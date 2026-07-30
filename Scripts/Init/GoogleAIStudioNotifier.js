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

      function isInsideChatTurn(el) {
        let curr = el;
        while (curr) {
          if (curr.tagName && curr.tagName.toLowerCase() === 'ms-chat-turn') {
            return true;
          }
          curr = curr.parentNode || curr.host;
        }
        return false;
      }

      function isInsideSidebar(el) {
        let curr = el;
        while (curr) {
          const name = (curr.tagName || '').toLowerCase();
          const className = (curr.className || '').toString().toLowerCase();
          const role = (curr.getAttribute && curr.getAttribute('role') || '').toLowerCase();

          if (
            name === 'ms-settings-panel' ||
            name === 'ms-parameters' ||
            name === 'aside' ||
            role === 'complementary' ||
            className.includes('settings') ||
            className.includes('parameters')
          ) {
            return true;
          }
          curr = curr.parentNode || curr.host;
        }
        return false;
      }

      // 3. Check generating indicators (Stop button, Cancel, spinners, loaders)
      let stopButtonFound = false;
      let spinnerFound = false;

      const buttons = queryShadowAll('button, ms-run-button, [role="button"], ms-icon-button');
      for (let i = 0; i < buttons.length; i++) {
        const btn = buttons[i];

        // Ignore buttons inside past chat messages or the settings sidebar
        if (isInsideChatTurn(btn) || isInsideSidebar(btn)) continue;

        const label = (btn.getAttribute('aria-label') || '').trim().toLowerCase();
        const text = (btn.textContent || '').trim().toLowerCase();
        const className = (btn.className || '').toString().toLowerCase();

        // Strict regex matching for Stop / Cancel
        const isStopLabel = /^stop(\s+generation|\s+run)?$/i.test(label) || label === 'cancel';
        const isStopText = /^stop$/i.test(text) || text === 'cancel';
        const isRunningClass = className.includes('running') || className.includes('is-loading');

        if (isStopLabel || isStopText || isRunningClass) {
          stopButtonFound = true;
          break;
        }
      }

      // Check spinners outside chat turn history and sidebar
      if (!stopButtonFound) {
        const spinners = queryShadowAll('mat-spinner, ms-loader, .spinner, .loading, .streaming');
        for (let i = 0; i < spinners.length; i++) {
          if (!isInsideChatTurn(spinners[i]) && !isInsideSidebar(spinners[i])) {
            spinnerFound = true;
            break;
          }
        }
      }

      const isGeneratingDOM = stopButtonFound || spinnerFound;

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
        isGeneratingDOM: isGeneratingDOM,
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
            growthTicks: 0,
            lastTextLength: status.textLength,
            unchangedTicks: 0,
            hasNotified: false
          });
          continue;
        }

        const textGrew = status.textLength > state.lastTextLength;

        // Count consecutive growth ticks
        if (textGrew) {
          state.growthTicks++;
        } else if (status.textLength < state.lastTextLength) {
          state.growthTicks = 0;
          state.unchangedTicks = 0;
        } else {
          state.growthTicks = 0;
        }

        const isStreaming = status.isGeneratingDOM || state.growthTicks >= 2;

        if (isStreaming && !state.isGenerating) {
          state.isGenerating = true;
          state.hasNotified = false;
        }

        if (state.isGenerating) {
          if (status.textLength === state.lastTextLength) {
            state.unchangedTicks++;
          } else {
            state.unchangedTicks = 0;
          }

          // Complete when: DOM no longer shows generating indicators AND text hasn't changed for 3 ticks (~1s)
          const isComplete = !status.isGeneratingDOM && state.unchangedTicks >= 3;

          if (isComplete && !state.hasNotified) {
            state.isGenerating = false;
            state.growthTicks = 0;
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