import { Plugin, PluginSettingTab, Setting, App, TFile } from "obsidian";
import { TaskCache } from "./cache/TaskCache";
import { DashboardView, VIEW_TYPE_DASHBOARD } from "./views/DashboardView";
import { AgendaView, VIEW_TYPE_AGENDA } from "./views/AgendaView";
import { ProgressPlannerSettings, DEFAULT_SETTINGS } from "./types";

export default class ProgressPlannerPlugin extends Plugin {
    public settings: ProgressPlannerSettings;
    public taskCache: TaskCache;

    async onload() {
        await this.loadSettings();

        // 1. Instantiate the cache object
        this.taskCache = new TaskCache(this.app, this.settings);

        // 2. Defer heavy indexing until Obsidian's layout and metadata cache are fully ready
        this.app.workspace.onLayoutReady(async () => {
            await this.taskCache.initialize();
            this.refreshViews();
        });

        // 3. Setup Cache Auto-Updates for note modifications after startup
        this.registerEvent(
            this.app.metadataCache.on("changed", async (file) => {
                if (file instanceof TFile) {
                    await this.taskCache.updateFile(file);
                    this.refreshViews();
                }
            })
        );

        this.registerEvent(
            this.app.vault.on("delete", (file) => {
                if (file instanceof TFile) {
                    this.taskCache.removeFile(file.path);
                    this.refreshViews();
                }
            })
        );

        this.registerEvent(
            this.app.vault.on("rename", async (file, oldPath) => {
                if (file instanceof TFile) {
                    this.taskCache.removeFile(oldPath);
                    await this.taskCache.updateFile(file);
                    this.refreshViews();
                }
            })
        );

        // 4. Register Views
        this.registerView(
            VIEW_TYPE_DASHBOARD,
            (leaf) => new DashboardView(leaf, this)
        );
        this.registerView(
            VIEW_TYPE_AGENDA,
            (leaf) => new AgendaView(leaf, this)
        );

        // 5. Ribbon Controls
        this.addRibbonIcon("graph", "Open Progress Dashboard", () => {
            this.activateView(VIEW_TYPE_DASHBOARD);
        });

        this.addRibbonIcon("calendar-days", "Open Agenda Calendar", () => {
            this.activateView(VIEW_TYPE_AGENDA);
        });

        // 6. Commands
        this.addCommand({
            id: "open-progress-dashboard",
            name: "Open Graph Dashboard",
            callback: () => this.activateView(VIEW_TYPE_DASHBOARD)
        });

        this.addCommand({
            id: "open-progress-agenda",
            name: "Open Agenda Calendar",
            callback: () => this.activateView(VIEW_TYPE_AGENDA)
        });

        // 7. Settings Page
        this.addSettingTab(new ProgressPlannerSettingTab(this.app, this));
    }

    async onunload() {}

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
        this.taskCache.updateSettings(this.settings);
        await this.taskCache.initialize();
        this.refreshViews();
    }

    async activateView(viewType: string) {
        const { workspace } = this.app;
        let leaf = workspace.getLeavesOfType(viewType)[0];
        
        if (!leaf) {
            leaf = workspace.getLeaf("tab");
            await leaf.setViewState({ type: viewType, active: true });
        }
        workspace.revealLeaf(leaf);
    }

    refreshViews() {
        this.app.workspace.getLeavesOfType(VIEW_TYPE_DASHBOARD).forEach((leaf) => {
            if (leaf.view instanceof DashboardView) {
                leaf.view.render();
            }
        });
        this.app.workspace.getLeavesOfType(VIEW_TYPE_AGENDA).forEach((leaf) => {
            if (leaf.view instanceof AgendaView) {
                leaf.view.render();
            }
        });
    }
}

class ProgressPlannerSettingTab extends PluginSettingTab {
    plugin: ProgressPlannerPlugin;

    constructor(app: App, plugin: ProgressPlannerPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl("h2", { text: "Progress Planner Settings" });

        new Setting(containerEl)
            .setName("Target Folders")
            .setDesc("Comma-separated list of folders the plugin should search for tasks and goals (e.g., Private, Work). Leave empty to scan your entire vault.")
            .addText(text => text
                .setPlaceholder("Private, Work")
                .setValue(this.plugin.settings.targetFolders.join(", "))
                .onChange(async (value) => {
                    this.plugin.settings.targetFolders = value
                        .split(",")
                        .map(p => p.trim())
                        .filter(p => p.length > 0);
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName("Skipped Paths")
            .setDesc("Comma-separated list of keywords. Files with these keywords in their paths will be ignored.")
            .addText(text => text
                .setPlaceholder("Templates, Archive")
                .setValue(this.plugin.settings.skipPaths.join(", "))
                .onChange(async (value) => {
                    this.plugin.settings.skipPaths = value
                        .split(",")
                        .map(p => p.trim())
                        .filter(p => p.length > 0);
                    await this.plugin.saveSettings();
                }));
    }
}