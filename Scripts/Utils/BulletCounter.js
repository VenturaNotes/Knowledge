module.exports = async (params) => {
    const STATE_KEY = "obsidianBulletCounterState";

    // 1. If already active, toggle it OFF
    if (window[STATE_KEY]) {
        const state = window[STATE_KEY];

        // Remove the custom status bar element from the DOM
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
    
    // Append it directly to the status bar container
    statusBarContainer.appendChild(statusBarItem);

    // Core logic to count bullet points in the active document
    const updateBulletCount = async () => {
        const activeFile = app.workspace.getActiveFile();

        // If no file is open, or it's not a markdown file, clear status text
        if (!activeFile || activeFile.extension !== "md") {
            statusBarItem.textContent = "";
            return;
        }

        try {
            let content = "";
            const activeEditor = app.workspace.activeEditor;

            // 1. Instantly pull text from the live, in-memory editor
            if (activeEditor && activeEditor.editor && activeEditor.file === activeFile) {
                content = activeEditor.editor.getValue();
            } else {
                // Fallback to disk read only if the editor isn't focused/ready yet
                content = await app.vault.read(activeFile);
            }

            // Remove Frontmatter
            const contentWithoutFrontmatter = content.replace(/^---\s*[\s\S]*?\s*---\s*/, "");

            // Regex for list items
            const listRegex = /^\s*([-*+]|\d+\.)\s/gm;

            // Count the matches
            const matches = contentWithoutFrontmatter.match(listRegex);
            const count = matches ? matches.length : 0;

            // Update status bar text
            statusBarItem.textContent = `Bullets: ${count}`;
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

    // Very fast debounce (20ms) to make updates feel immediate on every keystroke
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

    // Register listeners to trigger calculations automatically
    const fileOpenRef = app.workspace.on("file-open", () => {
        debouncedUpdate();
    });

    const editorChangeRef = app.workspace.on("editor-change", () => {
        debouncedUpdate();
    });

    // Save references to the events so we can clean them up later
    window[STATE_KEY].eventRefs = [fileOpenRef, editorChangeRef];

    // Initial calculation for the currently active document
    await updateBulletCount();
};