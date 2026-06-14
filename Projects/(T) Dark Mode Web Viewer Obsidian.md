---
status: done
reminders:
  - id: rem_1771789115047_fffer2aa0
    type: relative
    description: ""
    relatedTo: scheduled
    offset: -PT0H
tags:
  - task
parent:
  - "[[(T) Optimize]]"
completedDate: 2026-05-09
---
## Synthesis
### Solution
- I have a dark mode script for QuickAdd which runs on startup. However, if I want a webpage with light mode, i can just manually turn it off with the shortcut. 
- It doesn't seem to affect Google Spreadsheets but that's okay.

#### V5
- Works across several windows
```javascript
module.exports = async (params) => {
    const WEBVIEW_SELECTOR = 'div.external-link-view webview, .webviewer-content webview';
    
    // Shift state storage to the shared app object so all windows stay synchronized
    const isFirstRun = app.__DARK_MODE_GLOBAL_STATE === undefined;

    if (isFirstRun) {
        app.__DARK_MODE_GLOBAL_STATE = true; 
    } else {
        app.__DARK_MODE_GLOBAL_STATE = !app.__DARK_MODE_GLOBAL_STATE;
    }

    const isActivating = app.__DARK_MODE_GLOBAL_STATE;

    async function updateWebview(webview, forceState) {
        if (!webview || typeof webview.executeJavaScript !== 'function' || webview._dmBusy) return;
        webview._dmBusy = true; // Prevent recursive calls

        const script = forceState 
            ? `(function() {
                const inject = () => { DarkReader.setFetchMethod(window.fetch); DarkReader.enable({ brightness: 100, contrast: 95, sepia: 0 }); };
                if (window.DarkReader) { inject(); } else {
                    const s = document.createElement('script');
                    s.src = 'https://cdn.jsdelivr.net/npm/darkreader/darkreader.min.js';
                    s.onload = inject;
                    document.head.appendChild(s);
                }
               })();`
            : `if (window.DarkReader) { DarkReader.disable(); }`;

        await webview.executeJavaScript(script).catch(() => {});
        webview._dmBusy = false;
    }

    // Gathers all open DOM windows (main window + any pop-outs)
    const getActiveWindows = () => {
        const windows = new Set([window]);
        const floatingSplit = app.workspace.floatingSplit;
        if (floatingSplit && floatingSplit.children) {
            floatingSplit.children.forEach(child => {
                if (child.win) {
                    windows.add(child.win);
                }
            });
        }
        return Array.from(windows);
    };

    // Scans all discovered windows and applies dark mode configuration to webviews
    const applyToAll = () => {
        const windows = getActiveWindows();
        windows.forEach(win => {
            if (!win || !win.document) return;
            const webviews = win.document.querySelectorAll(WEBVIEW_SELECTOR);
            webviews.forEach(wv => {
                updateWebview(wv, app.__DARK_MODE_GLOBAL_STATE);
                if (!wv._dmEventSet) {
                    wv.addEventListener('dom-ready', () => updateWebview(wv, app.__DARK_MODE_GLOBAL_STATE));
                    wv._dmEventSet = true;
                }
            });
        });
    };

    // Set up workspace listeners once per session on the shared global app object
    if (!app.__DARK_MODE_INIT) {
        app.__DARK_MODE_INIT = true;
        let timer;
        const triggerApply = () => {
            clearTimeout(timer);
            timer = setTimeout(applyToAll, 500); // Wait until layout settles
        };
        app.workspace.on('layout-change', triggerApply);
        app.workspace.on('window-open', triggerApply);
    }

    applyToAll();

    // Only show the notice if it is a manual toggle (not the first run on startup)
    if (!isFirstRun) {
        new Notice(isActivating ? "🌙 Webview Dark Mode: ON" : "☀️ Webview Dark Mode: OFF");
    }
};
```
#### Iteration 4
- Should be identical to iteration 3 but just doesn't notify on start-up that Dark-Mode is on
```javascript
module.exports = async (params) => {
    const WEBVIEW_SELECTOR = 'div.external-link-view webview, .webviewer-content webview';
    
    // Check if this is the first time the script is running this session
    const isFirstRun = window.__DARK_MODE_GLOBAL_STATE === undefined;

    if (isFirstRun) {
        window.__DARK_MODE_GLOBAL_STATE = true; 
    } else {
        window.__DARK_MODE_GLOBAL_STATE = !window.__DARK_MODE_GLOBAL_STATE;
    }

    const isActivating = window.__DARK_MODE_GLOBAL_STATE;

    async function updateWebview(webview, forceState) {
        if (!webview || typeof webview.executeJavaScript !== 'function' || webview._dmBusy) return;
        webview._dmBusy = true; // Prevent recursive calls

        const script = forceState 
            ? `(function() {
                const inject = () => { DarkReader.setFetchMethod(window.fetch); DarkReader.enable({ brightness: 100, contrast: 95, sepia: 0 }); };
                if (window.DarkReader) { inject(); } else {
                    const s = document.createElement('script');
                    s.src = 'https://cdn.jsdelivr.net/npm/darkreader/darkreader.min.js';
                    s.onload = inject;
                    document.head.appendChild(s);
                }
               })();`
            : `if (window.DarkReader) { DarkReader.disable(); }`;

        await webview.executeJavaScript(script).catch(() => {});
        webview._dmBusy = false;
    }

    // Optimized scanning: only runs when called or on specific layout changes
    const applyToAll = () => {
        const webviews = document.querySelectorAll(WEBVIEW_SELECTOR);
        webviews.forEach(wv => {
            updateWebview(wv, window.__DARK_MODE_GLOBAL_STATE);
            if (!wv._dmEventSet) {
                wv.addEventListener('dom-ready', () => updateWebview(wv, window.__DARK_MODE_GLOBAL_STATE));
                wv._dmEventSet = true;
            }
        });
    };

    // Replace the heavy MutationObserver with a light Layout listener
    if (!window.__DARK_MODE_INIT) {
        let timer;
        app.workspace.on('layout-change', () => {
            clearTimeout(timer);
            timer = setTimeout(applyToAll, 500); // Wait until layout settles
        });
        window.__DARK_MODE_INIT = true;
    }

    applyToAll();

    // Only show the notice if it is a manual toggle (not the first run on startup)
    if (!isFirstRun) {
        new Notice(isActivating ? "🌙 Webview Dark Mode: ON" : "☀️ Webview Dark Mode: OFF");
    }
};
```
#### Iteration 3
- Removed global observer so the entire Obsidian body will not be viewed for every single tiny change
- Added debouncing so the script waits 500ms to see if done moving things around before scanning for webviews. 
- Only looks for webviews when the layout changes which is rarer than "DOM changes" such as typing.
```javascript
module.exports = async (params) => {
    const WEBVIEW_SELECTOR = 'div.external-link-view webview, .webviewer-content webview';
    
    if (window.__DARK_MODE_GLOBAL_STATE === undefined) {
        window.__DARK_MODE_GLOBAL_STATE = true; 
    } else {
        window.__DARK_MODE_GLOBAL_STATE = !window.__DARK_MODE_GLOBAL_STATE;
    }

    const isActivating = window.__DARK_MODE_GLOBAL_STATE;

    async function updateWebview(webview, forceState) {
        if (!webview || typeof webview.executeJavaScript !== 'function' || webview._dmBusy) return;
        webview._dmBusy = true; // Prevent recursive calls

        const script = forceState 
            ? `(function() {
                const inject = () => { DarkReader.setFetchMethod(window.fetch); DarkReader.enable({ brightness: 100, contrast: 95, sepia: 0 }); };
                if (window.DarkReader) { inject(); } else {
                    const s = document.createElement('script');
                    s.src = 'https://cdn.jsdelivr.net/npm/darkreader/darkreader.min.js';
                    s.onload = inject;
                    document.head.appendChild(s);
                }
               })();`
            : `if (window.DarkReader) { DarkReader.disable(); }`;

        await webview.executeJavaScript(script).catch(() => {});
        webview._dmBusy = false;
    }

    // Optimized scanning: only runs when called or on specific layout changes
    const applyToAll = () => {
        const webviews = document.querySelectorAll(WEBVIEW_SELECTOR);
        webviews.forEach(wv => {
            updateWebview(wv, window.__DARK_MODE_GLOBAL_STATE);
            if (!wv._dmEventSet) {
                wv.addEventListener('dom-ready', () => updateWebview(wv, window.__DARK_MODE_GLOBAL_STATE));
                wv._dmEventSet = true;
            }
        });
    };

    // Replace the heavy MutationObserver with a light Layout listener
    if (!window.__DARK_MODE_INIT) {
        let timer;
        app.workspace.on('layout-change', () => {
            clearTimeout(timer);
            timer = setTimeout(applyToAll, 500); // Wait until layout settles
        });
        window.__DARK_MODE_INIT = true;
    }

    applyToAll();
    new Notice(isActivating ? "🌙 Webview Dark Mode: ON" : "☀️ Webview Dark Mode: OFF");
};
```
#### Iteration 1 (Working but inefficient?)
- Add optimization to the web viewer so that it doesn’t poll every second? It does slow down my computer then.
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
#### Iteration 2 (Not Really Working)
- Runs faster by removing MutationObserver and only using a `layout-change` listener
- When I refresh a page with dark mode set to off, it still runs dark mode
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