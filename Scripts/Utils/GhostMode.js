// GhostMode.js
// Script Runner plugin script.
// Locks Obsidian in an invisible background state and uses macOS System Events
// to reliably restore full-screen mode upon unlocking with Control+Space.

module.exports = async ({ app }) => {
  const { execSync } = require("child_process");
  const { Notice } = require("obsidian");
  
  let win = null;
  let globalShortcut = null;

  try {
    const electron = require("electron");
    const remote = electron.remote || (electron.main ? electron.main : null);
    
    if (remote) {
      win = remote.getCurrentWindow();
      globalShortcut = remote.globalShortcut;
    } else if (electron.getCurrentWindow) {
      win = electron.getCurrentWindow();
      globalShortcut = electron.globalShortcut;
    }
  } catch (err) {
    console.error("[GhostMode] Error accessing Electron modules:", err);
  }

  if (!win) {
    new Notice("Unable to access Electron window controls.");
    return;
  }

  const HOTKEY = "Control+Space";

  // Native macOS Full-Screen check via AppleScript
  function isMacFullScreen() {
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
    try {
      const output = execSync(`osascript -e '${script}'`).toString().trim();
      return output === "true";
    } catch (e) {
      return win.isFullScreen();
    }
  }

  // Native macOS Full-Screen set via AppleScript
  function setMacFullScreen(enable) {
    const script = `
      tell application "System Events"
        try
          tell process "Obsidian"
            set value of attribute "AXFullScreen" of window 1 to ${enable ? "true" : "false"}
          end tell
        end try
      end tell
    `;
    try {
      execSync(`osascript -e '${script}'`);
    } catch (e) {
      win.setFullScreen(enable);
    }
  }

  async function unlockWindow() {
    try {
      // 1. Re-enable standard background throttling
      if (win.webContents && win.webContents.setBackgroundThrottling) {
        win.webContents.setBackgroundThrottling(true);
      }

      // 2. Clear floating window levels & mouse click-through
      win.setAlwaysOnTop(false);
      win.setOpacity(1.0);
      win.setIgnoreMouseEvents(false);
      win.focus();
      
      // 3. Unregister global hotkey
      if (globalShortcut && globalShortcut.isRegistered(HOTKEY)) {
        globalShortcut.unregister(HOTKEY);
      }
      
      // 4. Short delay to ensure macOS window flags settle before toggling full-screen
      await new Promise(resolve => setTimeout(resolve, 150));

      // 5. Restore full-screen mode via AppleScript if originally full-screen
      if (window.obsidianGhostWasFullScreen) {
        setMacFullScreen(true);
      }

      window.obsidianGhostActive = false;
      window.obsidianGhostWasFullScreen = false;
      new Notice("Obsidian unlocked and restored.");
    } catch (err) {
      console.error("[GhostMode] Failed to unlock window:", err);
    }
  }

  async function lockWindow() {
    try {
      const wasFS = isMacFullScreen();
      window.obsidianGhostWasFullScreen = wasFS;

      // 1. If currently in Full-Screen mode, exit full-screen via AppleScript
      if (wasFS) {
        setMacFullScreen(false);
        // Delay to allow macOS native Space animation to complete
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // 2. Disable background throttling so webviews render continuously
      if (win.webContents && win.webContents.setBackgroundThrottling) {
        win.webContents.setBackgroundThrottling(false);
      }

      // 3. Apply ghosting properties
      win.setOpacity(0.02);
      win.setAlwaysOnTop(true, "floating");
      win.setIgnoreMouseEvents(true, { forward: true });
      win.blur();

      // 4. Register system-wide shortcut listener
      if (globalShortcut) {
        if (globalShortcut.isRegistered(HOTKEY)) {
          globalShortcut.unregister(HOTKEY);
        }

        const registered = globalShortcut.register(HOTKEY, () => {
          unlockWindow();
        });

        if (!registered) {
          console.warn(`[GhostMode] System hotkey registration failed for ${HOTKEY}`);
        }
      }

      window.obsidianGhostActive = true;
      new Notice("Ghost Mode active. Press Control+Space to unlock.");
    } catch (err) {
      console.error("[GhostMode] Failed to lock window:", err);
    }
  }

  if (window.obsidianGhostActive) {
    await unlockWindow();
  } else {
    await lockWindow();
  }
};