// MoveToMainSpace.js
// Script Runner plugin script.
// Exits full-screen mode, scrolls the latest chat turn into view via scrollIntoView(),
// and restores Full-Screen mode with prompt input focused via Control+Space.

module.exports = async ({ app }) => {
  const { Notice } = require("obsidian");

  let electron = null;
  let remote = null;
  let win = null;
  let globalShortcut = null;

  try {
    electron = require("electron");
    remote = electron.remote || (electron.main ? electron.main : null);
    
    if (remote) {
      win = remote.getCurrentWindow();
      globalShortcut = remote.globalShortcut;
    } else if (electron.getCurrentWindow) {
      win = electron.getCurrentWindow();
      globalShortcut = electron.globalShortcut;
    }
  } catch (err) {
    console.error("[MoveToMainSpace] Error accessing Electron modules:", err);
  }

  if (!win) {
    new Notice("Unable to access Electron window controls.");
    return;
  }

  const HOTKEY = "Control+Space";

  // Uses scrollIntoView on the latest chat turn inside Google AI Studio
  async function performWebviewScrollAndReflow() {
    const webviews = Array.from(document.querySelectorAll("webview"));
    for (const wv of webviews) {
      const src = wv.getAttribute("src") || "";
      if (!src.includes("aistudio.google.com")) continue;

      try {
        await wv.executeJavaScript(`
          (function() {
            function queryShadowAll(selector, root) {
              root = root || document;
              let results = Array.from(root.querySelectorAll(selector));
              const all = root.querySelectorAll('*');
              for (let i = 0; i < all.length; i++) {
                if (all[i].shadowRoot) {
                  results = results.concat(queryShadowAll(selector, all[i].shadowRoot));
                }
              }
              return results;
            }

            function queryShadowSelector(selector, root) {
              root = root || document;
              const el = root.querySelector(selector);
              if (el) return el;
              const allElements = root.querySelectorAll('*');
              for (let i = 0; i < allElements.length; i++) {
                if (allElements[i].shadowRoot) {
                  const found = queryShadowSelector(selector, allElements[i].shadowRoot);
                  if (found) return found;
                }
              }
              return null;
            }

            try {
              // 1. Find the latest chat turn and scroll it into view natively
              const turns = queryShadowAll('ms-chat-turn');
              if (turns.length > 0) {
                const lastTurn = turns[turns.length - 1];
                if (lastTurn && lastTurn.scrollIntoView) {
                  lastTurn.scrollIntoView({ behavior: 'instant', block: 'end' });
                }
              } else {
                // 2. Fallback: Scroll prompt box into view
                const promptBox = queryShadowSelector('ms-prompt-box, textarea, [role="textbox"]');
                if (promptBox && promptBox.scrollIntoView) {
                  promptBox.scrollIntoView({ behavior: 'instant', block: 'end' });
                }
              }

              // 3. Fallback: Scroll main window
              window.scrollTo(0, document.body.scrollHeight);
            } catch(e) {}
          })();
        `);
      } catch (e) {}
    }
  }

  // Traverses Shadow DOM inside webviews to focus the prompt input field
  async function focusWebviewInput() {
    const webviews = Array.from(document.querySelectorAll("webview"));
    for (const wv of webviews) {
      const src = wv.getAttribute("src") || "";
      if (!src.includes("aistudio.google.com")) continue;

      try {
        wv.focus();
        await wv.executeJavaScript(`
          (function() {
            function queryShadowSelector(selector, root) {
              root = root || document;
              const el = root.querySelector(selector);
              if (el) return el;
              const allElements = root.querySelectorAll('*');
              for (let i = 0; i < allElements.length; i++) {
                if (allElements[i].shadowRoot) {
                  const found = queryShadowSelector(selector, allElements[i].shadowRoot);
                  if (found) return found;
                }
              }
              return null;
            }

            const input = queryShadowSelector(
              'ms-prompt-box textarea, ms-prompt-box ms-autosize-textarea textarea, textarea[aria-label="Type something"], textarea[aria-label="Enter a prompt"], textarea, div[contenteditable="true"], [role="textbox"]'
            );
            if (input) {
              input.focus();
            }
          })();
        `);
      } catch (e) {
        console.error("[MoveToMainSpace] Webview input focus error:", e);
      }
    }
  }

  async function restoreToFullScreen() {
    try {
      // 1. STOP the background auto-scroll loop immediately
      if (window.obsidianBackgroundScrollLoop) {
        clearInterval(window.obsidianBackgroundScrollLoop);
        delete window.obsidianBackgroundScrollLoop;
      }

      // 2. Unregister active global hotkey
      if (globalShortcut && globalShortcut.isRegistered(HOTKEY)) {
        globalShortcut.unregister(HOTKEY);
      }

      // 3. Focus application in macOS Cocoa BEFORE triggering full-screen
      if (remote && remote.app) {
        try { remote.app.focus({ steal: true }); } catch (e) {}
      }
      win.show();
      win.focus();

      // 4. Trigger native full-screen and await completion event
      if (!win.isFullScreen()) {
        await new Promise((resolve) => {
          let resolved = false;
          const done = () => {
            if (!resolved) {
              resolved = true;
              resolve();
            }
          };
          win.once("enter-full-screen", done);
          win.setFullScreen(true);
          setTimeout(done, 1000);
        });
      }

      // 5. Focus prompt input box inside webview
      await focusWebviewInput();

      window.obsidianMainSpaceActive = false;
    } catch (err) {
      console.error("[MoveToMainSpace] Failed to restore full-screen:", err);
    }
  }

  async function moveToMainSpace() {
    try {
      // 1. Exit full-screen natively if currently full-screen
      if (win.isFullScreen()) {
        await new Promise((resolve) => {
          let resolved = false;
          const done = () => {
            if (!resolved) {
              resolved = true;
              resolve();
            }
          };
          win.once("leave-full-screen", done);
          win.setFullScreen(false);
          setTimeout(done, 1000);
        });
      }

      // 2. Ensure normal window interactivity
      win.setOpacity(1.0);
      win.setIgnoreMouseEvents(false);
      win.setAlwaysOnTop(false);

      // 3. Drop window focus so active desktop applications sit in front
      win.blur();

      // 4. START BACKGROUND SCROLL-INTO-VIEW LOOP (400ms interval while backgrounded)
      if (window.obsidianBackgroundScrollLoop) {
        clearInterval(window.obsidianBackgroundScrollLoop);
      }
      window.obsidianBackgroundScrollLoop = setInterval(async () => {
        await performWebviewScrollAndReflow();
      }, 400);

      // 5. Register Control+Space global shortcut
      if (globalShortcut) {
        if (globalShortcut.isRegistered(HOTKEY)) {
          globalShortcut.unregister(HOTKEY);
        }

        const registered = globalShortcut.register(HOTKEY, () => {
          restoreToFullScreen();
        });

        if (registered) {
          new Notice("Obsidian on main Space (Auto-scroll active). Press Control+Space to restore Full-Screen.");
        } else {
          new Notice("Failed to register Control+Space global shortcut.");
        }
      }

      window.obsidianMainSpaceActive = true;
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