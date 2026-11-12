module.exports = async (params) => {
    const STATE_KEY = "obsidianBulletCounterState";

    // 1. If already active, toggle it OFF
    if (window[STATE_KEY]) {
        const state = window[STATE_KEY];

        // Remove the custom status bar element from the DOM
        if (state.statusBarItem) {
            state.statusBarItem.remove();
        }

        // Unregister workspace event listeners to prevent memory leaks
        if (state.workspaceRefs && Array.isArray(state.workspaceRefs)) {
            for (const ref of state.workspaceRefs) {
                app.workspace.offref(ref);
            }
        }

        // Unregister vault event listeners to prevent memory leaks
        if (state.vaultRefs && Array.isArray(state.vaultRefs)) {
            for (const ref of state.vaultRefs) {
                app.vault.offref(ref);
            }
        }

        // Clear any pending debounced calculations
        if (state.timeoutId) {
            clearTimeout(state.timeoutId);
        }

        // Delete the state
        delete window[STATE_KEY];

        new Notice("Bullet Counter: OFF");
        return;
    }

    // Locate the status bar container in the DOM
    const statusBarContainer = document.querySelector(".status-bar");
    if (!statusBarContainer) {
        new Notice("Error: Could not find Obsidian status bar.");
        return;
    }

    // 2. If not active, toggle it ON
    new Notice("Bullet Counter: ON");

    // Create a new status bar item using standard DOM APIs
    const statusBarItem = document.createElement("div");
    statusBarItem.classList.add("status-bar-item", "status-bar-bullet-counter");
    statusBarItem.style.display = "none";

    // Append it directly to the status bar container
    statusBarContainer.appendChild(statusBarItem);

    // Core logic to count bullet points in the active document
    const updateBulletCount = async () => {
        if (!window[STATE_KEY]) return;

        const activeFile = app.workspace.getActiveFile();

        // If no file is open, or it's not a markdown file, hide status bar item
        if (!activeFile || activeFile.extension !== "md") {
            statusBarItem.textContent = "";
            statusBarItem.style.display = "none";
            return;
        }

        try {
            let content = "";
            const activeEditor = app.workspace.activeEditor;
            const recentLeaf = app.workspace.getMostRecentLeaf();

            // 1. Pull text from the live, in-memory editor if focused
            if (activeEditor && activeEditor.editor && activeEditor.file === activeFile) {
                content = activeEditor.editor.getValue();
            // 2. Otherwise pull from the most recent MarkdownView (e.g., Reading view or newly clicked pane)
            } else if (
                recentLeaf &&
                recentLeaf.view &&
                recentLeaf.view.file === activeFile &&
                typeof recentLeaf.view.getViewData === "function"
            ) {
                content = recentLeaf.view.getViewData();
            // 3. Fallback to vault cache read
            } else {
                content = await app.vault.cachedRead(activeFile);
            }

            // Guard in case the counter was toggled OFF during async read
            if (!window[STATE_KEY]) return;

            // Remove Frontmatter
            const contentWithoutFrontmatter = content.replace(/^---\s*[\s\S]*?\s*---\s*/, "");

            // Regex for list items
            const listRegex = /^\s*([-*+]|\d+\.)\s/gm;

            // Count the matches
            const matches = contentWithoutFrontmatter.match(listRegex);
            const count = matches ? matches.length : 0;

            // Update and show status bar text
            statusBarItem.textContent = `Bullets: ${count}`;
            statusBarItem.style.display = "";
        } catch (error) {
            console.error("Bullet Counter Error:", error);
        }
    };

    // Initialize state on the window object
    window[STATE_KEY] = {
        statusBarItem: statusBarItem,
        workspaceRefs: [],
        vaultRefs: [],
        timeoutId: null
    };

    // Very fast debounce (20ms) to make updates feel immediate
    const debouncedUpdate = () => {
        const state = window[STATE_KEY];
        if (!state) return;

        if (state.timeoutId) {
            clearTimeout(state.timeoutId);
        }

        state.timeoutId = setTimeout(async () => {
            await updateBulletCount();
        }, 20);
    };

    // Register listeners to trigger calculations automatically on focus, navigation, view switch, and edits
    const activeLeafChangeRef = app.workspace.on("active-leaf-change", () => {
        debouncedUpdate();
    });

    const fileOpenRef = app.workspace.on("file-open", () => {
        debouncedUpdate();
    });

    const layoutChangeRef = app.workspace.on("layout-change", () => {
        debouncedUpdate();
    });

    const editorChangeRef = app.workspace.on("editor-change", () => {
        debouncedUpdate();
    });

    const vaultModifyRef = app.vault.on("modify", (file) => {
        if (file === app.workspace.getActiveFile()) {
            debouncedUpdate();
        }
    });

    // Save references to the events so we can clean them up later
    window[STATE_KEY].workspaceRefs = [
        activeLeafChangeRef,
        fileOpenRef,
        layoutChangeRef,
        editorChangeRef
    ];
    window[STATE_KEY].vaultRefs = [vaultModifyRef];

    // Initial calculation once the workspace layout is ready
    app.workspace.onLayoutReady(() => {
        updateBulletCount();
    });
};