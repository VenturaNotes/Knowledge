// BackgroundMode.js
// Script Runner plugin script.
// Exits macOS Full-Screen mode, stretches Obsidian to fill the main desktop screen,
// pushes it behind active windows, and listens for Control+Space to return to Full-Screen.

module.exports = async ({ app }) => {
  const { execSync } = require("child_process");
  const { Notice } = require("obsidian");

  let win = null;
  let globalShortcut = null;
  let screen = null;

  try {
    const electron = require("electron");
    const remote = electron.remote || (electron.main ? electron.main : null);
    
    if (remote) {
      win = remote.getCurrentWindow();
      globalShortcut = remote.globalShortcut;
      screen = remote.screen || electron.screen;
    } else if (electron.getCurrentWindow) {
      win = electron.getCurrentWindow();
      globalShortcut = electron.globalShortcut;
      screen = electron.screen;
    }
  } catch (err) {
    console.error("[MoveToMainSpace] Error accessing Electron modules:", err);
  }

  if (!win) {
    new Notice("Unable to access Electron window controls.");
    return;
  }

  const HOTKEY = "Control+Space";

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

  async function restoreToFullScreen() {
    try {
      // 1. Unregister OS global shortcut
      if (globalShortcut && globalShortcut.isRegistered(HOTKEY)) {
        globalShortcut.unregister(HOTKEY);
      }

      // 2. Return to native macOS Full-Screen space
      win.setFullScreen(true);
      win.focus();

      window.obsidianMainSpaceActive = false;
      new Notice("Obsidian restored to Full-Screen mode.");
    } catch (err) {
      console.error("[MoveToMainSpace] Failed to restore full-screen:", err);
    }
  }

  async function moveToMainSpace() {
    try {
      const wasFS = isFullScreen() || win.isFullScreen();

      // 1. Exit native macOS Full-Screen space if currently full-screen
      if (wasFS) {
        win.setFullScreen(false);
        // Pause briefly for macOS Space slide transition to settle
        await new Promise(resolve => setTimeout(resolve, 400));
      }

      // 2. Ensure normal visibility and mouse interactivity
      win.setOpacity(1.0);
      win.setIgnoreMouseEvents(false);
      win.setAlwaysOnTop(false);

      // 3. Maximize bounds to fill the entire primary display screen
      if (screen) {
        const primaryDisplay = screen.getPrimaryDisplay();
        const workArea = primaryDisplay.workArea; // Full screen excluding menu bar/dock
        win.setBounds(workArea);
      } else {
        win.maximize();
      }

      // 4. Send window to background behind active applications
      win.blur();

      // 5. Register system-wide global shortcut (Control+Space) to return to Full-Screen from any app
      if (globalShortcut) {
        if (globalShortcut.isRegistered(HOTKEY)) {
          globalShortcut.unregister(HOTKEY);
        }

        const registered = globalShortcut.register(HOTKEY, () => {
          restoreToFullScreen();
        });

        if (!registered) {
          console.warn(`[MoveToMainSpace] Global shortcut registration failed for ${HOTKEY}`);
        }
      }

      window.obsidianMainSpaceActive = true;
      new Notice("Obsidian moved to main Space (maximized in background). Press Control+Space to return to Full-Screen.");
    } catch (err) {
      console.error("[MoveToMainSpace] Failed to move to main Space:", err);
    }
  }

  if (window.obsidianMainSpaceActive) {
    await restoreToFullScreen();
  } else {
    await moveToMainSpace();
  }
};