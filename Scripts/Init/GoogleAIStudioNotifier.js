// GoogleAIStudioNotifier.js
// Script Runner plugin script.
// Set as a Startup Script in Script Runner settings or execute manually to toggle on/off.

module.exports = async ({ app }) => {
  const { Notice } = require("obsidian");

  let electron = null;
  let remote = null;

  try {
    electron = require("electron");
    remote = electron.remote || (electron.main ? electron.main : null);
    
    // Disable background throttling on host window
    const win = remote ? remote.getCurrentWindow() : null;
    if (win && win.webContents && win.webContents.setBackgroundThrottling) {
      win.webContents.setBackgroundThrottling(false);
    }
  } catch (e) {}

  // Direct osascript notification with sound alert (macOS across Spaces)
  function sendMacNotification(title, message) {
    let sent = false;

    // Tier 1: AppleScript System Notification with Ping system sound
    try {
      const script = `display notification ${JSON.stringify(message)} with title ${JSON.stringify(title)} sound name "Ping"`;
      require("child_process").exec(`osascript -e ${JSON.stringify(script)}`);
      sent = true;
    } catch (e) {}

    // Tier 2: Electron Main Process Native Notification
    if (!sent && remote && remote.Notification && remote.Notification.isSupported()) {
      try {
        const notif = new remote.Notification({ title: title, body: message, silent: false });
        notif.on("click", () => {
          const win = remote.getCurrentWindow();
          if (win) win.focus();
        });
        notif.show();
        sent = true;
      } catch (e) {}
    }

    // Tier 3: HTML5 Web Notification API fallback
    if (!sent && "Notification" in window && Notification.permission === "granted") {
      try {
        const notif = new Notification(title, { body: message });
        notif.onclick = () => window.focus();
      } catch (e) {}
    }
  }

  // Request Notification permission if needed
  if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission();
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

      // 2. Spoof Page Visibility & Focus APIs
      if (!window.__aiStudioVisibilitySpoofed) {
        window.__aiStudioVisibilitySpoofed = true;
        try {
          Object.defineProperty(document, 'visibilityState', { get: function() { return 'visible'; }, configurable: true });
          Object.defineProperty(document, 'hidden', { get: function() { return false; }, configurable: true });
          Object.defineProperty(document, 'webkitVisibilityState', { get: function() { return 'visible'; }, configurable: true });
          Object.defineProperty(document, 'webkitHidden', { get: function() { return false; }, configurable: true });
        } catch (e) {}
      }

      try {
        document.dispatchEvent(new Event('visibilitychange'));
        window.dispatchEvent(new Event('focus'));
      } catch (e) {}

      // Shadow DOM recursive query helper
      function queryShadowSelectorAll(selector, root, results) {
        root = root || document;
        results = results || [];
        const els = root.querySelectorAll(selector);
        els.forEach(el => results.push(el));
        const allElements = root.querySelectorAll('*');
        for (let i = 0; i < allElements.length; i++) {
          const element = allElements[i];
          if (element.shadowRoot) {
            queryShadowSelectorAll(selector, element.shadowRoot, results);
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
          const element = allElements[i];
          if (element.shadowRoot) {
            const found = queryShadowSelector(selector, element.shadowRoot);
            if (found) return found;
          }
        }
        return null;
      }

      // Targeted prompt-box stop button detection
      function isStopButtonActive() {
        const runButtons = queryShadowSelectorAll('ms-run-button button, ms-prompt-box button, button.run-button');
        for (let i = 0; i < runButtons.length; i++) {
          const btn = runButtons[i];
          const label = (btn.getAttribute('aria-label') || '').toLowerCase();
          const text = (btn.textContent || '').toLowerCase();
          if (label.includes('stop') || text.includes('stop')) {
            return true;
          }
        }
        return false;
      }

      // Measure latest text specifically in active model turn
      const turns = queryShadowSelectorAll('ms-chat-turn');
      let latestText = "";
      let modelContainer = null;
      
      for (let i = turns.length - 1; i >= 0; i--) {
        const turn = turns[i];
        const container = queryShadowSelector('.chat-turn-container.model', turn);
        if (container) {
          modelContainer = container;
          break;
        }
      }

      if (modelContainer) {
        const cmarkEls = queryShadowSelectorAll('ms-cmark-node, .model-content, .markdown', modelContainer);
        latestText = cmarkEls.map(el => el.textContent || "").join("");
      }

      return {
        isStopActive: isStopButtonActive(),
        textLength: latestText.length
      };
    })();
  `;

  // Poll every 250ms
  const intervalId = setInterval(async () => {
    const webviews = Array.from(document.querySelectorAll("webview"));

    for (const webview of webviews) {
      const src = webview.getAttribute("src") || "";
      if (!src.includes("aistudio.google.com")) continue;

      try {
        if (remote && webview.getWebContentsId) {
          const wc = remote.webContents.fromId(webview.getWebContentsId());
          if (wc && wc.setBackgroundThrottling) {
            wc.setBackgroundThrottling(false);
          }
        }
      } catch (e) {}

      try {
        const status = await webview.executeJavaScript(checkStatusScript);
        if (!status) continue;

        let state = stateMap.get(webview);

        if (!state) {
          stateMap.set(webview, {
            isGenerating: false,
            stopButtonWasSeen: false,
            lastTextLength: status.textLength,
            unchangedTicks: 0,
            hasNotified: false
          });
          continue;
        }

        // STRICT GATE: Only enter generation state when the Stop button is explicitly active.
        // This prevents chat history loading on initial page open from triggering a false notification.
        if (status.isStopActive) {
          if (!state.isGenerating) {
            state.isGenerating = true;
            state.hasNotified = false;
          }
          state.stopButtonWasSeen = true;
          state.unchangedTicks = 0; // Reset stability counter while stop button is active
        }

        if (state.isGenerating) {
          // Track content stability when Stop button has turned off
          if (!status.isStopActive) {
            if (status.textLength === state.lastTextLength && status.textLength > 0) {
              state.unchangedTicks++;
            } else {
              state.unchangedTicks = 0;
            }

            // Completion criteria:
            // 1. We were actively generating
            // 2. The Stop button is no longer active
            // 3. The Stop button WAS explicitly active during this run session
            // 4. Content has stayed unchanged for 4 consecutive checks (~1 sec stability)
            const isStable = state.unchangedTicks >= 4;
            const isComplete = !status.isStopActive && state.stopButtonWasSeen && isStable;

            if (isComplete && !state.hasNotified) {
              state.isGenerating = false;
              state.stopButtonWasSeen = false;
              state.unchangedTicks = 0;
              state.hasNotified = true;

              sendMacNotification(
                "Google AI Studio",
                "Response generation complete."
              );
            }
          }
        } else {
          // Reset notification lock once idle
          if (!status.isStopActive) {
            state.hasNotified = false;
            state.stopButtonWasSeen = false;
          }
        }

        state.lastTextLength = status.textLength;
      } catch (err) {
        // Skip unmounted webviews
      }
    }
  }, 250);

  window.aiStudioNotifierCleanup = () => {
    clearInterval(intervalId);
    delete window.aiStudioNotifierCleanup;
    delete window.aiStudioNotifierActive;
  };
};