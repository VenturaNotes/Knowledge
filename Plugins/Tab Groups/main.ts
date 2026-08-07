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

    async onload() {
        await this.loadSettings();

        // Convert stored Record back to Map for easier session handling
        this.leafToGroupMap = new Map(Object.entries(this.settings.leafToGroupMap));

        // Create Status Bar indicator
        this.statusBarItemEl = this.addStatusBarItem();
        this.updateStatusBar();

        // Register event listener for workspace state updates
        this.registerEvent(
            this.app.workspace.on('layout-change', () => {
                this.applyVisibility();
            })
        );

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

                    // Replace old group name in list
                    this.settings.groups = this.settings.groups.map(g => g === currentGroup ? newName : g);
                    
                    // Update active settings context
                    this.settings.activeGroup = newName;

                    // Re-assign mapping values
                    for (const [leafId, g] of this.leafToGroupMap.entries()) {
                        if (g === currentGroup) {
                            this.leafToGroupMap.set(leafId, newName);
                        }
                    }

                    // Rename active history reference if applicable
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
                // Ensure there is at least one custom group to delete
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

        // Once Obsidian's workspace layout is completely ready, run the visibility mask
        this.app.workspace.onLayoutReady(() => {
            this.prevLeafCount = this.getLeafCount();
            this.applyVisibility();
        });
    }

    onunload() {
        // Clean up our classes when disabling the plugin so tabs/splits return to normal
        const rootSplit = this.app.workspace.rootSplit as any;
        if (rootSplit && Array.isArray(rootSplit.children)) {
            rootSplit.children.forEach((child: any) => {
                this.clearVisibilityHidden(child);
            });
        }
        this.app.workspace.iterateRootLeaves((leaf) => {
            this.showLeaf(leaf);
        });
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        this.settings.leafToGroupMap = Object.fromEntries(this.leafToGroupMap);
        await this.saveData(this.settings);
    }

    /**
     * Determines if a leaf is located in the main editor area (excluding Sidebars)
     */
    isRootLeaf(leaf: WorkspaceLeaf): boolean {
        return leaf.getRoot() === this.app.workspace.rootSplit;
    }

    /**
     * Returns the total count of root leaves currently in the workspace
     */
    getLeafCount(): number {
        let count = 0;
        this.app.workspace.iterateRootLeaves(() => {
            count++;
        });
        return count;
    }

    /**
     * Changes the current group context and updates the workspace view
     */
    async switchGroup(groupName: string) {
        this.settings.activeGroup = groupName;
        await this.saveSettings();
        this.applyVisibility();
    }

    /**
     * Reassigns a specific leaf to a different group
     */
    async moveLeafToGroup(leaf: WorkspaceLeaf, groupName: string) {
        this.leafToGroupMap.set((leaf as any).id, groupName);
        await this.saveSettings();
        this.applyVisibility();
    }

    /**
     * Deletes a group entirely, safely migrating remaining tabs to 'Default'
     */
    async deleteGroup(groupName: string) {
        if (groupName === "Default") {
            new Notice("You cannot delete the 'Default' group.");
            return;
        }

        // Safely migrate orphaned tabs back to Default
        this.leafToGroupMap.forEach((g, leafId) => {
            if (g === groupName) {
                this.leafToGroupMap.set(leafId, "Default");
            }
        });

        this.settings.groups = this.settings.groups.filter(g => g !== groupName);

        // Remove active history reference if applicable
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

    /**
     * Helper to get the currently active leaf, prioritizing the visually selected
     * tab inside the active WorkspaceTabs container (e.g. after tab reordering)
     */
    getActiveLeafInContainer(): WorkspaceLeaf | null {
        const activeLeaf = this.app.workspace.activeLeaf;
        if (!activeLeaf) return null;

        const parent = (activeLeaf as any).parent;
        if (parent && typeof parent.currentTab === 'number' && Array.isArray(parent.children)) {
            const selectedTabLeaf = parent.children[parent.currentTab];
            if (selectedTabLeaf && this.isRootLeaf(selectedTabLeaf)) {
                return selectedTabLeaf;
            }
        }

        return activeLeaf;
    }

    /**
     * Gets visible leaves specifically within the active focused tab-pane split
     */
    getVisibleLeavesInActiveContainer(): WorkspaceLeaf[] {
        const currentActive = this.getActiveLeafInContainer();
        if (!currentActive) return [];

        const activeParent = (currentActive as any).parent;
        const visibleLeaves: WorkspaceLeaf[] = [];

        // Check active container's physical children hierarchy
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
            // Fallback to iterating general root leaves if structure is unexpected
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

    /**
     * Recursively traverses splits and checks if they contain any visible leaves in the current group.
     * Returns true if there is at least one visible child. Hides parent containers if empty.
     */
    evaluateContainerVisibility(container: any, activeGroup: string): boolean {
        // Base Case: If the item is a leaf
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
                    // Recursively check deeper split structures
                    if (this.evaluateContainerVisibility(child, activeGroup)) {
                        hasVisibleChild = true;
                    }
                }
            }
        }

        // Apply our hiding class to the entire split/tab container if it is empty
        if (container.containerEl) {
            if (hasVisibleChild) {
                container.containerEl.classList.remove('vtg-hidden');
            } else {
                container.containerEl.classList.add('vtg-hidden');
            }
        }

        return hasVisibleChild;
    }

    /**
     * Clears our hiding classes recursively (used during plugin disable)
     */
    clearVisibilityHidden(container: any) {
        if (container.containerEl) {
            container.containerEl.classList.remove('vtg-hidden');
        }
        if (container.children && Array.isArray(container.children)) {
            container.children.forEach((child: any) => this.clearVisibilityHidden(child));
        }
    }

    /**
     * Iterates all open root tabs and hides/shows them depending on their active group assignments
     */
    applyVisibility() {
        this.cleanupMap();

        const activeGroup = this.settings.activeGroup;

        // 1. Ensure all open root leaves have a group assignment before evaluating visibility
        this.app.workspace.iterateRootLeaves((leaf) => {
            const leafId = (leaf as any).id;
            let assignedGroup = this.leafToGroupMap.get(leafId);

            if (!assignedGroup) {
                assignedGroup = activeGroup;
                this.leafToGroupMap.set(leafId, assignedGroup);
            }
        });

        // 2. Check if the currently focused tab belongs to an inactive group
        const currentActive = this.getActiveLeafInContainer();
        let activeIsHidden = false;

        if (currentActive && this.isRootLeaf(currentActive)) {
            const currentActiveGroup = this.leafToGroupMap.get((currentActive as any).id);
            if (currentActiveGroup && currentActiveGroup !== activeGroup && !(currentActive as any).pinned) {
                activeIsHidden = true;
            }
        }

        // 3. If the current active tab is going to be hidden, programmatically focus a visible tab first
        if (activeIsHidden) {
            const lastActiveId = this.settings.groupLastActiveLeaf[activeGroup];
            let fallbackLeaf: WorkspaceLeaf | null = null;

            // Step A: Attempt to locate your saved "last active" tab for this group
            if (lastActiveId) {
                this.app.workspace.iterateRootLeaves((leaf) => {
                    if ((leaf as any).id === lastActiveId) {
                        const assignedGroup = this.leafToGroupMap.get((leaf as any).id);
                        if (assignedGroup === activeGroup || (leaf as any).pinned) {
                            fallbackLeaf = leaf;
                        }
                    }
                });
            }

            // Step B: If that tab was closed or doesn't exist, fall back to the first available tab
            if (!fallbackLeaf) {
                this.app.workspace.iterateRootLeaves((leaf) => {
                    const assignedGroup = this.leafToGroupMap.get((leaf as any).id);
                    if (assignedGroup === activeGroup || (leaf as any).pinned) {
                        if (!fallbackLeaf) fallbackLeaf = leaf;
                    }
                });
            }

            if (fallbackLeaf) {
                this.app.workspace.setActiveLeaf(fallbackLeaf, { focus: true });
            } else {
                // If no visible leaves are left in the active group, open a new empty tab.
                const newLeaf = this.app.workspace.getLeaf('tab');
                this.leafToGroupMap.set((newLeaf as any).id, activeGroup);
                this.saveSettings();
                this.app.workspace.setActiveLeaf(newLeaf, { focus: true });
                return;
            }
        }

        // 4. Physically apply visual hiding classes to individual leaves
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

        // 5. Recursively evaluate container splits and tab groups (hides panels with no active tabs)
        const rootSplit = this.app.workspace.rootSplit as any;
        if (rootSplit && Array.isArray(rootSplit.children)) {
            rootSplit.children.forEach((child: any) => {
                this.evaluateContainerVisibility(child, activeGroup);
            });
        }

        this.updateStatusBar();
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

    /**
     * Purges closed or dead leaf IDs from memory to prevent memory bloat
     */
    cleanupMap() {
        const activeLeafIds = new Set<string>();
        this.app.workspace.iterateRootLeaves((leaf) => {
            activeLeafIds.add((leaf as any).id);
        });

        let changed = false;

        // Clean leaf assignment maps
        for (const leafId of this.leafToGroupMap.keys()) {
            if (!activeLeafIds.has(leafId)) {
                this.leafToGroupMap.delete(leafId);
                changed = true;
            }
        }

        // Clean last active leaf mapping references
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