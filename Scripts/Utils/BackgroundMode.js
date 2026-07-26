// MoveToMainSpace.js
// Script Runner plugin script.
// Exits macOS Full-Screen mode to bring Obsidian onto your main desktop Space,
// keeping it fully visible (opacity 1.0), clickable, and interactive alongside your other apps.

module.exports = async ({ app }) => {
  const { execSync } = require("child_process");
  const { Notice } = require("obsidian");

  let win = null;
  try {
    const electron = require("electron");
    const remote = electron.remote || (electron.main ? electron.main : null);
    if (remote) {
      win = remote.getCurrentWindow();
    } else if (electron.getCurrentWindow) {
      win = electron.getCurrentWindow();
    }
  } catch (err) {
    console.error("[MoveToMainSpace] Error accessing Electron window:", err);
  }

  if (!win) {
    new Notice("Unable to access Electron window controls.");
    return;
  }

  // Helper to check native macOS full-screen state
  function isFullScreen() {
    try {
      const script = `
        tell application "System Events"
          try
            tell process "Obsidian"
              return value of attribute "AXFullScreen" of window 1
            end tell
          on error
            return "false"
          end try
        end tell
      `;
      const output = execSync(`osascript -e '${script}'`).toString().trim();
      return output === "true";
    } catch (e) {
      return win.isFullScreen();
    }
  }

  // Ensure normal window interactivity & visibility
  win.setOpacity(1.0);
  win.setIgnoreMouseEvents(false);
  win.setAlwaysOnTop(false);

  if (isFullScreen() || win.isFullScreen()) {
    // Exit full-screen mode to bring Obsidian onto the main desktop Space
    win.setFullScreen(false);
    new Notice("Obsidian moved to main desktop Space.");
  } else {
    // Focus Obsidian window on the main Space
    win.focus();
    new Notice("Obsidian is on main Space.");
  }
};