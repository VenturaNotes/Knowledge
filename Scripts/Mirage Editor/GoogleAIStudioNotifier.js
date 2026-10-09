// Scripts/GoogleAIStudioNotifier.js
// Background notifier for Google AI Studio tabs in Mirage Editor.
// Triggers ONLY macOS native system notifications (banner + sound alert).

const { ipcRenderer } = require("electron");
const { exec } = require("child_process");

module.exports = async () => {
  // 1. Toggle OFF if already active in this window
  if (window.__aiStudioNotifierActive) {
    if (window.__aiStudioNotifierCleanup) {
      window.__aiStudioNotifierCleanup();
    }
    return;
  }

  window.__aiStudioNotifierActive = true;

  // Pure macOS system notification (Notification Center banner + "Ping" sound)
  function sendMacNotification(title, message) {
    try {
      const script = `display notification ${JSON.stringify(message)} with title ${JSON.stringify(title)} sound name "Ping"`;
      exec(`osascript -e ${JSON.stringify(script)}`);
    } catch (_) {}
  }

  // State map by tabId
  const tabStates = new Map();

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
            gain.gain.value = 0.00001;
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

  // Poll active AI Studio tabs every 300ms
  const intervalId = setInterval(async () => {
    try {
      const allTabs = await ipcRenderer.invoke("wcv:getAllTabs");
      const activeTabIds = new Set();

      for (const tab of allTabs) {
        if (!tab.url || !tab.url.includes("aistudio.google.com")) continue;

        activeTabIds.add(tab.tabId);

        const status = await ipcRenderer.invoke("wcv:executeJavaScript", {
          tabId: tab.tabId,
          script: checkStatusScript,
        });

        if (!status) continue;

        let state = tabStates.get(tab.tabId);
        if (!state) {
          tabStates.set(tab.tabId, {
            isGenerating: false,
            stopButtonWasSeen: false,
            lastTextLength: status.textLength,
            unchangedTicks: 0,
            hasNotified: false,
          });
          continue;
        }

        // STRICT GATE: Only enter generation state when the Stop button is explicitly active.
        if (status.isStopActive) {
          if (!state.isGenerating) {
            state.isGenerating = true;
            state.hasNotified = false;
          }
          state.stopButtonWasSeen = true;
          state.unchangedTicks = 0;
        }

        if (state.isGenerating) {
          if (!status.isStopActive) {
            if (status.textLength === state.lastTextLength && status.textLength > 0) {
              state.unchangedTicks++;
            } else {
              state.unchangedTicks = 0;
            }

            // Completion criteria: Stop button was active, has finished, and text is stable
            const isStable = state.unchangedTicks >= 4;
            const isComplete = !status.isStopActive && state.stopButtonWasSeen && isStable;

            if (isComplete && !state.hasNotified) {
              state.isGenerating = false;
              state.stopButtonWasSeen = false;
              state.unchangedTicks = 0;
              state.hasNotified = true;

              // Sends purely to macOS Notification Center with sound alert
              sendMacNotification(
                "Google AI Studio",
                "Response generation complete."
              );
            }
          }
        } else {
          if (!status.isStopActive) {
            state.hasNotified = false;
            state.stopButtonWasSeen = false;
          }
        }

        state.lastTextLength = status.textLength;
      }

      // Cleanup closed tabs
      for (const existingId of tabStates.keys()) {
        if (!activeTabIds.has(existingId)) {
          tabStates.delete(existingId);
        }
      }
    } catch (_) {}
  }, 300);

  window.__aiStudioNotifierCleanup = () => {
    clearInterval(intervalId);
    tabStates.clear();
    delete window.__aiStudioNotifierCleanup;
    delete window.__aiStudioNotifierActive;
  };
};