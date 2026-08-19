import {
    App,
    Modal,
    Notice,
    Plugin,
    PluginSettingTab,
    Setting,
    SuggestModal,
    WorkspaceLeaf
} from 'obsidian';

interface VirtualTabGroupsSettings {
    activeGroup: string;
    groups: string[];
    leafToGroupMap: Record<string, string>;
    groupLastActiveLeaf: Record<string, string>;
}

const DEFAULT_SETTINGS: VirtualTabGroupsSettings = {
    activeGroup: 'Default',
    groups: ['Default'],
    leafToGroupMap: {},
    groupLastActiveLeaf: {}
};

export default class VirtualTabGroupsPlugin extends Plugin {
    settings: VirtualTabGroupsSettings;
    leafToGroupMap: Map<string, string>;
    statusBarItemEl: HTMLElement;
    prevLeafCount: number = 0;
    private isApplyingVisibility = false;
    private resizeRaf: number | null = null;
    private resizeObserver: ResizeObserver | null = null;
    private observer: MutationObserver | null = null;

    async onload() {
        await this.loadSettings();

        // Convert stored Record back to Map for easier session handling
        this.leafToGroupMap = new Map(Object.entries(this.settings.leafToGroupMap));

        // Create Status Bar indicator
        this.statusBarItemEl = this.addStatusBarItem();
        this.updateStatusBar();

        // Register event listeners using Obsidian's standard workspace events
        this.registerEvent(
            this.app.workspace.on('layout-change', () => {
                this.applyVisibility();
                this.scheduleReposition();
            })
        );

        // Keep sidebar buttons synchronized through window, fullscreen, and workspace resizing
        this.registerDomEvent(window, 'resize', () => {
            this.onWindowResizeOrFullscreen();
        });

        this.registerDomEvent(document, 'fullscreenchange', () => {
            this.onWindowResizeOrFullscreen();
        });

        this.registerEvent(
            this.app.workspace.on('resize', () => {
                this.onWindowResizeOrFullscreen();
            })
        );

        // Hook Electron native window events (covers MoveToMainSpace.js and native macOS full-screen exits)
        try {
            const electron = (window as any).require?.('electron');
            const remote = electron?.remote || (electron?.main ? electron.main : null);
            const win = remote?.getCurrentWindow?.() || electron?.getCurrentWindow?.();
            if (win) {
                const onWinEvent = () => this.onWindowResizeOrFullscreen();
                win.on('leave-full-screen', onWinEvent);
                win.on('enter-full-screen', onWinEvent);
                win.on('resize', onWinEvent);
                this.register(() => {
                    win.removeListener('leave-full-screen', onWinEvent);
                    win.removeListener('enter-full-screen', onWinEvent);
                    win.removeListener('resize', onWinEvent);
                });
            }
        } catch (e) {}

        // Use standard ResizeObserver on root workspace to automatically catch macOS full-screen transitions
        this.app.workspace.onLayoutReady(() => {
            const rootEl = document.querySelector('.mod-root');
            if (rootEl) {
                this.resizeObserver = new ResizeObserver(() => {
                    this.scheduleReposition();
                });
                this.resizeObserver.observe(rootEl);

                // Scoped MutationObserver: watches tab headers only (0 overhead during typing/reading)
                this.observer = new MutationObserver((mutations) => {
                    let shouldReposition = false;
                    for (const m of mutations) {
                        if (m.type === 'childList') {
                            const target = m.target as HTMLElement;
                            if (target && (
                                target.classList?.contains('workspace-tab-header-container') ||
                                target.classList?.contains('workspace-tabs') ||
                                target.closest?.('.workspace-tab-header-container')
                            )) {
                                shouldReposition = true;
                                break;
                            }
                        }
                    }
                    if (shouldReposition) {
                        this.scheduleReposition();
                    }
                });

                this.observer.observe(rootEl, {
                    childList: true,
                    subtree: true
                });
            }

            this.prevLeafCount = this.getLeafCount();
            this.applyVisibility();
            this.scheduleReposition();
        });

        // Track active tab changes
        this.registerEvent(
            this.app.workspace.on('active-leaf-change', (leaf) => {
                if (!leaf || !this.isRootLeaf(leaf)) return;

                const leafId = (leaf as any).id;
                let leafGroup = this.leafToGroupMap.get(leafId);

                // Detect if the tab change was caused by closing a tab
                const currentCount = this.getLeafCount();
                const isTabClosed = currentCount < this.prevLeafCount;
                this.prevLeafCount = currentCount;

                if (!leafGroup) {
                    // If a brand new tab is opened, assign it to the current active group
                    leafGroup = this.settings.activeGroup;
                    this.leafToGroupMap.set(leafId, leafGroup);
                    this.saveSettings();
                } else if (leafGroup !== this.settings.activeGroup) {
                    // Only pull the tab if it wasn't focused as an automatic fallback from closing a tab
                    if (!isTabClosed) {
                        leafGroup = this.settings.activeGroup;
                        this.leafToGroupMap.set(leafId, leafGroup);
                        this.saveSettings();
                        new Notice(`Moved "${leaf.getDisplayText()}" to group: ${this.settings.activeGroup}`);
                    }
                }

                // Save this tab as the "last active" tab for its assigned group
                if (leafGroup === this.settings.activeGroup) {
                    this.settings.groupLastActiveLeaf[leafGroup] = leafId;
                    this.saveSettings();
                }

                this.applyVisibility();
                this.scheduleReposition();
            })
        );

        // Add Ribbon Icon (Side panel button)
        this.addRibbonIcon('layers', 'Switch Tab Group', () => {
            new GroupSwitchModal(this.app, this).open();
        });

        // Add Hotkey / Palette Commands
        this.addCommand({
            id: 'switch-tab-group',
            name: 'Switch Tab Group',
            callback: () => {
                new GroupSwitchModal(this.app, this).open();
            }
        });

        this.addCommand({
            id: 'move-tab-to-group',
            name: 'Move Active Tab to Group',
            callback: () => {
                const activeLeaf = this.getActiveLeafInContainer();
                if (activeLeaf && this.isRootLeaf(activeLeaf)) {
                    new MoveToGroupModal(this.app, this, activeLeaf).open();
                } else {
                    new Notice("No active editor tab found to move.");
                }
            }
        });

        this.addCommand({
            id: 'create-tab-group',
            name: 'Create New Tab Group',
            callback: () => {
                new CreateGroupModal(this.app, this, async (name) => {
                    if (this.settings.groups.includes(name)) {
                        new Notice("This group name already exists.");
                        return;
                    }
                    this.settings.groups.push(name);
                    await this.saveSettings();
                    new Notice(`Created group: ${name}`);
                    await this.switchGroup(name);
                }).open();
            }
        });

        this.addCommand({
            id: 'rename-current-tab-group',
            name: 'Rename Current Tab Group',
            callback: () => {
                const currentGroup = this.settings.activeGroup;
                if (currentGroup === 'Default') {
                    new Notice("You cannot rename the 'Default' group.");
                    return;
                }
                new RenameGroupModal(this.app, this, currentGroup, async (newName) => {
                    if (this.settings.groups.includes(newName)) {
                        new Notice("This group name already exists.");
                        return;
                    }

                    this.settings.groups = this.settings.groups.map(g => g === currentGroup ? newName : g);
                    this.settings.activeGroup = newName;

                    for (const [leafId, g] of this.leafToGroupMap.entries()) {
                        if (g === currentGroup) {
                            this.leafToGroupMap.set(leafId, newName);
                        }
                    }

                    if (this.settings.groupLastActiveLeaf[currentGroup]) {
                        this.settings.groupLastActiveLeaf[newName] = this.settings.groupLastActiveLeaf[currentGroup];
                        delete this.settings.groupLastActiveLeaf[currentGroup];
                    }

                    await this.saveSettings();
                    this.applyVisibility();
                    new Notice(`Renamed group "${currentGroup}" to "${newName}"`);
                }).open();
            }
        });

        this.addCommand({
            id: 'delete-tab-group',
            name: 'Delete a Tab Group',
            callback: () => {
                if (this.settings.groups.length <= 1) {
                    new Notice("No custom tab groups available to delete.");
                    return;
                }
                new DeleteGroupModal(this.app, this).open();
            }
        });

        // Hotkeys for tab cycling strictly inside the current active split container
        this.addCommand({
            id: 'go-to-next-tab-in-group',
            name: 'Go to Next Tab in Current Group',
            callback: () => this.goToNextTab(),
            hotkeys: [
                {
                    modifiers: ["Mod", "Alt"],
                    key: "ArrowRight"
                }
            ]
        });

        this.addCommand({
            id: 'go-to-prev-tab-in-group',
            name: 'Go to Previous Tab in Current Group',
            callback: () => this.goToPrevTab(),
            hotkeys: [
                {
                    modifiers: ["Mod", "Alt"],
                    key: "ArrowLeft"
                }
            ]
        });

        this.addSettingTab(new VirtualTabGroupsSettingTab(this.app, this));
    }

    onunload() {
        if (this.resizeRaf) cancelAnimationFrame(this.resizeRaf);
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

        // Clean up classes when disabling plugin
        const rootSplit = this.app.workspace.rootSplit as any;
        if (rootSplit && Array.isArray(rootSplit.children)) {
            rootSplit.children.forEach((child: any) => {
                this.clearVisibilityHidden(child);
            });
        }
        const allContainers = document.querySelectorAll('.mod-root .workspace-tabs');
        allContainers.forEach((el) => {
            el.classList.remove('mod-top-left-space', 'mod-top-right-space');
        });
        this.app.workspace.iterateRootLeaves((leaf) => {
            this.showLeaf(leaf);
        });
    }

    /**
     * Handles window resize and fullscreen changes, with follow-ups to catch
     * macOS 500ms window transition animations.
     */
    private onWindowResizeOrFullscreen() {
        this.scheduleReposition();
        setTimeout(() => this.scheduleReposition(), 300);
        setTimeout(() => this.scheduleReposition(), 600);
    }

    /**
     * One-shot repositioning in a single visual frame.
     */
    private scheduleReposition() {
        if (this.resizeRaf) cancelAnimationFrame(this.resizeRaf);
        this.resizeRaf = requestAnimationFrame(() => {
            this.repositionSidebarButtons();
            this.resizeRaf = null;
        });
    }

    /**
     * Determines true visual top-left and top-right containers geometrically.
     * Uses .closest('.vtg-hidden') so panes inside hidden parent split containers are never selected.
     */
    private getTopmostVisibleContainers(): { topLeft: HTMLElement | null; topRight: HTMLElement | null } {
        const allContainers = Array.from(document.querySelectorAll('.mod-root .workspace-tabs')) as HTMLElement[];
        const visible = allContainers.filter((el) => {
            return !el.closest('.vtg-hidden') && el.offsetWidth > 0 && el.offsetHeight > 0;
        });

        if (visible.length === 0) {
            const nonHidden = allContainers.filter((el) => !el.closest('.vtg-hidden'));
            if (nonHidden.length > 0) {
                return { topLeft: nonHidden[0] ?? null, topRight: nonHidden[nonHidden.length - 1] ?? null };
            }
            return { topLeft: null, topRight: null };
        }

        let minTop = Infinity;
        const withRects = visible.map((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.top < minTop) minTop = rect.top;
            return { el, rect };
        });

        const topRow = withRects.filter(item => Math.abs(item.rect.top - minTop) < 10);

        if (topRow.length === 0) return { topLeft: null, topRight: null };

        topRow.sort((a, b) => a.rect.left - b.rect.left);

        const firstItem = topRow[0];
        const lastItem = topRow[topRow.length - 1];

        const topLeft = firstItem?.el ?? null;
        const topRight = lastItem?.el ?? null;

        return { topLeft, topRight };
    }

    private toggleSidebar(side: 'left' | 'right') {
        const split = side === 'left' ? (this.app.workspace.leftSplit as any) : (this.app.workspace.rightSplit as any);
        if (split) {
            if (typeof split.expand === 'function' && split.collapsed) {
                split.expand();
            } else if (typeof split.collapse === 'function' && !split.collapsed) {
                split.collapse();
            } else if (typeof split.toggle === 'function') {
                split.toggle();
            } else {
                (this.app as any).commands?.executeCommandById(side === 'left' ? 'app:toggle-left-sidebar' : 'app:toggle-right-sidebar');
            }
        } else {
            (this.app as any).commands?.executeCommandById(side === 'left' ? 'app:toggle-left-sidebar' : 'app:toggle-right-sidebar');
        }
    }

    private createRightSidebarButton(): HTMLElement {
        const btn = createDiv({
            cls: 'clickable-icon sidebar-toggle-button mod-right',
            attr: {
                'aria-label': 'Expand right sidebar',
                'aria-label-position': 'bottom'
            }
        });
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon sidebar-right"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M15 3v18"></path></svg>`;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleSidebar('right');
        });
        return btn;
    }

    private createLeftSidebarButton(): HTMLElement {
        const btn = createDiv({
            cls: 'clickable-icon sidebar-toggle-button mod-left',
            attr: {
                'aria-label': 'Expand left sidebar',
                'aria-label-position': 'bottom'
            }
        });
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon sidebar-left"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M9 3v18"></path></svg>`;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleSidebar('left');
        });
        return btn;
    }

    /**
     * Safely ensures the first and last visible panes have access to native sidebar toggle buttons
     * and maintains native Obsidian spacing (.mod-top-left-space and .mod-top-right-space).
     */
    repositionSidebarButtons() {
        const { topLeft, topRight } = this.getTopmostVisibleContainers();
        if (!topLeft || !topRight) return;

        const isLeftCollapsed = !!(this.app.workspace.leftSplit?.collapsed ?? (this.app.workspace.leftSplit as any)?.isCollapsed?.());
        const isRightCollapsed = !!(this.app.workspace.rightSplit?.collapsed ?? (this.app.workspace.rightSplit as any)?.isCollapsed?.());

        // 1. Maintain native space classes across visible containers
        const allContainers = Array.from(document.querySelectorAll('.mod-root .workspace-tabs')) as HTMLElement[];
        allContainers.forEach((el) => {
            if (el === topLeft && !el.closest('.vtg-hidden')) {
                el.classList.toggle('mod-top-left-space', isLeftCollapsed);
            } else {
                el.classList.remove('mod-top-left-space');
            }

            if (el === topRight && !el.closest('.vtg-hidden')) {
                el.classList.toggle('mod-top-right-space', isRightCollapsed);
            } else {
                el.classList.remove('mod-top-right-space');
            }
        });

        // 2. Manage Left Sidebar Button (only when left sidebar is closed)
        if (isLeftCollapsed && topLeft) {
            const topLeftHeader = topLeft.querySelector('.workspace-tab-header-container');
            if (topLeftHeader) {
                const hasLeftBtn = !!topLeftHeader.querySelector('.sidebar-toggle-button.mod-left');
                if (!hasLeftBtn) {
                    const existingLeftBtn = document.querySelector('.sidebar-toggle-button.mod-left');
                    if (existingLeftBtn && !topLeftHeader.contains(existingLeftBtn)) {
                        topLeftHeader.prepend(existingLeftBtn);
                    } else if (!existingLeftBtn) {
                        topLeftHeader.prepend(this.createLeftSidebarButton());
                    }
                }
            }
        }

        // 3. Manage Right Sidebar Button (only when right sidebar is closed)
        if (isRightCollapsed && topRight) {
            const topRightHeader = topRight.querySelector('.workspace-tab-header-container');
            if (topRightHeader) {
                const hasRightBtn = !!topRightHeader.querySelector('.sidebar-toggle-button.mod-right');
                if (!hasRightBtn) {
                    const existingRightBtn = document.querySelector('.sidebar-toggle-button.mod-right');
                    if (existingRightBtn && !topRightHeader.contains(existingRightBtn)) {
                        topRightHeader.appendChild(existingRightBtn);
                    } else if (!existingRightBtn) {
                        topRightHeader.appendChild(this.createRightSidebarButton());
                    }
                }
            }
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        this.settings.leafToGroupMap = Object.fromEntries(this.leafToGroupMap);
        await this.saveData(this.settings);
    }

    isRootLeaf(leaf: WorkspaceLeaf): boolean {
        return leaf.getRoot() === this.app.workspace.rootSplit;
    }

    getPrimaryRootLeaf(): WorkspaceLeaf {
        let firstRootLeaf: WorkspaceLeaf | null = null;
        this.app.workspace.iterateRootLeaves((leaf) => {
            if (!firstRootLeaf && this.isRootLeaf(leaf)) {
                firstRootLeaf = leaf;
            }
        });

        if (firstRootLeaf && (firstRootLeaf as any).parent) {
            const parent = (firstRootLeaf as any).parent;
            if (typeof (this.app.workspace as any).createLeafInParent === 'function') {
                return (this.app.workspace as any).createLeafInParent(parent, parent.children?.length ?? 0);
            }
        }

        if (typeof (this.app.workspace as any).createLeafInParent === 'function') {
            return (this.app.workspace as any).createLeafInParent(this.app.workspace.rootSplit, 0);
        }

        return this.app.workspace.getLeaf(false);
    }

    getVisibleNeighborInContainer(leaf: WorkspaceLeaf, activeGroup: string): WorkspaceLeaf | null {
        const parent = (leaf as any).parent;
        if (!parent || !Array.isArray(parent.children)) return null;

        const children: WorkspaceLeaf[] = parent.children;
        const currentIndex = children.findIndex((c) => (c as any).id === (leaf as any).id);
        if (currentIndex === -1) return null;

        const isLeafVisible = (l: WorkspaceLeaf) => {
            if (!this.isRootLeaf(l)) return false;
            const id = (l as any).id;
            const g = this.leafToGroupMap.get(id);
            const isPinned = !!(l as any).pinned;
            return g === activeGroup || isPinned;
        };

        for (let i = currentIndex + 1; i < children.length; i++) {
            const child = children[i];
            if (child && isLeafVisible(child)) {
                return child;
            }
        }

        for (let i = currentIndex - 1; i >= 0; i--) {
            const child = children[i];
            if (child && isLeafVisible(child)) {
                return child;
            }
        }

        return null;
    }

    getLeafCount(): number {
        let count = 0;
        this.app.workspace.iterateRootLeaves(() => {
            count++;
        });
        return count;
    }

    async switchGroup(groupName: string) {
        this.settings.activeGroup = groupName;
        await this.saveSettings();
        this.applyVisibility();
    }

    async moveLeafToGroup(leaf: WorkspaceLeaf, groupName: string) {
        this.leafToGroupMap.set((leaf as any).id, groupName);
        await this.saveSettings();
        this.applyVisibility();
    }

    async deleteGroup(groupName: string) {
        if (groupName === "Default") {
            new Notice("You cannot delete the 'Default' group.");
            return;
        }

        this.leafToGroupMap.forEach((g, leafId) => {
            if (g === groupName) {
                this.leafToGroupMap.set(leafId, "Default");
            }
        });

        this.settings.groups = this.settings.groups.filter(g => g !== groupName);

        if (this.settings.groupLastActiveLeaf[groupName]) {
            delete this.settings.groupLastActiveLeaf[groupName];
        }

        if (this.settings.activeGroup === groupName) {
            await this.switchGroup("Default");
        } else {
            await this.saveSettings();
            this.applyVisibility();
        }

        new Notice(`Deleted group "${groupName}". Any active tabs were moved to 'Default'.`);
    }

    getActiveLeafInContainer(): WorkspaceLeaf | null {
        const activeLeaf = this.app.workspace.activeLeaf;
        if (!activeLeaf) return null;

        const parent = (activeLeaf as any).parent;
        if (parent && typeof parent.currentTab === 'number' && Array.isArray(parent.children) && parent.children.length > 0) {
            const validIndex = Math.min(Math.max(0, parent.currentTab), parent.children.length - 1);
            const selectedTabLeaf = parent.children[validIndex];
            if (selectedTabLeaf && this.isRootLeaf(selectedTabLeaf)) {
                return selectedTabLeaf;
            }
        }

        return activeLeaf;
    }

    getVisibleLeavesInActiveContainer(): WorkspaceLeaf[] {
        const currentActive = this.getActiveLeafInContainer();
        if (!currentActive) return [];

        const activeParent = (currentActive as any).parent;
        const visibleLeaves: WorkspaceLeaf[] = [];

        if (activeParent && Array.isArray(activeParent.children)) {
            activeParent.children.forEach((leaf: any) => {
                if (this.isRootLeaf(leaf)) {
                    const assignedGroup = this.leafToGroupMap.get(leaf.id);
                    const isPinned = !!leaf.pinned;
                    if (assignedGroup === this.settings.activeGroup || isPinned) {
                        visibleLeaves.push(leaf);
                    }
                }
            });
        } else {
            this.app.workspace.iterateRootLeaves((leaf) => {
                const assignedGroup = this.leafToGroupMap.get((leaf as any).id);
                const isPinned = !!(leaf as any).pinned;
                if (assignedGroup === this.settings.activeGroup || isPinned) {
                    visibleLeaves.push(leaf);
                }
            });
        }
        return visibleLeaves;
    }

    goToNextTab() {
        const visibleLeaves = this.getVisibleLeavesInActiveContainer();
        if (visibleLeaves.length <= 1) return;

        const currentActive = this.getActiveLeafInContainer();
        if (!currentActive) return;

        const currentIndex = visibleLeaves.findIndex(leaf => (leaf as any).id === (currentActive as any).id);
        if (currentIndex === -1) return;

        const nextIndex = (currentIndex + 1) % visibleLeaves.length;
        const targetLeaf = visibleLeaves[nextIndex];
        
        if (targetLeaf) {
            this.app.workspace.setActiveLeaf(targetLeaf, { focus: true });
        }
    }

    goToPrevTab() {
        const visibleLeaves = this.getVisibleLeavesInActiveContainer();
        if (visibleLeaves.length <= 1) return;

        const currentActive = this.getActiveLeafInContainer();
        if (!currentActive) return;

        const currentIndex = visibleLeaves.findIndex(leaf => (leaf as any).id === (currentActive as any).id);
        if (currentIndex === -1) return;

        const prevIndex = (currentIndex - 1 + visibleLeaves.length) % visibleLeaves.length;
        const targetLeaf = visibleLeaves[prevIndex];

        if (targetLeaf) {
            this.app.workspace.setActiveLeaf(targetLeaf, { focus: true });
        }
    }

    evaluateContainerVisibility(container: any, activeGroup: string): boolean {
        if (container.id && this.leafToGroupMap.has(container.id)) {
            const assignedGroup = this.leafToGroupMap.get(container.id);
            const isPinned = !!container.pinned;
            return assignedGroup === activeGroup || isPinned;
        }

        let hasVisibleChild = false;

        if (container.children && Array.isArray(container.children)) {
            for (const child of container.children) {
                const isLeaf = !child.children;

                if (isLeaf) {
                    const assignedGroup = this.leafToGroupMap.get(child.id);
                    const isPinned = !!child.pinned;
                    if (assignedGroup === activeGroup || isPinned) {
                        hasVisibleChild = true;
                    }
                } else {
                    if (this.evaluateContainerVisibility(child, activeGroup)) {
                        hasVisibleChild = true;
                    }
                }
            }
        }

        if (container.containerEl) {
            if (hasVisibleChild) {
                container.containerEl.classList.remove('vtg-hidden');
            } else {
                container.containerEl.classList.add('vtg-hidden');
            }
        }

        return hasVisibleChild;
    }

    clearVisibilityHidden(container: any) {
        if (container.containerEl) {
            container.containerEl.classList.remove('vtg-hidden');
        }
        if (container.children && Array.isArray(container.children)) {
            container.children.forEach((child: any) => this.clearVisibilityHidden(child));
        }
    }

    applyVisibility() {
        if (this.isApplyingVisibility) return;
        this.isApplyingVisibility = true;

        try {
            this.cleanupMap();

            const activeGroup = this.settings.activeGroup;

            // 1. Group assignment check
            this.app.workspace.iterateRootLeaves((leaf) => {
                const leafId = (leaf as any).id;
                let assignedGroup = this.leafToGroupMap.get(leafId);

                if (!assignedGroup) {
                    assignedGroup = activeGroup;
                    this.leafToGroupMap.set(leafId, assignedGroup);
                }
            });

            // 2. Ensure at least one leaf exists in activeGroup
            let hasVisibleRootLeaf = false;
            this.app.workspace.iterateRootLeaves((leaf) => {
                const leafId = (leaf as any).id;
                const assignedGroup = this.leafToGroupMap.get(leafId);
                const isPinned = !!(leaf as any).pinned;
                if (assignedGroup === activeGroup || isPinned) {
                    hasVisibleRootLeaf = true;
                }
            });

            if (!hasVisibleRootLeaf) {
                const newLeaf = this.getPrimaryRootLeaf();
                const newLeafId = (newLeaf as any).id;
                this.leafToGroupMap.set(newLeafId, activeGroup);
                this.settings.groupLastActiveLeaf[activeGroup] = newLeafId;
                this.saveSettings();
            }

            // 3. Apply visual hiding
            this.app.workspace.iterateRootLeaves((leaf) => {
                const leafId = (leaf as any).id;
                const assignedGroup = this.leafToGroupMap.get(leafId);
                const isPinned = !!(leaf as any).pinned;

                if (assignedGroup === activeGroup || isPinned) {
                    this.showLeaf(leaf);
                } else {
                    this.hideLeaf(leaf);
                }
            });

            // 4. Hide empty containers & collect visible ones
            const visibleTabContainers: any[] = [];
            const collectVisibleContainers = (container: any) => {
                if (!container) return;
                if (container.children && Array.isArray(container.children)) {
                    const isTabContainer = container.children.every((c: any) => !c.children);
                    if (isTabContainer) {
                        const hasVisibleTab = container.children.some((c: any) => {
                            const g = this.leafToGroupMap.get(c.id);
                            return g === activeGroup || !!c.pinned;
                        });
                        if (hasVisibleTab && container.containerEl) {
                            visibleTabContainers.push(container);
                        }
                    } else {
                        container.children.forEach((c: any) => collectVisibleContainers(c));
                    }
                }
            };

            const rootSplit = this.app.workspace.rootSplit as any;
            if (rootSplit && Array.isArray(rootSplit.children)) {
                rootSplit.children.forEach((child: any) => {
                    this.evaluateContainerVisibility(child, activeGroup);
                    collectVisibleContainers(child);
                });
            }

            // 5. Ensure each visible tab container selects an active tab belonging to activeGroup
            for (const parent of visibleTabContainers) {
                if (parent && Array.isArray(parent.children) && parent.children.length > 0) {
                    const currentIndex = Math.min(Math.max(0, parent.currentTab ?? 0), parent.children.length - 1);
                    const currentTabLeaf = parent.children[currentIndex];
                    const isCurrentTabVisible = currentTabLeaf && (
                        this.leafToGroupMap.get(currentTabLeaf.id) === activeGroup || !!currentTabLeaf.pinned
                    );

                    if (!isCurrentTabVisible) {
                        let visibleChild: WorkspaceLeaf | null = null;
                        for (let i = currentIndex + 1; i < parent.children.length; i++) {
                            const c = parent.children[i];
                            if (c && (this.leafToGroupMap.get(c.id) === activeGroup || !!c.pinned)) {
                                visibleChild = c;
                                break;
                            }
                        }
                        if (!visibleChild) {
                            for (let i = currentIndex - 1; i >= 0; i--) {
                                const c = parent.children[i];
                                if (c && (this.leafToGroupMap.get(c.id) === activeGroup || !!c.pinned)) {
                                    visibleChild = c;
                                    break;
                                }
                            }
                        }
                        if (visibleChild && typeof parent.selectTab === 'function') {
                            parent.selectTab(visibleChild);
                        }
                    } else if (currentTabLeaf && typeof parent.selectTab === 'function') {
                        parent.selectTab(currentTabLeaf);
                    }
                }
            }

            // 6. Focus the saved or best visible leaf
            const currentActive = this.getActiveLeafInContainer();
            let targetLeaf: WorkspaceLeaf | null = null;
            const savedLastActiveId = this.settings.groupLastActiveLeaf[activeGroup];

            if (savedLastActiveId) {
                this.app.workspace.iterateRootLeaves((leaf) => {
                    if ((leaf as any).id === savedLastActiveId) {
                        const assignedGroup = this.leafToGroupMap.get((leaf as any).id);
                        if (assignedGroup === activeGroup || (leaf as any).pinned) {
                            targetLeaf = leaf;
                        }
                    }
                });
            }

            const currentActiveVisible = currentActive && this.isRootLeaf(currentActive) && (
                this.leafToGroupMap.get((currentActive as any).id) === activeGroup || !!(currentActive as any).pinned
            );

            if (!targetLeaf && currentActiveVisible) {
                targetLeaf = currentActive;
            }

            if (!targetLeaf && currentActive) {
                targetLeaf = this.getVisibleNeighborInContainer(currentActive, activeGroup);
            }

            if (!targetLeaf) {
                this.app.workspace.iterateRootLeaves((leaf) => {
                    const assignedGroup = this.leafToGroupMap.get((leaf as any).id);
                    if (assignedGroup === activeGroup || (leaf as any).pinned) {
                        if (!targetLeaf) targetLeaf = leaf;
                    }
                });
            }

            if (targetLeaf) {
                const targetParent = (targetLeaf as any).parent;
                if (targetParent && typeof targetParent.selectTab === 'function') {
                    targetParent.selectTab(targetLeaf);
                }
                this.app.workspace.setActiveLeaf(targetLeaf, { focus: true });
            }

            this.updateStatusBar();
            this.scheduleReposition();
        } finally {
            this.isApplyingVisibility = false;
        }
    }

    showLeaf(leaf: WorkspaceLeaf) {
        const anyLeaf = leaf as any;
        if (anyLeaf.tabHeaderEl) {
            anyLeaf.tabHeaderEl.classList.remove('vtg-hidden');
        }
        if (anyLeaf.containerEl) {
            anyLeaf.containerEl.classList.remove('vtg-hidden');
        }
    }

    hideLeaf(leaf: WorkspaceLeaf) {
        const anyLeaf = leaf as any;
        if (anyLeaf.tabHeaderEl) {
            anyLeaf.tabHeaderEl.classList.add('vtg-hidden');
        }
        if (anyLeaf.containerEl) {
            anyLeaf.containerEl.classList.add('vtg-hidden');
        }
    }

    cleanupMap() {
        const activeLeafIds = new Set<string>();
        this.app.workspace.iterateRootLeaves((leaf) => {
            activeLeafIds.add((leaf as any).id);
        });

        let changed = false;

        for (const leafId of this.leafToGroupMap.keys()) {
            if (!activeLeafIds.has(leafId)) {
                this.leafToGroupMap.delete(leafId);
                changed = true;
            }
        }

        for (const group of Object.keys(this.settings.groupLastActiveLeaf)) {
            const savedLeafId = this.settings.groupLastActiveLeaf[group];
            if (savedLeafId && !activeLeafIds.has(savedLeafId)) {
                delete this.settings.groupLastActiveLeaf[group];
                changed = true;
            }
        }

        if (changed) {
            this.saveSettings();
        }
    }

    updateStatusBar() {
        if (this.statusBarItemEl) {
            this.statusBarItemEl.setText(`Group: ${this.settings.activeGroup}`);
        }
    }
}

// Modal: Switching Active Groups
class GroupSwitchModal extends SuggestModal<string> {
    plugin: VirtualTabGroupsPlugin;

    constructor(app: App, plugin: VirtualTabGroupsPlugin) {
        super(app);
        this.plugin = plugin;
        this.setPlaceholder("Select a tab group to switch to...");
    }

    getSuggestions(query: string): string[] {
        return this.plugin.settings.groups.filter(group =>
            group.toLowerCase().includes(query.toLowerCase())
        );
    }

    renderSuggestion(value: string, el: HTMLElement) {
        el.createEl("div", { text: value });
    }

    async onChooseSuggestion(item: string, evt: MouseEvent | KeyboardEvent) {
        await this.plugin.switchGroup(item);
    }
}

// Modal: Moving Tabs to another Group
class MoveToGroupModal extends SuggestModal<string> {
    plugin: VirtualTabGroupsPlugin;
    leaf: WorkspaceLeaf;

    constructor(app: App, plugin: VirtualTabGroupsPlugin, leaf: WorkspaceLeaf) {
        super(app);
        this.plugin = plugin;
        this.leaf = leaf;
        this.setPlaceholder(`Move "${leaf.getDisplayText()}" to group...`);
    }

    getSuggestions(query: string): string[] {
        return this.plugin.settings.groups.filter(group =>
            group.toLowerCase().includes(query.toLowerCase())
        );
    }

    renderSuggestion(value: string, el: HTMLElement) {
        el.createEl("div", { text: value });
    }

    async onChooseSuggestion(item: string, evt: MouseEvent | KeyboardEvent) {
        await this.plugin.moveLeafToGroup(this.leaf, item);
        new Notice(`Moved "${this.leaf.getDisplayText()}" to: ${item}`);
    }
}

// Modal: Select Group to Delete
class DeleteGroupModal extends SuggestModal<string> {
    plugin: VirtualTabGroupsPlugin;

    constructor(app: App, plugin: VirtualTabGroupsPlugin) {
        super(app);
        this.plugin = plugin;
        this.setPlaceholder("Select a tab group to delete...");
    }

    getSuggestions(query: string): string[] {
        return this.plugin.settings.groups.filter(group =>
            group !== 'Default' && group.toLowerCase().includes(query.toLowerCase())
        );
    }

    renderSuggestion(value: string, el: HTMLElement) {
        el.createEl("div", { text: value });
    }

    async onChooseSuggestion(item: string, evt: MouseEvent | KeyboardEvent) {
        await this.plugin.deleteGroup(item);
    }
}

// Modal: Create New Group Input Prompt
class CreateGroupModal extends Modal {
    plugin: VirtualTabGroupsPlugin;
    onSubmit: (result: string) => void;

    constructor(app: App, plugin: VirtualTabGroupsPlugin, onSubmit: (result: string) => void) {
        super(app);
        this.plugin = plugin;
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl("h2", { text: "Create New Tab Group" });

        let name = "";

        new Setting(contentEl)
            .setName("Group Name")
            .addText((text) => {
                text.onChange((value) => {
                    name = value;
                });
                text.inputEl.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        if (name.trim()) {
                            this.close();
                            this.onSubmit(name.trim());
                        } else {
                            new Notice("Group name cannot be empty.");
                        }
                    }
                });

                setTimeout(() => {
                    text.inputEl.focus();
                }, 50);
            });

        new Setting(contentEl)
            .addButton((btn) =>
                btn
                    .setButtonText("Create")
                    .setCta()
                    .onClick(() => {
                        if (name.trim()) {
                            this.close();
                            this.onSubmit(name.trim());
                        } else {
                            new Notice("Group name cannot be empty.");
                        }
                    })
            );
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

// Modal: Rename Existing Group Input Prompt
class RenameGroupModal extends Modal {
    plugin: VirtualTabGroupsPlugin;
    oldName: string;
    onSubmit: (result: string) => void;

    constructor(app: App, plugin: VirtualTabGroupsPlugin, oldName: string, onSubmit: (result: string) => void) {
        super(app);
        this.plugin = plugin;
        this.oldName = oldName;
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl("h2", { text: `Rename Tab Group: ${this.oldName}` });

        let name = this.oldName;

        new Setting(contentEl)
            .setName("New Group Name")
            .addText((text) => {
                text.setValue(this.oldName);
                text.onChange((value) => {
                    name = value;
                });
                text.inputEl.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        if (name.trim() && name.trim() !== this.oldName) {
                            this.close();
                            this.onSubmit(name.trim());
                        } else if (name.trim() === this.oldName) {
                            this.close();
                        } else {
                            new Notice("Group name cannot be empty.");
                        }
                    }
                });

                setTimeout(() => {
                    text.inputEl.focus();
                    text.inputEl.select();
                }, 50);
            });

        new Setting(contentEl)
            .addButton((btn) =>
                btn
                    .setButtonText("Rename")
                    .setCta()
                    .onClick(() => {
                        if (name.trim() && name.trim() !== this.oldName) {
                            this.close();
                            this.onSubmit(name.trim());
                        } else if (name.trim() === this.oldName) {
                            this.close();
                        } else {
                            new Notice("Group name cannot be empty.");
                        }
                    })
            );
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

// Settings Panel: Manage and Delete Groups
class VirtualTabGroupsSettingTab extends PluginSettingTab {
    plugin: VirtualTabGroupsPlugin;

    constructor(app: App, plugin: VirtualTabGroupsPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl("h2", { text: "Virtual Tab Groups Settings" });

        new Setting(containerEl)
            .setName("Manage Groups")
            .setDesc("Create and delete your active custom workspace tab groups.")
            .addButton((btn) => {
                btn.setButtonText("Add Group")
                    .setCta()
                    .onClick(() => {
                        new CreateGroupModal(this.app, this.plugin, async (name) => {
                            if (this.plugin.settings.groups.includes(name)) {
                                new Notice("Group name already exists.");
                                return;
                            }
                            this.plugin.settings.groups.push(name);
                            await this.plugin.saveSettings();
                            this.display();
                        }).open();
                    });
            });

        this.plugin.settings.groups.forEach((group) => {
            if (group === "Default") return;

            new Setting(containerEl)
                .setName(group)
                .addButton((btn) => {
                    btn.setButtonText("Delete Group")
                        .setWarning()
                        .onClick(async () => {
                            await this.plugin.deleteGroup(group);
                            this.display();
                        });
                });
        });
    }
}