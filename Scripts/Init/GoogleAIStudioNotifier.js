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

  // Direct osascript notification with sound alert (most reliable on macOS across Spaces)
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

      // 2. Spoof Visibility & Focus
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

      // 3. Check Stop button
      let stopButtonFound = false;
      const buttons = queryShadowAll('button, ms-run-button, [role="button"]');
      for (let i = 0; i < buttons.length; i++) {
        const btn = buttons[i];
        const label = (btn.getAttribute('aria-label') || '').toLowerCase();
        const text = (btn.textContent || '').toLowerCase();
        if (label.includes('stop') || text.includes('stop') || label.includes('cancel') || text.includes('cancel')) {
          stopButtonFound = true;
          break;
        }
      }

      // 4. Measure response text length
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

      // Un-throttle webview webContents using Electron's webContents.fromId() API
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
            stopButtonSeen: false,
            lastTextLength: status.textLength,
            unchangedTicks: 0,
            hasNotified: false
          });
          continue;
        }

        const isStopActive = status.stopButtonFound;

        // ONLY enter generation tracking state if the active "Stop" button is present
        if (isStopActive) {
          state.isGenerating = true;
          state.stopButtonSeen = true;
          state.hasNotified = false;
        }

        if (state.isGenerating) {
          if (status.textLength === state.lastTextLength) {
            state.unchangedTicks++;
          } else {
            state.unchangedTicks = 0;
          }

          // Complete ONLY when: Stop button is gone AND we explicitly saw it active during this generation
          // AND text hasn't changed for 3 ticks (~1s)
          const isComplete = !isStopActive && state.stopButtonSeen && state.unchangedTicks >= 3;

          if (isComplete && !state.hasNotified) {
            state.isGenerating = false;
            state.stopButtonSeen = false;
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
        // Skip unmounted webviews
      }
    }
  }, 300);

  window.aiStudioNotifierCleanup = () => {
    clearInterval(intervalId);
    delete window.aiStudioNotifierCleanup;
    delete window.aiStudioNotifierActive;
  };
};