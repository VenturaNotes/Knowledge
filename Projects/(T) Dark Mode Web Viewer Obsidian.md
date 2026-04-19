---
title: (T) Dark Mode Web Viewer Obsidian
status: done
priority: "0"
dateCreated: 2026-02-22T14:38:39.146-05:00
dateModified: 2026-02-22T17:00:27.311-05:00
reminders:
  - id: rem_1771789115047_fffer2aa0
    type: relative
    description: ""
    relatedTo: scheduled
    offset: -PT0H
tags:
  - task
completedDate: 2026-02-22
---
## Synthesis
### Solution
- I have a dark mode script for QuickAdd which runs on startup. However, if I want a webpage with light mode, i can just manually turn it off with the shortcut. 
- It doesn't seem to affect Google Spreadsheets but that's okay.
#### Iteration 2
- Runs faster by removing MutationObserver and only using a `layout-change` listener
```javascript
module.exports = async (params) => {
    // 1. Detect if this is the startup run or a manual toggle
    const isFirstRun = window.__DARK_MODE_GLOBAL_STATE === undefined;

    // 2. Set the state
    if (isFirstRun) {
        window.__DARK_MODE_GLOBAL_STATE = true; // Default to ON at startup
    } else {
        window.__DARK_MODE_GLOBAL_STATE = !window.__DARK_MODE_GLOBAL_STATE;
    }

    const isActivating = window.__DARK_MODE_GLOBAL_STATE;
    const WEBVIEW_SELECTOR = 'div.external-link-view webview, .webviewer-content webview, webview';

    async function updateWebview(webview) {
        if (!webview || typeof webview.executeJavaScript !== 'function') return;

        if (isActivating) {
            await webview.executeJavaScript(`
                (function() {
                    const inject = () => {
                        DarkReader.setFetchMethod(window.fetch);
                        DarkReader.enable({ brightness: 100, contrast: 95, sepia: 0 });
                    };
                    if (window.DarkReader) {
                        inject();
                    } else {
                        const script = document.createElement('script');
                        script.src = 'https://cdn.jsdelivr.net/npm/darkreader/darkreader.min.js';
                        script.onload = inject;
                        document.head.appendChild(script);
                    }
                })();
            `).catch(e => {});
        } else {
            await webview.executeJavaScript(`
                if (window.DarkReader) { DarkReader.disable(); }
            `).catch(e => {});
        }
    }

    // 3. Optimized Event Listener (Layout-change instead of MutationObserver)
    if (!window.__DARK_MODE_EVENT_SET) {
        app.workspace.on('layout-change', () => {
            if (window.__DARK_MODE_GLOBAL_STATE) {
                document.querySelectorAll(WEBVIEW_SELECTOR).forEach(wv => {
                    if (!wv._dmAttached) {
                        wv.addEventListener('dom-ready', () => updateWebview(wv));
                        updateWebview(wv);
                        wv._dmAttached = true;
                    }
                });
            }
        });
        window.__DARK_MODE_EVENT_SET = true;
    }

    // 4. Apply immediately to active webviews
    const activeWebviews = document.querySelectorAll(WEBVIEW_SELECTOR);
    activeWebviews.forEach(wv => {
        if (!wv._dmAttached) {
            wv.addEventListener('dom-ready', () => updateWebview(wv));
            wv._dmAttached = true;
        }
        updateWebview(wv);
    });

    // 5. THE FIX: Only show Notice if it's NOT the first run (manual toggle only)
    if (!isFirstRun) {
        new Notice(isActivating ? "🌙 Webview Dark Mode: ON" : "☀️ Webview Dark Mode: OFF");
    }
};
```
#### Iteration 1
```javascript
module.exports = async (params) => {
    // 1. Check if this is the very first run of the session
    const isFirstRun = window.__DARK_MODE_GLOBAL_STATE === undefined;

    // 2. Set the state
    if (isFirstRun) {
        window.__DARK_MODE_GLOBAL_STATE = true; // Default to ON at startup
    } else {
        window.__DARK_MODE_GLOBAL_STATE = !window.__DARK_MODE_GLOBAL_STATE;
    }

    const isActivating = window.__DARK_MODE_GLOBAL_STATE;
    const WEBVIEW_SELECTOR = 'div.external-link-view webview, .webviewer-content webview';

    async function updateWebview(webview, forceState) {
        if (!webview || typeof webview.executeJavaScript !== 'function') return;

        if (forceState) {
            await webview.executeJavaScript(`
                (function() {
                    const inject = () => {
                        DarkReader.setFetchMethod(window.fetch);
                        DarkReader.enable({ brightness: 100, contrast: 95, sepia: 0 });
                    };
                    if (window.DarkReader) {
                        inject();
                    } else {
                        const script = document.createElement('script');
                        script.src = 'https://cdn.jsdelivr.net/npm/darkreader/darkreader.min.js';
                        script.onload = inject;
                        document.head.appendChild(script);
                    }
                })();
            `).catch(e => {});
        } else {
            await webview.executeJavaScript(`
                if (window.DarkReader) { DarkReader.disable(); }
            `).catch(e => {});
        }
    }

    // 3. Setup the Observer (One-time setup)
    if (!window.__DARK_MODE_OBSERVER_SET) {
        const observer = new MutationObserver(() => {
            if (window.__DARK_MODE_GLOBAL_STATE === true) {
                const webviews = document.querySelectorAll(WEBVIEW_SELECTOR);
                webviews.forEach(wv => {
                    if (!wv._dmAttached) {
                        wv.addEventListener('dom-ready', () => {
                            updateWebview(wv, window.__DARK_MODE_GLOBAL_STATE);
                        });
                        updateWebview(wv, true);
                        wv._dmAttached = true;
                    }
                });
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        window.__DARK_MODE_OBSERVER_SET = true;
    }

    // 4. Apply to active webviews
    const activeWebviews = document.querySelectorAll(WEBVIEW_SELECTOR);
    activeWebviews.forEach(wv => updateWebview(wv, isActivating));

    // 5. THE FIX: Only show Notice if it's NOT the first run
    if (!isFirstRun) {
        new Notice(isActivating ? "🌙 Webview Dark Mode: ON" : "☀️ Webview Dark Mode: OFF");
    }
};
```
### Potential Solution
- Use QuickAdd for Dark Mode. On StartUp, this script runs so that any webpage I'm on will always have dark-mode activated.
- Make the change so that you can turn it on or off whenever you want
### Description
- [Gemini Conversation](https://gemini.google.com/app/3f4bdbcdff8c7408)
- Use this
	- https://github.com/mnaoumov/obsidian-codescript-toolkit
- And code from here to make it work
	- https://forum.obsidian.md/t/web-viewer-dark-mode/107153/3
- [Wikipedia Test Website](https://en.wikipedia.org/wiki/Wikipedia)
## Source [^1]
- 
## References

[^1]: 