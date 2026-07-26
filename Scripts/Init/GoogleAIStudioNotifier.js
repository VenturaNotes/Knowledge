// GoogleAIStudioNotifier.js
// Script Runner plugin script.
// Set as a Startup Script in Script Runner settings or execute manually to toggle on/off.

module.exports = async ({ app }) => {
  const { exec } = require("child_process");
  const { Notice } = require("obsidian");

  // Disable background throttling on the host Electron window
  try {
    const electron = require("electron");
    const remote = electron.remote || (electron.main ? electron.main : null);
    const win = remote ? remote.getCurrentWindow() : null;
    if (win && win.webContents && win.webContents.setBackgroundThrottling) {
      win.webContents.setBackgroundThrottling(false);
    }
  } catch (e) {}

  // Dispatches native macOS notification via osascript
  function sendMacNotification(title, message) {
    const script = `display notification ${JSON.stringify(message)} with title ${JSON.stringify(title)}`;
    const command = `osascript -e ${JSON.stringify(script)}`;

    exec(command, (err) => {
      if (err) {
        console.error("[AIStudioNotifier] Failed to dispatch macOS notification:", err);
      }
      // Show Obsidian in-app Notice as well
      new Notice(`${title}: ${message}`);
    });
  }

  // Toggle Off if already running
  if (window.aiStudioNotifierActive) {
    if (window.aiStudioNotifierCleanup) {
      window.aiStudioNotifierCleanup();
    }
    new Notice("Google AI Studio Notifier stopped.");
    return;
  }

  window.aiStudioNotifierActive = true;
  new Notice("Google AI Studio Notifier active.");

  const stateMap = new WeakMap();

  const checkStatusScript = `
    (function() {
      // 1. Silent WebAudio Keep-Alive
      if (!window.__aiStudioAudioKeepAlive) {
        window.__aiStudioAudioKeepAlive = true;
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            gain.gain.value = 0.00001; // Inaudible
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
          }
        } catch(e) {}
      }

      // 2. Spoof Page Visibility and Focus
      if (!window.__aiStudioVisibilitySpoofed) {
        window.__aiStudioVisibilitySpoofed = true;
        try {
          Object.defineProperty(document, 'visibilityState', { get: function() { return 'visible'; }, configurable: true });
          Object.defineProperty(document, 'hidden', { get: function() { return false; }, configurable: true });
        } catch (e) {}
      }

      try {
        document.dispatchEvent(new Event('visibilitychange'));
        window.dispatchEvent(new Event('focus'));
      } catch (e) {}

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

      // 3. Check for active Stop button
      let stopButtonFound = false;
      const buttons = queryShadowAll('button, ms-run-button');
      for (let i = 0; i < buttons.length; i++) {
        const btn = buttons[i];
        const label = (btn.getAttribute('aria-label') || '').toLowerCase();
        const text = (btn.textContent || '').toLowerCase();
        if (label.includes('stop') || text.includes('stop')) {
          stopButtonFound = true;
          break;
        }
      }

      // 4. Measure output text length in latest chat turn
      const turns = queryShadowAll('ms-chat-turn');
      let latestText = "";
      for (let i = turns.length - 1; i >= 0; i--) {
        const turn = turns[i];
        const contentEls = queryShadowAll('ms-cmark-node, .model-content, .markdown', turn);
        if (contentEls.length > 0) {
          latestText = contentEls.map(el => el.textContent || "").join("");
          break;
        }
      }

      return {
        stopButtonFound: stopButtonFound,
        textLength: latestText.length
      };
    })();
  `;

  const intervalId = setInterval(async () => {
    const webviews = Array.from(document.querySelectorAll("webview"));

    for (const webview of webviews) {
      const src = webview.getAttribute("src") || "";
      if (!src.includes("aistudio.google.com")) continue;

      try {
        if (webview.getWebContents && webview.getWebContents().setBackgroundThrottling) {
          webview.getWebContents().setBackgroundThrottling(false);
        }
      } catch (e) {}

      try {
        const status = await webview.executeJavaScript(checkStatusScript);
        if (!status) continue;

        let state = stateMap.get(webview);

        if (!state) {
          stateMap.set(webview, {
            isGenerating: false,
            lastTextLength: status.textLength,
            unchangedTicks: 0,
            hasNotified: false
          });
          continue;
        }

        const isStopActive = status.stopButtonFound;
        const textGrew = status.textLength > state.lastTextLength;

        if (status.textLength < state.lastTextLength) {
          state.isGenerating = false;
          state.unchangedTicks = 0;
          state.hasNotified = false;
        }

        if (isStopActive || textGrew) {
          if (!state.isGenerating) {
            state.isGenerating = true;
            state.hasNotified = false;
            state.unchangedTicks = 0;
          }
        }

        if (state.isGenerating) {
          if (status.textLength === state.lastTextLength) {
            state.unchangedTicks++;
          } else {
            state.unchangedTicks = 0;
          }

          const isComplete = !isStopActive && state.unchangedTicks >= 4;

          if (isComplete && !state.hasNotified) {
            state.isGenerating = false;
            state.hasNotified = true;
            state.unchangedTicks = 0;

            sendMacNotification(
              "Google AI Studio",
              "Response generation complete."
            );
          }
        }

        state.lastTextLength = status.textLength;
      } catch (err) {
        // Silently skip if webview is unmounted
      }
    }
  }, 300);

  window.aiStudioNotifierCleanup = () => {
    clearInterval(intervalId);
    delete window.aiStudioNotifierCleanup;
    delete window.aiStudioNotifierActive;
  };
};