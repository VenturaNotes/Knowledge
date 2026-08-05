module.exports = async ({ obsidian }) => {
    const Notice = obsidian?.Notice || window.Notice;

    // Locate the Obsidian status bar in the DOM
    const statusBar = document.querySelector(".status-bar");

    if (!statusBar) {
        if (Notice) new Notice("Error: Could not find Obsidian status bar.");
        return;
    }

    // Check if the status bar is currently hidden
    const isHidden = statusBar.style.display === "none";

    if (isHidden) {
        // Revert back: Show status bar
        statusBar.style.display = "";
        if (Notice) new Notice("Status Bar: Shown");
    } else {
        // Hide status bar
        statusBar.style.display = "none";
        if (Notice) new Notice("Status Bar: Hidden");
    }
};