module.exports = async (params) => {
    const STATE_KEY = "obsidianBulletCounterState";

    // 1. If already active, toggle it OFF
    if (window[STATE_KEY]) {
        const state = window[STATE_KEY];

        // Remove the status bar item from the UI
        if (state.statusBarItem) {
            state.statusBarItem.remove();
        }

        // Unregister the workspace event listeners to prevent memory leaks
        if (state.eventRefs && Array.isArray(state.eventRefs)) {
            for (const ref of state.eventRefs) {
                app.workspace.offref(ref);
            }
        }

        // Clear any pending debounced calculations
        if (state.timeoutId) {
            clearTimeout(state.timeoutId);
        }

        // Delete the state so the next run knows to turn it back on
        delete window[STATE_KEY];

        new Notice("Bullet Counter: OFF");
        return;
    }

    // 2. If not active, toggle it ON
    new Notice("Bullet Counter: ON");

    // Create the status bar element in the bottom-right corner of the app
    const statusBarItem = app.addStatusBarItem();
    statusBarItem.classList.add("status-bar-bullet-counter");

    // Core logic to count bullet points in the active document
    const updateBulletCount = async () => {
        const activeFile = app.workspace.getActiveFile();

        // If no file is open, or it's not a markdown file, clear status text
        if (!activeFile || activeFile.extension !== "md") {
            statusBarItem.setText("");
            return;
        }

        try {
            // Read active file content
            const content = await app.vault.read(activeFile);

            // Remove Frontmatter
            const contentWithoutFrontmatter = content.replace(/^---\s*[\s\S]*?\s*---\s*/, "");

            // Regex for list items
            const listRegex = /^\s*([-*+]|\d+\.)\s/gm;

            // Count the matches
            const matches = contentWithoutFrontmatter.match(listRegex);
            const count = matches ? matches.length : 0;

            // Update status bar text
            statusBarItem.setText(`Bullets: ${count}`);
        } catch (error) {
            console.error("Bullet Counter Error:", error);
        }
    };

    // Initialize state on the window object
    window[STATE_KEY] = {
        statusBarItem: statusBarItem,
        eventRefs: [],
        timeoutId: null
    };

    // Debounce helper to avoid heavy recalculations during rapid typing
    const debouncedUpdate = () => {
        const state = window[STATE_KEY];
        if (!state) return;

        if (state.timeoutId) {
            clearTimeout(state.timeoutId);
        }

        state.timeoutId = setTimeout(async () => {
            await updateBulletCount();
        }, 300); // 300ms delay after typing pauses
    };

    // Register listeners to trigger calculations automatically
    // Triggered when switching active documents
    const fileOpenRef = app.workspace.on("file-open", () => {
        debouncedUpdate();
    });

    // Triggered on every modification/edit inside the active document
    const editorChangeRef = app.workspace.on("editor-change", () => {
        debouncedUpdate();
    });

    // Save references to the events so we can clean them up later
    window[STATE_KEY].eventRefs = [fileOpenRef, editorChangeRef];

    // Initial calculation for the currently active document
    await updateBulletCount();
};