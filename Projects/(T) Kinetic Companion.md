---
status: open
tags:
  - task
---
- To achieve this, we can introduce Auto-File Patching to the Kinetic Companion plugin.
	- We can make this completely toggleable. You can trigger it automatically on stream completion, or manually via an Obsidian command so your workspace remains protected from accidental overwrites.
	- Oh, I think this is the code that would directly change the existing code that I have! 
## ToDo
- [ ] When writing question, have it fall below the highlight you made 
- [ ] Be able to type within its own line!
	- Of course make sure that you can't send anything though if there is nothing to send. So if you press enter, nothing is sent through. 
- [ ] Expand the input so that it wraps around multiple lines and pressing command + shift sends me to the next line. 
- [ ] Probably should make the window resizable
	- And by that I mean the floating window for my Kinetic Companion (but there should be a minimum size as not to be too small. Like the current dimensions that exist should not be smaller than they are)
- [ ] Remove the sparkle + slamdown affect in the settings
- [ ] Make it so the its 100% visible on initial load.
- [ ] Need to remove the "debug" things (or I could maybe change that to a notification? Just to make sure that it's not stuck)
## V11
- Fixed problem with making it work consistently. Just layered back.
- Also the below has the debug mode in-case we need to add it back later for future development. 
### FloatingCompanion
```typescript
import { App, Editor, Notice, htmlToMarkdown, WorkspaceLeaf } from 'obsidian';

export class FloatingCompanion {
    private app: App;
    private container: HTMLDivElement | null = null;
    private leaf: WorkspaceLeaf | null = null;
    private webview: any = null;
    
    private isVisible = false;
    private isMinimized = false;
    private opacityValue = '0.95';
    
    // Drag/position states
    private isDragging = false;
    private dragStartX = 0;
    private dragStartY = 0;
    private containerStartX = 0;
    private containerStartY = 0;
    private dragOverlay: HTMLDivElement | null = null;
    
    // Active prompt session states
    private activeEditor: Editor | null = null;
    private activePromptId: number | null = null;
    
    // Default position states
    private savedWidth = '380px';
    private savedHeight = '500px';
    private savedLeft = '100px';
    private savedTop = '100px';

    constructor(app: App) {
        this.app = app;
    }

    public async init() {
        const doc = document;
        
        // 1. Create a local floating container element
        const container = doc.createElement('div');
        container.classList.add('kc-floating-container');
        this.container = container; 
        this.styleContainerOffscreen();
        
        // 2. Build the top bar controls (drag bar, minimize, close/hide, opacity slider)
        this.buildChrome();
        
        // 3. Create a local native Obsidian leaf
        const leaf = new (WorkspaceLeaf as any)(this.app);
        this.leaf = leaf;
        this.neutralizeLeaf(leaf);
        
        await leaf.setViewState({
            type: 'webviewer',
            state: {
                url: 'https://aistudio.google.com/',
                navigate: true
            },
            active: true
        });

        // Style the leaf container to cleanly fill our floating frame
        Object.assign(leaf.containerEl.style, {
            flex: '1',
            minHeight: '0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        });

        // Append the native leaf container to our floating container
        container.appendChild(leaf.containerEl);
        doc.body.appendChild(container);
        
        // 4. Locates the loaded webview element inside the Obsidian leaf
        const webviewEl = await this.getReadyWebview();
        if (webviewEl) {
            this.webview = webviewEl;
            this.setupConsoleMessageInterceptor();
            console.log("Obsidian KC: Native webview is ready and hooked.");
        } else {
            console.error("Obsidian KC: Native webview could not be located inside the leaf.");
        }
    }

    public cleanup() {
        if (this.leaf) {
            try {
                // Force-allow standard layout detachment during unload
                (this.leaf as any)._allowDetach = true;
                this.leaf.detach();
            } catch (_) {}
            this.leaf = null;
        }
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
        this.webview = null;
        this.activeEditor = null;
        this.activePromptId = null;
    }

    public toggleVisibility() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    public show() {
        if (!this.container) return;
        this.styleContainerOnscreen();
    }

    public hide() {
        if (!this.container) return;
        this.styleContainerOffscreen();
    }

    private toggleMinimize() {
        if (!this.container || !this.leaf) return;
        this.isMinimized = !this.isMinimized;
        
        if (this.isMinimized) {
            const r = this.container.getBoundingClientRect();
            this.savedWidth = r.width + 'px';
            this.savedHeight = r.height + 'px';
            
            this.container.style.height = '36px';
            (this.leaf as any).containerEl.style.display = 'none';
        } else {
            this.container.style.height = this.savedHeight;
            (this.leaf as any).containerEl.style.display = 'flex';
        }
    }

    private styleContainerOffscreen() {
        if (!this.container) return;
        Object.assign(this.container.style, {
            position: 'fixed',
            top: '0px',
            left: '0px',
            width: '380px',
            height: '500px',
            opacity: '1.0',              // Prevents Chromium background throttling
            pointerEvents: 'none',       // Mouse clicks pass through completely
            zIndex: '-9999',             // Put behind the workspace so it is visually hidden
            clipPath: 'none',            // Standard layout boundaries allow IntersectionObservers to run
            background: 'transparent',
            border: 'none',
            borderRadius: '0px',
            boxShadow: 'none',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        });
        this.isVisible = false;
    }

    private styleContainerOnscreen() {
        if (!this.container) return;
        Object.assign(this.container.style, {
            position: 'fixed',
            top: this.savedTop,
            left: this.savedLeft,
            width: this.isMinimized ? '380px' : this.savedWidth,
            height: this.isMinimized ? '36px' : this.savedHeight,
            right: 'auto',
            bottom: 'auto',
            opacity: this.opacityValue,
            pointerEvents: 'auto',       // Restored mouse interactions
            zIndex: '9999',              // Brought to the foreground
            clipPath: 'none',            // Normal rendering
            background: 'var(--background-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        });
        this.isVisible = true;
    }

    private buildChrome() {
        if (!this.container) return;
        const doc = document;
        
        const dragBar = doc.createElement('div');
        dragBar.style.cssText = `
            background: var(--background-secondary);
            padding: 8px 12px; cursor: move; font-size: 11px; font-weight: bold;
            color: var(--text-muted); border-bottom: 1px solid var(--border-color);
            display: flex; justify-content: space-between; align-items: center;
            user-select: none; flex-shrink: 0; height: 36px; box-sizing: border-box;
        `;
        
        const titleSpan = doc.createElement('span');
        titleSpan.textContent = "Kinetic Companion (Google AI Studio)";
        dragBar.appendChild(titleSpan);
        
        const controls = doc.createElement('div');
        controls.style.cssText = `display: flex; align-items: center; gap: 8px; margin-left: auto;`;
        
        // Opacity Slider
        const sliderLabel = doc.createElement('span');
        sliderLabel.textContent = "☀";
        sliderLabel.title = "Opacity";
        sliderLabel.style.cssText = "font-size: 10px; opacity: 0.7;";
        controls.appendChild(sliderLabel);
        
        const opacitySlider = doc.createElement('input');
        opacitySlider.type = 'range';
        opacitySlider.min = '0.2';
        opacitySlider.max = '1.0';
        opacitySlider.step = '0.05';
        opacitySlider.value = this.opacityValue;
        opacitySlider.style.cssText = `
            width: 50px; height: 3px; cursor: pointer; margin: 0; accent-color: var(--interactive-accent);
        `;
        opacitySlider.addEventListener('input', (e: any) => {
            this.opacityValue = e.target.value;
            if (this.container && this.isVisible) {
                this.container.style.opacity = this.opacityValue;
            }
        });
        controls.appendChild(opacitySlider);
        
        // Minimize Button
        const minimizeBtn = doc.createElement('span');
        minimizeBtn.textContent = '−';
        minimizeBtn.title = "Minimize";
        minimizeBtn.style.cssText = `cursor: pointer; padding: 0 4px; font-weight: bold; font-size: 12px;`;
        minimizeBtn.addEventListener('click', () => this.toggleMinimize());
        controls.appendChild(minimizeBtn);
        
        // Hide Button
        const closeBtn = doc.createElement('span');
        closeBtn.textContent = '✕';
        closeBtn.title = "Hide";
        closeBtn.style.cssText = `cursor: pointer; padding: 0 4px; font-size: 11px;`;
        closeBtn.addEventListener('click', () => this.hide());
        controls.appendChild(closeBtn);
        
        dragBar.appendChild(controls);
        this.container.appendChild(dragBar);
        
        // Window drag handlers
        dragBar.addEventListener('mousedown', (e: MouseEvent) => {
            if (e.target === closeBtn || e.target === minimizeBtn || e.target === opacitySlider) return;
            this.isDragging = true;
            this.dragStartX = e.clientX;
            this.dragStartY = e.clientY;
            
            if (this.container) {
                const r = this.container.getBoundingClientRect();
                this.containerStartX = r.left;
                this.containerStartY = r.top;
            }
            
            e.preventDefault();
            this.showDragOverlay();
        });
        
        doc.addEventListener('mousemove', (e: MouseEvent) => {
            if (!this.isDragging || !this.container) return;
            const newLeft = this.containerStartX + (e.clientX - this.dragStartX);
            const newTop = this.containerStartY + (e.clientY - this.dragStartY);
            
            this.container.style.left = `${newLeft}px`;
            this.container.style.top = `${newTop}px`;
            this.container.style.right = 'auto';
            
            this.savedLeft = `${newLeft}px`;
            this.savedTop = `${newTop}px`;
        });
        
        doc.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.removeDragOverlay();
            }
        });
    }

    private showDragOverlay() {
        if (this.dragOverlay) return;
        const doc = document;
        this.dragOverlay = doc.createElement('div');
        this.dragOverlay.style.cssText = 'position: fixed; inset: 0; z-index: 999999; background: transparent; cursor: move;';
        doc.body.appendChild(this.dragOverlay);
        
        if (this.webview) {
            this.webview.style.pointerEvents = 'none';
        }
    }

    private removeDragOverlay() {
        if (this.dragOverlay) {
            this.dragOverlay.remove();
            this.dragOverlay = null;
        }
        if (this.webview) {
            this.webview.style.pointerEvents = '';
        }
    }

    private neutralizeLeaf(leaf: any) {
        if (leaf && leaf.containerEl) {
            leaf.containerEl.setAttribute('tabindex', '-1');
            leaf.containerEl.style.outline = 'none';
        }

        const noopContainer = {
            requestFocus: () => {},
            focus:        () => {},
            get win() { return window; },
            get doc() { return document; },
            containerEl:  leaf.containerEl,
        };

        const safeContainerEl = {
            addClass:        () => {},
            removeClass:     () => {},
            toggleClass:     () => {},
            hasClass:        () => false,
            setAttribute:    () => {},
            removeAttribute: () => {},
            classList:       { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
            style:           {},
            dataset:         {},
        };

        const fakeRoot = {
            get win() { return window; },
            get doc() { return document; },
            containerEl:     safeContainerEl,
            getRoot:         () => fakeRoot,
            isAttached:      () => true,
            recomputeLayout: () => {},
            updateLayout:    () => {},
            type: 'root',
        };

        const fakeParent = {
            get win() { return window; },
            get doc() { return document; },
            getContainer:    () => noopContainer,
            containerEl:     safeContainerEl,
            children:        [leaf],
            type:            'split',
            getRoot:         () => fakeRoot,
            isAttached:      () => true,
            recomputeLayout: () => {},
            updateLayout:    () => {},
        };

        if (!leaf.parent) {
            leaf.parent = fakeParent;
        }
    }

    private async getReadyWebview(): Promise<any> {
        const leaf = this.leaf;
        if (!leaf) return null;
        
        return new Promise<any>((resolve) => {
            const el = (leaf as any).containerEl.querySelector("webview");
            if (el) {
                resolve(el);
                return;
            }
            const observer = new MutationObserver(() => {
                const el = (leaf as any).containerEl.querySelector("webview");
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe((leaf as any).containerEl, { childList: true, subtree: true });
            
            setTimeout(() => {
                observer.disconnect();
                resolve((leaf as any).containerEl.querySelector("webview"));
            }, 5000);
        });
    }

    private setupConsoleMessageInterceptor() {
        if (!this.webview) return;
        this.webview.addEventListener('console-message', (event: any) => {
            const message = event.message as string;
            console.log("[WebView Guest]", message);

            if (message && message.startsWith("gemini-stream-chunk::")) {
                const encodedHTML = message.substring("gemini-stream-chunk::".length);
                try {
                    const decodedHTML = decodeURIComponent(encodedHTML);
                    this.handleStreamChunk(decodedHTML);
                } catch (e) {
                    console.error("Obsidian KC: Parsing received HTML stream chunk failed:", e);
                }
            }
        });
    }

    private getNextAvailableId(editor: Editor): number {
        const text = editor.getValue();
        const lines = text.split('\n');
        const used = new Set<number>();
        
        for (const line of lines) {
            const trimmed = line.trim();
            // Match structural companion tags on their own line to avoid footnote/link collisions
            const openMatch = trimmed.match(/^\[(\d+)\]$/);
            if (openMatch) {
                const numStr = openMatch[1];
                if (numStr) {
                    used.add(parseInt(numStr as string, 10));
                }
            }
            const closeMatch = trimmed.match(/^\[\/(\d+)\]$/);
            if (closeMatch) {
                const numStr = closeMatch[1];
                if (numStr) {
                    used.add(parseInt(numStr as string, 10));
                }
            }
        }
        
        let id = 1;
        while (used.has(id)) {
            id++;
        }
        return id;
    }

    private findResponseRange(editor: Editor, id: number): { start: { line: number; ch: number }; end: { line: number; ch: number } } | null {
        const text = editor.getValue();
        const lines = text.split('\n');
        let startLine = -1;
        let endLine = -1;

        const openTag = `[${id}]`;
        const closeTag = `[/${id}]`;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line === undefined) continue; // Resolve TS2532 Object is possibly 'undefined'
            
            const trimmed = line.trim();
            if (trimmed === openTag) {
                startLine = i + 1; // Content starts on the next line
            } else if (trimmed === closeTag) {
                endLine = i - 1; // Content ends on the previous line
                break;
            }
        }

        // Validate range structure
        if (startLine !== -1 && endLine !== -1 && startLine <= endLine + 1) {
            const endLineText = lines[endLine] || "";
            return {
                start: { line: startLine, ch: 0 },
                end: { line: endLine, ch: endLineText.length }
            };
        }

        return null;
    }

    public async executeStreamSession(
        editor: Editor, 
        promptContent: string, 
        rawSelection: string, 
        rangeFrom: { line: number; ch: number }, 
        rangeTo: { line: number; ch: number }
    ) {
        console.log("Obsidian KC: Starting executeStreamSession.");
        
        if (!this.webview) {
            new Notice("Companion Webview is not ready.");
            return;
        }

        // Programmatically focus the webview tag prior to execution to assert viewport active states
        try {
            this.webview.focus();
        } catch (_) {}

        this.activeEditor = editor;
        
        // Scan the file to discover the next available bracket identifier
        const id = this.getNextAvailableId(editor);
        this.activePromptId = id;
        
        // Format the document layout with companion wrapper blocks
        const headerText = `${rawSelection}\n[${id}]\n(loading response...)\n[/${id}]\n`;
        editor.replaceRange(headerText, rangeFrom, rangeTo);

        const escapedPrompt = JSON.stringify(promptContent);
        
        console.log("Obsidian KC: Crafting injection script payload.");
        const injectionCode = `
            (function() {
                // Spoof Page Visibility and Focus APIs to bypass background tab suspension
                try {
                    Object.defineProperty(document, 'visibilityState', { get: function() { return 'visible'; }, configurable: true });
                    Object.defineProperty(document, 'hidden', { get: function() { return false; }, configurable: true });
                    Object.defineProperty(document, 'webkitVisibilityState', { get: function() { return 'visible'; }, configurable: true });
                    Object.defineProperty(document, 'webkitHidden', { get: function() { return false; }, configurable: true });
                    
                    document.dispatchEvent(new Event('visibilitychange'));
                    document.dispatchEvent(new Event('webkitvisibilitychange'));
                    
                    window.dispatchEvent(new Event('focus'));
                    document.dispatchEvent(new Event('focus'));
                    console.log("KC Debug: Injected background visibility and focus spoofs.");
                } catch (visibilityErr) {
                    console.warn("KC Debug: Visibility spoofing failed:", visibilityErr);
                }

                const promptText = ${escapedPrompt};
                console.log("KC Debug: Guest automation process initiated.");

                // Helper queries
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

                // Query and match all elements, including inside Shadow DOMs
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

                // Check for errors, rate limits, or generic server failures
                function checkErrorOrRateLimit() {
                    const errorSelectors = 'ms-alert, .error-message, .error, mat-snack-bar-container, .mat-mdc-snack-bar-container, .snack-bar, ms-chat-turn.error, .error-container, ms-toast';
                    const errorNodes = queryShadowSelectorAll(errorSelectors);
                    
                    for (let i = 0; i < errorNodes.length; i++) {
                        const el = errorNodes[i];
                        const text = (el.textContent || "").toLowerCase();
                        if (text.includes("rate limit") || 
                            text.includes("too many requests") || 
                            text.includes("try again later") || 
                            text.includes("resource has been exhausted") || 
                            text.includes("quota") ||
                            text.includes("internal error") ||
                            text.includes("something went wrong") ||
                            text.includes("error has occurred") ||
                            text.includes("error occurred")
                        ) {
                            return el.textContent.trim();
                        }
                    }
                    
                    const textElements = queryShadowSelectorAll('div, span, p');
                    for (let i = 0; i < textElements.length; i++) {
                        const el = textElements[i];
                        if (el.children.length === 0) {
                            const text = (el.textContent || "").toLowerCase();
                            if ((text.includes("rate limit") && text.includes("later")) || 
                                text.includes("quota exceeded") || 
                                text.includes("resource exhausted") ||
                                text.includes("internal error") ||
                                text.includes("something went wrong") ||
                                text.includes("error has occurred") ||
                                text.includes("error occurred")
                            ) {
                                return el.textContent.trim();
                            }
                        }
                    }
                    return null;
                }

                let fillRetries = 0;
                function findAndFillInput() {
                    console.log("KC Debug: Querying main input text field... (Attempt: " + (fillRetries + 1) + ")");
                    const inputEl = queryShadowSelector('ms-prompt-box textarea, ms-prompt-box ms-autosize-textarea textarea, textarea[aria-label="Type something"], textarea[aria-label="Enter a prompt"], textarea, div[contenteditable="true"], [role="textbox"]');
                    if (inputEl) {
                        console.log("KC Debug: Target input located successfully:", inputEl);
                        const initialTurnCount = queryShadowSelectorAll('ms-chat-turn').length;
                        console.log("KC Debug: Initial history chat turn count:", initialTurnCount);

                        if (inputEl.tagName === 'DIV') {
                            inputEl.textContent = promptText;
                        } else {
                            inputEl.value = promptText;
                        }
                        inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                        inputEl.dispatchEvent(new Event('change', { bubbles: true }));

                        setTimeout(() => {
                            let parent = inputEl.parentElement;
                            let runButton = null;
                            
                            while (parent && !runButton) {
                                runButton = parent.querySelector('ms-prompt-box ms-run-button button[aria-label="Run"], ms-prompt-box button[aria-label="Run"][type="submit"], button.run-button, button[aria-label="Run"], button[aria-label="Run prompt"], ms-run-button button[type="submit"].run-button');
                                if (!runButton) {
                                    const containerButtons = parent.querySelectorAll('button');
                                    for (let i = 0; i < containerButtons.length; i++) {
                                        const btn = containerButtons[i];
                                        const text = (btn.textContent || '').trim();
                                        if (text.startsWith('Run') || btn.classList.contains('run-button')) {
                                            runButton = btn;
                                            break;
                                        }
                                    }
                                }
                                if (parent.tagName === 'BODY') {
                                    break;
                                }
                                parent = parent.parentElement;
                            }

                            if (runButton) {
                                console.log("KC Debug: Executing robust click cycle on run button:", runButton);
                                runButton.focus();
                                runButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
                                runButton.dispatchEvent(new Event('change', { bubbles: true }));
                                runButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
                                runButton.click();
                            } else {
                                console.log("KC Debug: Run button absent. Dispatching Ctrl+Enter KeyboardEvent fallback.");
                                const enterEvent = new KeyboardEvent('keydown', {
                                    key: 'Enter', code: 'Enter', keyCode: 13, ctrlKey: true, metaKey: true, bubbles: true, cancelable: true
                                });
                                inputEl.dispatchEvent(enterEvent);
                            }
                            waitForCompletionAndExtract(initialTurnCount);
                        }, 250);
                    } else {
                        fillRetries++;
                        if (fillRetries < 40) {
                            setTimeout(findAndFillInput, 500);
                        } else {
                            console.error("KC Debug: Could not locate active input element context.");
                            console.log("gemini-stream-chunk::" + encodeURIComponent("Error: Prompt field absent. Please click the Ribbon Icon to open the Companion Webview and ensure you are logged in."));
                        }
                    }
                }

                function waitForCompletionAndExtract(initialCount) {
                    console.log("KC Debug: Initiating content-stability polling tracker.");
                    let checkCount = 0;
                    const maxChecks = 450; // 90 seconds (450 * 200ms)
                    let generationStarted = false;
                    let previousText = "";
                    let unchangedCount = 0;
                    const stabilityThreshold = 3; // 600ms of stability (3 ticks * 200ms) after generation stop
                    let stopButtonWasSeen = false;

                    // Checks if the Stop prompt button is rendering in the workspace
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

                    const pollInterval = setInterval(() => {
                        checkCount++;

                        // Scan for active rate limit or server error containers
                        const rateLimitError = checkErrorOrRateLimit();
                        if (rateLimitError) {
                            clearInterval(pollInterval);
                            console.error("KC Debug: Google AI Studio error detected: " + rateLimitError);
                            console.log("gemini-stream-chunk::" + encodeURIComponent("Error: " + rateLimitError));
                            return;
                        }

                        // Track active button transition
                        const stopActive = isStopButtonActive();
                        if (stopActive) {
                            stopButtonWasSeen = true;
                            generationStarted = true;
                        }

                        const turns = queryShadowSelectorAll('ms-chat-turn');
                        let latestText = "";
                        let modelContainer = null;
                        
                        for (let i = turns.length - 1; i >= initialCount; i--) {
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

                        if (latestText && latestText.trim().length > 0) {
                            if (!generationStarted) {
                                generationStarted = true;
                                console.log("KC Debug: Generation started. Content detected length: " + latestText.length);
                            }

                            if (latestText === previousText) {
                                unchangedCount++;
                                console.log("KC Debug: Content unchanged count: " + unchangedCount + "/" + stabilityThreshold + " (StopActive=" + stopActive + ")");
                            } else {
                                unchangedCount = 0;
                                previousText = latestText;
                                console.log("KC Debug: Content updated. New length: " + latestText.length);
                            }
                        } else {
                            console.log("KC Debug: Waiting for model turn or text... (" + checkCount + ")");
                        }

                        // Complete once:
                        // 1. Generation has started,
                        // 2. The Stop button is no longer active,
                        // 3. And content has stayed completely stable for our 600ms threshold (3 poll ticks)
                        const meetsCompletionCriteria = generationStarted && !stopActive && (unchangedCount >= stabilityThreshold);

                        if (meetsCompletionCriteria || (checkCount > maxChecks)) {
                            clearInterval(pollInterval);
                            console.log("KC Debug: Content finished and stable. meetsCompletionCriteria=" + meetsCompletionCriteria);
                            extractFinalResponse(initialCount);
                        }
                    }, 200); // Polling checks speed up to 200ms
                }

                function extractFinalResponse(initialCount) {
                    const turns = queryShadowSelectorAll('ms-chat-turn');
                    console.log("KC Debug: Finalizing extraction. Detected chat turns count: " + turns.length);

                    let modelContainer = null;
                    for (let i = turns.length - 1; i >= initialCount; i--) {
                        const turn = turns[i];
                        const container = queryShadowSelector('.chat-turn-container.model', turn);
                        if (container) {
                            modelContainer = container;
                            break;
                        }
                    }

                    if (!modelContainer) {
                        console.error("KC Debug: Active model turn element missing from workspace layout.");
                        return;
                    }

                    const cmarkEls = queryShadowSelectorAll('ms-cmark-node, .model-content, .markdown', modelContainer);
                    
                    const isInsideThinking = (node) => {
                        while (node) {
                            const tag = node.tagName || "";
                            if (tag === 'MS-THOUGHT-CHUNK' || 
                                tag === 'MODEL-THOUGHTS' || 
                                (node.classList && (
                                    node.classList.contains('thinking') || 
                                    node.classList.contains('thought-container')
                                ))) {
                                    return true;
                                }
                                node = node.parentNode || node.host;
                            }
                            return false;
                        };

                    const nonThinkingEls = cmarkEls.filter(el => !isInsideThinking(el));

                    const uniqueEls = nonThinkingEls.filter(el => {
                        return !nonThinkingEls.some(otherEl => otherEl !== el && otherEl.contains(el));
                    });

                    let combinedHTML = "";
                    for (let j = 0; j < uniqueEls.length; j++) {
                        const el = uniqueEls[j];
                        const clone = el.cloneNode(true);
                        
                        // Process Math Blocks
                        const mathBlocks = clone.querySelectorAll('ms-math-block, math-block');
                        mathBlocks.forEach(block => {
                            const rawTex = block.text || block.math || block.getAttribute('math') || block.getAttribute('value') || "";
                            if (rawTex && block.parentNode) {
                                const replacement = document.createTextNode("\\n\\n$$" + rawTex + "$$\\n\\n");
                                block.parentNode.replaceChild(replacement, block);
                            }
                        });

                        // Process Math Inlines
                        const mathInlines = clone.querySelectorAll('ms-math-inline, math-inline, span.math');
                        mathInlines.forEach(inline => {
                            const rawTex = inline.text || inline.math || inline.getAttribute('math') || inline.getAttribute('value') || "";
                            if (rawTex && inline.parentNode) {
                                const replacement = document.createTextNode(" $" + rawTex + "$ ");
                                inline.parentNode.replaceChild(replacement, inline);
                            } else if (inline.parentNode) {
                                const script = inline.querySelector('script[type="math/tex"]');
                                if (script && script.textContent) {
                                    const replacement = document.createTextNode(" $" + script.textContent + "$ ");
                                    inline.parentNode.replaceChild(replacement, inline);
                                }
                            }
                        });

                        // Process Modern KaTeX Elements
                        const katexElements = clone.querySelectorAll('ms-katex, .math-block, .math-inline, .katex');
                        katexElements.forEach(mathEl => {
                            let latexSource = mathEl.text || mathEl.math || mathEl.getAttribute('text') || mathEl.getAttribute('math') || "";
                            
                            if (!latexSource) {
                                const annotation = mathEl.querySelector('annotation[encoding="application/x-tex"]');
                                if (annotation) {
                                    latexSource = annotation.textContent || "";
                                }
                            }
                            
                            if (latexSource && mathEl.parentNode) {
                                const isInline = mathEl.classList.contains('inline') || mathEl.classList.contains('math-inline') || mathEl.tagName === 'SPAN';
                                const replacementText = isInline ? " $" + latexSource.trim() + "$ " : "\\n\\n$$" + latexSource.trim() + "$$\\n\\n";
                                const replacement = document.createTextNode(replacementText);
                                mathEl.parentNode.replaceChild(replacement, mathEl);
                            }
                        });

                        combinedHTML += clone.innerHTML + "\\n";
                    }
                    
                    if (combinedHTML) {
                        console.log("KC Debug: Sending completed static payload to Obsidian (" + combinedHTML.length + " characters).");
                        console.log("gemini-stream-chunk::" + encodeURIComponent("html-payload::" + combinedHTML));
                    } else {
                        console.warn("KC Debug: Response content list resolved to empty HTML structure.");
                    }
                }

                findAndFillInput();
            })();
        `;
        
        console.log("Obsidian KC: Sending executeJavaScript query to webview.");
        this.webview.executeJavaScript(injectionCode)
            .then(() => console.log("Obsidian KC: executeJavaScript injection success."))
            .catch((err: any) => console.error("Obsidian KC: executeJavaScript injection failed:", err));
    }

    private handleStreamChunk(htmlContent: string) {
        if (!this.activeEditor || this.activePromptId === null) return;

        // Query the document to find the exact boundaries of [id] and [/id]
        const range = this.findResponseRange(this.activeEditor, this.activePromptId);
        if (!range) {
            console.error("Obsidian KC: Could not find the response boundary tags in the document.");
            this.activePromptId = null;
            this.activeEditor = null;
            return;
        }

        let fullMarkdown = "";

        if (htmlContent.startsWith("html-payload::")) {
            const content = htmlContent.substring("html-payload::".length);
            fullMarkdown = htmlToMarkdown(content);
        } else {
            fullMarkdown = htmlContent;
        }

        fullMarkdown = fullMarkdown
            .split("\n")
            .map(line => line.trimEnd())
            .join("\n");

        fullMarkdown = fullMarkdown.replace(/\n{3,}/g, "\n\n");
        fullMarkdown = fullMarkdown.replace(/\n\s*\n\s*([-*+]\s|\d+\.\s)/g, "\n$1");

        // Trim outer brackets from Google AI Studio grounding / citation links
        fullMarkdown = fullMarkdown.replace(/\[\[([^\]]+)\]\((.*?)\)\]/g, "[$1]($2)");

        // Safely replace the exact content line(s) between the wrappers
        this.activeEditor.replaceRange(fullMarkdown, range.start, range.end);

        this.activePromptId = null;
        this.activeEditor = null;

        new Notice("✅ Gemini response inserted.");
    }
}
```

### Main
```typescript
import { App, Editor, Modal, Notice, Plugin, PluginSettingTab, Setting, MarkdownView } from 'obsidian';
import { FloatingCompanion } from './FloatingCompanion';

// ── CONFIGURATION & CONSTANTS ──────────────────────────────────────────
interface KineticCompanionSettings {
    enableSparkles: boolean;
    enableSlamPaste: boolean;
}

const DEFAULT_SETTINGS: KineticCompanionSettings = {
    enableSparkles: true,
    enableSlamPaste: true
};

// ── CUSTOM INLINE SELECTION PROMPT MODAL ────────────────────────────────
class SelectionPromptModal extends Modal {
    onSubmit: (instruction: string) => void;
    inputEl!: HTMLInputElement;

    constructor(app: App, onSubmit: (instruction: string) => void) {
        super(app);
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h3", { text: "Kinetic Prompt Selection" });
        
        const desc = contentEl.createEl("p", { text: "How should Gemma 4 update your highlighted selection? (Leave blank to submit raw selection)" });
        desc.style.cssText = "color: var(--text-muted); font-size: 0.85em; margin-top: 10px;";

        this.inputEl = contentEl.createEl("input", { type: "text" });
        this.inputEl.style.width = "100%";
        this.inputEl.placeholder = "e.g., make it sound warmer, rewrite as bullet list...";
        
        setTimeout(() => this.inputEl.focus(), 20);

        this.scope.register([], "Enter", (evt) => {
            evt.preventDefault();
            this.submit();
        });
    }

    submit() {
        const value = this.inputEl.value.trim();
        // Pass the value directly—even if empty—to support raw selection submissions
        this.onSubmit(value);
        this.close();
    }

    onClose() {
        this.contentEl.empty();
    }
}

// ── CORE PLUGIN IMPLEMENTATION ──────────────────────────────────────────
export default class KineticCompanionPlugin extends Plugin {
    settings!: KineticCompanionSettings;
    companion!: FloatingCompanion;
    audioCtx: AudioContext | null = null;

    async onload() {
        await this.loadSettings();

        // Initialize the VaporNote-style floating DOM background companion
        this.companion = new FloatingCompanion(this.app);
        this.companion.init();

        // 1. Command to prompt with active highlighted selection
        this.addCommand({
            id: 'kinetic-selection-prompt',
            name: 'Prompt with Selection',
            editorCallback: (editor: Editor) => {
                const selection = editor.getSelection().trim();
                if (!selection) {
                    new Notice("Please select some text to prompt with.");
                    return;
                }
                
                const rangeFrom = editor.getCursor('from');
                const rangeTo = editor.getCursor('to');

                const promptModal = new SelectionPromptModal(this.app, (instruction) => {
                    const compiledPrompt = instruction ? `${instruction}:\n\n${selection}` : selection;
                    this.companion.executeStreamSession(editor, compiledPrompt, selection, rangeFrom, rangeTo);
                });
                promptModal.open();
            }
        });

        // 2. Command to show, hide, or center the floating companion panel
        this.addCommand({
            id: 'toggle-companion-webview',
            name: 'Toggle Companion Webview',
            callback: () => {
                this.companion.toggleVisibility();
            }
        });

        // Ribbon icon opens and shows the floating companion panel
        this.addRibbonIcon("comment-discussion", "Open Companion View", () => {
            this.companion.show();
        });

        // 3. Register Editor Sparkle Visualizer
        this.registerEvent(
            this.app.workspace.on('editor-change', (editor: Editor) => {
                if (this.settings.enableSparkles) {
                    this.spawnCursorParticle(editor);
                }
            })
        );

        // 4. Register Heavy Slam Paste Listener
        this.registerEvent(
            this.app.workspace.on('editor-paste', (evt: ClipboardEvent, editor: Editor) => {
                if (this.settings.enableSlamPaste) {
                    this.triggerSlamEffect(editor);
                }
            })
        );

        this.addSettingTab(new KineticCompanionSettingTab(this.app, this));
    }

    async onunload() {
        if (this.audioCtx) {
            try {
                this.audioCtx.close();
            } catch(e) {}
        }
        if (this.companion) {
            this.companion.cleanup();
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playSlamStamp() {
        this.initAudio();
        if (!this.audioCtx) return;
        try {
            const now = this.audioCtx.currentTime;
            
            const lowOsc = this.audioCtx.createOscillator();
            const lowGain = this.audioCtx.createGain();
            lowOsc.type = 'sawtooth';
            lowOsc.frequency.setValueAtTime(90, now);
            lowOsc.frequency.linearRampToValueAtTime(30, now + 0.15);
            lowGain.gain.setValueAtTime(0.4, now);
            lowGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            lowOsc.connect(lowGain);
            lowGain.connect(this.audioCtx.destination);
            lowOsc.start(now);
            lowOsc.stop(now + 0.16);

            const clickOsc = this.audioCtx.createOscillator();
            const clickGain = this.audioCtx.createGain();
            clickOsc.type = 'triangle';
            clickOsc.frequency.setValueAtTime(600, now);
            clickOsc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
            clickGain.gain.setValueAtTime(0.2, now);
            clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            clickOsc.connect(clickGain);
            clickGain.connect(this.audioCtx.destination);
            clickOsc.start(now);
            clickOsc.stop(now + 0.06);
        } catch(e) {}
    }

    spawnCursorParticle(editor: Editor) {
        try {
            const cursor = editor.getCursor();
            const coords = (editor as any).coordsAtPos(cursor);
            if (coords) {
                const particle = document.createElement("div");
                particle.className = "kc-cursor-particle";
                
                const offsetX = (Math.random() - 0.5) * 8;
                const offsetY = (Math.random() - 0.5) * 4;
                
                particle.style.left = `${coords.left + offsetX}px`;
                particle.style.top = `${coords.top + offsetY}px`;
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 400);
            }
        } catch (e) {
            // Fail silently
        }
    }

    triggerSlamEffect(editor: Editor) {
        try {
            this.playSlamStamp();
            
            const cursor = editor.getCursor();
            const coords = (editor as any).coordsAtPos(cursor);
            if (coords) {
                for (let i = 0; i < 4; i++) {
                    const dustLeft = document.createElement("div");
                    dustLeft.className = "kc-dust-particle kc-dust-left";
                    dustLeft.style.left = `${coords.left}px`;
                    dustLeft.style.top = `${coords.top + (Math.random() - 0.5) * 8}px`;
                    document.body.appendChild(dustLeft);

                    const dustRight = document.createElement("div");
                    dustRight.className = "kc-dust-particle kc-dust-right";
                    dustRight.style.left = `${coords.left}px`;
                    dustRight.style.top = `${coords.top + (Math.random() - 0.5) * 8}px`;
                    document.body.appendChild(dustRight);

                    setTimeout(() => {
                        dustLeft.remove();
                        dustRight.remove();
                    }, 300);
                }

                const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (activeView) {
                    const el = activeView.containerEl;
                    el.classList.add("kc-shaking");
                    setTimeout(() => {
                        el.classList.remove("kc-shaking");
                    }, 150);
                }
            }
        } catch (e) {
            // Fail silently
        }
    }
}

// ── SETTINGS TAB CLASS ─────────────────────────────────────────────────
class KineticCompanionSettingTab extends PluginSettingTab {
    plugin: KineticCompanionPlugin;

    constructor(app: App, plugin: KineticCompanionPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Kinetic Companion Settings' });

        new Setting(containerEl)
            .setName('Typing Caret Sparkles')
            .setDesc('Toggle ON to spawn beautiful glowing kinetic sparkles behind your cursor as you type.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSparkles)
                .onChange(async (value) => {
                    this.plugin.settings.enableSparkles = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Heavy Slam Paste Effect')
            .setDesc('Toggle ON to trigger a satisfying, tactile stamp thud, screen shake, and dust particles whenever you paste text.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSlamPaste)
                .onChange(async (value) => {
                    this.plugin.settings.enableSlamPaste = value;
                    await this.plugin.saveSettings();
                }));
    }
}
```
## V10
- Fixed hyperlinks (just removed the brakects)
### FloatingCompanion
```typescript
import { App, Editor, Notice, htmlToMarkdown, WorkspaceLeaf } from 'obsidian';

export class FloatingCompanion {
    private app: App;
    private container: HTMLDivElement | null = null;
    private leaf: WorkspaceLeaf | null = null;
    private webview: any = null;
    
    private isVisible = false;
    private isMinimized = false;
    private opacityValue = '0.95';
    
    // Drag/position states
    private isDragging = false;
    private dragStartX = 0;
    private dragStartY = 0;
    private containerStartX = 0;
    private containerStartY = 0;
    private dragOverlay: HTMLDivElement | null = null;
    
    // Active prompt session states
    private activeEditor: Editor | null = null;
    private activePromptId: number | null = null;
    
    // Default position states
    private savedWidth = '380px';
    private savedHeight = '500px';
    private savedLeft = '100px';
    private savedTop = '100px';

    constructor(app: App) {
        this.app = app;
    }

    public async init() {
        const doc = document;
        
        // 1. Create a local floating container element
        const container = doc.createElement('div');
        container.classList.add('kc-floating-container');
        this.container = container; 
        this.styleContainerOffscreen();
        
        // 2. Build the top bar controls (drag bar, minimize, close/hide, opacity slider)
        this.buildChrome();
        
        // 3. Create a local native Obsidian leaf
        const leaf = new (WorkspaceLeaf as any)(this.app);
        this.leaf = leaf;
        this.neutralizeLeaf(leaf);
        
        await leaf.setViewState({
            type: 'webviewer',
            state: {
                url: 'https://aistudio.google.com/',
                navigate: true
            },
            active: true
        });

        // Style the leaf container to cleanly fill our floating frame
        Object.assign(leaf.containerEl.style, {
            flex: '1',
            minHeight: '0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        });

        // Append the native leaf container to our floating container
        container.appendChild(leaf.containerEl);
        doc.body.appendChild(container);
        
        // 4. Locates the loaded webview element inside the Obsidian leaf
        const webviewEl = await this.getReadyWebview();
        if (webviewEl) {
            this.webview = webviewEl;
            this.setupConsoleMessageInterceptor();
            console.log("Obsidian KC: Native webview is ready and hooked.");
        } else {
            console.error("Obsidian KC: Native webview could not be located inside the leaf.");
        }
    }

    public cleanup() {
        if (this.leaf) {
            try {
                // Force-allow standard layout detachment during unload
                (this.leaf as any)._allowDetach = true;
                this.leaf.detach();
            } catch (_) {}
            this.leaf = null;
        }
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
        this.webview = null;
        this.activeEditor = null;
        this.activePromptId = null;
    }

    public toggleVisibility() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    public show() {
        if (!this.container) return;
        this.styleContainerOnscreen();
    }

    public hide() {
        if (!this.container) return;
        this.styleContainerOffscreen();
    }

    private toggleMinimize() {
        if (!this.container || !this.leaf) return;
        this.isMinimized = !this.isMinimized;
        
        if (this.isMinimized) {
            const r = this.container.getBoundingClientRect();
            this.savedWidth = r.width + 'px';
            this.savedHeight = r.height + 'px';
            
            this.container.style.height = '36px';
            (this.leaf as any).containerEl.style.display = 'none';
        } else {
            this.container.style.height = this.savedHeight;
            (this.leaf as any).containerEl.style.display = 'flex';
        }
    }

    private styleContainerOffscreen() {
        if (!this.container) return;
        Object.assign(this.container.style, {
            position: 'fixed',
            top: '0px',
            left: '0px',
            width: '380px',
            height: '500px',
            opacity: '0.005',       // Non-zero opacity forces Chrome to keep the layout active
            pointerEvents: 'none',  // Non-interactive (mouse clicks pass through completely)
            zIndex: '9999',         // Brought to the front so Chrome never flags it as occluded
            background: 'transparent',
            border: 'none',
            borderRadius: '0px',
            boxShadow: 'none',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        });
        this.isVisible = false;
    }

    private styleContainerOnscreen() {
        if (!this.container) return;
        Object.assign(this.container.style, {
            position: 'fixed',
            top: this.savedTop,
            left: this.savedLeft,
            width: this.isMinimized ? '380px' : this.savedWidth,
            height: this.isMinimized ? '36px' : this.savedHeight,
            right: 'auto',
            bottom: 'auto',
            opacity: this.opacityValue,
            pointerEvents: 'auto',   // Restored mouse interactions
            zIndex: '9999',         // Brought to the foreground
            background: 'var(--background-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        });
        this.isVisible = true;
    }

    private buildChrome() {
        if (!this.container) return;
        const doc = document;
        
        const dragBar = doc.createElement('div');
        dragBar.style.cssText = `
            background: var(--background-secondary);
            padding: 8px 12px; cursor: move; font-size: 11px; font-weight: bold;
            color: var(--text-muted); border-bottom: 1px solid var(--border-color);
            display: flex; justify-content: space-between; align-items: center;
            user-select: none; flex-shrink: 0; height: 36px; box-sizing: border-box;
        `;
        
        const titleSpan = doc.createElement('span');
        titleSpan.textContent = "Kinetic Companion (Google AI Studio)";
        dragBar.appendChild(titleSpan);
        
        const controls = doc.createElement('div');
        controls.style.cssText = `display: flex; align-items: center; gap: 8px; margin-left: auto;`;
        
        // Opacity Slider
        const sliderLabel = doc.createElement('span');
        sliderLabel.textContent = "☀";
        sliderLabel.title = "Opacity";
        sliderLabel.style.cssText = "font-size: 10px; opacity: 0.7;";
        controls.appendChild(sliderLabel);
        
        const opacitySlider = doc.createElement('input');
        opacitySlider.type = 'range';
        opacitySlider.min = '0.2';
        opacitySlider.max = '1.0';
        opacitySlider.step = '0.05';
        opacitySlider.value = this.opacityValue;
        opacitySlider.style.cssText = `
            width: 50px; height: 3px; cursor: pointer; margin: 0; accent-color: var(--interactive-accent);
        `;
        opacitySlider.addEventListener('input', (e: any) => {
            this.opacityValue = e.target.value;
            if (this.container && this.isVisible) {
                this.container.style.opacity = this.opacityValue;
            }
        });
        controls.appendChild(opacitySlider);
        
        // Minimize Button
        const minimizeBtn = doc.createElement('span');
        minimizeBtn.textContent = '−';
        minimizeBtn.title = "Minimize";
        minimizeBtn.style.cssText = `cursor: pointer; padding: 0 4px; font-weight: bold; font-size: 12px;`;
        minimizeBtn.addEventListener('click', () => this.toggleMinimize());
        controls.appendChild(minimizeBtn);
        
        // Hide Button
        const closeBtn = doc.createElement('span');
        closeBtn.textContent = '✕';
        closeBtn.title = "Hide";
        closeBtn.style.cssText = `cursor: pointer; padding: 0 4px; font-size: 11px;`;
        closeBtn.addEventListener('click', () => this.hide());
        controls.appendChild(closeBtn);
        
        dragBar.appendChild(controls);
        this.container.appendChild(dragBar);
        
        // Window drag handlers
        dragBar.addEventListener('mousedown', (e: MouseEvent) => {
            if (e.target === closeBtn || e.target === minimizeBtn || e.target === opacitySlider) return;
            this.isDragging = true;
            this.dragStartX = e.clientX;
            this.dragStartY = e.clientY;
            
            if (this.container) {
                const r = this.container.getBoundingClientRect();
                this.containerStartX = r.left;
                this.containerStartY = r.top;
            }
            
            e.preventDefault();
            this.showDragOverlay();
        });
        
        doc.addEventListener('mousemove', (e: MouseEvent) => {
            if (!this.isDragging || !this.container) return;
            const newLeft = this.containerStartX + (e.clientX - this.dragStartX);
            const newTop = this.containerStartY + (e.clientY - this.dragStartY);
            
            this.container.style.left = `${newLeft}px`;
            this.container.style.top = `${newTop}px`;
            this.container.style.right = 'auto';
            
            this.savedLeft = `${newLeft}px`;
            this.savedTop = `${newTop}px`;
        });
        
        doc.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.removeDragOverlay();
            }
        });
    }

    private showDragOverlay() {
        if (this.dragOverlay) return;
        const doc = document;
        this.dragOverlay = doc.createElement('div');
        this.dragOverlay.style.cssText = 'position: fixed; inset: 0; z-index: 999999; background: transparent; cursor: move;';
        doc.body.appendChild(this.dragOverlay);
        
        if (this.webview) {
            this.webview.style.pointerEvents = 'none';
        }
    }

    private removeDragOverlay() {
        if (this.dragOverlay) {
            this.dragOverlay.remove();
            this.dragOverlay = null;
        }
        if (this.webview) {
            this.webview.style.pointerEvents = '';
        }
    }

    private neutralizeLeaf(leaf: any) {
        if (leaf && leaf.containerEl) {
            leaf.containerEl.setAttribute('tabindex', '-1');
            leaf.containerEl.style.outline = 'none';
        }

        const noopContainer = {
            requestFocus: () => {},
            focus:        () => {},
            get win() { return window; },
            get doc() { return document; },
            containerEl:  leaf.containerEl,
        };

        const safeContainerEl = {
            addClass:        () => {},
            removeClass:     () => {},
            toggleClass:     () => {},
            hasClass:        () => false,
            setAttribute:    () => {},
            removeAttribute: () => {},
            classList:       { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
            style:           {},
            dataset:         {},
        };

        const fakeRoot = {
            get win() { return window; },
            get doc() { return document; },
            containerEl:     safeContainerEl,
            getRoot:         () => fakeRoot,
            isAttached:      () => true,
            recomputeLayout: () => {},
            updateLayout:    () => {},
            type: 'root',
        };

        const fakeParent = {
            get win() { return window; },
            get doc() { return document; },
            getContainer:    () => noopContainer,
            containerEl:     safeContainerEl,
            children:        [leaf],
            type:            'split',
            getRoot:         () => fakeRoot,
            isAttached:      () => true,
            recomputeLayout: () => {},
            updateLayout:    () => {},
        };

        if (!leaf.parent) {
            leaf.parent = fakeParent;
        }
    }

    private async getReadyWebview(): Promise<any> {
        const leaf = this.leaf;
        if (!leaf) return null;
        
        return new Promise<any>((resolve) => {
            const el = (leaf as any).containerEl.querySelector("webview");
            if (el) {
                resolve(el);
                return;
            }
            const observer = new MutationObserver(() => {
                const el = (leaf as any).containerEl.querySelector("webview");
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe((leaf as any).containerEl, { childList: true, subtree: true });
            
            setTimeout(() => {
                observer.disconnect();
                resolve((leaf as any).containerEl.querySelector("webview"));
            }, 5000);
        });
    }

    private setupConsoleMessageInterceptor() {
        if (!this.webview) return;
        this.webview.addEventListener('console-message', (event: any) => {
            const message = event.message as string;
            console.log("[WebView Guest]", message);

            if (message && message.startsWith("gemini-stream-chunk::")) {
                const encodedHTML = message.substring("gemini-stream-chunk::".length);
                try {
                    const decodedHTML = decodeURIComponent(encodedHTML);
                    this.handleStreamChunk(decodedHTML);
                } catch (e) {
                    console.error("Obsidian KC: Parsing received HTML stream chunk failed:", e);
                }
            }
        });
    }

    private getNextAvailableId(editor: Editor): number {
        const text = editor.getValue();
        const lines = text.split('\n');
        const used = new Set<number>();
        
        for (const line of lines) {
            const trimmed = line.trim();
            // Match structural companion tags on their own line to avoid footnote/link collisions
            const openMatch = trimmed.match(/^\[(\d+)\]$/);
            if (openMatch) {
                const numStr = openMatch[1];
                if (numStr) {
                    used.add(parseInt(numStr as string, 10));
                }
            }
            const closeMatch = trimmed.match(/^\[\/(\d+)\]$/);
            if (closeMatch) {
                const numStr = closeMatch[1];
                if (numStr) {
                    used.add(parseInt(numStr as string, 10));
                }
            }
        }
        
        let id = 1;
        while (used.has(id)) {
            id++;
        }
        return id;
    }

    private findResponseRange(editor: Editor, id: number): { start: { line: number; ch: number }; end: { line: number; ch: number } } | null {
        const text = editor.getValue();
        const lines = text.split('\n');
        let startLine = -1;
        let endLine = -1;

        const openTag = `[${id}]`;
        const closeTag = `[/${id}]`;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line === undefined) continue; // Resolve TS2532 Object is possibly 'undefined'
            
            const trimmed = line.trim();
            if (trimmed === openTag) {
                startLine = i + 1; // Content starts on the next line
            } else if (trimmed === closeTag) {
                endLine = i - 1; // Content ends on the previous line
                break;
            }
        }

        // Validate range structure
        if (startLine !== -1 && endLine !== -1 && startLine <= endLine + 1) {
            const endLineText = lines[endLine] || "";
            return {
                start: { line: startLine, ch: 0 },
                end: { line: endLine, ch: endLineText.length }
            };
        }

        return null;
    }

    public async executeStreamSession(
        editor: Editor, 
        promptContent: string, 
        rawSelection: string, 
        rangeFrom: { line: number; ch: number }, 
        rangeTo: { line: number; ch: number }
    ) {
        console.log("Obsidian KC: Starting executeStreamSession.");
        
        if (!this.webview) {
            new Notice("Companion Webview is not ready.");
            return;
        }

        // Programmatically focus the webview tag prior to execution to assert viewport active states
        try {
            this.webview.focus();
        } catch (_) {}

        this.activeEditor = editor;
        
        // Scan the file to discover the next available bracket identifier
        const id = this.getNextAvailableId(editor);
        this.activePromptId = id;
        
        // Format the document layout with companion wrapper blocks
        const headerText = `${rawSelection}\n[${id}]\n(loading response...)\n[/${id}]\n`;
        editor.replaceRange(headerText, rangeFrom, rangeTo);

        const escapedPrompt = JSON.stringify(promptContent);
        
        console.log("Obsidian KC: Crafting injection script payload.");
        const injectionCode = `
            (function() {
                // Spoof Page Visibility and Focus APIs to bypass background tab suspension
                try {
                    Object.defineProperty(document, 'visibilityState', { get: function() { return 'visible'; }, configurable: true });
                    Object.defineProperty(document, 'hidden', { get: function() { return false; }, configurable: true });
                    Object.defineProperty(document, 'webkitVisibilityState', { get: function() { return 'visible'; }, configurable: true });
                    Object.defineProperty(document, 'webkitHidden', { get: function() { return false; }, configurable: true });
                    
                    document.dispatchEvent(new Event('visibilitychange'));
                    document.dispatchEvent(new Event('webkitvisibilitychange'));
                    
                    window.dispatchEvent(new Event('focus'));
                    document.dispatchEvent(new Event('focus'));
                    console.log("KC Debug: Injected background visibility and focus spoofs.");
                } catch (visibilityErr) {
                    console.warn("KC Debug: Visibility spoofing failed:", visibilityErr);
                }

                const promptText = ${escapedPrompt};
                console.log("KC Debug: Guest automation process initiated.");

                // Helper queries
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

                function checkErrorOrRateLimit() {
                    const errorSelectors = 'ms-alert, .error-message, .error, mat-snack-bar-container, .mat-mdc-snack-bar-container, .snack-bar, ms-chat-turn.error, .error-container, ms-toast';
                    const errorNodes = queryShadowSelectorAll(errorSelectors);
                    
                    for (let i = 0; i < errorNodes.length; i++) {
                        const el = errorNodes[i];
                        const text = (el.textContent || "").toLowerCase();
                        if (text.includes("rate limit") || text.includes("too many requests") || text.includes("try again later") || text.includes("resource has been exhausted") || text.includes("quota")) {
                            return el.textContent.trim();
                        }
                    }
                    
                    const textElements = queryShadowSelectorAll('div, span, p');
                    for (let i = 0; i < textElements.length; i++) {
                        const el = textElements[i];
                        if (el.children.length === 0) {
                            const text = (el.textContent || "").toLowerCase();
                            if ((text.includes("rate limit") && text.includes("later")) || text.includes("quota exceeded") || text.includes("resource exhausted")) {
                                return el.textContent.trim();
                            }
                        }
                    }
                    return null;
                }

                let fillRetries = 0;
                function findAndFillInput() {
                    console.log("KC Debug: Querying main input text field... (Attempt: " + (fillRetries + 1) + ")");
                    const inputEl = queryShadowSelector('ms-prompt-box textarea, ms-prompt-box ms-autosize-textarea textarea, textarea[aria-label="Type something"], textarea[aria-label="Enter a prompt"], textarea, div[contenteditable="true"], [role="textbox"]');
                    if (inputEl) {
                        console.log("KC Debug: Target input located successfully:", inputEl);
                        const initialTurnCount = queryShadowSelectorAll('ms-chat-turn').length;
                        console.log("KC Debug: Initial history chat turn count:", initialTurnCount);

                        if (inputEl.tagName === 'DIV') {
                            inputEl.textContent = promptText;
                        } else {
                            inputEl.value = promptText;
                        }
                        inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                        inputEl.dispatchEvent(new Event('change', { bubbles: true }));

                        setTimeout(() => {
                            let parent = inputEl.parentElement;
                            let runButton = null;
                            
                            while (parent && !runButton) {
                                runButton = parent.querySelector('ms-prompt-box ms-run-button button[aria-label="Run"], ms-prompt-box button[aria-label="Run"][type="submit"], button.run-button, button[aria-label="Run"], button[aria-label="Run prompt"], ms-run-button button[type="submit"].run-button');
                                if (!runButton) {
                                    const containerButtons = parent.querySelectorAll('button');
                                    for (let i = 0; i < containerButtons.length; i++) {
                                        const btn = containerButtons[i];
                                        const text = (btn.textContent || '').trim();
                                        if (text.startsWith('Run') || btn.classList.contains('run-button')) {
                                            runButton = btn;
                                            break;
                                        }
                                    }
                                }
                                if (parent.tagName === 'BODY') {
                                    break;
                                }
                                parent = parent.parentElement;
                            }

                            if (runButton) {
                                console.log("KC Debug: Executing robust click cycle on run button:", runButton);
                                runButton.focus();
                                runButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
                                runButton.dispatchEvent(new Event('change', { bubbles: true }));
                                runButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
                                runButton.click();
                            } else {
                                console.log("KC Debug: Run button absent. Dispatching Ctrl+Enter KeyboardEvent fallback.");
                                const enterEvent = new KeyboardEvent('keydown', {
                                    key: 'Enter', code: 'Enter', keyCode: 13, ctrlKey: true, metaKey: true, bubbles: true, cancelable: true
                                });
                                inputEl.dispatchEvent(enterEvent);
                            }
                            waitForCompletionAndExtract(initialTurnCount);
                        }, 250);
                    } else {
                        fillRetries++;
                        if (fillRetries < 40) {
                            setTimeout(findAndFillInput, 500);
                        } else {
                            console.error("KC Debug: Could not locate active input element context.");
                            console.log("gemini-stream-chunk::" + encodeURIComponent("Error: Prompt field absent. Please click the Ribbon Icon to open the Companion Webview and ensure you are logged in."));
                        }
                    }
                }

                function waitForCompletionAndExtract(initialCount) {
                    console.log("KC Debug: Initiating content-stability polling tracker.");
                    let checkCount = 0;
                    const maxChecks = 450; // 90 seconds (450 * 200ms)
                    let generationStarted = false;
                    let previousText = "";
                    let unchangedCount = 0;
                    const stabilityThreshold = 3; // 600ms of stability (3 ticks * 200ms) after generation stop
                    let stopButtonWasSeen = false;

                    // Checks if the Stop prompt button is rendering in the workspace
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

                    const pollInterval = setInterval(() => {
                        checkCount++;

                        // Scan for active rate limit or server error containers
                        const rateLimitError = checkErrorOrRateLimit();
                        if (rateLimitError) {
                            clearInterval(pollInterval);
                            console.error("KC Debug: Google AI Studio error detected: " + rateLimitError);
                            console.log("gemini-stream-chunk::" + encodeURIComponent("Error: " + rateLimitError));
                            return;
                        }

                        // Track active button transition
                        const stopActive = isStopButtonActive();
                        if (stopActive) {
                            stopButtonWasSeen = true;
                            generationStarted = true;
                        }

                        const turns = queryShadowSelectorAll('ms-chat-turn');
                        let latestText = "";
                        let modelContainer = null;
                        
                        for (let i = turns.length - 1; i >= initialCount; i--) {
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

                        if (latestText && latestText.trim().length > 0) {
                            if (!generationStarted) {
                                generationStarted = true;
                                console.log("KC Debug: Generation started. Content detected length: " + latestText.length);
                            }

                            if (latestText === previousText) {
                                unchangedCount++;
                                console.log("KC Debug: Content unchanged count: " + unchangedCount + "/" + stabilityThreshold + " (StopActive=" + stopActive + ")");
                            } else {
                                unchangedCount = 0;
                                previousText = latestText;
                                console.log("KC Debug: Content updated. New length: " + latestText.length);
                            }
                        } else {
                            console.log("KC Debug: Waiting for model turn or text... (" + checkCount + ")");
                        }

                        // Complete once:
                        // 1. Generation has started,
                        // 2. The Stop button is no longer active,
                        // 3. And content has stayed completely stable for our 600ms threshold (3 poll ticks)
                        const meetsCompletionCriteria = generationStarted && !stopActive && (unchangedCount >= stabilityThreshold);

                        if (meetsCompletionCriteria || (checkCount > maxChecks)) {
                            clearInterval(pollInterval);
                            console.log("KC Debug: Content finished and stable. meetsCompletionCriteria=" + meetsCompletionCriteria);
                            extractFinalResponse(initialCount);
                        }
                    }, 200); // Polling checks speed up to 200ms
                }

                function extractFinalResponse(initialCount) {
                    const turns = queryShadowSelectorAll('ms-chat-turn');
                    console.log("KC Debug: Finalizing extraction. Detected chat turns count: " + turns.length);

                    let modelContainer = null;
                    for (let i = turns.length - 1; i >= initialCount; i--) {
                        const turn = turns[i];
                        const container = queryShadowSelector('.chat-turn-container.model', turn);
                        if (container) {
                            modelContainer = container;
                            break;
                        }
                    }

                    if (!modelContainer) {
                        console.error("KC Debug: Active model turn element missing from workspace layout.");
                        return;
                    }

                    const cmarkEls = queryShadowSelectorAll('ms-cmark-node, .model-content, .markdown', modelContainer);
                    
                    const isInsideThinking = (node) => {
                        while (node) {
                            const tag = node.tagName || "";
                            if (tag === 'MS-THOUGHT-CHUNK' || 
                                tag === 'MODEL-THOUGHTS' || 
                                (node.classList && (
                                    node.classList.contains('thinking') || 
                                    node.classList.contains('thought-container')
                                ))) {
                                    return true;
                                }
                                node = node.parentNode || node.host;
                            }
                            return false;
                        };

                    const nonThinkingEls = cmarkEls.filter(el => !isInsideThinking(el));

                    const uniqueEls = nonThinkingEls.filter(el => {
                        return !nonThinkingEls.some(otherEl => otherEl !== el && otherEl.contains(el));
                    });

                    let combinedHTML = "";
                    for (let j = 0; j < uniqueEls.length; j++) {
                        const el = uniqueEls[j];
                        const clone = el.cloneNode(true);
                        
                        // Process Math Blocks
                        const mathBlocks = clone.querySelectorAll('ms-math-block, math-block');
                        mathBlocks.forEach(block => {
                            const rawTex = block.text || block.math || block.getAttribute('math') || block.getAttribute('value') || "";
                            if (rawTex && block.parentNode) {
                                const replacement = document.createTextNode("\\n\\n$$" + rawTex + "$$\\n\\n");
                                block.parentNode.replaceChild(replacement, block);
                            }
                        });

                        // Process Math Inlines
                        const mathInlines = clone.querySelectorAll('ms-math-inline, math-inline, span.math');
                        mathInlines.forEach(inline => {
                            const rawTex = inline.text || inline.math || inline.getAttribute('math') || inline.getAttribute('value') || "";
                            if (rawTex && inline.parentNode) {
                                const replacement = document.createTextNode(" $" + rawTex + "$ ");
                                inline.parentNode.replaceChild(replacement, inline);
                            } else if (inline.parentNode) {
                                const script = inline.querySelector('script[type="math/tex"]');
                                if (script && script.textContent) {
                                    const replacement = document.createTextNode(" $" + script.textContent + "$ ");
                                    inline.parentNode.replaceChild(replacement, inline);
                                }
                            }
                        });

                        // Process Modern KaTeX Elements
                        const katexElements = clone.querySelectorAll('ms-katex, .math-block, .math-inline, .katex');
                        katexElements.forEach(mathEl => {
                            let latexSource = mathEl.text || mathEl.math || mathEl.getAttribute('text') || mathEl.getAttribute('math') || "";
                            
                            if (!latexSource) {
                                const annotation = mathEl.querySelector('annotation[encoding="application/x-tex"]');
                                if (annotation) {
                                    latexSource = annotation.textContent || "";
                                }
                            }
                            
                            if (latexSource && mathEl.parentNode) {
                                const isInline = mathEl.classList.contains('inline') || mathEl.classList.contains('math-inline') || mathEl.tagName === 'SPAN';
                                const replacementText = isInline ? " $" + latexSource.trim() + "$ " : "\\n\\n$$" + latexSource.trim() + "$$\\n\\n";
                                const replacement = document.createTextNode(replacementText);
                                mathEl.parentNode.replaceChild(replacement, mathEl);
                            }
                        });

                        combinedHTML += clone.innerHTML + "\\n";
                    }
                    
                    if (combinedHTML) {
                        console.log("KC Debug: Sending completed static payload to Obsidian (" + combinedHTML.length + " characters).");
                        console.log("gemini-stream-chunk::" + encodeURIComponent("html-payload::" + combinedHTML));
                    } else {
                        console.warn("KC Debug: Response content list resolved to empty HTML structure.");
                    }
                }

                findAndFillInput();
            })();
        `;
        
        console.log("Obsidian KC: Sending executeJavaScript query to webview.");
        this.webview.executeJavaScript(injectionCode)
            .then(() => console.log("Obsidian KC: executeJavaScript injection success."))
            .catch((err: any) => console.error("Obsidian KC: executeJavaScript injection failed:", err));
    }

    private handleStreamChunk(htmlContent: string) {
        if (!this.activeEditor || this.activePromptId === null) return;

        // Query the document to find the exact boundaries of [id] and [/id]
        const range = this.findResponseRange(this.activeEditor, this.activePromptId);
        if (!range) {
            console.error("Obsidian KC: Could not find the response boundary tags in the document.");
            this.activePromptId = null;
            this.activeEditor = null;
            return;
        }

        let fullMarkdown = "";

        if (htmlContent.startsWith("html-payload::")) {
            const content = htmlContent.substring("html-payload::".length);
            fullMarkdown = htmlToMarkdown(content);
        } else {
            fullMarkdown = htmlContent;
        }

        fullMarkdown = fullMarkdown
            .split("\n")
            .map(line => line.trimEnd())
            .join("\n");

        fullMarkdown = fullMarkdown.replace(/\n{3,}/g, "\n\n");
        fullMarkdown = fullMarkdown.replace(/\n\s*\n\s*([-*+]\s|\d+\.\s)/g, "\n$1");

        // Trim outer brackets from Google AI Studio grounding / citation links
        fullMarkdown = fullMarkdown.replace(/\[\[([^\]]+)\]\((.*?)\)\]/g, "[$1]($2)");

        // Safely replace the exact content line(s) between the wrappers
        this.activeEditor.replaceRange(fullMarkdown, range.start, range.end);

        this.activePromptId = null;
        this.activeEditor = null;

        new Notice("✅ Gemini response inserted.");
    }
}
```
### Main
```typescript
import { App, Editor, Modal, Notice, Plugin, PluginSettingTab, Setting, MarkdownView } from 'obsidian';
import { FloatingCompanion } from './FloatingCompanion';

// ── CONFIGURATION & CONSTANTS ──────────────────────────────────────────
interface KineticCompanionSettings {
    enableSparkles: boolean;
    enableSlamPaste: boolean;
}

const DEFAULT_SETTINGS: KineticCompanionSettings = {
    enableSparkles: true,
    enableSlamPaste: true
};

// ── CUSTOM INLINE SELECTION PROMPT MODAL ────────────────────────────────
class SelectionPromptModal extends Modal {
    onSubmit: (instruction: string) => void;
    inputEl!: HTMLInputElement;

    constructor(app: App, onSubmit: (instruction: string) => void) {
        super(app);
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h3", { text: "Kinetic Prompt Selection" });
        
        const desc = contentEl.createEl("p", { text: "How should Gemma 4 update your highlighted selection? (Leave blank to submit raw selection)" });
        desc.style.cssText = "color: var(--text-muted); font-size: 0.85em; margin-top: 10px;";

        this.inputEl = contentEl.createEl("input", { type: "text" });
        this.inputEl.style.width = "100%";
        this.inputEl.placeholder = "e.g., make it sound warmer, rewrite as bullet list...";
        
        setTimeout(() => this.inputEl.focus(), 20);

        this.scope.register([], "Enter", (evt) => {
            evt.preventDefault();
            this.submit();
        });
    }

    submit() {
        const value = this.inputEl.value.trim();
        // Pass the value directly—even if empty—to support raw selection submissions
        this.onSubmit(value);
        this.close();
    }

    onClose() {
        this.contentEl.empty();
    }
}

// ── CORE PLUGIN IMPLEMENTATION ──────────────────────────────────────────
export default class KineticCompanionPlugin extends Plugin {
    settings!: KineticCompanionSettings;
    companion!: FloatingCompanion;
    audioCtx: AudioContext | null = null;

    async onload() {
        await this.loadSettings();

        // Initialize the VaporNote-style floating DOM background companion
        this.companion = new FloatingCompanion(this.app);
        this.companion.init();

        // 1. Command to prompt with active highlighted selection
        this.addCommand({
            id: 'kinetic-selection-prompt',
            name: 'Prompt with Selection',
            editorCallback: (editor: Editor) => {
                const selection = editor.getSelection().trim();
                if (!selection) {
                    new Notice("Please select some text to prompt with.");
                    return;
                }
                
                const rangeFrom = editor.getCursor('from');
                const rangeTo = editor.getCursor('to');

                const promptModal = new SelectionPromptModal(this.app, (instruction) => {
                    const compiledPrompt = instruction ? `${instruction}:\n\n${selection}` : selection;
                    this.companion.executeStreamSession(editor, compiledPrompt, selection, rangeFrom, rangeTo);
                });
                promptModal.open();
            }
        });

        // 2. Command to show, hide, or center the floating companion panel
        this.addCommand({
            id: 'toggle-companion-webview',
            name: 'Toggle Companion Webview',
            callback: () => {
                this.companion.toggleVisibility();
            }
        });

        // Ribbon icon opens and shows the floating companion panel
        this.addRibbonIcon("comment-discussion", "Open Companion View", () => {
            this.companion.show();
        });

        // 3. Register Editor Sparkle Visualizer
        this.registerEvent(
            this.app.workspace.on('editor-change', (editor: Editor) => {
                if (this.settings.enableSparkles) {
                    this.spawnCursorParticle(editor);
                }
            })
        );

        // 4. Register Heavy Slam Paste Listener
        this.registerEvent(
            this.app.workspace.on('editor-paste', (evt: ClipboardEvent, editor: Editor) => {
                if (this.settings.enableSlamPaste) {
                    this.triggerSlamEffect(editor);
                }
            })
        );

        this.addSettingTab(new KineticCompanionSettingTab(this.app, this));
    }

    async onunload() {
        if (this.audioCtx) {
            try {
                this.audioCtx.close();
            } catch(e) {}
        }
        if (this.companion) {
            this.companion.cleanup();
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playSlamStamp() {
        this.initAudio();
        if (!this.audioCtx) return;
        try {
            const now = this.audioCtx.currentTime;
            
            const lowOsc = this.audioCtx.createOscillator();
            const lowGain = this.audioCtx.createGain();
            lowOsc.type = 'sawtooth';
            lowOsc.frequency.setValueAtTime(90, now);
            lowOsc.frequency.linearRampToValueAtTime(30, now + 0.15);
            lowGain.gain.setValueAtTime(0.4, now);
            lowGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            lowOsc.connect(lowGain);
            lowGain.connect(this.audioCtx.destination);
            lowOsc.start(now);
            lowOsc.stop(now + 0.16);

            const clickOsc = this.audioCtx.createOscillator();
            const clickGain = this.audioCtx.createGain();
            clickOsc.type = 'triangle';
            clickOsc.frequency.setValueAtTime(600, now);
            clickOsc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
            clickGain.gain.setValueAtTime(0.2, now);
            clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            clickOsc.connect(clickGain);
            clickGain.connect(this.audioCtx.destination);
            clickOsc.start(now);
            clickOsc.stop(now + 0.06);
        } catch(e) {}
    }

    spawnCursorParticle(editor: Editor) {
        try {
            const cursor = editor.getCursor();
            const coords = (editor as any).coordsAtPos(cursor);
            if (coords) {
                const particle = document.createElement("div");
                particle.className = "kc-cursor-particle";
                
                const offsetX = (Math.random() - 0.5) * 8;
                const offsetY = (Math.random() - 0.5) * 4;
                
                particle.style.left = `${coords.left + offsetX}px`;
                particle.style.top = `${coords.top + offsetY}px`;
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 400);
            }
        } catch (e) {
            // Fail silently
        }
    }

    triggerSlamEffect(editor: Editor) {
        try {
            this.playSlamStamp();
            
            const cursor = editor.getCursor();
            const coords = (editor as any).coordsAtPos(cursor);
            if (coords) {
                for (let i = 0; i < 4; i++) {
                    const dustLeft = document.createElement("div");
                    dustLeft.className = "kc-dust-particle kc-dust-left";
                    dustLeft.style.left = `${coords.left}px`;
                    dustLeft.style.top = `${coords.top + (Math.random() - 0.5) * 8}px`;
                    document.body.appendChild(dustLeft);

                    const dustRight = document.createElement("div");
                    dustRight.className = "kc-dust-particle kc-dust-right";
                    dustRight.style.left = `${coords.left}px`;
                    dustRight.style.top = `${coords.top + (Math.random() - 0.5) * 8}px`;
                    document.body.appendChild(dustRight);

                    setTimeout(() => {
                        dustLeft.remove();
                        dustRight.remove();
                    }, 300);
                }

                const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (activeView) {
                    const el = activeView.containerEl;
                    el.classList.add("kc-shaking");
                    setTimeout(() => {
                        el.classList.remove("kc-shaking");
                    }, 150);
                }
            }
        } catch (e) {
            // Fail silently
        }
    }
}

// ── SETTINGS TAB CLASS ─────────────────────────────────────────────────
class KineticCompanionSettingTab extends PluginSettingTab {
    plugin: KineticCompanionPlugin;

    constructor(app: App, plugin: KineticCompanionPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Kinetic Companion Settings' });

        new Setting(containerEl)
            .setName('Typing Caret Sparkles')
            .setDesc('Toggle ON to spawn beautiful glowing kinetic sparkles behind your cursor as you type.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSparkles)
                .onChange(async (value) => {
                    this.plugin.settings.enableSparkles = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Heavy Slam Paste Effect')
            .setDesc('Toggle ON to trigger a satisfying, tactile stamp thud, screen shake, and dust particles whenever you paste text.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSlamPaste)
                .onChange(async (value) => {
                    this.plugin.settings.enableSlamPaste = value;
                    await this.plugin.saveSettings();
                }));
    }
}
```
## V9
- Need to fix hyperlinks
### FloatingCompanion
```typescript
import { App, Editor, Notice, htmlToMarkdown, WorkspaceLeaf } from 'obsidian';

export class FloatingCompanion {
    private app: App;
    private container: HTMLDivElement | null = null;
    private leaf: WorkspaceLeaf | null = null;
    private webview: any = null;
    
    private isVisible = false;
    private isMinimized = false;
    private opacityValue = '0.95';
    
    // Drag/position states
    private isDragging = false;
    private dragStartX = 0;
    private dragStartY = 0;
    private containerStartX = 0;
    private containerStartY = 0;
    private dragOverlay: HTMLDivElement | null = null;
    
    // Active prompt session states
    private activeEditor: Editor | null = null;
    private activePromptId: number | null = null;
    
    // Default position states
    private savedWidth = '380px';
    private savedHeight = '500px';
    private savedLeft = '100px';
    private savedTop = '100px';

    constructor(app: App) {
        this.app = app;
    }

    public async init() {
        const doc = document;
        
        // 1. Create a local floating container element
        const container = doc.createElement('div');
        container.classList.add('kc-floating-container');
        this.container = container; 
        this.styleContainerOffscreen();
        
        // 2. Build the top bar controls (drag bar, minimize, close/hide, opacity slider)
        this.buildChrome();
        
        // 3. Create a local native Obsidian leaf
        const leaf = new (WorkspaceLeaf as any)(this.app);
        this.leaf = leaf;
        this.neutralizeLeaf(leaf);
        
        await leaf.setViewState({
            type: 'webviewer',
            state: {
                url: 'https://aistudio.google.com/',
                navigate: true
            },
            active: true
        });

        // Style the leaf container to cleanly fill our floating frame
        Object.assign(leaf.containerEl.style, {
            flex: '1',
            minHeight: '0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        });

        // Append the native leaf container to our floating container
        container.appendChild(leaf.containerEl);
        doc.body.appendChild(container);
        
        // 4. Locates the loaded webview element inside the Obsidian leaf
        const webviewEl = await this.getReadyWebview();
        if (webviewEl) {
            this.webview = webviewEl;
            this.setupConsoleMessageInterceptor();
            console.log("Obsidian KC: Native webview is ready and hooked.");
        } else {
            console.error("Obsidian KC: Native webview could not be located inside the leaf.");
        }
    }

    public cleanup() {
        if (this.leaf) {
            try {
                // Force-allow standard layout detachment during unload
                (this.leaf as any)._allowDetach = true;
                this.leaf.detach();
            } catch (_) {}
            this.leaf = null;
        }
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
        this.webview = null;
        this.activeEditor = null;
        this.activePromptId = null;
    }

    public toggleVisibility() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    public show() {
        if (!this.container) return;
        this.styleContainerOnscreen();
    }

    public hide() {
        if (!this.container) return;
        this.styleContainerOffscreen();
    }

    private toggleMinimize() {
        if (!this.container || !this.leaf) return;
        this.isMinimized = !this.isMinimized;
        
        if (this.isMinimized) {
            const r = this.container.getBoundingClientRect();
            this.savedWidth = r.width + 'px';
            this.savedHeight = r.height + 'px';
            
            this.container.style.height = '36px';
            (this.leaf as any).containerEl.style.display = 'none';
        } else {
            this.container.style.height = this.savedHeight;
            (this.leaf as any).containerEl.style.display = 'flex';
        }
    }

    private styleContainerOffscreen() {
        if (!this.container) return;
        Object.assign(this.container.style, {
            position: 'fixed',
            top: '0px',
            left: '0px',
            width: '380px',
            height: '500px',
            opacity: '0.005',       // Non-zero opacity forces Chrome to keep the layout active
            pointerEvents: 'none',  // Non-interactive (mouse clicks pass through completely)
            zIndex: '9999',         // Brought to the front so Chrome never flags it as occluded
            background: 'transparent',
            border: 'none',
            borderRadius: '0px',
            boxShadow: 'none',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        });
        this.isVisible = false;
    }

    private styleContainerOnscreen() {
        if (!this.container) return;
        Object.assign(this.container.style, {
            position: 'fixed',
            top: this.savedTop,
            left: this.savedLeft,
            width: this.isMinimized ? '380px' : this.savedWidth,
            height: this.isMinimized ? '36px' : this.savedHeight,
            right: 'auto',
            bottom: 'auto',
            opacity: this.opacityValue,
            pointerEvents: 'auto',   // Restored mouse interactions
            zIndex: '9999',         // Brought to the foreground
            background: 'var(--background-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        });
        this.isVisible = true;
    }

    private buildChrome() {
        if (!this.container) return;
        const doc = document;
        
        const dragBar = doc.createElement('div');
        dragBar.style.cssText = `
            background: var(--background-secondary);
            padding: 8px 12px; cursor: move; font-size: 11px; font-weight: bold;
            color: var(--text-muted); border-bottom: 1px solid var(--border-color);
            display: flex; justify-content: space-between; align-items: center;
            user-select: none; flex-shrink: 0; height: 36px; box-sizing: border-box;
        `;
        
        const titleSpan = doc.createElement('span');
        titleSpan.textContent = "Kinetic Companion (Google AI Studio)";
        dragBar.appendChild(titleSpan);
        
        const controls = doc.createElement('div');
        controls.style.cssText = `display: flex; align-items: center; gap: 8px; margin-left: auto;`;
        
        // Opacity Slider
        const sliderLabel = doc.createElement('span');
        sliderLabel.textContent = "☀";
        sliderLabel.title = "Opacity";
        sliderLabel.style.cssText = "font-size: 10px; opacity: 0.7;";
        controls.appendChild(sliderLabel);
        
        const opacitySlider = doc.createElement('input');
        opacitySlider.type = 'range';
        opacitySlider.min = '0.2';
        opacitySlider.max = '1.0';
        opacitySlider.step = '0.05';
        opacitySlider.value = this.opacityValue;
        opacitySlider.style.cssText = `
            width: 50px; height: 3px; cursor: pointer; margin: 0; accent-color: var(--interactive-accent);
        `;
        opacitySlider.addEventListener('input', (e: any) => {
            this.opacityValue = e.target.value;
            if (this.container && this.isVisible) {
                this.container.style.opacity = this.opacityValue;
            }
        });
        controls.appendChild(opacitySlider);
        
        // Minimize Button
        const minimizeBtn = doc.createElement('span');
        minimizeBtn.textContent = '−';
        minimizeBtn.title = "Minimize";
        minimizeBtn.style.cssText = `cursor: pointer; padding: 0 4px; font-weight: bold; font-size: 12px;`;
        minimizeBtn.addEventListener('click', () => this.toggleMinimize());
        controls.appendChild(minimizeBtn);
        
        // Hide Button
        const closeBtn = doc.createElement('span');
        closeBtn.textContent = '✕';
        closeBtn.title = "Hide";
        closeBtn.style.cssText = `cursor: pointer; padding: 0 4px; font-size: 11px;`;
        closeBtn.addEventListener('click', () => this.hide());
        controls.appendChild(closeBtn);
        
        dragBar.appendChild(controls);
        this.container.appendChild(dragBar);
        
        // Window drag handlers
        dragBar.addEventListener('mousedown', (e: MouseEvent) => {
            if (e.target === closeBtn || e.target === minimizeBtn || e.target === opacitySlider) return;
            this.isDragging = true;
            this.dragStartX = e.clientX;
            this.dragStartY = e.clientY;
            
            if (this.container) {
                const r = this.container.getBoundingClientRect();
                this.containerStartX = r.left;
                this.containerStartY = r.top;
            }
            
            e.preventDefault();
            this.showDragOverlay();
        });
        
        doc.addEventListener('mousemove', (e: MouseEvent) => {
            if (!this.isDragging || !this.container) return;
            const newLeft = this.containerStartX + (e.clientX - this.dragStartX);
            const newTop = this.containerStartY + (e.clientY - this.dragStartY);
            
            this.container.style.left = `${newLeft}px`;
            this.container.style.top = `${newTop}px`;
            this.container.style.right = 'auto';
            
            this.savedLeft = `${newLeft}px`;
            this.savedTop = `${newTop}px`;
        });
        
        doc.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.removeDragOverlay();
            }
        });
    }

    private showDragOverlay() {
        if (this.dragOverlay) return;
        const doc = document;
        this.dragOverlay = doc.createElement('div');
        this.dragOverlay.style.cssText = 'position: fixed; inset: 0; z-index: 999999; background: transparent; cursor: move;';
        doc.body.appendChild(this.dragOverlay);
        
        if (this.webview) {
            this.webview.style.pointerEvents = 'none';
        }
    }

    private removeDragOverlay() {
        if (this.dragOverlay) {
            this.dragOverlay.remove();
            this.dragOverlay = null;
        }
        if (this.webview) {
            this.webview.style.pointerEvents = '';
        }
    }

    private neutralizeLeaf(leaf: any) {
        if (leaf && leaf.containerEl) {
            leaf.containerEl.setAttribute('tabindex', '-1');
            leaf.containerEl.style.outline = 'none';
        }

        const noopContainer = {
            requestFocus: () => {},
            focus:        () => {},
            get win() { return window; },
            get doc() { return document; },
            containerEl:  leaf.containerEl,
        };

        const safeContainerEl = {
            addClass:        () => {},
            removeClass:     () => {},
            toggleClass:     () => {},
            hasClass:        () => false,
            setAttribute:    () => {},
            removeAttribute: () => {},
            classList:       { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
            style:           {},
            dataset:         {},
        };

        const fakeRoot = {
            get win() { return window; },
            get doc() { return document; },
            containerEl:     safeContainerEl,
            getRoot:         () => fakeRoot,
            isAttached:      () => true,
            recomputeLayout: () => {},
            updateLayout:    () => {},
            type: 'root',
        };

        const fakeParent = {
            get win() { return window; },
            get doc() { return document; },
            getContainer:    () => noopContainer,
            containerEl:     safeContainerEl,
            children:        [leaf],
            type:            'split',
            getRoot:         () => fakeRoot,
            isAttached:      () => true,
            recomputeLayout: () => {},
            updateLayout:    () => {},
        };

        if (!leaf.parent) {
            leaf.parent = fakeParent;
        }
    }

    private async getReadyWebview(): Promise<any> {
        const leaf = this.leaf;
        if (!leaf) return null;
        
        return new Promise<any>((resolve) => {
            const el = (leaf as any).containerEl.querySelector("webview");
            if (el) {
                resolve(el);
                return;
            }
            const observer = new MutationObserver(() => {
                const el = (leaf as any).containerEl.querySelector("webview");
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe((leaf as any).containerEl, { childList: true, subtree: true });
            
            setTimeout(() => {
                observer.disconnect();
                resolve((leaf as any).containerEl.querySelector("webview"));
            }, 5000);
        });
    }

    private setupConsoleMessageInterceptor() {
        if (!this.webview) return;
        this.webview.addEventListener('console-message', (event: any) => {
            const message = event.message as string;
            console.log("[WebView Guest]", message);

            if (message && message.startsWith("gemini-stream-chunk::")) {
                const encodedHTML = message.substring("gemini-stream-chunk::".length);
                try {
                    const decodedHTML = decodeURIComponent(encodedHTML);
                    this.handleStreamChunk(decodedHTML);
                } catch (e) {
                    console.error("Obsidian KC: Parsing received HTML stream chunk failed:", e);
                }
            }
        });
    }

    private getNextAvailableId(editor: Editor): number {
        const text = editor.getValue();
        const lines = text.split('\n');
        const used = new Set<number>();
        
        for (const line of lines) {
            const trimmed = line.trim();
            // Match structural companion tags on their own line to avoid footnote/link collisions
            const openMatch = trimmed.match(/^\[(\d+)\]$/);
            if (openMatch) {
                const numStr = openMatch[1];
                if (numStr) {
                    used.add(parseInt(numStr as string, 10));
                }
            }
            const closeMatch = trimmed.match(/^\[\/(\d+)\]$/);
            if (closeMatch) {
                const numStr = closeMatch[1];
                if (numStr) {
                    used.add(parseInt(numStr as string, 10));
                }
            }
        }
        
        let id = 1;
        while (used.has(id)) {
            id++;
        }
        return id;
    }

    private findResponseRange(editor: Editor, id: number): { start: { line: number; ch: number }; end: { line: number; ch: number } } | null {
        const text = editor.getValue();
        const lines = text.split('\n');
        let startLine = -1;
        let endLine = -1;

        const openTag = `[${id}]`;
        const closeTag = `[/${id}]`;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line === undefined) continue; // Resolve TS2532 Object is possibly 'undefined'
            
            const trimmed = line.trim();
            if (trimmed === openTag) {
                startLine = i + 1; // Content starts on the next line
            } else if (trimmed === closeTag) {
                endLine = i - 1; // Content ends on the previous line
                break;
            }
        }

        // Validate range structure
        if (startLine !== -1 && endLine !== -1 && startLine <= endLine + 1) {
            const endLineText = lines[endLine] || "";
            return {
                start: { line: startLine, ch: 0 },
                end: { line: endLine, ch: endLineText.length }
            };
        }

        return null;
    }

    public async executeStreamSession(
        editor: Editor, 
        promptContent: string, 
        rawSelection: string, 
        rangeFrom: { line: number; ch: number }, 
        rangeTo: { line: number; ch: number }
    ) {
        console.log("Obsidian KC: Starting executeStreamSession.");
        
        if (!this.webview) {
            new Notice("Companion Webview is not ready.");
            return;
        }

        // Programmatically focus the webview tag prior to execution to assert viewport active states
        try {
            this.webview.focus();
        } catch (_) {}

        this.activeEditor = editor;
        
        // Scan the file to discover the next available bracket identifier
        const id = this.getNextAvailableId(editor);
        this.activePromptId = id;
        
        // Format the document layout with companion wrapper blocks
        const headerText = `${rawSelection}\n[${id}]\n(loading response...)\n[/${id}]\n`;
        editor.replaceRange(headerText, rangeFrom, rangeTo);

        const escapedPrompt = JSON.stringify(promptContent);
        
        console.log("Obsidian KC: Crafting injection script payload.");
        const injectionCode = `
            (function() {
                // Spoof Page Visibility and Focus APIs to bypass background tab suspension
                try {
                    Object.defineProperty(document, 'visibilityState', { get: function() { return 'visible'; }, configurable: true });
                    Object.defineProperty(document, 'hidden', { get: function() { return false; }, configurable: true });
                    Object.defineProperty(document, 'webkitVisibilityState', { get: function() { return 'visible'; }, configurable: true });
                    Object.defineProperty(document, 'webkitHidden', { get: function() { return false; }, configurable: true });
                    
                    document.dispatchEvent(new Event('visibilitychange'));
                    document.dispatchEvent(new Event('webkitvisibilitychange'));
                    
                    window.dispatchEvent(new Event('focus'));
                    document.dispatchEvent(new Event('focus'));
                    console.log("KC Debug: Injected background visibility and focus spoofs.");
                } catch (visibilityErr) {
                    console.warn("KC Debug: Visibility spoofing failed:", visibilityErr);
                }

                const promptText = ${escapedPrompt};
                console.log("KC Debug: Guest automation process initiated.");

                // Helper queries
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

                function checkErrorOrRateLimit() {
                    const errorSelectors = 'ms-alert, .error-message, .error, mat-snack-bar-container, .mat-mdc-snack-bar-container, .snack-bar, ms-chat-turn.error, .error-container, ms-toast';
                    const errorNodes = queryShadowSelectorAll(errorSelectors);
                    
                    for (let i = 0; i < errorNodes.length; i++) {
                        const el = errorNodes[i];
                        const text = (el.textContent || "").toLowerCase();
                        if (text.includes("rate limit") || text.includes("too many requests") || text.includes("try again later") || text.includes("resource has been exhausted") || text.includes("quota")) {
                            return el.textContent.trim();
                        }
                    }
                    
                    const textElements = queryShadowSelectorAll('div, span, p');
                    for (let i = 0; i < textElements.length; i++) {
                        const el = textElements[i];
                        if (el.children.length === 0) {
                            const text = (el.textContent || "").toLowerCase();
                            if ((text.includes("rate limit") && text.includes("later")) || text.includes("quota exceeded") || text.includes("resource exhausted")) {
                                return el.textContent.trim();
                            }
                        }
                    }
                    return null;
                }

                let fillRetries = 0;
                function findAndFillInput() {
                    console.log("KC Debug: Querying main input text field... (Attempt: " + (fillRetries + 1) + ")");
                    const inputEl = queryShadowSelector('ms-prompt-box textarea, ms-prompt-box ms-autosize-textarea textarea, textarea[aria-label="Type something"], textarea[aria-label="Enter a prompt"], textarea, div[contenteditable="true"], [role="textbox"]');
                    if (inputEl) {
                        console.log("KC Debug: Target input located successfully:", inputEl);
                        const initialTurnCount = queryShadowSelectorAll('ms-chat-turn').length;
                        console.log("KC Debug: Initial history chat turn count:", initialTurnCount);

                        if (inputEl.tagName === 'DIV') {
                            inputEl.textContent = promptText;
                        } else {
                            inputEl.value = promptText;
                        }
                        inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                        inputEl.dispatchEvent(new Event('change', { bubbles: true }));

                        setTimeout(() => {
                            let parent = inputEl.parentElement;
                            let runButton = null;
                            
                            while (parent && !runButton) {
                                runButton = parent.querySelector('ms-prompt-box ms-run-button button[aria-label="Run"], ms-prompt-box button[aria-label="Run"][type="submit"], button.run-button, button[aria-label="Run"], button[aria-label="Run prompt"], ms-run-button button[type="submit"].run-button');
                                if (!runButton) {
                                    const containerButtons = parent.querySelectorAll('button');
                                    for (let i = 0; i < containerButtons.length; i++) {
                                        const btn = containerButtons[i];
                                        const text = (btn.textContent || '').trim();
                                        if (text.startsWith('Run') || btn.classList.contains('run-button')) {
                                            runButton = btn;
                                            break;
                                        }
                                    }
                                }
                                if (parent.tagName === 'BODY') {
                                    break;
                                }
                                parent = parent.parentElement;
                            }

                            if (runButton) {
                                console.log("KC Debug: Executing robust click cycle on run button:", runButton);
                                runButton.focus();
                                runButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
                                runButton.dispatchEvent(new Event('change', { bubbles: true }));
                                runButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
                                runButton.click();
                            } else {
                                console.log("KC Debug: Run button absent. Dispatching Ctrl+Enter KeyboardEvent fallback.");
                                const enterEvent = new KeyboardEvent('keydown', {
                                    key: 'Enter', code: 'Enter', keyCode: 13, ctrlKey: true, metaKey: true, bubbles: true, cancelable: true
                                });
                                inputEl.dispatchEvent(enterEvent);
                            }
                            waitForCompletionAndExtract(initialTurnCount);
                        }, 250);
                    } else {
                        fillRetries++;
                        if (fillRetries < 40) {
                            setTimeout(findAndFillInput, 500);
                        } else {
                            console.error("KC Debug: Could not locate active input element context.");
                            console.log("gemini-stream-chunk::" + encodeURIComponent("Error: Prompt field absent. Please click the Ribbon Icon to open the Companion Webview and ensure you are logged in."));
                        }
                    }
                }

                function waitForCompletionAndExtract(initialCount) {
                    console.log("KC Debug: Initiating content-stability polling tracker.");
                    let checkCount = 0;
                    const maxChecks = 450; // 90 seconds (450 * 200ms)
                    let generationStarted = false;
                    let previousText = "";
                    let unchangedCount = 0;
                    const stabilityThreshold = 3; // 600ms of stability (3 ticks * 200ms) after generation stop
                    let stopButtonWasSeen = false;

                    // Checks if the Stop prompt button is rendering in the workspace
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

                    const pollInterval = setInterval(() => {
                        checkCount++;

                        // Scan for active rate limit or server error containers
                        const rateLimitError = checkErrorOrRateLimit();
                        if (rateLimitError) {
                            clearInterval(pollInterval);
                            console.error("KC Debug: Google AI Studio error detected: " + rateLimitError);
                            console.log("gemini-stream-chunk::" + encodeURIComponent("Error: " + rateLimitError));
                            return;
                        }

                        // Track active button transition
                        const stopActive = isStopButtonActive();
                        if (stopActive) {
                            stopButtonWasSeen = true;
                            generationStarted = true;
                        }

                        const turns = queryShadowSelectorAll('ms-chat-turn');
                        let latestText = "";
                        let modelContainer = null;
                        
                        for (let i = turns.length - 1; i >= initialCount; i--) {
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

                        if (latestText && latestText.trim().length > 0) {
                            if (!generationStarted) {
                                generationStarted = true;
                                console.log("KC Debug: Generation started. Content detected length: " + latestText.length);
                            }

                            if (latestText === previousText) {
                                unchangedCount++;
                                console.log("KC Debug: Content unchanged count: " + unchangedCount + "/" + stabilityThreshold + " (StopActive=" + stopActive + ")");
                            } else {
                                unchangedCount = 0;
                                previousText = latestText;
                                console.log("KC Debug: Content updated. New length: " + latestText.length);
                            }
                        } else {
                            console.log("KC Debug: Waiting for model turn or text... (" + checkCount + ")");
                        }

                        // Complete once:
                        // 1. Generation has started,
                        // 2. The Stop button is no longer active,
                        // 3. And content has stayed completely stable for our 600ms threshold (3 poll ticks)
                        const meetsCompletionCriteria = generationStarted && !stopActive && (unchangedCount >= stabilityThreshold);

                        if (meetsCompletionCriteria || (checkCount > maxChecks)) {
                            clearInterval(pollInterval);
                            console.log("KC Debug: Content finished and stable. meetsCompletionCriteria=" + meetsCompletionCriteria);
                            extractFinalResponse(initialCount);
                        }
                    }, 200); // Polling checks speed up to 200ms
                }

                function extractFinalResponse(initialCount) {
                    const turns = queryShadowSelectorAll('ms-chat-turn');
                    console.log("KC Debug: Finalizing extraction. Detected chat turns count: " + turns.length);

                    let modelContainer = null;
                    for (let i = turns.length - 1; i >= initialCount; i--) {
                        const turn = turns[i];
                        const container = queryShadowSelector('.chat-turn-container.model', turn);
                        if (container) {
                            modelContainer = container;
                            break;
                        }
                    }

                    if (!modelContainer) {
                        console.error("KC Debug: Active model turn element missing from workspace layout.");
                        return;
                    }

                    const cmarkEls = queryShadowSelectorAll('ms-cmark-node, .model-content, .markdown', modelContainer);
                    
                    const isInsideThinking = (node) => {
                        while (node) {
                            const tag = node.tagName || "";
                            if (tag === 'MS-THOUGHT-CHUNK' || 
                                tag === 'MODEL-THOUGHTS' || 
                                (node.classList && (
                                    node.classList.contains('thinking') || 
                                    node.classList.contains('thought-container')
                                ))) {
                                    return true;
                                }
                                node = node.parentNode || node.host;
                            }
                            return false;
                        };

                    const nonThinkingEls = cmarkEls.filter(el => !isInsideThinking(el));

                    const uniqueEls = nonThinkingEls.filter(el => {
                        return !nonThinkingEls.some(otherEl => otherEl !== el && otherEl.contains(el));
                    });

                    let combinedHTML = "";
                    for (let j = 0; j < uniqueEls.length; j++) {
                        const el = uniqueEls[j];
                        const clone = el.cloneNode(true);
                        
                        // Process Math Blocks
                        const mathBlocks = clone.querySelectorAll('ms-math-block, math-block');
                        mathBlocks.forEach(block => {
                            const rawTex = block.text || block.math || block.getAttribute('math') || block.getAttribute('value') || "";
                            if (rawTex && block.parentNode) {
                                const replacement = document.createTextNode("\\n\\n$$" + rawTex + "$$\\n\\n");
                                block.parentNode.replaceChild(replacement, block);
                            }
                        });

                        // Process Math Inlines
                        const mathInlines = clone.querySelectorAll('ms-math-inline, math-inline, span.math');
                        mathInlines.forEach(inline => {
                            const rawTex = inline.text || inline.math || inline.getAttribute('math') || inline.getAttribute('value') || "";
                            if (rawTex && inline.parentNode) {
                                const replacement = document.createTextNode(" $" + rawTex + "$ ");
                                inline.parentNode.replaceChild(replacement, inline);
                            } else if (inline.parentNode) {
                                const script = inline.querySelector('script[type="math/tex"]');
                                if (script && script.textContent) {
                                    const replacement = document.createTextNode(" $" + script.textContent + "$ ");
                                    inline.parentNode.replaceChild(replacement, inline);
                                }
                            }
                        });

                        // Process Modern KaTeX Elements
                        const katexElements = clone.querySelectorAll('ms-katex, .math-block, .math-inline, .katex');
                        katexElements.forEach(mathEl => {
                            let latexSource = mathEl.text || mathEl.math || mathEl.getAttribute('text') || mathEl.getAttribute('math') || "";
                            
                            if (!latexSource) {
                                const annotation = mathEl.querySelector('annotation[encoding="application/x-tex"]');
                                if (annotation) {
                                    latexSource = annotation.textContent || "";
                                }
                            }
                            
                            if (latexSource && mathEl.parentNode) {
                                const isInline = mathEl.classList.contains('inline') || mathEl.classList.contains('math-inline') || mathEl.tagName === 'SPAN';
                                const replacementText = isInline ? " $" + latexSource.trim() + "$ " : "\\n\\n$$" + latexSource.trim() + "$$\\n\\n";
                                const replacement = document.createTextNode(replacementText);
                                mathEl.parentNode.replaceChild(replacement, mathEl);
                            }
                        });

                        combinedHTML += clone.innerHTML + "\\n";
                    }
                    
                    if (combinedHTML) {
                        console.log("KC Debug: Sending completed static payload to Obsidian (" + combinedHTML.length + " characters).");
                        console.log("gemini-stream-chunk::" + encodeURIComponent("html-payload::" + combinedHTML));
                    } else {
                        console.warn("KC Debug: Response content list resolved to empty HTML structure.");
                    }
                }

                findAndFillInput();
            })();
        `;
        
        console.log("Obsidian KC: Sending executeJavaScript query to webview.");
        this.webview.executeJavaScript(injectionCode)
            .then(() => console.log("Obsidian KC: executeJavaScript injection success."))
            .catch((err: any) => console.error("Obsidian KC: executeJavaScript injection failed:", err));
    }

    private handleStreamChunk(htmlContent: string) {
        if (!this.activeEditor || this.activePromptId === null) return;

        // Query the document to find the exact boundaries of [id] and [/id]
        const range = this.findResponseRange(this.activeEditor, this.activePromptId);
        if (!range) {
            console.error("Obsidian KC: Could not find the response boundary tags in the document.");
            this.activePromptId = null;
            this.activeEditor = null;
            return;
        }

        let fullMarkdown = "";

        if (htmlContent.startsWith("html-payload::")) {
            const content = htmlContent.substring("html-payload::".length);
            fullMarkdown = htmlToMarkdown(content);
        } else {
            fullMarkdown = htmlContent;
        }

        fullMarkdown = fullMarkdown
            .split("\n")
            .map(line => line.trimEnd())
            .join("\n");

        fullMarkdown = fullMarkdown.replace(/\n{3,}/g, "\n\n");
        fullMarkdown = fullMarkdown.replace(/\n\s*\n\s*([-*+]\s|\d+\.\s)/g, "\n$1");

        // Safely replace the exact content line(s) between the wrappers
        this.activeEditor.replaceRange(fullMarkdown, range.start, range.end);

        this.activePromptId = null;
        this.activeEditor = null;

        new Notice("✅ Gemini response inserted.");
    }
}
```
### Main
```typescript
import { App, Editor, Modal, Notice, Plugin, PluginSettingTab, Setting, MarkdownView } from 'obsidian';
import { FloatingCompanion } from './FloatingCompanion';

// ── CONFIGURATION & CONSTANTS ──────────────────────────────────────────
interface KineticCompanionSettings {
    enableSparkles: boolean;
    enableSlamPaste: boolean;
}

const DEFAULT_SETTINGS: KineticCompanionSettings = {
    enableSparkles: true,
    enableSlamPaste: true
};

// ── CUSTOM INLINE SELECTION PROMPT MODAL ────────────────────────────────
class SelectionPromptModal extends Modal {
    onSubmit: (instruction: string) => void;
    inputEl!: HTMLInputElement;

    constructor(app: App, onSubmit: (instruction: string) => void) {
        super(app);
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h3", { text: "Kinetic Prompt Selection" });
        
        const desc = contentEl.createEl("p", { text: "How should Gemma 4 update your highlighted selection? (Leave blank to submit raw selection)" });
        desc.style.cssText = "color: var(--text-muted); font-size: 0.85em; margin-top: 10px;";

        this.inputEl = contentEl.createEl("input", { type: "text" });
        this.inputEl.style.width = "100%";
        this.inputEl.placeholder = "e.g., make it sound warmer, rewrite as bullet list...";
        
        setTimeout(() => this.inputEl.focus(), 20);

        this.scope.register([], "Enter", (evt) => {
            evt.preventDefault();
            this.submit();
        });
    }

    submit() {
        const value = this.inputEl.value.trim();
        // Pass the value directly—even if empty—to support raw selection submissions
        this.onSubmit(value);
        this.close();
    }

    onClose() {
        this.contentEl.empty();
    }
}

// ── CORE PLUGIN IMPLEMENTATION ──────────────────────────────────────────
export default class KineticCompanionPlugin extends Plugin {
    settings!: KineticCompanionSettings;
    companion!: FloatingCompanion;
    audioCtx: AudioContext | null = null;

    async onload() {
        await this.loadSettings();

        // Initialize the VaporNote-style floating DOM background companion
        this.companion = new FloatingCompanion(this.app);
        this.companion.init();

        // 1. Command to prompt with active highlighted selection
        this.addCommand({
            id: 'kinetic-selection-prompt',
            name: 'Prompt with Selection',
            editorCallback: (editor: Editor) => {
                const selection = editor.getSelection().trim();
                if (!selection) {
                    new Notice("Please select some text to prompt with.");
                    return;
                }
                
                const rangeFrom = editor.getCursor('from');
                const rangeTo = editor.getCursor('to');

                const promptModal = new SelectionPromptModal(this.app, (instruction) => {
                    const compiledPrompt = instruction ? `${instruction}:\n\n${selection}` : selection;
                    this.companion.executeStreamSession(editor, compiledPrompt, selection, rangeFrom, rangeTo);
                });
                promptModal.open();
            }
        });

        // 2. Command to show, hide, or center the floating companion panel
        this.addCommand({
            id: 'toggle-companion-webview',
            name: 'Toggle Companion Webview',
            callback: () => {
                this.companion.toggleVisibility();
            }
        });

        // Ribbon icon opens and shows the floating companion panel
        this.addRibbonIcon("comment-discussion", "Open Companion View", () => {
            this.companion.show();
        });

        // 3. Register Editor Sparkle Visualizer
        this.registerEvent(
            this.app.workspace.on('editor-change', (editor: Editor) => {
                if (this.settings.enableSparkles) {
                    this.spawnCursorParticle(editor);
                }
            })
        );

        // 4. Register Heavy Slam Paste Listener
        this.registerEvent(
            this.app.workspace.on('editor-paste', (evt: ClipboardEvent, editor: Editor) => {
                if (this.settings.enableSlamPaste) {
                    this.triggerSlamEffect(editor);
                }
            })
        );

        this.addSettingTab(new KineticCompanionSettingTab(this.app, this));
    }

    async onunload() {
        if (this.audioCtx) {
            try {
                this.audioCtx.close();
            } catch(e) {}
        }
        if (this.companion) {
            this.companion.cleanup();
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playSlamStamp() {
        this.initAudio();
        if (!this.audioCtx) return;
        try {
            const now = this.audioCtx.currentTime;
            
            const lowOsc = this.audioCtx.createOscillator();
            const lowGain = this.audioCtx.createGain();
            lowOsc.type = 'sawtooth';
            lowOsc.frequency.setValueAtTime(90, now);
            lowOsc.frequency.linearRampToValueAtTime(30, now + 0.15);
            lowGain.gain.setValueAtTime(0.4, now);
            lowGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            lowOsc.connect(lowGain);
            lowGain.connect(this.audioCtx.destination);
            lowOsc.start(now);
            lowOsc.stop(now + 0.16);

            const clickOsc = this.audioCtx.createOscillator();
            const clickGain = this.audioCtx.createGain();
            clickOsc.type = 'triangle';
            clickOsc.frequency.setValueAtTime(600, now);
            clickOsc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
            clickGain.gain.setValueAtTime(0.2, now);
            clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            clickOsc.connect(clickGain);
            clickGain.connect(this.audioCtx.destination);
            clickOsc.start(now);
            clickOsc.stop(now + 0.06);
        } catch(e) {}
    }

    spawnCursorParticle(editor: Editor) {
        try {
            const cursor = editor.getCursor();
            const coords = (editor as any).coordsAtPos(cursor);
            if (coords) {
                const particle = document.createElement("div");
                particle.className = "kc-cursor-particle";
                
                const offsetX = (Math.random() - 0.5) * 8;
                const offsetY = (Math.random() - 0.5) * 4;
                
                particle.style.left = `${coords.left + offsetX}px`;
                particle.style.top = `${coords.top + offsetY}px`;
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 400);
            }
        } catch (e) {
            // Fail silently
        }
    }

    triggerSlamEffect(editor: Editor) {
        try {
            this.playSlamStamp();
            
            const cursor = editor.getCursor();
            const coords = (editor as any).coordsAtPos(cursor);
            if (coords) {
                for (let i = 0; i < 4; i++) {
                    const dustLeft = document.createElement("div");
                    dustLeft.className = "kc-dust-particle kc-dust-left";
                    dustLeft.style.left = `${coords.left}px`;
                    dustLeft.style.top = `${coords.top + (Math.random() - 0.5) * 8}px`;
                    document.body.appendChild(dustLeft);

                    const dustRight = document.createElement("div");
                    dustRight.className = "kc-dust-particle kc-dust-right";
                    dustRight.style.left = `${coords.left}px`;
                    dustRight.style.top = `${coords.top + (Math.random() - 0.5) * 8}px`;
                    document.body.appendChild(dustRight);

                    setTimeout(() => {
                        dustLeft.remove();
                        dustRight.remove();
                    }, 300);
                }

                const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (activeView) {
                    const el = activeView.containerEl;
                    el.classList.add("kc-shaking");
                    setTimeout(() => {
                        el.classList.remove("kc-shaking");
                    }, 150);
                }
            }
        } catch (e) {
            // Fail silently
        }
    }
}

// ── SETTINGS TAB CLASS ─────────────────────────────────────────────────
class KineticCompanionSettingTab extends PluginSettingTab {
    plugin: KineticCompanionPlugin;

    constructor(app: App, plugin: KineticCompanionPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Kinetic Companion Settings' });

        new Setting(containerEl)
            .setName('Typing Caret Sparkles')
            .setDesc('Toggle ON to spawn beautiful glowing kinetic sparkles behind your cursor as you type.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSparkles)
                .onChange(async (value) => {
                    this.plugin.settings.enableSparkles = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Heavy Slam Paste Effect')
            .setDesc('Toggle ON to trigger a satisfying, tactile stamp thud, screen shake, and dust particles whenever you paste text.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSlamPaste)
                .onChange(async (value) => {
                    this.plugin.settings.enableSlamPaste = value;
                    await this.plugin.saveSettings();
                }));
    }
}
```
## V8
### FloatingCompanion
```typescript
import { App, Editor, Notice, htmlToMarkdown, WorkspaceLeaf } from 'obsidian';

export class FloatingCompanion {
    private app: App;
    private container: HTMLDivElement | null = null;
    private leaf: WorkspaceLeaf | null = null;
    private webview: any = null;
    
    private isVisible = false;
    private isMinimized = false;
    private opacityValue = '0.95';
    
    // Drag/position states
    private isDragging = false;
    private dragStartX = 0;
    private dragStartY = 0;
    private containerStartX = 0;
    private containerStartY = 0;
    private dragOverlay: HTMLDivElement | null = null;
    
    // Active prompt session states
    private activeEditor: Editor | null = null;
    private activePromptId: number | null = null;
    
    // Default position states
    private savedWidth = '380px';
    private savedHeight = '500px';
    private savedLeft = '100px';
    private savedTop = '100px';

    constructor(app: App) {
        this.app = app;
    }

    public async init() {
        const doc = document;
        
        // 1. Create a local floating container element
        const container = doc.createElement('div');
        container.classList.add('kc-floating-container');
        this.container = container; 
        this.styleContainerOffscreen();
        
        // 2. Build the top bar controls (drag bar, minimize, close/hide, opacity slider)
        this.buildChrome();
        
        // 3. Create a local native Obsidian leaf
        const leaf = new (WorkspaceLeaf as any)(this.app);
        this.leaf = leaf;
        this.neutralizeLeaf(leaf);
        
        await leaf.setViewState({
            type: 'webviewer',
            state: {
                url: 'https://aistudio.google.com/',
                navigate: true
            },
            active: true
        });

        // Style the leaf container to cleanly fill our floating frame
        Object.assign(leaf.containerEl.style, {
            flex: '1',
            minHeight: '0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        });

        // Append the native leaf container to our floating container
        container.appendChild(leaf.containerEl);
        doc.body.appendChild(container);
        
        // 4. Locates the loaded webview element inside the Obsidian leaf
        const webviewEl = await this.getReadyWebview();
        if (webviewEl) {
            this.webview = webviewEl;
            this.setupConsoleMessageInterceptor();
            console.log("Obsidian KC: Native webview is ready and hooked.");
        } else {
            console.error("Obsidian KC: Native webview could not be located inside the leaf.");
        }
    }

    public cleanup() {
        if (this.leaf) {
            try {
                // Force-allow standard layout detachment during unload
                (this.leaf as any)._allowDetach = true;
                this.leaf.detach();
            } catch (_) {}
            this.leaf = null;
        }
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
        this.webview = null;
        this.activeEditor = null;
        this.activePromptId = null;
    }

    public toggleVisibility() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    public show() {
        if (!this.container) return;
        this.styleContainerOnscreen();
    }

    public hide() {
        if (!this.container) return;
        this.styleContainerOffscreen();
    }

    private toggleMinimize() {
        if (!this.container || !this.leaf) return;
        this.isMinimized = !this.isMinimized;
        
        if (this.isMinimized) {
            const r = this.container.getBoundingClientRect();
            this.savedWidth = r.width + 'px';
            this.savedHeight = r.height + 'px';
            
            this.container.style.height = '36px';
            (this.leaf as any).containerEl.style.display = 'none';
        } else {
            this.container.style.height = this.savedHeight;
            (this.leaf as any).containerEl.style.display = 'flex';
        }
    }

    private styleContainerOffscreen() {
        if (!this.container) return;
        Object.assign(this.container.style, {
            position: 'fixed',
            top: '0px',
            left: '0px',
            width: '380px',
            height: '500px',
            opacity: '0.005',       // Non-zero opacity forces Chrome to keep the layout active
            pointerEvents: 'none',  // Non-interactive (mouse clicks pass through completely)
            zIndex: '9999',         // Brought to the front so Chrome never flags it as occluded
            background: 'transparent',
            border: 'none',
            borderRadius: '0px',
            boxShadow: 'none',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        });
        this.isVisible = false;
    }

    private styleContainerOnscreen() {
        if (!this.container) return;
        Object.assign(this.container.style, {
            position: 'fixed',
            top: this.savedTop,
            left: this.savedLeft,
            width: this.isMinimized ? '380px' : this.savedWidth,
            height: this.isMinimized ? '36px' : this.savedHeight,
            right: 'auto',
            bottom: 'auto',
            opacity: this.opacityValue,
            pointerEvents: 'auto',   // Restored mouse interactions
            zIndex: '9999',         // Brought to the foreground
            background: 'var(--background-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        });
        this.isVisible = true;
    }

    private buildChrome() {
        if (!this.container) return;
        const doc = document;
        
        const dragBar = doc.createElement('div');
        dragBar.style.cssText = `
            background: var(--background-secondary);
            padding: 8px 12px; cursor: move; font-size: 11px; font-weight: bold;
            color: var(--text-muted); border-bottom: 1px solid var(--border-color);
            display: flex; justify-content: space-between; align-items: center;
            user-select: none; flex-shrink: 0; height: 36px; box-sizing: border-box;
        `;
        
        const titleSpan = doc.createElement('span');
        titleSpan.textContent = "Kinetic Companion (Google AI Studio)";
        dragBar.appendChild(titleSpan);
        
        const controls = doc.createElement('div');
        controls.style.cssText = `display: flex; align-items: center; gap: 8px; margin-left: auto;`;
        
        // Opacity Slider
        const sliderLabel = doc.createElement('span');
        sliderLabel.textContent = "☀";
        sliderLabel.title = "Opacity";
        sliderLabel.style.cssText = "font-size: 10px; opacity: 0.7;";
        controls.appendChild(sliderLabel);
        
        const opacitySlider = doc.createElement('input');
        opacitySlider.type = 'range';
        opacitySlider.min = '0.2';
        opacitySlider.max = '1.0';
        opacitySlider.step = '0.05';
        opacitySlider.value = this.opacityValue;
        opacitySlider.style.cssText = `
            width: 50px; height: 3px; cursor: pointer; margin: 0; accent-color: var(--interactive-accent);
        `;
        opacitySlider.addEventListener('input', (e: any) => {
            this.opacityValue = e.target.value;
            if (this.container && this.isVisible) {
                this.container.style.opacity = this.opacityValue;
            }
        });
        controls.appendChild(opacitySlider);
        
        // Minimize Button
        const minimizeBtn = doc.createElement('span');
        minimizeBtn.textContent = '−';
        minimizeBtn.title = "Minimize";
        minimizeBtn.style.cssText = `cursor: pointer; padding: 0 4px; font-weight: bold; font-size: 12px;`;
        minimizeBtn.addEventListener('click', () => this.toggleMinimize());
        controls.appendChild(minimizeBtn);
        
        // Hide Button
        const closeBtn = doc.createElement('span');
        closeBtn.textContent = '✕';
        closeBtn.title = "Hide";
        closeBtn.style.cssText = `cursor: pointer; padding: 0 4px; font-size: 11px;`;
        closeBtn.addEventListener('click', () => this.hide());
        controls.appendChild(closeBtn);
        
        dragBar.appendChild(controls);
        this.container.appendChild(dragBar);
        
        // Window drag handlers
        dragBar.addEventListener('mousedown', (e: MouseEvent) => {
            if (e.target === closeBtn || e.target === minimizeBtn || e.target === opacitySlider) return;
            this.isDragging = true;
            this.dragStartX = e.clientX;
            this.dragStartY = e.clientY;
            
            if (this.container) {
                const r = this.container.getBoundingClientRect();
                this.containerStartX = r.left;
                this.containerStartY = r.top;
            }
            
            e.preventDefault();
            this.showDragOverlay();
        });
        
        doc.addEventListener('mousemove', (e: MouseEvent) => {
            if (!this.isDragging || !this.container) return;
            const newLeft = this.containerStartX + (e.clientX - this.dragStartX);
            const newTop = this.containerStartY + (e.clientY - this.dragStartY);
            
            this.container.style.left = `${newLeft}px`;
            this.container.style.top = `${newTop}px`;
            this.container.style.right = 'auto';
            
            this.savedLeft = `${newLeft}px`;
            this.savedTop = `${newTop}px`;
        });
        
        doc.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.removeDragOverlay();
            }
        });
    }

    private showDragOverlay() {
        if (this.dragOverlay) return;
        const doc = document;
        this.dragOverlay = doc.createElement('div');
        this.dragOverlay.style.cssText = 'position: fixed; inset: 0; z-index: 999999; background: transparent; cursor: move;';
        doc.body.appendChild(this.dragOverlay);
        
        if (this.webview) {
            this.webview.style.pointerEvents = 'none';
        }
    }

    private removeDragOverlay() {
        if (this.dragOverlay) {
            this.dragOverlay.remove();
            this.dragOverlay = null;
        }
        if (this.webview) {
            this.webview.style.pointerEvents = '';
        }
    }

    private neutralizeLeaf(leaf: any) {
        if (leaf && leaf.containerEl) {
            leaf.containerEl.setAttribute('tabindex', '-1');
            leaf.containerEl.style.outline = 'none';
        }

        const noopContainer = {
            requestFocus: () => {},
            focus:        () => {},
            get win() { return window; },
            get doc() { return document; },
            containerEl:  leaf.containerEl,
        };

        const safeContainerEl = {
            addClass:        () => {},
            removeClass:     () => {},
            toggleClass:     () => {},
            hasClass:        () => false,
            setAttribute:    () => {},
            removeAttribute: () => {},
            classList:       { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
            style:           {},
            dataset:         {},
        };

        const fakeRoot = {
            get win() { return window; },
            get doc() { return document; },
            containerEl:     safeContainerEl,
            getRoot:         () => fakeRoot,
            isAttached:      () => true,
            recomputeLayout: () => {},
            updateLayout:    () => {},
            type: 'root',
        };

        const fakeParent = {
            get win() { return window; },
            get doc() { return document; },
            getContainer:    () => noopContainer,
            containerEl:     safeContainerEl,
            children:        [leaf],
            type:            'split',
            getRoot:         () => fakeRoot,
            isAttached:      () => true,
            recomputeLayout: () => {},
            updateLayout:    () => {},
        };

        if (!leaf.parent) {
            leaf.parent = fakeParent;
        }
    }

    private async getReadyWebview(): Promise<any> {
        const leaf = this.leaf;
        if (!leaf) return null;
        
        return new Promise<any>((resolve) => {
            const el = (leaf as any).containerEl.querySelector("webview");
            if (el) {
                resolve(el);
                return;
            }
            const observer = new MutationObserver(() => {
                const el = (leaf as any).containerEl.querySelector("webview");
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe((leaf as any).containerEl, { childList: true, subtree: true });
            
            setTimeout(() => {
                observer.disconnect();
                resolve((leaf as any).containerEl.querySelector("webview"));
            }, 5000);
        });
    }

    private setupConsoleMessageInterceptor() {
        if (!this.webview) return;
        this.webview.addEventListener('console-message', (event: any) => {
            const message = event.message as string;
            console.log("[WebView Guest]", message);

            if (message && message.startsWith("gemini-stream-chunk::")) {
                const encodedHTML = message.substring("gemini-stream-chunk::".length);
                try {
                    const decodedHTML = decodeURIComponent(encodedHTML);
                    this.handleStreamChunk(decodedHTML);
                } catch (e) {
                    console.error("Obsidian KC: Parsing received HTML stream chunk failed:", e);
                }
            }
        });
    }

    private getNextAvailableId(editor: Editor): number {
        const text = editor.getValue();
        const lines = text.split('\n');
        const used = new Set<number>();
        
        for (const line of lines) {
            const trimmed = line.trim();
            // Match structural companion tags on their own line to avoid footnote/link collisions
            const openMatch = trimmed.match(/^\[(\d+)\]$/);
            if (openMatch) {
                const numStr = openMatch[1];
                if (numStr) {
                    used.add(parseInt(numStr as string, 10));
                }
            }
            const closeMatch = trimmed.match(/^\[\/(\d+)\]$/);
            if (closeMatch) {
                const numStr = closeMatch[1];
                if (numStr) {
                    used.add(parseInt(numStr as string, 10));
                }
            }
        }
        
        let id = 1;
        while (used.has(id)) {
            id++;
        }
        return id;
    }

    private findResponseRange(editor: Editor, id: number): { start: { line: number; ch: number }; end: { line: number; ch: number } } | null {
        const text = editor.getValue();
        const lines = text.split('\n');
        let startLine = -1;
        let endLine = -1;

        const openTag = `[${id}]`;
        const closeTag = `[/${id}]`;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line === undefined) continue; // Resolve TS2532 Object is possibly 'undefined'
            
            const trimmed = line.trim();
            if (trimmed === openTag) {
                startLine = i + 1; // Content starts on the next line
            } else if (trimmed === closeTag) {
                endLine = i - 1; // Content ends on the previous line
                break;
            }
        }

        // Validate range structure
        if (startLine !== -1 && endLine !== -1 && startLine <= endLine + 1) {
            const endLineText = lines[endLine] || "";
            return {
                start: { line: startLine, ch: 0 },
                end: { line: endLine, ch: endLineText.length }
            };
        }

        return null;
    }

    public async executeStreamSession(
        editor: Editor, 
        promptContent: string, 
        rawSelection: string, 
        rangeFrom: { line: number; ch: number }, 
        rangeTo: { line: number; ch: number }
    ) {
        console.log("Obsidian KC: Starting executeStreamSession.");
        
        if (!this.webview) {
            new Notice("Companion Webview is not ready.");
            return;
        }

        // Programmatically focus the webview tag prior to execution to assert viewport active states
        try {
            this.webview.focus();
        } catch (_) {}

        this.activeEditor = editor;
        
        // Scan the file to discover the next available bracket identifier
        const id = this.getNextAvailableId(editor);
        this.activePromptId = id;
        
        // Format the document layout with companion wrapper blocks
        const headerText = `${rawSelection}\n[${id}]\n(loading response...)\n[/${id}]\n`;
        editor.replaceRange(headerText, rangeFrom, rangeTo);

        const escapedPrompt = JSON.stringify(promptContent);
        
        console.log("Obsidian KC: Crafting injection script payload.");
        const injectionCode = `
            (function() {
                // Spoof Page Visibility and Focus APIs to bypass background tab suspension
                try {
                    Object.defineProperty(document, 'visibilityState', { get: function() { return 'visible'; }, configurable: true });
                    Object.defineProperty(document, 'hidden', { get: function() { return false; }, configurable: true });
                    Object.defineProperty(document, 'webkitVisibilityState', { get: function() { return 'visible'; }, configurable: true });
                    Object.defineProperty(document, 'webkitHidden', { get: function() { return false; }, configurable: true });
                    
                    document.dispatchEvent(new Event('visibilitychange'));
                    document.dispatchEvent(new Event('webkitvisibilitychange'));
                    
                    window.dispatchEvent(new Event('focus'));
                    document.dispatchEvent(new Event('focus'));
                    console.log("KC Debug: Injected background visibility and focus spoofs.");
                } catch (visibilityErr) {
                    console.warn("KC Debug: Visibility spoofing failed:", visibilityErr);
                }

                const promptText = ${escapedPrompt};
                console.log("KC Debug: Guest automation process initiated.");

                // Helper queries
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

                function checkErrorOrRateLimit() {
                    const errorSelectors = 'ms-alert, .error-message, .error, mat-snack-bar-container, .mat-mdc-snack-bar-container, .snack-bar, ms-chat-turn.error, .error-container, ms-toast';
                    const errorNodes = queryShadowSelectorAll(errorSelectors);
                    
                    for (let i = 0; i < errorNodes.length; i++) {
                        const el = errorNodes[i];
                        const text = (el.textContent || "").toLowerCase();
                        if (text.includes("rate limit") || text.includes("too many requests") || text.includes("try again later") || text.includes("resource has been exhausted") || text.includes("quota")) {
                            return el.textContent.trim();
                        }
                    }
                    
                    const textElements = queryShadowSelectorAll('div, span, p');
                    for (let i = 0; i < textElements.length; i++) {
                        const el = textElements[i];
                        if (el.children.length === 0) {
                            const text = (el.textContent || "").toLowerCase();
                            if ((text.includes("rate limit") && text.includes("later")) || text.includes("quota exceeded") || text.includes("resource exhausted")) {
                                return el.textContent.trim();
                            }
                        }
                    }
                    return null;
                }

                let fillRetries = 0;
                function findAndFillInput() {
                    console.log("KC Debug: Querying main input text field... (Attempt: " + (fillRetries + 1) + ")");
                    const inputEl = queryShadowSelector('ms-prompt-box textarea, ms-prompt-box ms-autosize-textarea textarea, textarea[aria-label="Type something"], textarea[aria-label="Enter a prompt"], textarea, div[contenteditable="true"], [role="textbox"]');
                    if (inputEl) {
                        console.log("KC Debug: Target input located successfully:", inputEl);
                        const initialTurnCount = queryShadowSelectorAll('ms-chat-turn').length;
                        console.log("KC Debug: Initial history chat turn count:", initialTurnCount);

                        if (inputEl.tagName === 'DIV') {
                            inputEl.textContent = promptText;
                        } else {
                            inputEl.value = promptText;
                        }
                        inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                        inputEl.dispatchEvent(new Event('change', { bubbles: true }));

                        setTimeout(() => {
                            let parent = inputEl.parentElement;
                            let runButton = null;
                            
                            while (parent && !runButton) {
                                runButton = parent.querySelector('ms-prompt-box ms-run-button button[aria-label="Run"], ms-prompt-box button[aria-label="Run"][type="submit"], button.run-button, button[aria-label="Run"], button[aria-label="Run prompt"], ms-run-button button[type="submit"].run-button');
                                if (!runButton) {
                                    const containerButtons = parent.querySelectorAll('button');
                                    for (let i = 0; i < containerButtons.length; i++) {
                                        const btn = containerButtons[i];
                                        const text = (btn.textContent || '').trim();
                                        if (text.startsWith('Run') || btn.classList.contains('run-button')) {
                                            runButton = btn;
                                            break;
                                        }
                                    }
                                }
                                if (parent.tagName === 'BODY') {
                                    break;
                                }
                                parent = parent.parentElement;
                            }

                            if (runButton) {
                                console.log("KC Debug: Executing robust click cycle on run button:", runButton);
                                runButton.focus();
                                runButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
                                runButton.dispatchEvent(new Event('change', { bubbles: true }));
                                runButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
                                runButton.click();
                            } else {
                                console.log("KC Debug: Run button absent. Dispatching Ctrl+Enter KeyboardEvent fallback.");
                                const enterEvent = new KeyboardEvent('keydown', {
                                    key: 'Enter', code: 'Enter', keyCode: 13, ctrlKey: true, metaKey: true, bubbles: true, cancelable: true
                                });
                                inputEl.dispatchEvent(enterEvent);
                            }
                            waitForCompletionAndExtract(initialTurnCount);
                        }, 250);
                    } else {
                        fillRetries++;
                        if (fillRetries < 40) {
                            setTimeout(findAndFillInput, 500);
                        } else {
                            console.error("KC Debug: Could not locate active input element context.");
                            console.log("gemini-stream-chunk::" + encodeURIComponent("Error: Prompt field absent. Please click the Ribbon Icon to open the Companion Webview and ensure you are logged in."));
                        }
                    }
                }

                function waitForCompletionAndExtract(initialCount) {
                    console.log("KC Debug: Initiating content-stability polling tracker.");
                    let checkCount = 0;
                    const maxChecks = 180; // 90 seconds timeout
                    let generationStarted = false;
                    let previousText = "";
                    let unchangedCount = 0;
                    const stabilityThreshold = 6; // 3 seconds of absolute stability (6 ticks * 500ms)

                    const pollInterval = setInterval(() => {
                        checkCount++;

                        // Scan for active rate limit or server error containers
                        const rateLimitError = checkErrorOrRateLimit();
                        if (rateLimitError) {
                            clearInterval(pollInterval);
                            console.error("KC Debug: Google AI Studio error detected: " + rateLimitError);
                            console.log("gemini-stream-chunk::" + encodeURIComponent("Error: " + rateLimitError));
                            return;
                        }

                        const turns = queryShadowSelectorAll('ms-chat-turn');
                        let latestText = "";
                        let modelContainer = null;
                        
                        for (let i = turns.length - 1; i >= initialCount; i--) {
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

                        if (latestText && latestText.trim().length > 0) {
                            if (!generationStarted) {
                                generationStarted = true;
                                console.log("KC Debug: Generation started. Content detected length: " + latestText.length);
                            }

                            if (latestText === previousText) {
                                unchangedCount++;
                                console.log("KC Debug: Content unchanged count: " + unchangedCount + "/" + stabilityThreshold);
                            } else {
                                unchangedCount = 0;
                                previousText = latestText;
                                console.log("KC Debug: Content updated. New length: " + latestText.length);
                            }
                        } else {
                            console.log("KC Debug: Waiting for model turn or text... (" + checkCount + ")");
                        }

                        if ((generationStarted && unchangedCount >= stabilityThreshold) || (checkCount > maxChecks)) {
                            clearInterval(pollInterval);
                            console.log("KC Debug: Content stable. Executing final extraction...");
                            extractFinalResponse(initialCount);
                        }
                    }, 500);
                }

                function extractFinalResponse(initialCount) {
                    const turns = queryShadowSelectorAll('ms-chat-turn');
                    console.log("KC Debug: Finalizing extraction. Detected chat turns count: " + turns.length);

                    let modelContainer = null;
                    for (let i = turns.length - 1; i >= initialCount; i--) {
                        const turn = turns[i];
                        const container = queryShadowSelector('.chat-turn-container.model', turn);
                        if (container) {
                            modelContainer = container;
                            break;
                        }
                    }

                    if (!modelContainer) {
                        console.error("KC Debug: Active model turn element missing from workspace layout.");
                        return;
                    }

                    const cmarkEls = queryShadowSelectorAll('ms-cmark-node, .model-content, .markdown', modelContainer);
                    
                    const isInsideThinking = (node) => {
                        while (node) {
                            const tag = node.tagName || "";
                            if (tag === 'MS-THOUGHT-CHUNK' || 
                                tag === 'MODEL-THOUGHTS' || 
                                (node.classList && (
                                    node.classList.contains('thinking') || 
                                    node.classList.contains('thought-container')
                                ))) {
                                    return true;
                                }
                                node = node.parentNode || node.host;
                            }
                            return false;
                        };

                    const nonThinkingEls = cmarkEls.filter(el => !isInsideThinking(el));

                    const uniqueEls = nonThinkingEls.filter(el => {
                        return !nonThinkingEls.some(otherEl => otherEl !== el && otherEl.contains(el));
                    });

                    let combinedHTML = "";
                    for (let j = 0; j < uniqueEls.length; j++) {
                        const el = uniqueEls[j];
                        const clone = el.cloneNode(true);
                        
                        // Process Math Blocks
                        const mathBlocks = clone.querySelectorAll('ms-math-block, math-block');
                        mathBlocks.forEach(block => {
                            const rawTex = block.text || block.math || block.getAttribute('math') || block.getAttribute('value') || "";
                            if (rawTex && block.parentNode) {
                                const replacement = document.createTextNode("\\n\\n$$" + rawTex + "$$\\n\\n");
                                block.parentNode.replaceChild(replacement, block);
                            }
                        });

                        // Process Math Inlines
                        const mathInlines = clone.querySelectorAll('ms-math-inline, math-inline, span.math');
                        mathInlines.forEach(inline => {
                            const rawTex = inline.text || inline.math || inline.getAttribute('math') || inline.getAttribute('value') || "";
                            if (rawTex && inline.parentNode) {
                                const replacement = document.createTextNode(" $" + rawTex + "$ ");
                                inline.parentNode.replaceChild(replacement, inline);
                            } else if (inline.parentNode) {
                                const script = inline.querySelector('script[type="math/tex"]');
                                if (script && script.textContent) {
                                    const replacement = document.createTextNode(" $" + script.textContent + "$ ");
                                    inline.parentNode.replaceChild(replacement, inline);
                                }
                            }
                        });

                        // Process Modern KaTeX Elements
                        const katexElements = clone.querySelectorAll('ms-katex, .math-block, .math-inline, .katex');
                        katexElements.forEach(mathEl => {
                            let latexSource = mathEl.text || mathEl.math || mathEl.getAttribute('text') || mathEl.getAttribute('math') || "";
                            
                            if (!latexSource) {
                                const annotation = mathEl.querySelector('annotation[encoding="application/x-tex"]');
                                if (annotation) {
                                    latexSource = annotation.textContent || "";
                                }
                            }
                            
                            if (latexSource && mathEl.parentNode) {
                                const isInline = mathEl.classList.contains('inline') || mathEl.classList.contains('math-inline') || mathEl.tagName === 'SPAN';
                                const replacementText = isInline ? " $" + latexSource.trim() + "$ " : "\\n\\n$$" + latexSource.trim() + "$$\\n\\n";
                                const replacement = document.createTextNode(replacementText);
                                mathEl.parentNode.replaceChild(replacement, mathEl);
                            }
                        });

                        combinedHTML += clone.innerHTML + "\\n";
                    }
                    
                    if (combinedHTML) {
                        console.log("KC Debug: Sending completed static payload to Obsidian (" + combinedHTML.length + " characters).");
                        console.log("gemini-stream-chunk::" + encodeURIComponent("html-payload::" + combinedHTML));
                    } else {
                        console.warn("KC Debug: Response content list resolved to empty HTML structure.");
                    }
                }

                findAndFillInput();
            })();
        `;
        
        console.log("Obsidian KC: Sending executeJavaScript query to webview.");
        this.webview.executeJavaScript(injectionCode)
            .then(() => console.log("Obsidian KC: executeJavaScript injection success."))
            .catch((err: any) => console.error("Obsidian KC: executeJavaScript injection failed:", err));
    }

    private handleStreamChunk(htmlContent: string) {
        if (!this.activeEditor || this.activePromptId === null) return;

        // Query the document to find the exact boundaries of [id] and [/id]
        const range = this.findResponseRange(this.activeEditor, this.activePromptId);
        if (!range) {
            console.error("Obsidian KC: Could not find the response boundary tags in the document.");
            this.activePromptId = null;
            this.activeEditor = null;
            return;
        }

        let fullMarkdown = "";

        if (htmlContent.startsWith("html-payload::")) {
            const content = htmlContent.substring("html-payload::".length);
            fullMarkdown = htmlToMarkdown(content);
        } else {
            fullMarkdown = htmlContent;
        }

        fullMarkdown = fullMarkdown
            .split("\n")
            .map(line => line.trimEnd())
            .join("\n");

        fullMarkdown = fullMarkdown.replace(/\n{3,}/g, "\n\n");
        fullMarkdown = fullMarkdown.replace(/\n\s*\n\s*([-*+]\s|\d+\.\s)/g, "\n$1");

        // Safely replace the exact content line(s) between the wrappers
        this.activeEditor.replaceRange(fullMarkdown, range.start, range.end);

        this.activePromptId = null;
        this.activeEditor = null;

        new Notice("✅ Gemini response inserted.");
    }
}
```
### Main
```typescript
import { App, Editor, Modal, Notice, Plugin, PluginSettingTab, Setting, MarkdownView } from 'obsidian';
import { FloatingCompanion } from './FloatingCompanion';

// ── CONFIGURATION & CONSTANTS ──────────────────────────────────────────
interface KineticCompanionSettings {
    enableSparkles: boolean;
    enableSlamPaste: boolean;
}

const DEFAULT_SETTINGS: KineticCompanionSettings = {
    enableSparkles: true,
    enableSlamPaste: true
};

// ── CUSTOM INLINE SELECTION PROMPT MODAL ────────────────────────────────
class SelectionPromptModal extends Modal {
    onSubmit: (instruction: string) => void;
    inputEl!: HTMLInputElement;

    constructor(app: App, onSubmit: (instruction: string) => void) {
        super(app);
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h3", { text: "Kinetic Prompt Selection" });
        
        const desc = contentEl.createEl("p", { text: "How should Gemma 4 update your highlighted selection? (Leave blank to submit raw selection)" });
        desc.style.cssText = "color: var(--text-muted); font-size: 0.85em; margin-top: 10px;";

        this.inputEl = contentEl.createEl("input", { type: "text" });
        this.inputEl.style.width = "100%";
        this.inputEl.placeholder = "e.g., make it sound warmer, rewrite as bullet list...";
        
        setTimeout(() => this.inputEl.focus(), 20);

        this.scope.register([], "Enter", (evt) => {
            evt.preventDefault();
            this.submit();
        });
    }

    submit() {
        const value = this.inputEl.value.trim();
        // Pass the value directly—even if empty—to support raw selection submissions
        this.onSubmit(value);
        this.close();
    }

    onClose() {
        this.contentEl.empty();
    }
}

// ── CORE PLUGIN IMPLEMENTATION ──────────────────────────────────────────
export default class KineticCompanionPlugin extends Plugin {
    settings!: KineticCompanionSettings;
    companion!: FloatingCompanion;
    audioCtx: AudioContext | null = null;

    async onload() {
        await this.loadSettings();

        // Initialize the VaporNote-style floating DOM background companion
        this.companion = new FloatingCompanion(this.app);
        this.companion.init();

        // 1. Command to prompt with active highlighted selection
        this.addCommand({
            id: 'kinetic-selection-prompt',
            name: 'Prompt with Selection',
            editorCallback: (editor: Editor) => {
                const selection = editor.getSelection().trim();
                if (!selection) {
                    new Notice("Please select some text to prompt with.");
                    return;
                }
                
                const rangeFrom = editor.getCursor('from');
                const rangeTo = editor.getCursor('to');

                const promptModal = new SelectionPromptModal(this.app, (instruction) => {
                    const compiledPrompt = instruction ? `${instruction}:\n\n${selection}` : selection;
                    this.companion.executeStreamSession(editor, compiledPrompt, selection, rangeFrom, rangeTo);
                });
                promptModal.open();
            }
        });

        // 2. Command to show, hide, or center the floating companion panel
        this.addCommand({
            id: 'toggle-companion-webview',
            name: 'Toggle Companion Webview',
            callback: () => {
                this.companion.toggleVisibility();
            }
        });

        // Ribbon icon opens and shows the floating companion panel
        this.addRibbonIcon("comment-discussion", "Open Companion View", () => {
            this.companion.show();
        });

        // 3. Register Editor Sparkle Visualizer
        this.registerEvent(
            this.app.workspace.on('editor-change', (editor: Editor) => {
                if (this.settings.enableSparkles) {
                    this.spawnCursorParticle(editor);
                }
            })
        );

        // 4. Register Heavy Slam Paste Listener
        this.registerEvent(
            this.app.workspace.on('editor-paste', (evt: ClipboardEvent, editor: Editor) => {
                if (this.settings.enableSlamPaste) {
                    this.triggerSlamEffect(editor);
                }
            })
        );

        this.addSettingTab(new KineticCompanionSettingTab(this.app, this));
    }

    async onunload() {
        if (this.audioCtx) {
            try {
                this.audioCtx.close();
            } catch(e) {}
        }
        if (this.companion) {
            this.companion.cleanup();
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playSlamStamp() {
        this.initAudio();
        if (!this.audioCtx) return;
        try {
            const now = this.audioCtx.currentTime;
            
            const lowOsc = this.audioCtx.createOscillator();
            const lowGain = this.audioCtx.createGain();
            lowOsc.type = 'sawtooth';
            lowOsc.frequency.setValueAtTime(90, now);
            lowOsc.frequency.linearRampToValueAtTime(30, now + 0.15);
            lowGain.gain.setValueAtTime(0.4, now);
            lowGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            lowOsc.connect(lowGain);
            lowGain.connect(this.audioCtx.destination);
            lowOsc.start(now);
            lowOsc.stop(now + 0.16);

            const clickOsc = this.audioCtx.createOscillator();
            const clickGain = this.audioCtx.createGain();
            clickOsc.type = 'triangle';
            clickOsc.frequency.setValueAtTime(600, now);
            clickOsc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
            clickGain.gain.setValueAtTime(0.2, now);
            clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            clickOsc.connect(clickGain);
            clickGain.connect(this.audioCtx.destination);
            clickOsc.start(now);
            clickOsc.stop(now + 0.06);
        } catch(e) {}
    }

    spawnCursorParticle(editor: Editor) {
        try {
            const cursor = editor.getCursor();
            const coords = (editor as any).coordsAtPos(cursor);
            if (coords) {
                const particle = document.createElement("div");
                particle.className = "kc-cursor-particle";
                
                const offsetX = (Math.random() - 0.5) * 8;
                const offsetY = (Math.random() - 0.5) * 4;
                
                particle.style.left = `${coords.left + offsetX}px`;
                particle.style.top = `${coords.top + offsetY}px`;
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 400);
            }
        } catch (e) {
            // Fail silently
        }
    }

    triggerSlamEffect(editor: Editor) {
        try {
            this.playSlamStamp();
            
            const cursor = editor.getCursor();
            const coords = (editor as any).coordsAtPos(cursor);
            if (coords) {
                for (let i = 0; i < 4; i++) {
                    const dustLeft = document.createElement("div");
                    dustLeft.className = "kc-dust-particle kc-dust-left";
                    dustLeft.style.left = `${coords.left}px`;
                    dustLeft.style.top = `${coords.top + (Math.random() - 0.5) * 8}px`;
                    document.body.appendChild(dustLeft);

                    const dustRight = document.createElement("div");
                    dustRight.className = "kc-dust-particle kc-dust-right";
                    dustRight.style.left = `${coords.left}px`;
                    dustRight.style.top = `${coords.top + (Math.random() - 0.5) * 8}px`;
                    document.body.appendChild(dustRight);

                    setTimeout(() => {
                        dustLeft.remove();
                        dustRight.remove();
                    }, 300);
                }

                const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (activeView) {
                    const el = activeView.containerEl;
                    el.classList.add("kc-shaking");
                    setTimeout(() => {
                        el.classList.remove("kc-shaking");
                    }, 150);
                }
            }
        } catch (e) {
            // Fail silently
        }
    }
}

// ── SETTINGS TAB CLASS ─────────────────────────────────────────────────
class KineticCompanionSettingTab extends PluginSettingTab {
    plugin: KineticCompanionPlugin;

    constructor(app: App, plugin: KineticCompanionPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Kinetic Companion Settings' });

        new Setting(containerEl)
            .setName('Typing Caret Sparkles')
            .setDesc('Toggle ON to spawn beautiful glowing kinetic sparkles behind your cursor as you type.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSparkles)
                .onChange(async (value) => {
                    this.plugin.settings.enableSparkles = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Heavy Slam Paste Effect')
            .setDesc('Toggle ON to trigger a satisfying, tactile stamp thud, screen shake, and dust particles whenever you paste text.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSlamPaste)
                .onChange(async (value) => {
                    this.plugin.settings.enableSlamPaste = value;
                    await this.plugin.saveSettings();
                }));
    }
}
```
## V7
- Works pretty well. Changes I still want
	- Make it so it doesn't take 3 seconds to get the input back
	- Changing the ouput
### FloatingCompanion
```typescript
import { App, Editor, Notice, htmlToMarkdown, WorkspaceLeaf } from 'obsidian';

export class FloatingCompanion {
    private app: App;
    private container: HTMLDivElement | null = null;
    private leaf: WorkspaceLeaf | null = null;
    private webview: any = null;
    
    private isVisible = false;
    private isMinimized = false;
    private opacityValue = '0.95';
    
    // Drag/position states
    private isDragging = false;
    private dragStartX = 0;
    private dragStartY = 0;
    private containerStartX = 0;
    private containerStartY = 0;
    private dragOverlay: HTMLDivElement | null = null;
    
    // Active prompt session states
    private activeEditor: Editor | null = null;
    private streamStartPos: { line: number; ch: number } | null = null;
    private streamEndPos: { line: number; ch: number } | null = null;
    
    // Default position states
    private savedWidth = '380px';
    private savedHeight = '500px';
    private savedLeft = '100px';
    private savedTop = '100px';

    constructor(app: App) {
        this.app = app;
    }

    public async init() {
        const doc = document;
        
        // 1. Create a local floating container element
        const container = doc.createElement('div');
        container.classList.add('kc-floating-container');
        this.container = container; // Assigned to the class property so downstream methods can access it
        this.styleContainerOffscreen();
        
        // 2. Build the top bar controls (drag bar, minimize, close/hide, opacity slider)
        this.buildChrome();
        
        // 3. Create a local native Obsidian leaf
        const leaf = new (WorkspaceLeaf as any)(this.app);
        this.leaf = leaf;
        this.neutralizeLeaf(leaf);
        
        // Call setViewState directly on the local non-null leaf variable to resolve TS2531
        await leaf.setViewState({
            type: 'webviewer',
            state: {
                url: 'https://aistudio.google.com/',
                navigate: true
            },
            active: true
        });

        // Style the leaf container to cleanly fill our floating frame
        Object.assign(leaf.containerEl.style, {
            flex: '1',
            minHeight: '0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        });

        // Append the native leaf container to our floating container
        container.appendChild(leaf.containerEl);
        doc.body.appendChild(container);
        
        // 4. Locates the loaded webview element inside the Obsidian leaf
        const webviewEl = await this.getReadyWebview();
        if (webviewEl) {
            this.webview = webviewEl;
            this.setupConsoleMessageInterceptor();
            console.log("Obsidian KC: Native webview is ready and hooked.");
        } else {
            console.error("Obsidian KC: Native webview could not be located inside the leaf.");
        }
    }

    public cleanup() {
        if (this.leaf) {
            try {
                // Force-allow standard layout detachment during unload
                (this.leaf as any)._allowDetach = true;
                this.leaf.detach();
            } catch (_) {}
            this.leaf = null;
        }
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
        this.webview = null;
        this.activeEditor = null;
        this.streamStartPos = null;
        this.streamEndPos = null;
    }

    public toggleVisibility() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    public show() {
        if (!this.container) return;
        this.styleContainerOnscreen();
    }

    public hide() {
        if (!this.container) return;
        this.styleContainerOffscreen();
    }

    private toggleMinimize() {
        if (!this.container || !this.leaf) return;
        this.isMinimized = !this.isMinimized;
        
        if (this.isMinimized) {
            const r = this.container.getBoundingClientRect();
            this.savedWidth = r.width + 'px';
            this.savedHeight = r.height + 'px';
            
            this.container.style.height = '36px';
            (this.leaf as any).containerEl.style.display = 'none';
        } else {
            this.container.style.height = this.savedHeight;
            (this.leaf as any).containerEl.style.display = 'flex';
        }
    }

    private styleContainerOffscreen() {
        if (!this.container) return;
        Object.assign(this.container.style, {
            position: 'fixed',
            top: '0px',
            left: '0px',
            width: '380px',
            height: '500px',
            opacity: '0.005',       // Non-zero opacity forces Chrome to keep the layout active
            pointerEvents: 'none',  // Non-interactive (mouse clicks pass through completely)
            zIndex: '9999',         // Brought to the front so Chrome never flags it as occluded
            background: 'transparent',
            border: 'none',
            borderRadius: '0px',
            boxShadow: 'none',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        });
        this.isVisible = false;
    }

    private styleContainerOnscreen() {
        if (!this.container) return;
        Object.assign(this.container.style, {
            position: 'fixed',
            top: this.savedTop,
            left: this.savedLeft,
            width: this.isMinimized ? '380px' : this.savedWidth,
            height: this.isMinimized ? '36px' : this.savedHeight,
            right: 'auto',
            bottom: 'auto',
            opacity: this.opacityValue,
            pointerEvents: 'auto',   // Restored mouse interactions
            zIndex: '9999',         // Brought to the foreground
            background: 'var(--background-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        });
        this.isVisible = true;
    }

    private buildChrome() {
        if (!this.container) return;
        const doc = document;
        
        const dragBar = doc.createElement('div');
        dragBar.style.cssText = `
            background: var(--background-secondary);
            padding: 8px 12px; cursor: move; font-size: 11px; font-weight: bold;
            color: var(--text-muted); border-bottom: 1px solid var(--border-color);
            display: flex; justify-content: space-between; align-items: center;
            user-select: none; flex-shrink: 0; height: 36px; box-sizing: border-box;
        `;
        
        const titleSpan = doc.createElement('span');
        titleSpan.textContent = "Kinetic Companion (Google AI Studio)";
        dragBar.appendChild(titleSpan);
        
        const controls = doc.createElement('div');
        controls.style.cssText = `display: flex; align-items: center; gap: 8px; margin-left: auto;`;
        
        // Opacity Slider
        const sliderLabel = doc.createElement('span');
        sliderLabel.textContent = "☀";
        sliderLabel.title = "Opacity";
        sliderLabel.style.cssText = "font-size: 10px; opacity: 0.7;";
        controls.appendChild(sliderLabel);
        
        const opacitySlider = doc.createElement('input');
        opacitySlider.type = 'range';
        opacitySlider.min = '0.2';
        opacitySlider.max = '1.0';
        opacitySlider.step = '0.05';
        opacitySlider.value = this.opacityValue;
        opacitySlider.style.cssText = `
            width: 50px; height: 3px; cursor: pointer; margin: 0; accent-color: var(--interactive-accent);
        `;
        opacitySlider.addEventListener('input', (e: any) => {
            this.opacityValue = e.target.value;
            if (this.container && this.isVisible) {
                this.container.style.opacity = this.opacityValue;
            }
        });
        controls.appendChild(opacitySlider);
        
        // Minimize Button
        const minimizeBtn = doc.createElement('span');
        minimizeBtn.textContent = '−';
        minimizeBtn.title = "Minimize";
        minimizeBtn.style.cssText = `cursor: pointer; padding: 0 4px; font-weight: bold; font-size: 12px;`;
        minimizeBtn.addEventListener('click', () => this.toggleMinimize());
        controls.appendChild(minimizeBtn);
        
        // Hide Button
        const closeBtn = doc.createElement('span');
        closeBtn.textContent = '✕';
        closeBtn.title = "Hide";
        closeBtn.style.cssText = `cursor: pointer; padding: 0 4px; font-size: 11px;`;
        closeBtn.addEventListener('click', () => this.hide());
        controls.appendChild(closeBtn);
        
        dragBar.appendChild(controls);
        this.container.appendChild(dragBar);
        
        // Window drag handlers
        dragBar.addEventListener('mousedown', (e: MouseEvent) => {
            if (e.target === closeBtn || e.target === minimizeBtn || e.target === opacitySlider) return;
            this.isDragging = true;
            this.dragStartX = e.clientX;
            this.dragStartY = e.clientY;
            
            if (this.container) {
                const r = this.container.getBoundingClientRect();
                this.containerStartX = r.left;
                this.containerStartY = r.top;
            }
            
            e.preventDefault();
            this.showDragOverlay();
        });
        
        doc.addEventListener('mousemove', (e: MouseEvent) => {
            if (!this.isDragging || !this.container) return;
            // Updated to use dragStartX and dragStartY instead of local out-of-scope variables
            const newLeft = this.containerStartX + (e.clientX - this.dragStartX);
            const newTop = this.containerStartY + (e.clientY - this.dragStartY);
            
            this.container.style.left = `${newLeft}px`;
            this.container.style.top = `${newTop}px`;
            this.container.style.right = 'auto';
            
            this.savedLeft = `${newLeft}px`;
            this.savedTop = `${newTop}px`;
        });
        
        doc.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.removeDragOverlay();
            }
        });
    }

    private showDragOverlay() {
        if (this.dragOverlay) return;
        const doc = document;
        this.dragOverlay = doc.createElement('div');
        this.dragOverlay.style.cssText = 'position: fixed; inset: 0; z-index: 999999; background: transparent; cursor: move;';
        doc.body.appendChild(this.dragOverlay);
        
        if (this.webview) {
            this.webview.style.pointerEvents = 'none';
        }
    }

    private removeDragOverlay() {
        if (this.dragOverlay) {
            this.dragOverlay.remove();
            this.dragOverlay = null;
        }
        if (this.webview) {
            this.webview.style.pointerEvents = '';
        }
    }

    private neutralizeLeaf(leaf: any) {
        if (leaf && leaf.containerEl) {
            leaf.containerEl.setAttribute('tabindex', '-1');
            leaf.containerEl.style.outline = 'none';
        }

        const noopContainer = {
            requestFocus: () => {},
            focus:        () => {},
            get win() { return window; },
            get doc() { return document; },
            containerEl:  leaf.containerEl,
        };

        const safeContainerEl = {
            addClass:        () => {},
            removeClass:     () => {},
            toggleClass:     () => {},
            hasClass:        () => false,
            setAttribute:    () => {},
            removeAttribute: () => {},
            classList:       { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
            style:           {},
            dataset:         {},
        };

        const fakeRoot = {
            get win() { return window; },
            get doc() { return document; },
            containerEl:     safeContainerEl,
            getRoot:         () => fakeRoot,
            isAttached:      () => true,
            recomputeLayout: () => {},
            updateLayout:    () => {},
            type: 'root',
        };

        const fakeParent = {
            get win() { return window; },
            get doc() { return document; },
            getContainer:    () => noopContainer,
            containerEl:     safeContainerEl,
            children:        [leaf],
            type:            'split',
            getRoot:         () => fakeRoot,
            isAttached:      () => true,
            recomputeLayout: () => {},
            updateLayout:    () => {},
        };

        if (!leaf.parent) {
            leaf.parent = fakeParent;
        }
    }

    private async getReadyWebview(): Promise<any> {
        const leaf = this.leaf;
        if (!leaf) return null;
        
        return new Promise<any>((resolve) => {
            const el = (leaf as any).containerEl.querySelector("webview");
            if (el) {
                resolve(el);
                return;
            }
            const observer = new MutationObserver(() => {
                const el = (leaf as any).containerEl.querySelector("webview");
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe((leaf as any).containerEl, { childList: true, subtree: true });
            
            setTimeout(() => {
                observer.disconnect();
                resolve((leaf as any).containerEl.querySelector("webview"));
            }, 5000);
        });
    }

    private setupConsoleMessageInterceptor() {
        if (!this.webview) return;
        this.webview.addEventListener('console-message', (event: any) => {
            const message = event.message as string;
            console.log("[WebView Guest]", message);

            if (message && message.startsWith("gemini-stream-chunk::")) {
                const encodedHTML = message.substring("gemini-stream-chunk::".length);
                try {
                    const decodedHTML = decodeURIComponent(encodedHTML);
                    this.handleStreamChunk(decodedHTML);
                } catch (e) {
                    console.error("Obsidian KC: Parsing received HTML stream chunk failed:", e);
                }
            }
        });
    }

    public async executeStreamSession(editor: Editor, promptContent: string, rangeFrom: { line: number; ch: number }, rangeTo: { line: number; ch: number }) {
        console.log("Obsidian KC: Starting executeStreamSession.");
        
        if (!this.webview) {
            new Notice("Companion Webview is not ready.");
            return;
        }

        // Programmatically focus the webview tag prior to execution to assert viewport active states
        try {
            this.webview.focus();
        } catch (_) {}

        this.activeEditor = editor;
        
        const headerText = `\n\n${promptContent}\n\n### 🎯 Paced Outline:\n(Loading response...)`;
        editor.replaceRange(headerText, rangeFrom, rangeTo);

        const newlineCount = (headerText.match(/\n/g) || []).length;
        this.streamStartPos = {
            line: rangeFrom.line + newlineCount,
            ch: 0
        };
        this.streamEndPos = {
            line: rangeFrom.line + newlineCount,
            ch: "(Loading response...)".length
        };

        const escapedPrompt = JSON.stringify(promptContent);
        
        console.log("Obsidian KC: Crafting injection script payload.");
        const injectionCode = `
            (function() {
                // Spoof Page Visibility and Focus APIs to bypass background tab suspension
                try {
                    Object.defineProperty(document, 'visibilityState', { get: function() { return 'visible'; }, configurable: true });
                    Object.defineProperty(document, 'hidden', { get: function() { return false; }, configurable: true });
                    Object.defineProperty(document, 'webkitVisibilityState', { get: function() { return 'visible'; }, configurable: true });
                    Object.defineProperty(document, 'webkitHidden', { get: function() { return false; }, configurable: true });
                    
                    document.dispatchEvent(new Event('visibilitychange'));
                    document.dispatchEvent(new Event('webkitvisibilitychange'));
                    
                    window.dispatchEvent(new Event('focus'));
                    document.dispatchEvent(new Event('focus'));
                    console.log("KC Debug: Injected background visibility and focus spoofs.");
                } catch (visibilityErr) {
                    console.warn("KC Debug: Visibility spoofing failed:", visibilityErr);
                }

                const promptText = ${escapedPrompt};
                console.log("KC Debug: Guest automation process initiated.");

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

                function checkErrorOrRateLimit() {
                    const errorSelectors = 'ms-alert, .error-message, .error, mat-snack-bar-container, .mat-mdc-snack-bar-container, .snack-bar, ms-chat-turn.error, .error-container, ms-toast';
                    const errorNodes = queryShadowSelectorAll(errorSelectors);
                    
                    for (let i = 0; i < errorNodes.length; i++) {
                        const el = errorNodes[i];
                        const text = (el.textContent || "").toLowerCase();
                        if (text.includes("rate limit") || text.includes("too many requests") || text.includes("try again later") || text.includes("resource has been exhausted") || text.includes("quota")) {
                            return el.textContent.trim();
                        }
                    }
                    
                    const textElements = queryShadowSelectorAll('div, span, p');
                    for (let i = 0; i < textElements.length; i++) {
                        const el = textElements[i];
                        if (el.children.length === 0) {
                            const text = (el.textContent || "").toLowerCase();
                            if ((text.includes("rate limit") && text.includes("later")) || text.includes("quota exceeded") || text.includes("resource exhausted")) {
                                return el.textContent.trim();
                            }
                        }
                    }
                    return null;
                }

                let fillRetries = 0;
                function findAndFillInput() {
                    console.log("KC Debug: Querying main input text field... (Attempt: " + (fillRetries + 1) + ")");
                    const inputEl = queryShadowSelector('ms-prompt-box textarea, ms-prompt-box ms-autosize-textarea textarea, textarea[aria-label="Type something"], textarea[aria-label="Enter a prompt"], textarea, div[contenteditable="true"], [role="textbox"]');
                    if (inputEl) {
                        console.log("KC Debug: Target input located successfully:", inputEl);
                        const initialTurnCount = queryShadowSelectorAll('ms-chat-turn').length;
                        console.log("KC Debug: Initial history chat turn count:", initialTurnCount);

                        if (inputEl.tagName === 'DIV') {
                            inputEl.textContent = promptText;
                        } else {
                            inputEl.value = promptText;
                        }
                        inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                        inputEl.dispatchEvent(new Event('change', { bubbles: true }));

                        setTimeout(() => {
                            let parent = inputEl.parentElement;
                            let runButton = null;
                            
                            while (parent && !runButton) {
                                runButton = parent.querySelector('ms-prompt-box ms-run-button button[aria-label="Run"], ms-prompt-box button[aria-label="Run"][type="submit"], button.run-button, button[aria-label="Run"], button[aria-label="Run prompt"], ms-run-button button[type="submit"].run-button');
                                if (!runButton) {
                                    const containerButtons = parent.querySelectorAll('button');
                                    for (let i = 0; i < containerButtons.length; i++) {
                                        const btn = containerButtons[i];
                                        const text = (btn.textContent || '').trim();
                                        if (text.startsWith('Run') || btn.classList.contains('run-button')) {
                                            runButton = btn;
                                            break;
                                        }
                                    }
                                }
                                if (parent.tagName === 'BODY') {
                                    break;
                                }
                                parent = parent.parentElement;
                            }

                            if (runButton) {
                                console.log("KC Debug: Executing robust click cycle on run button:", runButton);
                                runButton.focus();
                                runButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
                                runButton.dispatchEvent(new Event('change', { bubbles: true }));
                                runButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
                                runButton.click();
                            } else {
                                console.log("KC Debug: Run button absent. Dispatching Ctrl+Enter KeyboardEvent fallback.");
                                const enterEvent = new KeyboardEvent('keydown', {
                                    key: 'Enter', code: 'Enter', keyCode: 13, ctrlKey: true, metaKey: true, bubbles: true, cancelable: true
                                });
                                inputEl.dispatchEvent(enterEvent);
                            }
                            waitForCompletionAndExtract(initialTurnCount);
                        }, 250);
                    } else {
                        fillRetries++;
                        if (fillRetries < 40) {
                            setTimeout(findAndFillInput, 500);
                        } else {
                            console.error("KC Debug: Could not locate active input element context.");
                            console.log("gemini-stream-chunk::" + encodeURIComponent("Error: Prompt field absent. Please click the Ribbon Icon to open the Companion Webview and ensure you are logged in."));
                        }
                    }
                }

                function waitForCompletionAndExtract(initialCount) {
                    console.log("KC Debug: Initiating content-stability polling tracker.");
                    let checkCount = 0;
                    const maxChecks = 180; // 90 seconds timeout
                    let generationStarted = false;
                    let previousText = "";
                    let unchangedCount = 0;
                    const stabilityThreshold = 6; // 3 seconds of absolute stability (6 ticks * 500ms)

                    const pollInterval = setInterval(() => {
                        checkCount++;

                        // Scan for active rate limit or server error containers
                        const rateLimitError = checkErrorOrRateLimit();
                        if (rateLimitError) {
                            clearInterval(pollInterval);
                            console.error("KC Debug: Google AI Studio error detected: " + rateLimitError);
                            console.log("gemini-stream-chunk::" + encodeURIComponent("Error: " + rateLimitError));
                            return;
                        }

                        const turns = queryShadowSelectorAll('ms-chat-turn');
                        let latestText = "";
                        let modelContainer = null;
                        
                        for (let i = turns.length - 1; i >= initialCount; i--) {
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

                        if (latestText && latestText.trim().length > 0) {
                            if (!generationStarted) {
                                generationStarted = true;
                                console.log("KC Debug: Generation started. Content detected length: " + latestText.length);
                            }

                            if (latestText === previousText) {
                                unchangedCount++;
                                console.log("KC Debug: Content unchanged count: " + unchangedCount + "/" + stabilityThreshold);
                            } else {
                                unchangedCount = 0;
                                previousText = latestText;
                                console.log("KC Debug: Content updated. New length: " + latestText.length);
                            }
                        } else {
                            console.log("KC Debug: Waiting for model turn or text... (" + checkCount + ")");
                        }

                        if ((generationStarted && unchangedCount >= stabilityThreshold) || (checkCount > maxChecks)) {
                            clearInterval(pollInterval);
                            console.log("KC Debug: Content stable. Executing final extraction...");
                            extractFinalResponse(initialCount);
                        }
                    }, 500);
                }

                function extractFinalResponse(initialCount) {
                    const turns = queryShadowSelectorAll('ms-chat-turn');
                    console.log("KC Debug: Finalizing extraction. Detected chat turns count: " + turns.length);

                    let modelContainer = null;
                    for (let i = turns.length - 1; i >= initialCount; i--) {
                        const turn = turns[i];
                        const container = queryShadowSelector('.chat-turn-container.model', turn);
                        if (container) {
                            modelContainer = container;
                            break;
                        }
                    }

                    if (!modelContainer) {
                        console.error("KC Debug: Active model turn element missing from workspace layout.");
                        return;
                    }

                    const cmarkEls = queryShadowSelectorAll('ms-cmark-node, .model-content, .markdown', modelContainer);
                    
                    const isInsideThinking = (node) => {
                        while (node) {
                            const tag = node.tagName || "";
                            if (tag === 'MS-THOUGHT-CHUNK' || 
                                tag === 'MODEL-THOUGHTS' || 
                                (node.classList && (
                                    node.classList.contains('thinking') || 
                                    node.classList.contains('thought-container')
                                ))) {
                                    return true;
                                }
                                node = node.parentNode || node.host;
                            }
                            return false;
                        };

                    const nonThinkingEls = cmarkEls.filter(el => !isInsideThinking(el));

                    const uniqueEls = nonThinkingEls.filter(el => {
                        return !nonThinkingEls.some(otherEl => otherEl !== el && otherEl.contains(el));
                    });

                    let combinedHTML = "";
                    for (let j = 0; j < uniqueEls.length; j++) {
                        const el = uniqueEls[j];
                        const clone = el.cloneNode(true);
                        
                        // Process Math Blocks
                        const mathBlocks = clone.querySelectorAll('ms-math-block, math-block');
                        mathBlocks.forEach(block => {
                            const rawTex = block.text || block.math || block.getAttribute('math') || block.getAttribute('value') || "";
                            if (rawTex && block.parentNode) {
                                const replacement = document.createTextNode("\\n\\n$$" + rawTex + "$$\\n\\n");
                                block.parentNode.replaceChild(replacement, block);
                            }
                        });

                        // Process Math Inlines
                        const mathInlines = clone.querySelectorAll('ms-math-inline, math-inline, span.math');
                        mathInlines.forEach(inline => {
                            const rawTex = inline.text || inline.math || inline.getAttribute('math') || inline.getAttribute('value') || "";
                            if (rawTex && inline.parentNode) {
                                const replacement = document.createTextNode(" $" + rawTex + "$ ");
                                inline.parentNode.replaceChild(replacement, inline);
                            } else if (inline.parentNode) {
                                const script = inline.querySelector('script[type="math/tex"]');
                                if (script && script.textContent) {
                                    const replacement = document.createTextNode(" $" + script.textContent + "$ ");
                                    inline.parentNode.replaceChild(replacement, inline);
                                }
                            }
                        });

                        // Process Modern KaTeX Elements
                        const katexElements = clone.querySelectorAll('ms-katex, .math-block, .math-inline, .katex');
                        katexElements.forEach(mathEl => {
                            let latexSource = mathEl.text || mathEl.math || mathEl.getAttribute('text') || mathEl.getAttribute('math') || "";
                            
                            if (!latexSource) {
                                const annotation = mathEl.querySelector('annotation[encoding="application/x-tex"]');
                                if (annotation) {
                                    latexSource = annotation.textContent || "";
                                }
                            }
                            
                            if (latexSource && mathEl.parentNode) {
                                const isInline = mathEl.classList.contains('inline') || mathEl.classList.contains('math-inline') || mathEl.tagName === 'SPAN';
                                const replacementText = isInline ? " $" + latexSource.trim() + "$ " : "\\n\\n$$" + latexSource.trim() + "$$\\n\\n";
                                const replacement = document.createTextNode(replacementText);
                                mathEl.parentNode.replaceChild(replacement, mathEl);
                            }
                        });

                        combinedHTML += clone.innerHTML + "\\n";
                    }
                    
                    if (combinedHTML) {
                        console.log("KC Debug: Sending completed static payload to Obsidian (" + combinedHTML.length + " characters).");
                        console.log("gemini-stream-chunk::" + encodeURIComponent("html-payload::" + combinedHTML));
                    } else {
                        console.warn("KC Debug: Response content list resolved to empty HTML structure.");
                    }
                }

                findAndFillInput();
            })();
        `;
        
        console.log("Obsidian KC: Sending executeJavaScript query to webview.");
        this.webview.executeJavaScript(injectionCode)
            .then(() => console.log("Obsidian KC: executeJavaScript injection success."))
            .catch((err: any) => console.error("Obsidian KC: executeJavaScript injection failed:", err));
    }

    private handleStreamChunk(htmlContent: string) {
        if (!this.activeEditor || !this.streamStartPos || !this.streamEndPos) return;

        const startPos = this.streamStartPos;
        const endPos = this.streamEndPos;

        let fullMarkdown = "";

        if (htmlContent.startsWith("html-payload::")) {
            const content = htmlContent.substring("html-payload::".length);
            fullMarkdown = htmlToMarkdown(content);
        } else {
            fullMarkdown = htmlContent;
        }

        fullMarkdown = fullMarkdown
            .split("\n")
            .map(line => line.trimEnd())
            .join("\n");

        fullMarkdown = fullMarkdown.replace(/\n{3,}/g, "\n\n");
        fullMarkdown = fullMarkdown.replace(/\n\s*\n\s*([-*+]\s|\d+\.\s)/g, "\n$1");

        this.activeEditor.replaceRange(fullMarkdown, startPos, endPos);

        this.streamStartPos = null;
        this.streamEndPos = null;
        this.activeEditor = null;

        new Notice("✅ Gemini response inserted.");
    }
}
```

### Main
```typescript
import { App, Editor, Modal, Notice, Plugin, PluginSettingTab, Setting, MarkdownView } from 'obsidian';
import { FloatingCompanion } from './FloatingCompanion';

// ── CONFIGURATION & CONSTANTS ──────────────────────────────────────────
interface KineticCompanionSettings {
    enableSparkles: boolean;
    enableSlamPaste: boolean;
}

const DEFAULT_SETTINGS: KineticCompanionSettings = {
    enableSparkles: true,
    enableSlamPaste: true
};

// ── CUSTOM INLINE SELECTION PROMPT MODAL ────────────────────────────────
class SelectionPromptModal extends Modal {
    onSubmit: (instruction: string) => void;
    inputEl!: HTMLInputElement;

    constructor(app: App, onSubmit: (instruction: string) => void) {
        super(app);
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h3", { text: "Kinetic Prompt Selection" });
        
        const desc = contentEl.createEl("p", { text: "How should Gemma 4 update your highlighted selection? (Leave blank to submit raw selection)" });
        desc.style.cssText = "color: var(--text-muted); font-size: 0.85em; margin-top: 10px;";

        this.inputEl = contentEl.createEl("input", { type: "text" });
        this.inputEl.style.width = "100%";
        this.inputEl.placeholder = "e.g., make it sound warmer, rewrite as bullet list...";
        
        setTimeout(() => this.inputEl.focus(), 20);

        this.scope.register([], "Enter", (evt) => {
            evt.preventDefault();
            this.submit();
        });
    }

    submit() {
        const value = this.inputEl.value.trim();
        // Pass the value directly—even if empty—to support raw selection submissions
        this.onSubmit(value);
        this.close();
    }

    onClose() {
        this.contentEl.empty();
    }
}

// ── CORE PLUGIN IMPLEMENTATION ──────────────────────────────────────────
export default class KineticCompanionPlugin extends Plugin {
    settings!: KineticCompanionSettings;
    companion!: FloatingCompanion;
    audioCtx: AudioContext | null = null;

    async onload() {
        await this.loadSettings();

        // Initialize the VaporNote-style floating DOM background companion
        this.companion = new FloatingCompanion(this.app);
        this.companion.init();

        // 1. Command to prompt with active highlighted selection
        this.addCommand({
            id: 'kinetic-selection-prompt',
            name: 'Prompt with Selection',
            editorCallback: (editor: Editor) => {
                const selection = editor.getSelection().trim();
                if (!selection) {
                    new Notice("Please select some text to prompt with.");
                    return;
                }
                
                const rangeFrom = editor.getCursor('from');
                const rangeTo = editor.getCursor('to');

                const promptModal = new SelectionPromptModal(this.app, (instruction) => {
                    const compiledPrompt = instruction ? `${instruction}:\n\n${selection}` : selection;
                    this.companion.executeStreamSession(editor, compiledPrompt, rangeFrom, rangeTo);
                });
                promptModal.open();
            }
        });

        // 2. Command to show, hide, or center the floating companion panel
        this.addCommand({
            id: 'toggle-companion-webview',
            name: 'Toggle Companion Webview',
            callback: () => {
                this.companion.toggleVisibility();
            }
        });

        // Ribbon icon opens and shows the floating companion panel
        this.addRibbonIcon("comment-discussion", "Open Companion View", () => {
            this.companion.show();
        });

        // 3. Register Editor Sparkle Visualizer
        this.registerEvent(
            this.app.workspace.on('editor-change', (editor: Editor) => {
                if (this.settings.enableSparkles) {
                    this.spawnCursorParticle(editor);
                }
            })
        );

        // 4. Register Heavy Slam Paste Listener
        this.registerEvent(
            this.app.workspace.on('editor-paste', (evt: ClipboardEvent, editor: Editor) => {
                if (this.settings.enableSlamPaste) {
                    this.triggerSlamEffect(editor);
                }
            })
        );

        this.addSettingTab(new KineticCompanionSettingTab(this.app, this));
    }

    async onunload() {
        if (this.audioCtx) {
            try {
                this.audioCtx.close();
            } catch(e) {}
        }
        if (this.companion) {
            this.companion.cleanup();
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playSlamStamp() {
        this.initAudio();
        if (!this.audioCtx) return;
        try {
            const now = this.audioCtx.currentTime;
            
            const lowOsc = this.audioCtx.createOscillator();
            const lowGain = this.audioCtx.createGain();
            lowOsc.type = 'sawtooth';
            lowOsc.frequency.setValueAtTime(90, now);
            lowOsc.frequency.linearRampToValueAtTime(30, now + 0.15);
            lowGain.gain.setValueAtTime(0.4, now);
            lowGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            lowOsc.connect(lowGain);
            lowGain.connect(this.audioCtx.destination);
            lowOsc.start(now);
            lowOsc.stop(now + 0.16);

            const clickOsc = this.audioCtx.createOscillator();
            const clickGain = this.audioCtx.createGain();
            clickOsc.type = 'triangle';
            clickOsc.frequency.setValueAtTime(600, now);
            clickOsc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
            clickGain.gain.setValueAtTime(0.2, now);
            clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            clickOsc.connect(clickGain);
            clickGain.connect(this.audioCtx.destination);
            clickOsc.start(now);
            clickOsc.stop(now + 0.06);
        } catch(e) {}
    }

    spawnCursorParticle(editor: Editor) {
        try {
            const cursor = editor.getCursor();
            const coords = (editor as any).coordsAtPos(cursor);
            if (coords) {
                const particle = document.createElement("div");
                particle.className = "kc-cursor-particle";
                
                const offsetX = (Math.random() - 0.5) * 8;
                const offsetY = (Math.random() - 0.5) * 4;
                
                particle.style.left = `${coords.left + offsetX}px`;
                particle.style.top = `${coords.top + offsetY}px`;
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 400);
            }
        } catch (e) {
            // Fail silently
        }
    }

    triggerSlamEffect(editor: Editor) {
        try {
            this.playSlamStamp();
            
            const cursor = editor.getCursor();
            const coords = (editor as any).coordsAtPos(cursor);
            if (coords) {
                for (let i = 0; i < 4; i++) {
                    const dustLeft = document.createElement("div");
                    dustLeft.className = "kc-dust-particle kc-dust-left";
                    dustLeft.style.left = `${coords.left}px`;
                    dustLeft.style.top = `${coords.top + (Math.random() - 0.5) * 8}px`;
                    document.body.appendChild(dustLeft);

                    const dustRight = document.createElement("div");
                    dustRight.className = "kc-dust-particle kc-dust-right";
                    dustRight.style.left = `${coords.left}px`;
                    dustRight.style.top = `${coords.top + (Math.random() - 0.5) * 8}px`;
                    document.body.appendChild(dustRight);

                    setTimeout(() => {
                        dustLeft.remove();
                        dustRight.remove();
                    }, 300);
                }

                const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (activeView) {
                    const el = activeView.containerEl;
                    el.classList.add("kc-shaking");
                    setTimeout(() => {
                        el.classList.remove("kc-shaking");
                    }, 150);
                }
            }
        } catch (e) {
            // Fail silently
        }
    }
}

// ── SETTINGS TAB CLASS ─────────────────────────────────────────────────
class KineticCompanionSettingTab extends PluginSettingTab {
    plugin: KineticCompanionPlugin;

    constructor(app: App, plugin: KineticCompanionPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Kinetic Companion Settings' });

        new Setting(containerEl)
            .setName('Typing Caret Sparkles')
            .setDesc('Toggle ON to spawn beautiful glowing kinetic sparkles behind your cursor as you type.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSparkles)
                .onChange(async (value) => {
                    this.plugin.settings.enableSparkles = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Heavy Slam Paste Effect')
            .setDesc('Toggle ON to trigger a satisfying, tactile stamp thud, screen shake, and dust particles whenever you paste text.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSlamPaste)
                .onChange(async (value) => {
                    this.plugin.settings.enableSlamPaste = value;
                    await this.plugin.saveSettings();
                }));
    }
}
```
## V6
- Injects prompt properly, but it seems like the code isn't actually returned unless the view is active.
```typescript
import { App, Editor, Modal, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf, MarkdownView, htmlToMarkdown } from 'obsidian';

// ── CONFIGURATION & CONSTANTS ──────────────────────────────────────────
interface KineticCompanionSettings {
    enableSparkles: boolean;
    enableSlamPaste: boolean;
}

const DEFAULT_SETTINGS: KineticCompanionSettings = {
    enableSparkles: true,
    enableSlamPaste: true
};

// ── CUSTOM INLINE SELECTION PROMPT MODAL ────────────────────────────────
class SelectionPromptModal extends Modal {
    onSubmit: (instruction: string) => void;
    inputEl!: HTMLInputElement;

    constructor(app: App, onSubmit: (instruction: string) => void) {
        super(app);
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h3", { text: "Kinetic Prompt Selection" });
        
        const desc = contentEl.createEl("p", { text: "How should Gemma 4 update your highlighted selection?" });
        desc.style.cssText = "color: var(--text-muted); font-size: 0.85em; margin-top: 10px;";

        this.inputEl = contentEl.createEl("input", { type: "text" });
        this.inputEl.style.width = "100%";
        this.inputEl.placeholder = "e.g., make it sound warmer, rewrite as bullet list...";
        
        setTimeout(() => this.inputEl.focus(), 20);

        this.scope.register([], "Enter", (evt) => {
            evt.preventDefault();
            this.submit();
        });
    }

    submit() {
        const value = this.inputEl.value.trim();
        if (value) {
            this.onSubmit(value);
        }
        this.close();
    }

    onClose() {
        this.contentEl.empty();
    }
}

// ── CORE PLUGIN IMPLEMENTATION ──────────────────────────────────────────
export default class KineticCompanionPlugin extends Plugin {
    settings!: KineticCompanionSettings;
    activeEditor: Editor | null = null;
    audioCtx: AudioContext | null = null;
    streamStartPos: { line: number; ch: number } | null = null;
    streamEndPos: { line: number; ch: number } | null = null;

    async onload() {
        await this.loadSettings();

        this.addCommand({
            id: 'kinetic-selection-prompt',
            name: 'Prompt with Selection',
            editorCallback: (editor: Editor) => {
                const selection = editor.getSelection().trim();
                if (!selection) {
                    new Notice("Please select some text to prompt with.");
                    return;
                }
                
                const rangeFrom = editor.getCursor('from');
                const rangeTo = editor.getCursor('to');

                const promptModal = new SelectionPromptModal(this.app, (instruction) => {
                    const compiledPrompt = `${instruction}:\n\n${selection}`;
                    this.executeStreamSession(editor, compiledPrompt, rangeFrom, rangeTo);
                });
                promptModal.open();
            }
        });

        this.addRibbonIcon("comment-discussion", "Open Companion View", () => {
            this.activateView(true); // Manually reveal the split when clicking the ribbon icon
        });

        this.registerEvent(
            this.app.workspace.on('editor-change', (editor: Editor) => {
                if (this.settings.enableSparkles) {
                    this.spawnCursorParticle(editor);
                }
            })
        );

        this.registerEvent(
            this.app.workspace.on('editor-paste', (evt: ClipboardEvent, editor: Editor) => {
                if (this.settings.enableSlamPaste) {
                    this.triggerSlamEffect(editor);
                }
            })
        );

        this.addSettingTab(new KineticCompanionSettingTab(this.app, this));
    }

    async onunload() {
        if (this.audioCtx) {
            try {
                this.audioCtx.close();
            } catch(e) {}
        }
        this.streamStartPos = null;
        this.streamEndPos = null;
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playSlamStamp() {
        this.initAudio();
        if (!this.audioCtx) return;
        try {
            const now = this.audioCtx.currentTime;
            
            const lowOsc = this.audioCtx.createOscillator();
            const lowGain = this.audioCtx.createGain();
            lowOsc.type = 'sawtooth';
            lowOsc.frequency.setValueAtTime(90, now);
            lowOsc.frequency.linearRampToValueAtTime(30, now + 0.15);
            lowGain.gain.setValueAtTime(0.4, now);
            lowGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            lowOsc.connect(lowGain);
            lowGain.connect(this.audioCtx.destination);
            lowOsc.start(now);
            lowOsc.stop(now + 0.16);

            const clickOsc = this.audioCtx.createOscillator();
            const clickGain = this.audioCtx.createGain();
            clickOsc.type = 'triangle';
            clickOsc.frequency.setValueAtTime(600, now);
            clickOsc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
            clickGain.gain.setValueAtTime(0.2, now);
            clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            clickOsc.connect(clickGain);
            clickGain.connect(this.audioCtx.destination);
            clickOsc.start(now);
            clickOsc.stop(now + 0.06);
        } catch(e) {}
    }

    spawnCursorParticle(editor: Editor) {
        try {
            const cursor = editor.getCursor();
            const coords = (editor as any).coordsAtPos(cursor);
            if (coords) {
                const particle = document.createElement("div");
                particle.className = "kc-cursor-particle";
                
                const offsetX = (Math.random() - 0.5) * 8;
                const offsetY = (Math.random() - 0.5) * 4;
                
                particle.style.left = `${coords.left + offsetX}px`;
                particle.style.top = `${coords.top + offsetY}px`;
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 400);
            }
        } catch (e) {
            // Fail silently
        }
    }

    triggerSlamEffect(editor: Editor) {
        try {
            this.playSlamStamp();
            
            const cursor = editor.getCursor();
            const coords = (editor as any).coordsAtPos(cursor);
            if (coords) {
                for (let i = 0; i < 4; i++) {
                    const dustLeft = document.createElement("div");
                    dustLeft.className = "kc-dust-particle kc-dust-left";
                    dustLeft.style.left = `${coords.left}px`;
                    dustLeft.style.top = `${coords.top + (Math.random() - 0.5) * 8}px`;
                    document.body.appendChild(dustLeft);

                    const dustRight = document.createElement("div");
                    dustRight.className = "kc-dust-particle kc-dust-right";
                    dustRight.style.left = `${coords.left}px`;
                    dustRight.style.top = `${coords.top + (Math.random() - 0.5) * 8}px`;
                    document.body.appendChild(dustRight);

                    setTimeout(() => {
                        dustLeft.remove();
                        dustRight.remove();
                    }, 300);
                }

                const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (activeView) {
                    const el = activeView.containerEl;
                    el.classList.add("kc-shaking");
                    setTimeout(() => {
                        el.classList.remove("kc-shaking");
                    }, 150);
                }
            }
        } catch (e) {
            // Fail silently
        }
    }

    async activateView(reveal: boolean = true): Promise<WorkspaceLeaf | null> {
        const { workspace } = this.app;
        
        let leaf: WorkspaceLeaf | null | undefined = workspace.getLeavesOfType("webviewer").find(l => {
            const state = l.getViewState();
            const url = (state.state as any)?.url;
            const matchesUrl = typeof url === "string" && url.includes("aistudio.google.com");
            const inRightSidebar = l.getRoot() === workspace.rightSplit;
            return matchesUrl && inRightSidebar;
        });

        if (!leaf) {
            leaf = workspace.getRightLeaf(false);
            if (!leaf) {
                leaf = workspace.getLeaf('tab');
            }
            
            if (leaf) {
                await leaf.setViewState({
                    type: 'webviewer',
                    state: {
                        url: 'https://aistudio.google.com/',
                        navigate: true,
                    },
                    active: true,
                });
            }
        }
        
        if (leaf && reveal) {
            if (workspace.rightSplit.collapsed) {
                workspace.rightSplit.expand();
            }
            workspace.revealLeaf(leaf);
        }
        return leaf || null;
    }

    async getReadyWebviewElement(view: any): Promise<any> {
        const webview = await new Promise<any>((resolve) => {
            const el = view.containerEl.querySelector("webview");
            if (el) {
                resolve(el);
                return;
            }
            const observer = new MutationObserver(() => {
                const el = view.containerEl.querySelector("webview");
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe(view.containerEl, { childList: true, subtree: true });
            
            setTimeout(() => {
                observer.disconnect();
                resolve(view.containerEl.querySelector("webview"));
            }, 3000);
        });

        if (!webview) return null;

        await new Promise<void>((resolve) => {
            const isWebviewReady = () => {
                try {
                    webview.isLoading();
                    return true;
                } catch (e) {
                    return false;
                }
            };

            if (isWebviewReady()) {
                resolve();
                return;
            }

            const onDomReady = () => {
                webview.removeEventListener("dom-ready", onDomReady);
                resolve();
            };
            webview.addEventListener("dom-ready", onDomReady);

            setTimeout(() => {
                webview.removeEventListener("dom-ready", onDomReady);
                resolve();
            }, 5000);
        });

        return webview;
    }

    async waitForTargetPageLoad(webview: any): Promise<void> {
        return new Promise<void>((resolve) => {
            const checkUrlAndLoad = () => {
                const currentUrl = webview.getURL() || "";
                const isCorrectSite = currentUrl.includes("aistudio.google.com");
                const isStillLoading = webview.isLoading();

                if (isCorrectSite && !isStillLoading) {
                    resolve();
                    return true;
                }
                return false;
            };

            if (checkUrlAndLoad()) return;

            const onStopLoading = () => {
                if (checkUrlAndLoad()) {
                    webview.removeEventListener("did-stop-loading", onStopLoading);
                }
            };
            webview.addEventListener("did-stop-loading", onStopLoading);

            const interval = setInterval(() => {
                if (checkUrlAndLoad()) {
                    clearInterval(interval);
                    webview.removeEventListener("did-stop-loading", onStopLoading);
                }
            }, 500);

            setTimeout(() => {
                clearInterval(interval);
                webview.removeEventListener("did-stop-loading", onStopLoading);
                resolve();
            }, 15000);
        });
    }

    async executeStreamSession(editor: Editor, promptContent: string, rangeFrom: { line: number; ch: number }, rangeTo: { line: number; ch: number }) {
        console.log("Obsidian KC: Starting executeStreamSession.");
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        const originalLeaf = activeView?.leaf;
        const originalCursor = editor.getCursor();

        console.log("Obsidian KC: Locating Web Viewer split (running background task).");
        // Pass false to run Web Viewer tasks silently in the background
        const webviewerLeaf = await this.activateView(false);
        if (!webviewerLeaf) {
            console.error("Obsidian KC: Web Viewer was not ready or enabled.");
            new Notice("Could not open the Web Viewer. Please ensure the 'Web Viewer' core plugin is enabled in Obsidian Settings.");
            return;
        }

        if (originalLeaf) {
            this.app.workspace.setActiveLeaf(originalLeaf, { focus: true });
            editor.setCursor(originalCursor);
        }

        const view = webviewerLeaf.view;
        console.log("Obsidian KC: Fetching ready webview context.");
        const webviewEl = await this.getReadyWebviewElement(view);
        if (!webviewEl) {
            console.error("Obsidian KC: Embedded webview element could not be found.");
            new Notice("Could not find the embedded webview element inside the Web Viewer.");
            return;
        }

        console.log("Obsidian KC: Verifying target page load state.");
        await this.waitForTargetPageLoad(webviewEl);
        console.log("Obsidian KC: Webview initialized and page loaded.");

        this.activeEditor = editor;
        
        const headerText = `\n\n${promptContent}\n\n### 🎯 Paced Outline:\n(Loading response...)`;
        editor.replaceRange(headerText, rangeFrom, rangeTo);

        const newlineCount = (headerText.match(/\n/g) || []).length;
        this.streamStartPos = {
            line: rangeFrom.line + newlineCount,
            ch: 0
        };
        this.streamEndPos = {
            line: rangeFrom.line + newlineCount,
            ch: "(Loading response...)".length
        };

        if (webviewEl._kcListener) {
            webviewEl.removeEventListener("console-message", webviewEl._kcListener);
        }

        webviewEl._kcListener = (event: any) => {
            const message = event.message as string;
            console.log("[WebView Guest]", message);

            if (message && message.startsWith("gemini-stream-chunk::")) {
                const encodedHTML = message.substring("gemini-stream-chunk::".length);
                try {
                    const decodedHTML = decodeURIComponent(encodedHTML);
                    this.handleStreamChunk(decodedHTML);
                } catch (e) {
                    console.error("Obsidian KC: Parsing received HTML stream chunk failed:", e);
                }
            }
        };

        webviewEl.addEventListener("console-message", webviewEl._kcListener);

        const runAutomation = () => {
            const escapedPrompt = JSON.stringify(promptContent);
            
            console.log("Obsidian KC: Crafting injection script payload.");
            const injectionCode = `
                (function() {
                    const promptText = ${escapedPrompt};
                    console.log("KC Debug: Guest automation process initiated.");

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

                    let fillRetries = 0;
                    function findAndFillInput() {
                        console.log("KC Debug: Querying main input text field... (Attempt: " + (fillRetries + 1) + ")");
                        const inputEl = queryShadowSelector('ms-prompt-box textarea, ms-prompt-box ms-autosize-textarea textarea, textarea[aria-label="Type something"], textarea[aria-label="Enter a prompt"], textarea, div[contenteditable="true"], [role="textbox"]');
                        if (inputEl) {
                            console.log("KC Debug: Target input located successfully:", inputEl);
                            const initialTurnCount = queryShadowSelectorAll('ms-chat-turn').length;
                            console.log("KC Debug: Initial history chat turn count:", initialTurnCount);

                            if (inputEl.tagName === 'DIV') {
                                inputEl.textContent = promptText;
                            } else {
                                inputEl.value = promptText;
                            }
                            inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                            inputEl.dispatchEvent(new Event('change', { bubbles: true }));

                            setTimeout(() => {
                                let parent = inputEl.parentElement;
                                let runButton = null;
                                
                                while (parent && !runButton) {
                                    runButton = parent.querySelector('ms-prompt-box ms-run-button button[aria-label="Run"], ms-prompt-box button[aria-label="Run"][type="submit"], button.run-button, button[aria-label="Run"], button[aria-label="Run prompt"], ms-run-button button[type="submit"].run-button');
                                    if (!runButton) {
                                        const containerButtons = parent.querySelectorAll('button');
                                        for (let i = 0; i < containerButtons.length; i++) {
                                            const btn = containerButtons[i];
                                            const text = (btn.textContent || '').trim();
                                            if (text.startsWith('Run') || btn.classList.contains('run-button')) {
                                                runButton = btn;
                                                break;
                                            }
                                        }
                                    }
                                    if (parent.tagName === 'BODY') {
                                        break;
                                    }
                                    parent = parent.parentElement;
                                }

                                if (runButton) {
                                    console.log("KC Debug: Executing run button click:", runButton);
                                    runButton.click();
                                } else {
                                    console.log("KC Debug: Run button absent. Dispatching Ctrl+Enter KeyboardEvent fallback.");
                                    const enterEvent = new KeyboardEvent('keydown', {
                                        key: 'Enter', code: 'Enter', keyCode: 13, ctrlKey: true, metaKey: true, bubbles: true, cancelable: true
                                    });
                                    inputEl.dispatchEvent(enterEvent);
                                }
                                waitForCompletionAndExtract(initialTurnCount);
                            }, 250);
                        } else {
                            fillRetries++;
                            if (fillRetries < 40) {
                                setTimeout(findAndFillInput, 500);
                            } else {
                                console.error("KC Debug: Could not locate active input element context.");
                                // Return instruction directly into document if login session or setup state is missing
                                console.log("gemini-stream-chunk::" + encodeURIComponent("Error: Prompt field absent. Please open Companion View via the ribbon icon to ensure you are logged in."));
                            }
                        }
                    }

                    function waitForCompletionAndExtract(initialCount) {
                        console.log("KC Debug: Initiating content-stability polling tracker.");
                        let checkCount = 0;
                        const maxChecks = 180; // 90 seconds timeout
                        let generationStarted = false;
                        let previousText = "";
                        let unchangedCount = 0;
                        const stabilityThreshold = 6; // 3 seconds of absolute stability (6 ticks * 500ms)

                        const pollInterval = setInterval(() => {
                            checkCount++;

                            const turns = queryShadowSelectorAll('ms-chat-turn');
                            let latestText = "";
                            let modelContainer = null;
                            
                            for (let i = turns.length - 1; i >= initialCount; i--) {
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

                            if (latestText && latestText.trim().length > 0) {
                                if (!generationStarted) {
                                    generationStarted = true;
                                    console.log("KC Debug: Generation started. Content detected length: " + latestText.length);
                                }

                                if (latestText === previousText) {
                                    unchangedCount++;
                                    console.log("KC Debug: Content unchanged count: " + unchangedCount + "/" + stabilityThreshold);
                                } else {
                                    unchangedCount = 0;
                                    previousText = latestText;
                                    console.log("KC Debug: Content updated. New length: " + latestText.length);
                                }
                            } else {
                                console.log("KC Debug: Waiting for model turn or text... (" + checkCount + ")");
                            }

                            // Terminate polling and extract completed content if:
                            // 1. Text has been detected and has stayed completely stable for 3 seconds.
                            // 2. We've hit the absolute safety timeout (90s).
                            if ((generationStarted && unchangedCount >= stabilityThreshold) || (checkCount > maxChecks)) {
                                clearInterval(pollInterval);
                                console.log("KC Debug: Content stable. Executing final extraction...");
                                extractFinalResponse(initialCount);
                            }
                        }, 500);
                    }

                    function extractFinalResponse(initialCount) {
                        const turns = queryShadowSelectorAll('ms-chat-turn');
                        console.log("KC Debug: Finalizing extraction. Detected chat turns count: " + turns.length);

                        let modelContainer = null;
                        for (let i = turns.length - 1; i >= initialCount; i--) {
                            const turn = turns[i];
                            const container = queryShadowSelector('.chat-turn-container.model', turn);
                            if (container) {
                                modelContainer = container;
                                break;
                            }
                        }

                        if (!modelContainer) {
                            console.error("KC Debug: Active model turn element missing from workspace layout.");
                            return;
                        }

                        const cmarkEls = queryShadowSelectorAll('ms-cmark-node, .model-content, .markdown', modelContainer);
                        
                        const isInsideThinking = (node) => {
                            while (node) {
                                const tag = node.tagName || "";
                                if (tag === 'MS-THOUGHT-CHUNK' || 
                                    tag === 'MODEL-THOUGHTS' || 
                                    (node.classList && (
                                        node.classList.contains('thinking') || 
                                        node.classList.contains('thought-container')
                                    ))) {
                                        return true;
                                    }
                                    node = node.parentNode || node.host;
                                }
                                return false;
                            };

                        const nonThinkingEls = cmarkEls.filter(el => !isInsideThinking(el));

                        const uniqueEls = nonThinkingEls.filter(el => {
                            return !nonThinkingEls.some(otherEl => otherEl !== el && otherEl.contains(el));
                        });

                        let combinedHTML = "";
                        for (let j = 0; j < uniqueEls.length; j++) {
                            const el = uniqueEls[j];
                            const clone = el.cloneNode(true);
                            
                            // Process Math Blocks using single-escaped newlines
                            const mathBlocks = clone.querySelectorAll('ms-math-block, math-block');
                            mathBlocks.forEach(block => {
                                const rawTex = block.text || block.math || block.getAttribute('math') || block.getAttribute('value') || "";
                                if (rawTex && block.parentNode) {
                                    const replacement = document.createTextNode("\\n\\n$$" + rawTex + "$$\\n\\n");
                                    block.parentNode.replaceChild(replacement, block);
                                }
                            });

                            // Process Math Inlines using single-escaped newlines
                            const mathInlines = clone.querySelectorAll('ms-math-inline, math-inline, span.math');
                            mathInlines.forEach(inline => {
                                const rawTex = inline.text || inline.math || inline.getAttribute('math') || inline.getAttribute('value') || "";
                                if (rawTex && inline.parentNode) {
                                    const replacement = document.createTextNode(" $" + rawTex + "$ ");
                                    inline.parentNode.replaceChild(replacement, inline);
                                } else if (inline.parentNode) {
                                    const script = inline.querySelector('script[type="math/tex"]');
                                    if (script && script.textContent) {
                                        const replacement = document.createTextNode(" $" + script.textContent + "$ ");
                                        inline.parentNode.replaceChild(replacement, inline);
                                    }
                                }
                            });

                            // Process Modern KaTeX Elements using single-escaped newlines
                            const katexElements = clone.querySelectorAll('ms-katex, .math-block, .math-inline, .katex');
                            katexElements.forEach(mathEl => {
                                let latexSource = mathEl.text || mathEl.math || mathEl.getAttribute('text') || mathEl.getAttribute('math') || "";
                                
                                if (!latexSource) {
                                    const annotation = mathEl.querySelector('annotation[encoding="application/x-tex"]');
                                    if (annotation) {
                                        latexSource = annotation.textContent || "";
                                    }
                                }
                                
                                if (latexSource && mathEl.parentNode) {
                                    const isInline = mathEl.classList.contains('inline') || mathEl.classList.contains('math-inline') || mathEl.tagName === 'SPAN';
                                    const replacementText = isInline ? " $" + latexSource.trim() + "$ " : "\\n\\n$$" + latexSource.trim() + "$$\\n\\n";
                                    const replacement = document.createTextNode(replacementText);
                                    mathEl.parentNode.replaceChild(replacement, mathEl);
                                }
                            });

                            combinedHTML += clone.innerHTML + "\\n";
                        }
                        
                        if (combinedHTML) {
                            console.log("KC Debug: Sending completed static payload to Obsidian (" + combinedHTML.length + " characters).");
                            console.log("gemini-stream-chunk::" + encodeURIComponent("html-payload::" + combinedHTML));
                        } else {
                            console.warn("KC Debug: Response content list resolved to empty HTML structure.");
                        }
                    }

                    findAndFillInput();
                })();
            `;
            
            console.log("Obsidian KC: Executing Javascript injection.");
            webviewEl.executeJavaScript(injectionCode)
                .then(() => console.log("Obsidian KC: executeJavaScript injection success."))
                .catch((err: any) => console.error("Obsidian KC: executeJavaScript injection failed:", err));
        };

        runAutomation();
    }

    handleStreamChunk(htmlContent: string) {
        if (!this.activeEditor || !this.streamStartPos || !this.streamEndPos) return;

        const startPos = this.streamStartPos;
        const endPos = this.streamEndPos;

        let fullMarkdown = "";

        if (htmlContent.startsWith("html-payload::")) {
            const content = htmlContent.substring("html-payload::".length);
            fullMarkdown = htmlToMarkdown(content);
        } else {
            fullMarkdown = htmlContent;
        }

        fullMarkdown = fullMarkdown
            .split("\n")
            .map(line => line.trimEnd())
            .join("\n");

        fullMarkdown = fullMarkdown.replace(/\n{3,}/g, "\n\n");
        fullMarkdown = fullMarkdown.replace(/\n\s*\n\s*([-*+]\s|\d+\.\s)/g, "\n$1");

        this.activeEditor.replaceRange(fullMarkdown, startPos, endPos);

        this.streamStartPos = null;
        this.streamEndPos = null;
        this.activeEditor = null;

        new Notice("✅ Gemini response inserted.");
    }
}

// ── SETTINGS TAB CLASS ─────────────────────────────────────────────────
class KineticCompanionSettingTab extends PluginSettingTab {
    plugin: KineticCompanionPlugin;

    constructor(app: App, plugin: KineticCompanionPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Kinetic Companion Settings' });

        new Setting(containerEl)
            .setName('Typing Caret Sparkles')
            .setDesc('Toggle ON to spawn beautiful glowing kinetic sparkles behind your cursor as you type.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSparkles)
                .onChange(async (value) => {
                    this.plugin.settings.enableSparkles = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Heavy Slam Paste Effect')
            .setDesc('Toggle ON to trigger a satisfying, tactile stamp thud, screen shake, and dust particles whenever you paste text.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSlamPaste)
                .onChange(async (value) => {
                    this.plugin.settings.enableSlamPaste = value;
                    await this.plugin.saveSettings();
                }));
    }
}
```
## V5
- Perfect output.
```typescript
import { App, Editor, Modal, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf, MarkdownView, htmlToMarkdown } from 'obsidian';

// ── CONFIGURATION & CONSTANTS ──────────────────────────────────────────
interface KineticCompanionSettings {
    enableSparkles: boolean;
    enableSlamPaste: boolean;
}

const DEFAULT_SETTINGS: KineticCompanionSettings = {
    enableSparkles: true,
    enableSlamPaste: true
};

// ── CUSTOM INLINE SELECTION PROMPT MODAL ────────────────────────────────
class SelectionPromptModal extends Modal {
    onSubmit: (instruction: string) => void;
    inputEl!: HTMLInputElement;

    constructor(app: App, onSubmit: (instruction: string) => void) {
        super(app);
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h3", { text: "Kinetic Prompt Selection" });
        
        const desc = contentEl.createEl("p", { text: "How should Gemma 4 update your highlighted selection?" });
        desc.style.cssText = "color: var(--text-muted); font-size: 0.85em; margin-top: 10px;";

        this.inputEl = contentEl.createEl("input", { type: "text" });
        this.inputEl.style.width = "100%";
        this.inputEl.placeholder = "e.g., make it sound warmer, rewrite as bullet list...";
        
        setTimeout(() => this.inputEl.focus(), 20);

        this.scope.register([], "Enter", (evt) => {
            evt.preventDefault();
            this.submit();
        });
    }

    submit() {
        const value = this.inputEl.value.trim();
        if (value) {
            this.onSubmit(value);
        }
        this.close();
    }

    onClose() {
        this.contentEl.empty();
    }
}

// ── CORE PLUGIN IMPLEMENTATION ──────────────────────────────────────────
export default class KineticCompanionPlugin extends Plugin {
    settings!: KineticCompanionSettings;
    activeEditor: Editor | null = null;
    audioCtx: AudioContext | null = null;
    streamStartPos: { line: number; ch: number } | null = null;
    streamEndPos: { line: number; ch: number } | null = null;

    async onload() {
        await this.loadSettings();

        this.addCommand({
            id: 'kinetic-selection-prompt',
            name: 'Prompt with Selection',
            editorCallback: (editor: Editor) => {
                const selection = editor.getSelection().trim();
                if (!selection) {
                    new Notice("Please select some text to prompt with.");
                    return;
                }
                
                const rangeFrom = editor.getCursor('from');
                const rangeTo = editor.getCursor('to');

                const promptModal = new SelectionPromptModal(this.app, (instruction) => {
                    const compiledPrompt = `${instruction}:\n\n${selection}`;
                    this.executeStreamSession(editor, compiledPrompt, rangeFrom, rangeTo);
                });
                promptModal.open();
            }
        });

        this.addRibbonIcon("comment-discussion", "Open Companion View", () => {
            this.activateView(true);
        });

        this.registerEvent(
            this.app.workspace.on('editor-change', (editor: Editor) => {
                if (this.settings.enableSparkles) {
                    this.spawnCursorParticle(editor);
                }
            })
        );

        this.registerEvent(
            this.app.workspace.on('editor-paste', (evt: ClipboardEvent, editor: Editor) => {
                if (this.settings.enableSlamPaste) {
                    this.triggerSlamEffect(editor);
                }
            })
        );

        this.addSettingTab(new KineticCompanionSettingTab(this.app, this));
    }

    async onunload() {
        if (this.audioCtx) {
            try {
                this.audioCtx.close();
            } catch(e) {}
        }
        this.streamStartPos = null;
        this.streamEndPos = null;
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playSlamStamp() {
        this.initAudio();
        if (!this.audioCtx) return;
        try {
            const now = this.audioCtx.currentTime;
            
            const lowOsc = this.audioCtx.createOscillator();
            const lowGain = this.audioCtx.createGain();
            lowOsc.type = 'sawtooth';
            lowOsc.frequency.setValueAtTime(90, now);
            lowOsc.frequency.linearRampToValueAtTime(30, now + 0.15);
            lowGain.gain.setValueAtTime(0.4, now);
            lowGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            lowOsc.connect(lowGain);
            lowGain.connect(this.audioCtx.destination);
            lowOsc.start(now);
            lowOsc.stop(now + 0.16);

            const clickOsc = this.audioCtx.createOscillator();
            const clickGain = this.audioCtx.createGain();
            clickOsc.type = 'triangle';
            clickOsc.frequency.setValueAtTime(600, now);
            clickOsc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
            clickGain.gain.setValueAtTime(0.2, now);
            clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            clickOsc.connect(clickGain);
            clickGain.connect(this.audioCtx.destination);
            clickOsc.start(now);
            clickOsc.stop(now + 0.06);
        } catch(e) {}
    }

    spawnCursorParticle(editor: Editor) {
        try {
            const cursor = editor.getCursor();
            const coords = (editor as any).coordsAtPos(cursor);
            if (coords) {
                const particle = document.createElement("div");
                particle.className = "kc-cursor-particle";
                
                const offsetX = (Math.random() - 0.5) * 8;
                const offsetY = (Math.random() - 0.5) * 4;
                
                particle.style.left = `${coords.left + offsetX}px`;
                particle.style.top = `${coords.top + offsetY}px`;
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 400);
            }
        } catch (e) {
            // Fail silently
        }
    }

    triggerSlamEffect(editor: Editor) {
        try {
            this.playSlamStamp();
            
            const cursor = editor.getCursor();
            const coords = (editor as any).coordsAtPos(cursor);
            if (coords) {
                for (let i = 0; i < 4; i++) {
                    const dustLeft = document.createElement("div");
                    dustLeft.className = "kc-dust-particle kc-dust-left";
                    dustLeft.style.left = `${coords.left}px`;
                    dustLeft.style.top = `${coords.top + (Math.random() - 0.5) * 8}px`;
                    document.body.appendChild(dustLeft);

                    const dustRight = document.createElement("div");
                    dustRight.className = "kc-dust-particle kc-dust-right";
                    dustRight.style.left = `${coords.left}px`;
                    dustRight.style.top = `${coords.top + (Math.random() - 0.5) * 8}px`;
                    document.body.appendChild(dustRight);

                    setTimeout(() => {
                        dustLeft.remove();
                        dustRight.remove();
                    }, 300);
                }

                const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (activeView) {
                    const el = activeView.containerEl;
                    el.classList.add("kc-shaking");
                    setTimeout(() => {
                        el.classList.remove("kc-shaking");
                    }, 150);
                }
            }
        } catch (e) {
            // Fail silently
        }
    }

    async activateView(reveal: boolean = true): Promise<WorkspaceLeaf | null> {
        const { workspace } = this.app;
        
        let leaf: WorkspaceLeaf | null | undefined = workspace.getLeavesOfType("webviewer").find(l => {
            const state = l.getViewState();
            const url = (state.state as any)?.url;
            const matchesUrl = typeof url === "string" && url.includes("aistudio.google.com");
            const inRightSidebar = l.getRoot() === workspace.rightSplit;
            return matchesUrl && inRightSidebar;
        });

        if (!leaf) {
            leaf = workspace.getRightLeaf(false);
            if (!leaf) {
                leaf = workspace.getLeaf('tab');
            }
            
            if (leaf) {
                await leaf.setViewState({
                    type: 'webviewer',
                    state: {
                        url: 'https://aistudio.google.com/',
                        navigate: true,
                    },
                    active: true,
                });
            }
        }
        
        if (leaf && reveal) {
            if (workspace.rightSplit.collapsed) {
                workspace.rightSplit.expand();
            }
            workspace.revealLeaf(leaf);
        }
        return leaf || null;
    }

    async getReadyWebviewElement(view: any): Promise<any> {
        const webview = await new Promise<any>((resolve) => {
            const el = view.containerEl.querySelector("webview");
            if (el) {
                resolve(el);
                return;
            }
            const observer = new MutationObserver(() => {
                const el = view.containerEl.querySelector("webview");
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe(view.containerEl, { childList: true, subtree: true });
            
            setTimeout(() => {
                observer.disconnect();
                resolve(view.containerEl.querySelector("webview"));
            }, 3000);
        });

        if (!webview) return null;

        await new Promise<void>((resolve) => {
            const isWebviewReady = () => {
                try {
                    webview.isLoading();
                    return true;
                } catch (e) {
                    return false;
                }
            };

            if (isWebviewReady()) {
                resolve();
                return;
            }

            const onDomReady = () => {
                webview.removeEventListener("dom-ready", onDomReady);
                resolve();
            };
            webview.addEventListener("dom-ready", onDomReady);

            setTimeout(() => {
                webview.removeEventListener("dom-ready", onDomReady);
                resolve();
            }, 5000);
        });

        return webview;
    }

    async waitForTargetPageLoad(webview: any): Promise<void> {
        return new Promise<void>((resolve) => {
            const checkUrlAndLoad = () => {
                const currentUrl = webview.getURL() || "";
                const isCorrectSite = currentUrl.includes("aistudio.google.com");
                const isStillLoading = webview.isLoading();

                if (isCorrectSite && !isStillLoading) {
                    resolve();
                    return true;
                }
                return false;
            };

            if (checkUrlAndLoad()) return;

            const onStopLoading = () => {
                if (checkUrlAndLoad()) {
                    webview.removeEventListener("did-stop-loading", onStopLoading);
                }
            };
            webview.addEventListener("did-stop-loading", onStopLoading);

            const interval = setInterval(() => {
                if (checkUrlAndLoad()) {
                    clearInterval(interval);
                    webview.removeEventListener("did-stop-loading", onStopLoading);
                }
            }, 500);

            setTimeout(() => {
                clearInterval(interval);
                webview.removeEventListener("did-stop-loading", onStopLoading);
                resolve();
            }, 15000);
        });
    }

    async executeStreamSession(editor: Editor, promptContent: string, rangeFrom: { line: number; ch: number }, rangeTo: { line: number; ch: number }) {
        console.log("Obsidian KC: Starting executeStreamSession.");
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        const originalLeaf = activeView?.leaf;
        const originalCursor = editor.getCursor();

        console.log("Obsidian KC: Locating Web Viewer split.");
        const webviewerLeaf = await this.activateView(true);
        if (!webviewerLeaf) {
            console.error("Obsidian KC: Web Viewer was not ready or enabled.");
            new Notice("Could not open the Web Viewer. Please ensure the 'Web Viewer' core plugin is enabled in Obsidian Settings.");
            return;
        }

        if (originalLeaf) {
            this.app.workspace.setActiveLeaf(originalLeaf, { focus: true });
            editor.setCursor(originalCursor);
        }

        const view = webviewerLeaf.view;
        console.log("Obsidian KC: Fetching ready webview context.");
        const webviewEl = await this.getReadyWebviewElement(view);
        if (!webviewEl) {
            console.error("Obsidian KC: Embedded webview element could not be found.");
            new Notice("Could not find the embedded webview element inside the Web Viewer.");
            return;
        }

        console.log("Obsidian KC: Verifying target page load state.");
        await this.waitForTargetPageLoad(webviewEl);
        console.log("Obsidian KC: Webview initialized and page loaded.");

        this.activeEditor = editor;
        
        const headerText = `\n\n${promptContent}\n\n### 🎯 Paced Outline:\n(Loading response...)`;
        editor.replaceRange(headerText, rangeFrom, rangeTo);

        const newlineCount = (headerText.match(/\n/g) || []).length;
        this.streamStartPos = {
            line: rangeFrom.line + newlineCount,
            ch: 0
        };
        this.streamEndPos = {
            line: rangeFrom.line + newlineCount,
            ch: "(Loading response...)".length
        };

        if (webviewEl._kcListener) {
            webviewEl.removeEventListener("console-message", webviewEl._kcListener);
        }

        webviewEl._kcListener = (event: any) => {
            const message = event.message as string;
            console.log("[WebView Guest]", message);

            if (message && message.startsWith("gemini-stream-chunk::")) {
                const encodedHTML = message.substring("gemini-stream-chunk::".length);
                try {
                    const decodedHTML = decodeURIComponent(encodedHTML);
                    this.handleStreamChunk(decodedHTML);
                } catch (e) {
                    console.error("Obsidian KC: Parsing received HTML stream chunk failed:", e);
                }
            }
        };

        webviewEl.addEventListener("console-message", webviewEl._kcListener);

        const runAutomation = () => {
            const escapedPrompt = JSON.stringify(promptContent);
            
            console.log("Obsidian KC: Crafting injection script payload.");
            const injectionCode = `
                (function() {
                    const promptText = ${escapedPrompt};
                    console.log("KC Debug: Guest automation process initiated.");

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

                    let fillRetries = 0;
                    function findAndFillInput() {
                        console.log("KC Debug: Querying main input text field... (Attempt: " + (fillRetries + 1) + ")");
                        const inputEl = queryShadowSelector('ms-prompt-box textarea, ms-prompt-box ms-autosize-textarea textarea, textarea[aria-label="Type something"], textarea[aria-label="Enter a prompt"], textarea, div[contenteditable="true"], [role="textbox"]');
                        if (inputEl) {
                            console.log("KC Debug: Target input located successfully:", inputEl);
                            const initialTurnCount = queryShadowSelectorAll('ms-chat-turn').length;
                            console.log("KC Debug: Initial history chat turn count:", initialTurnCount);

                            if (inputEl.tagName === 'DIV') {
                                inputEl.textContent = promptText;
                            } else {
                                inputEl.value = promptText;
                            }
                            inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                            inputEl.dispatchEvent(new Event('change', { bubbles: true }));

                            setTimeout(() => {
                                let parent = inputEl.parentElement;
                                let runButton = null;
                                
                                while (parent && !runButton) {
                                    runButton = parent.querySelector('ms-prompt-box ms-run-button button[aria-label="Run"], ms-prompt-box button[aria-label="Run"][type="submit"], button.run-button, button[aria-label="Run"], button[aria-label="Run prompt"], ms-run-button button[type="submit"].run-button');
                                    if (!runButton) {
                                        const containerButtons = parent.querySelectorAll('button');
                                        for (let i = 0; i < containerButtons.length; i++) {
                                            const btn = containerButtons[i];
                                            const text = (btn.textContent || '').trim();
                                            if (text.startsWith('Run') || btn.classList.contains('run-button')) {
                                                runButton = btn;
                                                break;
                                            }
                                        }
                                    }
                                    if (parent.tagName === 'BODY') {
                                        break;
                                    }
                                    parent = parent.parentElement;
                                }

                                if (runButton) {
                                    console.log("KC Debug: Executing run button click:", runButton);
                                    runButton.click();
                                } else {
                                    console.log("KC Debug: Run button absent. Dispatching Ctrl+Enter KeyboardEvent fallback.");
                                    const enterEvent = new KeyboardEvent('keydown', {
                                        key: 'Enter', code: 'Enter', keyCode: 13, ctrlKey: true, metaKey: true, bubbles: true, cancelable: true
                                    });
                                    inputEl.dispatchEvent(enterEvent);
                                }
                                waitForCompletionAndExtract(initialTurnCount);
                            }, 250);
                        } else {
                            fillRetries++;
                            if (fillRetries < 40) {
                                setTimeout(findAndFillInput, 500);
                            } else {
                                console.error("KC Debug: Could not locate active input element context.");
                            }
                        }
                    }

                    function waitForCompletionAndExtract(initialCount) {
                        console.log("KC Debug: Initiating content-stability polling tracker.");
                        let checkCount = 0;
                        const maxChecks = 180; // 90 seconds timeout
                        let generationStarted = false;
                        let previousText = "";
                        let unchangedCount = 0;
                        const stabilityThreshold = 6; // 3 seconds of absolute stability (6 ticks * 500ms)

                        const pollInterval = setInterval(() => {
                            checkCount++;

                            const turns = queryShadowSelectorAll('ms-chat-turn');
                            let latestText = "";
                            let modelContainer = null;
                            
                            for (let i = turns.length - 1; i >= initialCount; i--) {
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

                            if (latestText && latestText.trim().length > 0) {
                                if (!generationStarted) {
                                    generationStarted = true;
                                    console.log("KC Debug: Generation started. Content detected length: " + latestText.length);
                                }

                                if (latestText === previousText) {
                                    unchangedCount++;
                                    console.log("KC Debug: Content unchanged count: " + unchangedCount + "/" + stabilityThreshold);
                                } else {
                                    unchangedCount = 0;
                                    previousText = latestText;
                                    console.log("KC Debug: Content updated. New length: " + latestText.length);
                                }
                            } else {
                                console.log("KC Debug: Waiting for model turn or text... (" + checkCount + ")");
                            }

                            // Terminate polling and extract completed content if:
                            // 1. Text has been detected and has stayed completely stable for 3 seconds.
                            // 2. We've hit the absolute safety timeout (90s).
                            if ((generationStarted && unchangedCount >= stabilityThreshold) || (checkCount > maxChecks)) {
                                clearInterval(pollInterval);
                                console.log("KC Debug: Content stable. Executing final extraction...");
                                extractFinalResponse(initialCount);
                            }
                        }, 500);
                    }

                    function extractFinalResponse(initialCount) {
                        const turns = queryShadowSelectorAll('ms-chat-turn');
                        console.log("KC Debug: Finalizing extraction. Detected chat turns count: " + turns.length);

                        let modelContainer = null;
                        for (let i = turns.length - 1; i >= initialCount; i--) {
                            const turn = turns[i];
                            const container = queryShadowSelector('.chat-turn-container.model', turn);
                            if (container) {
                                modelContainer = container;
                                break;
                            }
                        }

                        if (!modelContainer) {
                            console.error("KC Debug: Active model turn element missing from workspace layout.");
                            return;
                        }

                        const cmarkEls = queryShadowSelectorAll('ms-cmark-node, .model-content, .markdown', modelContainer);
                        
                        const isInsideThinking = (node) => {
                            while (node) {
                                const tag = node.tagName || "";
                                if (tag === 'MS-THOUGHT-CHUNK' || 
                                    tag === 'MODEL-THOUGHTS' || 
                                    (node.classList && (
                                        node.classList.contains('thinking') || 
                                        node.classList.contains('thought-container')
                                    ))) {
                                        return true;
                                    }
                                    node = node.parentNode || node.host;
                                }
                                return false;
                            };

                        const nonThinkingEls = cmarkEls.filter(el => !isInsideThinking(el));

                        const uniqueEls = nonThinkingEls.filter(el => {
                            return !nonThinkingEls.some(otherEl => otherEl !== el && otherEl.contains(el));
                        });

                        let combinedHTML = "";
                        for (let j = 0; j < uniqueEls.length; j++) {
                            const el = uniqueEls[j];
                            const clone = el.cloneNode(true);
                            
                            // Process Math Blocks using single-escaped newlines
                            const mathBlocks = clone.querySelectorAll('ms-math-block, math-block');
                            mathBlocks.forEach(block => {
                                const rawTex = block.text || block.math || block.getAttribute('math') || block.getAttribute('value') || "";
                                if (rawTex && block.parentNode) {
                                    const replacement = document.createTextNode("\\n\\n$$" + rawTex + "$$\\n\\n");
                                    block.parentNode.replaceChild(replacement, block);
                                }
                            });

                            // Process Math Inlines using single-escaped newlines
                            const mathInlines = clone.querySelectorAll('ms-math-inline, math-inline, span.math');
                            mathInlines.forEach(inline => {
                                const rawTex = inline.text || inline.math || inline.getAttribute('math') || inline.getAttribute('value') || "";
                                if (rawTex && inline.parentNode) {
                                    const replacement = document.createTextNode(" $" + rawTex + "$ ");
                                    inline.parentNode.replaceChild(replacement, inline);
                                } else if (inline.parentNode) {
                                    const script = inline.querySelector('script[type="math/tex"]');
                                    if (script && script.textContent) {
                                        const replacement = document.createTextNode(" $" + script.textContent + "$ ");
                                        inline.parentNode.replaceChild(replacement, inline);
                                    }
                                }
                            });

                            // Process Modern KaTeX Elements using single-escaped newlines
                            const katexElements = clone.querySelectorAll('ms-katex, .math-block, .math-inline, .katex');
                            katexElements.forEach(mathEl => {
                                let latexSource = mathEl.text || mathEl.math || mathEl.getAttribute('text') || mathEl.getAttribute('math') || "";
                                
                                if (!latexSource) {
                                    const annotation = mathEl.querySelector('annotation[encoding="application/x-tex"]');
                                    if (annotation) {
                                        latexSource = annotation.textContent || "";
                                    }
                                }
                                
                                if (latexSource && mathEl.parentNode) {
                                    const isInline = mathEl.classList.contains('inline') || mathEl.classList.contains('math-inline') || mathEl.tagName === 'SPAN';
                                    const replacementText = isInline ? " $" + latexSource.trim() + "$ " : "\\n\\n$$" + latexSource.trim() + "$$\\n\\n";
                                    const replacement = document.createTextNode(replacementText);
                                    mathEl.parentNode.replaceChild(replacement, mathEl);
                                }
                            });

                            combinedHTML += clone.innerHTML + "\\n";
                        }
                        
                        if (combinedHTML) {
                            console.log("KC Debug: Sending completed static payload to Obsidian (" + combinedHTML.length + " characters).");
                            console.log("gemini-stream-chunk::" + encodeURIComponent("html-payload::" + combinedHTML));
                        } else {
                            console.warn("KC Debug: Response content list resolved to empty HTML structure.");
                        }
                    }

                    findAndFillInput();
                })();
            `;
            
            console.log("Obsidian KC: Executing Javascript injection.");
            webviewEl.executeJavaScript(injectionCode)
                .then(() => console.log("Obsidian KC: executeJavaScript injection success."))
                .catch((err: any) => console.error("Obsidian KC: executeJavaScript injection failed:", err));
        };

        runAutomation();
    }

    handleStreamChunk(htmlContent: string) {
        if (!this.activeEditor || !this.streamStartPos || !this.streamEndPos) return;

        const startPos = this.streamStartPos;
        const endPos = this.streamEndPos;

        let fullMarkdown = "";

        if (htmlContent.startsWith("html-payload::")) {
            const content = htmlContent.substring("html-payload::".length);
            fullMarkdown = htmlToMarkdown(content);
        } else {
            fullMarkdown = htmlContent;
        }

        fullMarkdown = fullMarkdown
            .split("\n")
            .map(line => line.trimEnd())
            .join("\n");

        fullMarkdown = fullMarkdown.replace(/\n{3,}/g, "\n\n");
        fullMarkdown = fullMarkdown.replace(/\n\s*\n\s*([-*+]\s|\d+\.\s)/g, "\n$1");

        this.activeEditor.replaceRange(fullMarkdown, startPos, endPos);

        this.streamStartPos = null;
        this.streamEndPos = null;
        this.activeEditor = null;

        new Notice("✅ Gemini response inserted.");
    }
}

// ── SETTINGS TAB CLASS ─────────────────────────────────────────────────
class KineticCompanionSettingTab extends PluginSettingTab {
    plugin: KineticCompanionPlugin;

    constructor(app: App, plugin: KineticCompanionPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Kinetic Companion Settings' });

        new Setting(containerEl)
            .setName('Typing Caret Sparkles')
            .setDesc('Toggle ON to spawn beautiful glowing kinetic sparkles behind your cursor as you type.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSparkles)
                .onChange(async (value) => {
                    this.plugin.settings.enableSparkles = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Heavy Slam Paste Effect')
            .setDesc('Toggle ON to trigger a satisfying, tactile stamp thud, screen shake, and dust particles whenever you paste text.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSlamPaste)
                .onChange(async (value) => {
                    this.plugin.settings.enableSlamPaste = value;
                    await this.plugin.saveSettings();
                }));
    }
}
```
## V4
- Best working so far (just has too many `\n\n`)
```typescript
import { App, Editor, Modal, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf, MarkdownView, htmlToMarkdown } from 'obsidian';

// ── CONFIGURATION & CONSTANTS ──────────────────────────────────────────
interface KineticCompanionSettings {
    enableSparkles: boolean;
    enableSlamPaste: boolean;
}

const DEFAULT_SETTINGS: KineticCompanionSettings = {
    enableSparkles: true,
    enableSlamPaste: true
};

// ── CUSTOM INLINE SELECTION PROMPT MODAL ────────────────────────────────
class SelectionPromptModal extends Modal {
    onSubmit: (instruction: string) => void;
    inputEl!: HTMLInputElement;

    constructor(app: App, onSubmit: (instruction: string) => void) {
        super(app);
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h3", { text: "Kinetic Prompt Selection" });
        
        const desc = contentEl.createEl("p", { text: "How should Gemma 4 update your highlighted selection?" });
        desc.style.cssText = "color: var(--text-muted); font-size: 0.85em; margin-top: 10px;";

        this.inputEl = contentEl.createEl("input", { type: "text" });
        this.inputEl.style.width = "100%";
        this.inputEl.placeholder = "e.g., make it sound warmer, rewrite as bullet list...";
        
        setTimeout(() => this.inputEl.focus(), 20);

        this.scope.register([], "Enter", (evt) => {
            evt.preventDefault();
            this.submit();
        });
    }

    submit() {
        const value = this.inputEl.value.trim();
        if (value) {
            this.onSubmit(value);
        }
        this.close();
    }

    onClose() {
        this.contentEl.empty();
    }
}

// ── CORE PLUGIN IMPLEMENTATION ──────────────────────────────────────────
export default class KineticCompanionPlugin extends Plugin {
    settings!: KineticCompanionSettings;
    activeEditor: Editor | null = null;
    audioCtx: AudioContext | null = null;
    streamStartPos: { line: number; ch: number } | null = null;
    streamEndPos: { line: number; ch: number } | null = null;

    async onload() {
        await this.loadSettings();

        this.addCommand({
            id: 'kinetic-selection-prompt',
            name: 'Prompt with Selection',
            editorCallback: (editor: Editor) => {
                const selection = editor.getSelection().trim();
                if (!selection) {
                    new Notice("Please select some text to prompt with.");
                    return;
                }
                
                const rangeFrom = editor.getCursor('from');
                const rangeTo = editor.getCursor('to');

                const promptModal = new SelectionPromptModal(this.app, (instruction) => {
                    const compiledPrompt = `${instruction}:\n\n${selection}`;
                    this.executeStreamSession(editor, compiledPrompt, rangeFrom, rangeTo);
                });
                promptModal.open();
            }
        });

        this.addRibbonIcon("comment-discussion", "Open Companion View", () => {
            this.activateView(true);
        });

        this.registerEvent(
            this.app.workspace.on('editor-change', (editor: Editor) => {
                if (this.settings.enableSparkles) {
                    this.spawnCursorParticle(editor);
                }
            })
        );

        this.registerEvent(
            this.app.workspace.on('editor-paste', (evt: ClipboardEvent, editor: Editor) => {
                if (this.settings.enableSlamPaste) {
                    this.triggerSlamEffect(editor);
                }
            })
        );

        this.addSettingTab(new KineticCompanionSettingTab(this.app, this));
    }

    async onunload() {
        if (this.audioCtx) {
            try {
                this.audioCtx.close();
            } catch(e) {}
        }
        this.streamStartPos = null;
        this.streamEndPos = null;
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playSlamStamp() {
        this.initAudio();
        if (!this.audioCtx) return;
        try {
            const now = this.audioCtx.currentTime;
            
            const lowOsc = this.audioCtx.createOscillator();
            const lowGain = this.audioCtx.createGain();
            lowOsc.type = 'sawtooth';
            lowOsc.frequency.setValueAtTime(90, now);
            lowOsc.frequency.linearRampToValueAtTime(30, now + 0.15);
            lowGain.gain.setValueAtTime(0.4, now);
            lowGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            lowOsc.connect(lowGain);
            lowGain.connect(this.audioCtx.destination);
            lowOsc.start(now);
            lowOsc.stop(now + 0.16);

            const clickOsc = this.audioCtx.createOscillator();
            const clickGain = this.audioCtx.createGain();
            clickOsc.type = 'triangle';
            clickOsc.frequency.setValueAtTime(600, now);
            clickOsc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
            clickGain.gain.setValueAtTime(0.2, now);
            clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            clickOsc.connect(clickGain);
            clickGain.connect(this.audioCtx.destination);
            clickOsc.start(now);
            clickOsc.stop(now + 0.06);
        } catch(e) {}
    }

    spawnCursorParticle(editor: Editor) {
        try {
            const cursor = editor.getCursor();
            const coords = (editor as any).coordsAtPos(cursor);
            if (coords) {
                const particle = document.createElement("div");
                particle.className = "kc-cursor-particle";
                
                const offsetX = (Math.random() - 0.5) * 8;
                const offsetY = (Math.random() - 0.5) * 4;
                
                particle.style.left = `${coords.left + offsetX}px`;
                particle.style.top = `${coords.top + offsetY}px`;
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 400);
            }
        } catch (e) {
            // Fail silently
        }
    }

    triggerSlamEffect(editor: Editor) {
        try {
            this.playSlamStamp();
            
            const cursor = editor.getCursor();
            const coords = (editor as any).coordsAtPos(cursor);
            if (coords) {
                for (let i = 0; i < 4; i++) {
                    const dustLeft = document.createElement("div");
                    dustLeft.className = "kc-dust-particle kc-dust-left";
                    dustLeft.style.left = `${coords.left}px`;
                    dustLeft.style.top = `${coords.top + (Math.random() - 0.5) * 8}px`;
                    document.body.appendChild(dustLeft);

                    const dustRight = document.createElement("div");
                    dustRight.className = "kc-dust-particle kc-dust-right";
                    dustRight.style.left = `${coords.left}px`;
                    dustRight.style.top = `${coords.top + (Math.random() - 0.5) * 8}px`;
                    document.body.appendChild(dustRight);

                    setTimeout(() => {
                        dustLeft.remove();
                        dustRight.remove();
                    }, 300);
                }

                const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (activeView) {
                    const el = activeView.containerEl;
                    el.classList.add("kc-shaking");
                    setTimeout(() => {
                        el.classList.remove("kc-shaking");
                    }, 150);
                }
            }
        } catch (e) {
            // Fail silently
        }
    }

    async activateView(reveal: boolean = true): Promise<WorkspaceLeaf | null> {
        const { workspace } = this.app;
        
        let leaf: WorkspaceLeaf | null | undefined = workspace.getLeavesOfType("webviewer").find(l => {
            const state = l.getViewState();
            const url = (state.state as any)?.url;
            const matchesUrl = typeof url === "string" && url.includes("aistudio.google.com");
            const inRightSidebar = l.getRoot() === workspace.rightSplit;
            return matchesUrl && inRightSidebar;
        });

        if (!leaf) {
            leaf = workspace.getRightLeaf(false);
            if (!leaf) {
                leaf = workspace.getLeaf('tab');
            }
            
            if (leaf) {
                await leaf.setViewState({
                    type: 'webviewer',
                    state: {
                        url: 'https://aistudio.google.com/',
                        navigate: true,
                    },
                    active: true,
                });
            }
        }
        
        if (leaf && reveal) {
            if (workspace.rightSplit.collapsed) {
                workspace.rightSplit.expand();
            }
            workspace.revealLeaf(leaf);
        }
        return leaf || null;
    }

    async getReadyWebviewElement(view: any): Promise<any> {
        const webview = await new Promise<any>((resolve) => {
            const el = view.containerEl.querySelector("webview");
            if (el) {
                resolve(el);
                return;
            }
            const observer = new MutationObserver(() => {
                const el = view.containerEl.querySelector("webview");
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe(view.containerEl, { childList: true, subtree: true });
            
            setTimeout(() => {
                observer.disconnect();
                resolve(view.containerEl.querySelector("webview"));
            }, 3000);
        });

        if (!webview) return null;

        await new Promise<void>((resolve) => {
            const isWebviewReady = () => {
                try {
                    webview.isLoading();
                    return true;
                } catch (e) {
                    return false;
                }
            };

            if (isWebviewReady()) {
                resolve();
                return;
            }

            const onDomReady = () => {
                webview.removeEventListener("dom-ready", onDomReady);
                resolve();
            };
            webview.addEventListener("dom-ready", onDomReady);

            setTimeout(() => {
                webview.removeEventListener("dom-ready", onDomReady);
                resolve();
            }, 5000);
        });

        return webview;
    }

    async waitForTargetPageLoad(webview: any): Promise<void> {
        return new Promise<void>((resolve) => {
            const checkUrlAndLoad = () => {
                const currentUrl = webview.getURL() || "";
                const isCorrectSite = currentUrl.includes("aistudio.google.com");
                const isStillLoading = webview.isLoading();

                if (isCorrectSite && !isStillLoading) {
                    resolve();
                    return true;
                }
                return false;
            };

            if (checkUrlAndLoad()) return;

            const onStopLoading = () => {
                if (checkUrlAndLoad()) {
                    webview.removeEventListener("did-stop-loading", onStopLoading);
                }
            };
            webview.addEventListener("did-stop-loading", onStopLoading);

            const interval = setInterval(() => {
                if (checkUrlAndLoad()) {
                    clearInterval(interval);
                    webview.removeEventListener("did-stop-loading", onStopLoading);
                }
            }, 500);

            setTimeout(() => {
                clearInterval(interval);
                webview.removeEventListener("did-stop-loading", onStopLoading);
                resolve();
            }, 15000);
        });
    }

    async executeStreamSession(editor: Editor, promptContent: string, rangeFrom: { line: number; ch: number }, rangeTo: { line: number; ch: number }) {
        console.log("Obsidian KC: Starting executeStreamSession.");
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        const originalLeaf = activeView?.leaf;
        const originalCursor = editor.getCursor();

        console.log("Obsidian KC: Locating Web Viewer split.");
        const webviewerLeaf = await this.activateView(true);
        if (!webviewerLeaf) {
            console.error("Obsidian KC: Web Viewer was not ready or enabled.");
            new Notice("Could not open the Web Viewer. Please ensure the 'Web Viewer' core plugin is enabled in Obsidian Settings.");
            return;
        }

        if (originalLeaf) {
            this.app.workspace.setActiveLeaf(originalLeaf, { focus: true });
            editor.setCursor(originalCursor);
        }

        const view = webviewerLeaf.view;
        console.log("Obsidian KC: Fetching ready webview context.");
        const webviewEl = await this.getReadyWebviewElement(view);
        if (!webviewEl) {
            console.error("Obsidian KC: Embedded webview element could not be found.");
            new Notice("Could not find the embedded webview element inside the Web Viewer.");
            return;
        }

        console.log("Obsidian KC: Verifying target page load state.");
        await this.waitForTargetPageLoad(webviewEl);
        console.log("Obsidian KC: Webview initialized and page loaded.");

        this.activeEditor = editor;
        
        const headerText = `\n\n${promptContent}\n\n### 🎯 Paced Outline:\n(Loading response...)`;
        editor.replaceRange(headerText, rangeFrom, rangeTo);

        const newlineCount = (headerText.match(/\n/g) || []).length;
        this.streamStartPos = {
            line: rangeFrom.line + newlineCount,
            ch: 0
        };
        this.streamEndPos = {
            line: rangeFrom.line + newlineCount,
            ch: "(Loading response...)".length
        };

        if (webviewEl._kcListener) {
            webviewEl.removeEventListener("console-message", webviewEl._kcListener);
        }

        webviewEl._kcListener = (event: any) => {
            const message = event.message as string;
            console.log("[WebView Guest]", message);

            if (message && message.startsWith("gemini-stream-chunk::")) {
                const encodedHTML = message.substring("gemini-stream-chunk::".length);
                try {
                    const decodedHTML = decodeURIComponent(encodedHTML);
                    this.handleStreamChunk(decodedHTML);
                } catch (e) {
                    console.error("Obsidian KC: Parsing received HTML stream chunk failed:", e);
                }
            }
        };

        webviewEl.addEventListener("console-message", webviewEl._kcListener);

        const runAutomation = () => {
            const escapedPrompt = JSON.stringify(promptContent);
            
            console.log("Obsidian KC: Crafting injection script payload.");
            const injectionCode = `
                (function() {
                    const promptText = ${escapedPrompt};
                    console.log("KC Debug: Guest automation process initiated.");

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

                    let fillRetries = 0;
                    function findAndFillInput() {
                        console.log("KC Debug: Querying main input text field... (Attempt: " + (fillRetries + 1) + ")");
                        const inputEl = queryShadowSelector('ms-prompt-box textarea, ms-prompt-box ms-autosize-textarea textarea, textarea[aria-label="Type something"], textarea[aria-label="Enter a prompt"], textarea, div[contenteditable="true"], [role="textbox"]');
                        if (inputEl) {
                            console.log("KC Debug: Target input located successfully:", inputEl);
                            const initialTurnCount = queryShadowSelectorAll('ms-chat-turn').length;
                            console.log("KC Debug: Initial history chat turn count:", initialTurnCount);

                            if (inputEl.tagName === 'DIV') {
                                inputEl.textContent = promptText;
                            } else {
                                inputEl.value = promptText;
                            }
                            inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                            inputEl.dispatchEvent(new Event('change', { bubbles: true }));

                            setTimeout(() => {
                                let parent = inputEl.parentElement;
                                let runButton = null;
                                
                                while (parent && !runButton) {
                                    runButton = parent.querySelector('ms-prompt-box ms-run-button button[aria-label="Run"], ms-prompt-box button[aria-label="Run"][type="submit"], button.run-button, button[aria-label="Run"], button[aria-label="Run prompt"], ms-run-button button[type="submit"].run-button');
                                    if (!runButton) {
                                        const containerButtons = parent.querySelectorAll('button');
                                        for (let i = 0; i < containerButtons.length; i++) {
                                            const btn = containerButtons[i];
                                            const text = (btn.textContent || '').trim();
                                            if (text.startsWith('Run') || btn.classList.contains('run-button')) {
                                                runButton = btn;
                                                break;
                                            }
                                        }
                                    }
                                    if (parent.tagName === 'BODY') {
                                        break;
                                    }
                                    parent = parent.parentElement;
                                }

                                if (runButton) {
                                    console.log("KC Debug: Executing run button click:", runButton);
                                    runButton.click();
                                } else {
                                    console.log("KC Debug: Run button absent. Dispatching Ctrl+Enter KeyboardEvent fallback.");
                                    const enterEvent = new KeyboardEvent('keydown', {
                                        key: 'Enter', code: 'Enter', keyCode: 13, ctrlKey: true, metaKey: true, bubbles: true, cancelable: true
                                    });
                                    inputEl.dispatchEvent(enterEvent);
                                }
                                waitForCompletionAndExtract(initialTurnCount);
                            }, 250);
                        } else {
                            fillRetries++;
                            if (fillRetries < 40) {
                                setTimeout(findAndFillInput, 500);
                            } else {
                                console.error("KC Debug: Could not locate active input element context.");
                            }
                        }
                    }

                    function waitForCompletionAndExtract(initialCount) {
                        console.log("KC Debug: Initiating content-stability polling tracker.");
                        let checkCount = 0;
                        const maxChecks = 180; // 90 seconds timeout
                        let generationStarted = false;
                        let previousText = "";
                        let unchangedCount = 0;
                        const stabilityThreshold = 6; // 3 seconds of absolute stability (6 ticks * 500ms)

                        const pollInterval = setInterval(() => {
                            checkCount++;

                            const turns = queryShadowSelectorAll('ms-chat-turn');
                            let latestText = "";
                            let modelContainer = null;
                            
                            for (let i = turns.length - 1; i >= initialCount; i--) {
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

                            if (latestText && latestText.trim().length > 0) {
                                if (!generationStarted) {
                                    generationStarted = true;
                                    console.log("KC Debug: Generation started. Content detected length: " + latestText.length);
                                }

                                if (latestText === previousText) {
                                    unchangedCount++;
                                    console.log("KC Debug: Content unchanged count: " + unchangedCount + "/" + stabilityThreshold);
                                } else {
                                    unchangedCount = 0;
                                    previousText = latestText;
                                    console.log("KC Debug: Content updated. New length: " + latestText.length);
                                }
                            } else {
                                console.log("KC Debug: Waiting for model turn or text... (" + checkCount + ")");
                            }

                            // Terminate polling and extract completed content if:
                            // 1. Text has been detected and has stayed completely stable for 3 seconds.
                            // 2. We've hit the absolute safety timeout (90s).
                            if ((generationStarted && unchangedCount >= stabilityThreshold) || (checkCount > maxChecks)) {
                                clearInterval(pollInterval);
                                console.log("KC Debug: Content stable. Executing final extraction...");
                                extractFinalResponse(initialCount);
                            }
                        }, 500);
                    }

                    function extractFinalResponse(initialCount) {
                        const turns = queryShadowSelectorAll('ms-chat-turn');
                        console.log("KC Debug: Finalizing extraction. Detected chat turns count: " + turns.length);

                        let modelContainer = null;
                        for (let i = turns.length - 1; i >= initialCount; i--) {
                            const turn = turns[i];
                            const container = queryShadowSelector('.chat-turn-container.model', turn);
                            if (container) {
                                modelContainer = container;
                                break;
                            }
                        }

                        if (!modelContainer) {
                            console.error("KC Debug: Active model turn element missing from workspace layout.");
                            return;
                        }

                        const cmarkEls = queryShadowSelectorAll('ms-cmark-node, .model-content, .markdown', modelContainer);
                        
                        const isInsideThinking = (node) => {
                            while (node) {
                                const tag = node.tagName || "";
                                if (tag === 'MS-THOUGHT-CHUNK' || 
                                    tag === 'MODEL-THOUGHTS' || 
                                    (node.classList && (
                                        node.classList.contains('thinking') || 
                                        node.classList.contains('thought-container')
                                    ))) {
                                        return true;
                                    }
                                    node = node.parentNode || node.host;
                                }
                                return false;
                            };

                        const nonThinkingEls = cmarkEls.filter(el => !isInsideThinking(el));

                        const uniqueEls = nonThinkingEls.filter(el => {
                            return !nonThinkingEls.some(otherEl => otherEl !== el && otherEl.contains(el));
                        });

                        let combinedHTML = "";
                        for (let j = 0; j < uniqueEls.length; j++) {
                            const el = uniqueEls[j];
                            const clone = el.cloneNode(true);
                            
                            // Process Math Blocks using trusted-types safe replacement
                            const mathBlocks = clone.querySelectorAll('ms-math-block, math-block');
                            mathBlocks.forEach(block => {
                                const rawTex = block.text || block.math || block.getAttribute('math') || block.getAttribute('value') || "";
                                if (rawTex && block.parentNode) {
                                    const replacement = document.createTextNode("\\\\n\\\\n$$" + rawTex + "$$\\\\n\\\\n");
                                    block.parentNode.replaceChild(replacement, block);
                                }
                            });

                            // Process Math Inlines using trusted-types safe replacement
                            const mathInlines = clone.querySelectorAll('ms-math-inline, math-inline, span.math');
                            mathInlines.forEach(inline => {
                                const rawTex = inline.text || inline.math || inline.getAttribute('math') || inline.getAttribute('value') || "";
                                if (rawTex && inline.parentNode) {
                                    const replacement = document.createTextNode(" $" + rawTex + "$ ");
                                    inline.parentNode.replaceChild(replacement, inline);
                                } else if (inline.parentNode) {
                                    const script = inline.querySelector('script[type="math/tex"]');
                                    if (script && script.textContent) {
                                        const replacement = document.createTextNode(" $" + script.textContent + "$ ");
                                        inline.parentNode.replaceChild(replacement, inline);
                                    }
                                }
                            });

                            // Process Modern KaTeX Elements using trusted-types safe replacement
                            const katexElements = clone.querySelectorAll('ms-katex, .math-block, .math-inline, .katex');
                            katexElements.forEach(mathEl => {
                                let latexSource = mathEl.text || mathEl.math || mathEl.getAttribute('text') || mathEl.getAttribute('math') || "";
                                
                                if (!latexSource) {
                                    const annotation = mathEl.querySelector('annotation[encoding="application/x-tex"]');
                                    if (annotation) {
                                        latexSource = annotation.textContent || "";
                                    }
                                }
                                
                                if (latexSource && mathEl.parentNode) {
                                    const isInline = mathEl.classList.contains('inline') || mathEl.classList.contains('math-inline') || mathEl.tagName === 'SPAN';
                                    const replacementText = isInline ? " $" + latexSource.trim() + "$ " : "\\\\n\\\\n$$" + latexSource.trim() + "$$\\\\n\\\\n";
                                    const replacement = document.createTextNode(replacementText);
                                    mathEl.parentNode.replaceChild(replacement, mathEl);
                                }
                            });

                            combinedHTML += clone.innerHTML + "\\n";
                        }
                        
                        if (combinedHTML) {
                            console.log("KC Debug: Sending completed static payload to Obsidian (" + combinedHTML.length + " characters).");
                            console.log("gemini-stream-chunk::" + encodeURIComponent("html-payload::" + combinedHTML));
                        } else {
                            console.warn("KC Debug: Response content list resolved to empty HTML structure.");
                        }
                    }

                    findAndFillInput();
                })();
            `;
            
            console.log("Obsidian KC: Executing Javascript injection.");
            webviewEl.executeJavaScript(injectionCode)
                .then(() => console.log("Obsidian KC: executeJavaScript injection success."))
                .catch((err: any) => console.error("Obsidian KC: executeJavaScript injection failed:", err));
        };

        runAutomation();
    }

    handleStreamChunk(htmlContent: string) {
        if (!this.activeEditor || !this.streamStartPos || !this.streamEndPos) return;

        const startPos = this.streamStartPos;
        const endPos = this.streamEndPos;

        let fullMarkdown = "";

        if (htmlContent.startsWith("html-payload::")) {
            const content = htmlContent.substring("html-payload::".length);
            fullMarkdown = htmlToMarkdown(content);
        } else {
            fullMarkdown = htmlContent;
        }

        fullMarkdown = fullMarkdown
            .split("\n")
            .map(line => line.trimEnd())
            .join("\n");

        fullMarkdown = fullMarkdown.replace(/\n{3,}/g, "\n\n");
        fullMarkdown = fullMarkdown.replace(/\n\s*\n\s*([-*+]\s|\d+\.\s)/g, "\n$1");

        this.activeEditor.replaceRange(fullMarkdown, startPos, endPos);

        this.streamStartPos = null;
        this.streamEndPos = null;
        this.activeEditor = null;

        new Notice("✅ Gemini response inserted.");
    }
}

// ── SETTINGS TAB CLASS ─────────────────────────────────────────────────
class KineticCompanionSettingTab extends PluginSettingTab {
    plugin: KineticCompanionPlugin;

    constructor(app: App, plugin: KineticCompanionPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Kinetic Companion Settings' });

        new Setting(containerEl)
            .setName('Typing Caret Sparkles')
            .setDesc('Toggle ON to spawn beautiful glowing kinetic sparkles behind your cursor as you type.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSparkles)
                .onChange(async (value) => {
                    this.plugin.settings.enableSparkles = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Heavy Slam Paste Effect')
            .setDesc('Toggle ON to trigger a satisfying, tactile stamp thud, screen shake, and dust particles whenever you paste text.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSlamPaste)
                .onChange(async (value) => {
                    this.plugin.settings.enableSlamPaste = value;
                    await this.plugin.saveSettings();
                }));
    }
}
```
## V3
- Receiving outputs
```typescript
import { App, Editor, Modal, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf, MarkdownView, htmlToMarkdown } from 'obsidian';

// ── CONFIGURATION & CONSTANTS ──────────────────────────────────────────
interface KineticCompanionSettings {
    enableSparkles: boolean;
    enableSlamPaste: boolean;
}

const DEFAULT_SETTINGS: KineticCompanionSettings = {
    enableSparkles: true,
    enableSlamPaste: true
};

// ── CUSTOM INLINE SELECTION PROMPT MODAL ────────────────────────────────
class SelectionPromptModal extends Modal {
    onSubmit: (instruction: string) => void;
    inputEl!: HTMLInputElement;

    constructor(app: App, onSubmit: (instruction: string) => void) {
        super(app);
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h3", { text: "Kinetic Prompt Selection" });
        
        const desc = contentEl.createEl("p", { text: "How should Gemma 4 update your highlighted selection?" });
        desc.style.cssText = "color: var(--text-muted); font-size: 0.85em; margin-top: 10px;";

        this.inputEl = contentEl.createEl("input", { type: "text" });
        this.inputEl.style.width = "100%";
        this.inputEl.placeholder = "e.g., make it sound warmer, rewrite as bullet list...";
        
        setTimeout(() => this.inputEl.focus(), 20);

        this.scope.register([], "Enter", (evt) => {
            evt.preventDefault();
            this.submit();
        });
    }

    submit() {
        const value = this.inputEl.value.trim();
        if (value) {
            this.onSubmit(value);
        }
        this.close();
    }

    onClose() {
        this.contentEl.empty();
    }
}

// ── CORE PLUGIN IMPLEMENTATION ──────────────────────────────────────────
export default class KineticCompanionPlugin extends Plugin {
    settings!: KineticCompanionSettings;
    activeEditor: Editor | null = null;
    audioCtx: AudioContext | null = null;
    streamStartPos: { line: number; ch: number } | null = null;
    streamEndPos: { line: number; ch: number } | null = null;

    async onload() {
        await this.loadSettings();

        this.addCommand({
            id: 'kinetic-selection-prompt',
            name: 'Prompt with Selection',
            editorCallback: (editor: Editor) => {
                const selection = editor.getSelection().trim();
                if (!selection) {
                    new Notice("Please select some text to prompt with.");
                    return;
                }
                
                const rangeFrom = editor.getCursor('from');
                const rangeTo = editor.getCursor('to');

                const promptModal = new SelectionPromptModal(this.app, (instruction) => {
                    const compiledPrompt = `${instruction}:\n\n${selection}`;
                    this.executeStreamSession(editor, compiledPrompt, rangeFrom, rangeTo);
                });
                promptModal.open();
            }
        });

        this.addRibbonIcon("comment-discussion", "Open Companion View", () => {
            this.activateView(true);
        });

        this.registerEvent(
            this.app.workspace.on('editor-change', (editor: Editor) => {
                if (this.settings.enableSparkles) {
                    this.spawnCursorParticle(editor);
                }
            })
        );

        this.registerEvent(
            this.app.workspace.on('editor-paste', (evt: ClipboardEvent, editor: Editor) => {
                if (this.settings.enableSlamPaste) {
                    this.triggerSlamEffect(editor);
                }
            })
        );

        this.addSettingTab(new KineticCompanionSettingTab(this.app, this));
    }

    async onunload() {
        if (this.audioCtx) {
            try {
                this.audioCtx.close();
            } catch(e) {}
        }
        this.streamStartPos = null;
        this.streamEndPos = null;
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playSlamStamp() {
        this.initAudio();
        if (!this.audioCtx) return;
        try {
            const now = this.audioCtx.currentTime;
            
            const lowOsc = this.audioCtx.createOscillator();
            const lowGain = this.audioCtx.createGain();
            lowOsc.type = 'sawtooth';
            lowOsc.frequency.setValueAtTime(90, now);
            lowOsc.frequency.linearRampToValueAtTime(30, now + 0.15);
            lowGain.gain.setValueAtTime(0.4, now);
            lowGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            lowOsc.connect(lowGain);
            lowGain.connect(this.audioCtx.destination);
            lowOsc.start(now);
            lowOsc.stop(now + 0.16);

            const clickOsc = this.audioCtx.createOscillator();
            const clickGain = this.audioCtx.createGain();
            clickOsc.type = 'triangle';
            clickOsc.frequency.setValueAtTime(600, now);
            clickOsc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
            clickGain.gain.setValueAtTime(0.2, now);
            clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            clickOsc.connect(clickGain);
            clickGain.connect(this.audioCtx.destination);
            clickOsc.start(now);
            clickOsc.stop(now + 0.06);
        } catch(e) {}
    }

    spawnCursorParticle(editor: Editor) {
        try {
            const cursor = editor.getCursor();
            const coords = (editor as any).coordsAtPos(cursor);
            if (coords) {
                const particle = document.createElement("div");
                particle.className = "kc-cursor-particle";
                
                const offsetX = (Math.random() - 0.5) * 8;
                const offsetY = (Math.random() - 0.5) * 4;
                
                particle.style.left = `${coords.left + offsetX}px`;
                particle.style.top = `${coords.top + offsetY}px`;
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 400);
            }
        } catch (e) {
            // Fail silently
        }
    }

    triggerSlamEffect(editor: Editor) {
        try {
            this.playSlamStamp();
            
            const cursor = editor.getCursor();
            const coords = (editor as any).coordsAtPos(cursor);
            if (coords) {
                for (let i = 0; i < 4; i++) {
                    const dustLeft = document.createElement("div");
                    dustLeft.className = "kc-dust-particle kc-dust-left";
                    dustLeft.style.left = `${coords.left}px`;
                    dustLeft.style.top = `${coords.top + (Math.random() - 0.5) * 8}px`;
                    document.body.appendChild(dustLeft);

                    const dustRight = document.createElement("div");
                    dustRight.className = "kc-dust-particle kc-dust-right";
                    dustRight.style.left = `${coords.left}px`;
                    dustRight.style.top = `${coords.top + (Math.random() - 0.5) * 8}px`;
                    document.body.appendChild(dustRight);

                    setTimeout(() => {
                        dustLeft.remove();
                        dustRight.remove();
                    }, 300);
                }

                const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (activeView) {
                    const el = activeView.containerEl;
                    el.classList.add("kc-shaking");
                    setTimeout(() => {
                        el.classList.remove("kc-shaking");
                    }, 150);
                }
            }
        } catch (e) {
            // Fail silently
        }
    }

    async activateView(reveal: boolean = true): Promise<WorkspaceLeaf | null> {
        const { workspace } = this.app;
        
        let leaf: WorkspaceLeaf | null | undefined = workspace.getLeavesOfType("webviewer").find(l => {
            const state = l.getViewState();
            const url = (state.state as any)?.url;
            const matchesUrl = typeof url === "string" && url.includes("aistudio.google.com");
            const inRightSidebar = l.getRoot() === workspace.rightSplit;
            return matchesUrl && inRightSidebar;
        });

        if (!leaf) {
            leaf = workspace.getRightLeaf(false);
            if (!leaf) {
                leaf = workspace.getLeaf('tab');
            }
            
            if (leaf) {
                await leaf.setViewState({
                    type: 'webviewer',
                    state: {
                        url: 'https://aistudio.google.com/',
                        navigate: true,
                    },
                    active: true,
                });
            }
        }
        
        if (leaf && reveal) {
            if (workspace.rightSplit.collapsed) {
                workspace.rightSplit.expand();
            }
            workspace.revealLeaf(leaf);
        }
        return leaf || null;
    }

    async getReadyWebviewElement(view: any): Promise<any> {
        const webview = await new Promise<any>((resolve) => {
            const el = view.containerEl.querySelector("webview");
            if (el) {
                resolve(el);
                return;
            }
            const observer = new MutationObserver(() => {
                const el = view.containerEl.querySelector("webview");
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe(view.containerEl, { childList: true, subtree: true });
            
            setTimeout(() => {
                observer.disconnect();
                resolve(view.containerEl.querySelector("webview"));
            }, 3000);
        });

        if (!webview) return null;

        await new Promise<void>((resolve) => {
            const isWebviewReady = () => {
                try {
                    webview.isLoading();
                    return true;
                } catch (e) {
                    return false;
                }
            };

            if (isWebviewReady()) {
                resolve();
                return;
            }

            const onDomReady = () => {
                webview.removeEventListener("dom-ready", onDomReady);
                resolve();
            };
            webview.addEventListener("dom-ready", onDomReady);

            setTimeout(() => {
                webview.removeEventListener("dom-ready", onDomReady);
                resolve();
            }, 5000);
        });

        return webview;
    }

    async waitForTargetPageLoad(webview: any): Promise<void> {
        return new Promise<void>((resolve) => {
            const checkUrlAndLoad = () => {
                const currentUrl = webview.getURL() || "";
                const isCorrectSite = currentUrl.includes("aistudio.google.com");
                const isStillLoading = webview.isLoading();

                if (isCorrectSite && !isStillLoading) {
                    resolve();
                    return true;
                }
                return false;
            };

            if (checkUrlAndLoad()) return;

            const onStopLoading = () => {
                if (checkUrlAndLoad()) {
                    webview.removeEventListener("did-stop-loading", onStopLoading);
                }
            };
            webview.addEventListener("did-stop-loading", onStopLoading);

            const interval = setInterval(() => {
                if (checkUrlAndLoad()) {
                    clearInterval(interval);
                    webview.removeEventListener("did-stop-loading", onStopLoading);
                }
            }, 500);

            setTimeout(() => {
                clearInterval(interval);
                webview.removeEventListener("did-stop-loading", onStopLoading);
                resolve();
            }, 15000);
        });
    }

    async executeStreamSession(editor: Editor, promptContent: string, rangeFrom: { line: number; ch: number }, rangeTo: { line: number; ch: number }) {
        console.log("Obsidian KC: Starting executeStreamSession.");
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        const originalLeaf = activeView?.leaf;
        const originalCursor = editor.getCursor();

        console.log("Obsidian KC: Locating Web Viewer split.");
        const webviewerLeaf = await this.activateView(true);
        if (!webviewerLeaf) {
            console.error("Obsidian KC: Web Viewer was not ready or enabled.");
            new Notice("Could not open the Web Viewer. Please ensure the 'Web Viewer' core plugin is enabled in Obsidian Settings.");
            return;
        }

        if (originalLeaf) {
            this.app.workspace.setActiveLeaf(originalLeaf, { focus: true });
            editor.setCursor(originalCursor);
        }

        const view = webviewerLeaf.view;
        console.log("Obsidian KC: Fetching ready webview context.");
        const webviewEl = await this.getReadyWebviewElement(view);
        if (!webviewEl) {
            console.error("Obsidian KC: Embedded webview element could not be found.");
            new Notice("Could not find the embedded webview element inside the Web Viewer.");
            return;
        }

        console.log("Obsidian KC: Verifying target page load state.");
        await this.waitForTargetPageLoad(webviewEl);
        console.log("Obsidian KC: Webview initialized and page loaded.");

        this.activeEditor = editor;
        
        const headerText = `\n\n${promptContent}\n\n### 🎯 Paced Outline:\n(Loading response...)`;
        editor.replaceRange(headerText, rangeFrom, rangeTo);

        const newlineCount = (headerText.match(/\n/g) || []).length;
        this.streamStartPos = {
            line: rangeFrom.line + newlineCount,
            ch: 0
        };
        this.streamEndPos = {
            line: rangeFrom.line + newlineCount,
            ch: "(Loading response...)".length
        };

        if (webviewEl._kcListener) {
            webviewEl.removeEventListener("console-message", webviewEl._kcListener);
        }

        webviewEl._kcListener = (event: any) => {
            const message = event.message as string;
            // Route nested webview logs directly to the main Obsidian developer console
            console.log("[WebView Guest]", message);

            if (message && message.startsWith("gemini-stream-chunk::")) {
                const encodedHTML = message.substring("gemini-stream-chunk::".length);
                try {
                    const decodedHTML = decodeURIComponent(encodedHTML);
                    this.handleStreamChunk(decodedHTML);
                } catch (e) {
                    console.error("Obsidian KC: Parsing received HTML stream chunk failed:", e);
                }
            }
        };

        webviewEl.addEventListener("console-message", webviewEl._kcListener);

        const runAutomation = () => {
            const escapedPrompt = JSON.stringify(promptContent);
            
            console.log("Obsidian KC: Crafting injection script payload.");
            const injectionCode = `
                (function() {
                    const promptText = ${escapedPrompt};
                    console.log("KC Debug: Guest automation process initiated.");

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

                    let fillRetries = 0;
                    function findAndFillInput() {
                        console.log("KC Debug: Querying main input text field... (Attempt: " + (fillRetries + 1) + ")");
                        const inputEl = queryShadowSelector('ms-prompt-box textarea, ms-prompt-box ms-autosize-textarea textarea, textarea[aria-label="Type something"], textarea[aria-label="Enter a prompt"], textarea, div[contenteditable="true"], [role="textbox"]');
                        if (inputEl) {
                            console.log("KC Debug: Target input located successfully:", inputEl);
                            const initialTurnCount = queryShadowSelectorAll('ms-chat-turn').length;
                            console.log("KC Debug: Initial history chat turn count:", initialTurnCount);

                            if (inputEl.tagName === 'DIV') {
                                inputEl.textContent = promptText;
                            } else {
                                inputEl.value = promptText;
                            }
                            inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                            inputEl.dispatchEvent(new Event('change', { bubbles: true }));

                            setTimeout(() => {
                                let parent = inputEl.parentElement;
                                let runButton = null;
                                
                                while (parent && !runButton) {
                                    runButton = parent.querySelector('ms-prompt-box ms-run-button button[aria-label="Run"], ms-prompt-box button[aria-label="Run"][type="submit"], button.run-button, button[aria-label="Run"], button[aria-label="Run prompt"], ms-run-button button[type="submit"].run-button');
                                    if (!runButton) {
                                        const containerButtons = parent.querySelectorAll('button');
                                        for (let i = 0; i < containerButtons.length; i++) {
                                            const btn = containerButtons[i];
                                            const text = (btn.textContent || '').trim();
                                            if (text.startsWith('Run') || btn.classList.contains('run-button')) {
                                                runButton = btn;
                                                break;
                                            }
                                        }
                                    }
                                    if (parent.tagName === 'BODY') {
                                        break;
                                    }
                                    parent = parent.parentElement;
                                }

                                if (runButton) {
                                    console.log("KC Debug: Executing run button click:", runButton);
                                    runButton.click();
                                } else {
                                    console.log("KC Debug: Run button absent. Dispatching Ctrl+Enter KeyboardEvent fallback.");
                                    const enterEvent = new KeyboardEvent('keydown', {
                                        key: 'Enter', code: 'Enter', keyCode: 13, ctrlKey: true, metaKey: true, bubbles: true, cancelable: true
                                    });
                                    inputEl.dispatchEvent(enterEvent);
                                }
                                waitForCompletionAndExtract(initialTurnCount);
                            }, 250);
                        } else {
                            fillRetries++;
                            if (fillRetries < 40) {
                                setTimeout(findAndFillInput, 500);
                            } else {
                                console.error("KC Debug: Could not locate active input element context.");
                            }
                        }
                    }

                    function waitForCompletionAndExtract(initialCount) {
                        console.log("KC Debug: Initiating completed-state polling tracker.");
                        let checkCount = 0;
                        const maxChecks = 180; // 90 seconds timeout
                        let generationStarted = false;

                        const pollInterval = setInterval(() => {
                            checkCount++;

                            // Inspect current active state of Google's Run/Stop control
                            let runBtn = null;
                            const promptBox = queryShadowSelector('ms-prompt-box');
                            if (promptBox) {
                                runBtn = queryShadowSelector('button.run-button, button[aria-label*="Run"], button[aria-label*="Stop"], ms-run-button button', promptBox);
                            }
                            if (!runBtn) {
                                runBtn = queryShadowSelector('button.run-button, button[aria-label*="Run"], button[aria-label*="Stop"], ms-run-button button');
                            }

                            let isStopState = false;
                            if (runBtn) {
                                const ariaLabel = runBtn.getAttribute("aria-label") || "";
                                const textContent = (runBtn.textContent || "").trim();
                                isStopState = ariaLabel.includes("Stop") || textContent.includes("Stop");
                            }

                            if (isStopState) {
                                generationStarted = true;
                                console.log("KC Debug: Active stream detected (Stop button present). Polling state... (" + checkCount + ")");
                            }

                            if ((generationStarted && !isStopState) || (checkCount > maxChecks) || (!generationStarted && checkCount > 30 && !isStopState)) {
                                clearInterval(pollInterval);
                                console.log("KC Debug: Generation completed or timed out. Executing content extraction...");
                                extractFinalResponse(initialCount);
                            }
                        }, 500);
                    }

                    function extractFinalResponse(initialCount) {
                        const turns = queryShadowSelectorAll('ms-chat-turn');
                        console.log("KC Debug: Finalizing extraction. Detected chat turns count: " + turns.length);

                        let modelContainer = null;
                        for (let i = turns.length - 1; i >= initialCount; i--) {
                            const turn = turns[i];
                            const container = turn.querySelector('.chat-turn-container.model');
                            if (container) {
                                modelContainer = container;
                                break;
                            }
                        }

                        if (!modelContainer) {
                            console.error("KC Debug: Active model turn element missing from workspace layout.");
                            return;
                        }

                        const cmarkEls = queryShadowSelectorAll('ms-cmark-node, .model-content, .markdown', modelContainer);
                        
                        const isInsideThinking = (node) => {
                            while (node) {
                                const tag = node.tagName || "";
                                if (tag === 'MS-THOUGHT-CHUNK' || 
                                    tag === 'MODEL-THOUGHTS' || 
                                    (node.classList && (
                                        node.classList.contains('thinking') || 
                                        node.classList.contains('thought-container')
                                    ))) {
                                        return true;
                                    }
                                    node = node.parentNode || node.host;
                                }
                                return false;
                            };

                        const nonThinkingEls = cmarkEls.filter(el => !isInsideThinking(el));

                        const uniqueEls = nonThinkingEls.filter(el => {
                            return !nonThinkingEls.some(otherEl => otherEl !== el && otherEl.contains(el));
                        });

                        let combinedHTML = "";
                        for (let j = 0; j < uniqueEls.length; j++) {
                            const el = uniqueEls[j];
                            const clone = el.cloneNode(true);
                            
                            // Process Math Blocks using trusted-types safe replacement
                            const mathBlocks = clone.querySelectorAll('ms-math-block, math-block');
                            mathBlocks.forEach(block => {
                                const rawTex = block.text || block.math || block.getAttribute('math') || block.getAttribute('value') || "";
                                if (rawTex && block.parentNode) {
                                    const replacement = document.createTextNode("\\\\n\\\\n$$" + rawTex + "$$\\\\n\\\\n");
                                    block.parentNode.replaceChild(replacement, block);
                                }
                            });

                            // Process Math Inlines using trusted-types safe replacement
                            const mathInlines = clone.querySelectorAll('ms-math-inline, math-inline, span.math');
                            mathInlines.forEach(inline => {
                                const rawTex = inline.text || inline.math || inline.getAttribute('math') || inline.getAttribute('value') || "";
                                if (rawTex && inline.parentNode) {
                                    const replacement = document.createTextNode(" $" + rawTex + "$ ");
                                    inline.parentNode.replaceChild(replacement, inline);
                                } else if (inline.parentNode) {
                                    const script = inline.querySelector('script[type="math/tex"]');
                                    if (script && script.textContent) {
                                        const replacement = document.createTextNode(" $" + script.textContent + "$ ");
                                        inline.parentNode.replaceChild(replacement, inline);
                                    }
                                }
                            });

                            // Process Modern KaTeX Elements using trusted-types safe replacement
                            const katexElements = clone.querySelectorAll('ms-katex, .math-block, .math-inline, .katex');
                            katexElements.forEach(mathEl => {
                                let latexSource = mathEl.text || mathEl.math || mathEl.getAttribute('text') || mathEl.getAttribute('math') || "";
                                
                                if (!latexSource) {
                                    const annotation = mathEl.querySelector('annotation[encoding="application/x-tex"]');
                                    if (annotation) {
                                        latexSource = annotation.textContent || "";
                                    }
                                }
                                
                                if (latexSource && mathEl.parentNode) {
                                    const isInline = mathEl.classList.contains('inline') || mathEl.classList.contains('math-inline') || mathEl.tagName === 'SPAN';
                                    const replacementText = isInline ? " $" + latexSource.trim() + "$ " : "\\\\n\\\\n$$" + latexSource.trim() + "$$\\\\n\\\\n";
                                    const replacement = document.createTextNode(replacementText);
                                    mathEl.parentNode.replaceChild(replacement, mathEl);
                                }
                            });

                            combinedHTML += clone.innerHTML + "\\n";
                        }
                        
                        if (combinedHTML) {
                            console.log("KC Debug: Sending completed static payload to Obsidian (" + combinedHTML.length + " characters).");
                            console.log("gemini-stream-chunk::" + encodeURIComponent("html-payload::" + combinedHTML));
                        } else {
                            console.warn("KC Debug: Response content list resolved to empty HTML structure.");
                        }
                    }

                    findAndFillInput();
                })();
            `;
            
            console.log("Obsidian KC: Executing Javascript injection.");
            webviewEl.executeJavaScript(injectionCode)
                .then(() => console.log("Obsidian KC: executeJavaScript injection success."))
                .catch((err: any) => console.error("Obsidian KC: executeJavaScript injection failed:", err));
        };

        runAutomation();
    }

    handleStreamChunk(htmlContent: string) {
        if (!this.activeEditor || !this.streamStartPos || !this.streamEndPos) return;

        const startPos = this.streamStartPos;
        const endPos = this.streamEndPos;

        let fullMarkdown = "";

        if (htmlContent.startsWith("html-payload::")) {
            const content = htmlContent.substring("html-payload::".length);
            fullMarkdown = htmlToMarkdown(content);
        } else {
            fullMarkdown = htmlContent;
        }

        fullMarkdown = fullMarkdown
            .split("\n")
            .map(line => line.trimEnd())
            .join("\n");

        fullMarkdown = fullMarkdown.replace(/\n{3,}/g, "\n\n");
        fullMarkdown = fullMarkdown.replace(/\n\s*\n\s*([-*+]\s|\d+\.\s)/g, "\n$1");

        this.activeEditor.replaceRange(fullMarkdown, startPos, endPos);

        this.streamStartPos = null;
        this.streamEndPos = null;
        this.activeEditor = null;

        new Notice("✅ Gemini response inserted.");
    }
}

// ── SETTINGS TAB CLASS ─────────────────────────────────────────────────
class KineticCompanionSettingTab extends PluginSettingTab {
    plugin: KineticCompanionPlugin;

    constructor(app: App, plugin: KineticCompanionPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Kinetic Companion Settings' });

        new Setting(containerEl)
            .setName('Typing Caret Sparkles')
            .setDesc('Toggle ON to spawn beautiful glowing kinetic sparkles behind your cursor as you type.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSparkles)
                .onChange(async (value) => {
                    this.plugin.settings.enableSparkles = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Heavy Slam Paste Effect')
            .setDesc('Toggle ON to trigger a satisfying, tactile stamp thud, screen shake, and dust particles whenever you paste text.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSlamPaste)
                .onChange(async (value) => {
                    this.plugin.settings.enableSlamPaste = value;
                    await this.plugin.saveSettings();
                }));
    }
}
```
## V2
- MathJax not working
```typescript
import { App, Editor, Modal, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf, MarkdownView, htmlToMarkdown } from 'obsidian';

// ── CONFIGURATION & CONSTANTS ──────────────────────────────────────────
// No custom view type registration is needed, as we leverage the native 'webviewer' state.

interface KineticCompanionSettings {
    enableSparkles: boolean;
    enableSlamPaste: boolean;
}

const DEFAULT_SETTINGS: KineticCompanionSettings = {
    enableSparkles: true,
    enableSlamPaste: true
};

// ── CUSTOM INLINE SELECTION PROMPT MODAL ────────────────────────────────
class SelectionPromptModal extends Modal {
    onSubmit: (instruction: string) => void;
    inputEl!: HTMLInputElement;

    constructor(app: App, onSubmit: (instruction: string) => void) {
        super(app);
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h3", { text: "Kinetic Prompt Selection" });
        
        const desc = contentEl.createEl("p", { text: "How should Gemma 4 update your highlighted selection?" });
        desc.style.cssText = "color: var(--text-muted); font-size: 0.85em; margin-top: 10px;";

        this.inputEl = contentEl.createEl("input", { type: "text" });
        this.inputEl.style.width = "100%";
        this.inputEl.placeholder = "e.g., make it sound warmer, rewrite as bullet list...";
        
        setTimeout(() => this.inputEl.focus(), 20);

        this.scope.register([], "Enter", (evt) => {
            evt.preventDefault();
            this.submit();
        });
    }

    submit() {
        const value = this.inputEl.value.trim();
        if (value) {
            this.onSubmit(value);
        }
        this.close();
    }

    onClose() {
        this.contentEl.empty();
    }
}

// ── CORE PLUGIN IMPLEMENTATION ──────────────────────────────────────────
export default class KineticCompanionPlugin extends Plugin {
    settings!: KineticCompanionSettings;
    activeEditor: Editor | null = null;
    audioCtx: AudioContext | null = null;
    streamStartPos: { line: number; ch: number } | null = null;
    streamEndPos: { line: number; ch: number } | null = null;

    async onload() {
        await this.loadSettings();

        // 1. Register Active Highlight-to-Prompt command (no pre-defined hotkeys)
        this.addCommand({
            id: 'kinetic-selection-prompt',
            name: 'Prompt with Selection',
            editorCallback: (editor: Editor) => {
                const selection = editor.getSelection().trim();
                if (!selection) {
                    new Notice("Please select some text to prompt with.");
                    return;
                }
                
                // Capture coordinates of selection before opening modal
                const rangeFrom = editor.getCursor('from');
                const rangeTo = editor.getCursor('to');

                const promptModal = new SelectionPromptModal(this.app, (instruction) => {
                    const compiledPrompt = `${instruction}:\n\n${selection}`;
                    this.executeStreamSession(editor, compiledPrompt, rangeFrom, rangeTo);
                });
                promptModal.open();
            }
        });

        this.addRibbonIcon("comment-discussion", "Open Companion View", () => {
            this.activateView(true); // Open and reveal the sidebar tab explicitly
        });

        // 2. Register Editor Sparkle Visualizer
        this.registerEvent(
            this.app.workspace.on('editor-change', (editor: Editor) => {
                if (this.settings.enableSparkles) {
                    this.spawnCursorParticle(editor);
                }
            })
        );

        // 3. Register Heavy Slam Paste Listener
        this.registerEvent(
            this.app.workspace.on('editor-paste', (evt: ClipboardEvent, editor: Editor) => {
                if (this.settings.enableSlamPaste) {
                    this.triggerSlamEffect(editor);
                }
            })
        );

        this.addSettingTab(new KineticCompanionSettingTab(this.app, this));
    }

    async onunload() {
        if (this.audioCtx) {
            try {
                this.audioCtx.close();
            } catch(e) {}
        }
        this.streamStartPos = null;
        this.streamEndPos = null;
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playSlamStamp() {
        this.initAudio();
        if (!this.audioCtx) return;
        try {
            const now = this.audioCtx.currentTime;
            
            const lowOsc = this.audioCtx.createOscillator();
            const lowGain = this.audioCtx.createGain();
            lowOsc.type = 'sawtooth';
            lowOsc.frequency.setValueAtTime(90, now);
            lowOsc.frequency.linearRampToValueAtTime(30, now + 0.15);
            lowGain.gain.setValueAtTime(0.4, now);
            lowGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            lowOsc.connect(lowGain);
            lowGain.connect(this.audioCtx.destination);
            lowOsc.start(now);
            lowOsc.stop(now + 0.16);

            const clickOsc = this.audioCtx.createOscillator();
            const clickGain = this.audioCtx.createGain();
            clickOsc.type = 'triangle';
            clickOsc.frequency.setValueAtTime(600, now);
            clickOsc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
            clickGain.gain.setValueAtTime(0.2, now);
            clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            clickOsc.connect(clickGain);
            clickGain.connect(this.audioCtx.destination);
            clickOsc.start(now);
            clickOsc.stop(now + 0.06);
        } catch(e) {}
    }

    spawnCursorParticle(editor: Editor) {
        try {
            const cursor = editor.getCursor();
            const coords = (editor as any).coordsAtPos(cursor);
            if (coords) {
                const particle = document.createElement("div");
                particle.className = "kc-cursor-particle";
                
                const offsetX = (Math.random() - 0.5) * 8;
                const offsetY = (Math.random() - 0.5) * 4;
                
                particle.style.left = `${coords.left + offsetX}px`;
                particle.style.top = `${coords.top + offsetY}px`;
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 400);
            }
        } catch (e) {
            // Fail silently
        }
    }

    triggerSlamEffect(editor: Editor) {
        try {
            this.playSlamStamp();
            
            const cursor = editor.getCursor();
            const coords = (editor as any).coordsAtPos(cursor);
            if (coords) {
                for (let i = 0; i < 4; i++) {
                    const dustLeft = document.createElement("div");
                    dustLeft.className = "kc-dust-particle kc-dust-left";
                    dustLeft.style.left = `${coords.left}px`;
                    dustLeft.style.top = `${coords.top + (Math.random() - 0.5) * 8}px`;
                    document.body.appendChild(dustLeft);

                    const dustRight = document.createElement("div");
                    dustRight.className = "kc-dust-particle kc-dust-right";
                    dustRight.style.left = `${coords.left}px`;
                    dustRight.style.top = `${coords.top + (Math.random() - 0.5) * 8}px`;
                    document.body.appendChild(dustRight);

                    setTimeout(() => {
                        dustLeft.remove();
                        dustRight.remove();
                    }, 300);
                }

                const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (activeView) {
                    const el = activeView.containerEl;
                    el.classList.add("kc-shaking");
                    setTimeout(() => {
                        el.classList.remove("kc-shaking");
                    }, 150);
                }
            }
        } catch (e) {
            // Fail silently
        }
    }

    // Opens or targets the native core 'webviewer' inside the right sidebar
    async activateView(reveal: boolean = true): Promise<WorkspaceLeaf | null> {
        const { workspace } = this.app;
        
        // Find existing 'webviewer' leaf specifically within the right sidebar pointing to Google AI Studio
        let leaf: WorkspaceLeaf | null | undefined = workspace.getLeavesOfType("webviewer").find(l => {
            const state = l.getViewState();
            const url = (state.state as any)?.url;
            const matchesUrl = typeof url === "string" && url.includes("aistudio.google.com");
            const inRightSidebar = l.getRoot() === workspace.rightSplit;
            return matchesUrl && inRightSidebar;
        });

        if (!leaf) {
            // Generate the native webviewer leaf specifically in the right sidebar split
            leaf = workspace.getRightLeaf(false);
            if (!leaf) {
                leaf = workspace.getLeaf('tab');
            }
            
            if (leaf) {
                await leaf.setViewState({
                    type: 'webviewer',
                    state: {
                        url: 'https://aistudio.google.com/',
                        navigate: true,
                    },
                    active: true, // Set to true so Chromium instantiates the WebContents
                });
            }
        }
        
        if (leaf && reveal) {
            // Expand right sidebar split if collapsed to allow element rendering
            if (workspace.rightSplit.collapsed) {
                workspace.rightSplit.expand();
            }
            workspace.revealLeaf(leaf);
        }
        return leaf || null;
    }

    // Asynchronously locates and waits for the underlying webview component to be mounted and ready
    async getReadyWebviewElement(view: any): Promise<any> {
        const webview = await new Promise<any>((resolve) => {
            const el = view.containerEl.querySelector("webview");
            if (el) {
                resolve(el);
                return;
            }
            const observer = new MutationObserver(() => {
                const el = view.containerEl.querySelector("webview");
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe(view.containerEl, { childList: true, subtree: true });
            
            // Timeout safety fallback
            setTimeout(() => {
                observer.disconnect();
                resolve(view.containerEl.querySelector("webview"));
            }, 3000);
        });

        if (!webview) return null;

        // 1. Wait for dom-ready of the webview element context itself (so isLoading() doesn't throw)
        await new Promise<void>((resolve) => {
            const isWebviewReady = () => {
                try {
                    webview.isLoading();
                    return true;
                } catch (e) {
                    return false;
                }
            };

            if (isWebviewReady()) {
                resolve();
                return;
            }

            const onDomReady = () => {
                webview.removeEventListener("dom-ready", onDomReady);
                resolve();
            };
            webview.addEventListener("dom-ready", onDomReady);

            // Safety timeout
            setTimeout(() => {
                webview.removeEventListener("dom-ready", onDomReady);
                resolve();
            }, 5000);
        });

        return webview;
    }

    // Waits for the actual URL content inside the webview frame to finish loading completely
    async waitForTargetPageLoad(webview: any): Promise<void> {
        return new Promise<void>((resolve) => {
            const checkUrlAndLoad = () => {
                const currentUrl = webview.getURL() || "";
                const isCorrectSite = currentUrl.includes("aistudio.google.com");
                const isStillLoading = webview.isLoading();

                if (isCorrectSite && !isStillLoading) {
                    resolve();
                    return true;
                }
                return false;
            };

            if (checkUrlAndLoad()) return;

            const onStopLoading = () => {
                if (checkUrlAndLoad()) {
                    webview.removeEventListener("did-stop-loading", onStopLoading);
                }
            };
            webview.addEventListener("did-stop-loading", onStopLoading);

            // Periodically check context transitions to catch dynamic SPA navigation changes
            const interval = setInterval(() => {
                if (checkUrlAndLoad()) {
                    clearInterval(interval);
                    webview.removeEventListener("did-stop-loading", onStopLoading);
                }
            }, 500);

            // Safety fallback timeout
            setTimeout(() => {
                clearInterval(interval);
                webview.removeEventListener("did-stop-loading", onStopLoading);
                resolve();
            }, 15000);
        });
    }

    async executeStreamSession(editor: Editor, promptContent: string, rangeFrom: { line: number; ch: number }, rangeTo: { line: number; ch: number }) {
        // Capture original workspace focus states to prevent background disruption
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        const originalLeaf = activeView?.leaf;
        const originalCursor = editor.getCursor();

        // Open and expand the view to force Chromium layout initialization
        const webviewerLeaf = await this.activateView(true);
        if (!webviewerLeaf) {
            new Notice("Could not open the Web Viewer. Please ensure the 'Web Viewer' core plugin is enabled in Obsidian Settings.");
            return;
        }

        // Restore active editor and cursor focus
        if (originalLeaf) {
            this.app.workspace.setActiveLeaf(originalLeaf, { focus: true });
            editor.setCursor(originalCursor);
        }

        const view = webviewerLeaf.view;
        const webviewEl = await this.getReadyWebviewElement(view);
        if (!webviewEl) {
            new Notice("Could not find the embedded webview element inside the Web Viewer.");
            return;
        }

        // Wait explicitly for Google AI Studio target site stabilization before attempting injection
        await this.waitForTargetPageLoad(webviewEl);

        this.activeEditor = editor;
        
        // Swap out the precise selection range in the editor with the prompt header
        const headerText = `\n\n${promptContent}\n\n### 🎯 Paced Outline:\n`;
        editor.replaceRange(headerText, rangeFrom, rangeTo);

        // Compute offset lines to begin target streaming correctly below the header
        const newlineCount = (headerText.match(/\n/g) || []).length;
        this.streamStartPos = {
            line: rangeFrom.line + newlineCount,
            ch: 0
        };
        this.streamEndPos = {
            line: rangeFrom.line + newlineCount,
            ch: 0
        };

        if (webviewEl._kcListener) {
            webviewEl.removeEventListener("console-message", webviewEl._kcListener);
        }

        // Fix potential lexical scope resolution warning inside listener constructor
        webviewEl._kcListener = (event: any) => {
            const message = event.message as string;
            if (message && message.startsWith("gemini-stream-chunk::")) {
                const encodedHTML = message.substring("gemini-stream-chunk::".length);
                try {
                    const decodedHTML = decodeURIComponent(encodedHTML);
                    this.handleStreamChunk(decodedHTML);
                } catch (e) {
                    // Fail silently
                }
            }
        };

        webviewEl.addEventListener("console-message", webviewEl._kcListener);

        const runAutomation = () => {
            const escapedPrompt = JSON.stringify(promptContent);
            
            const injectionCode = `
                (function() {
                    const promptText = ${escapedPrompt};

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

                    let fillRetries = 0;
                    function findAndFillInput() {
                        const inputEl = queryShadowSelector('ms-prompt-box textarea, ms-prompt-box ms-autosize-textarea textarea, textarea[aria-label="Type something"], textarea[aria-label="Enter a prompt"], textarea, div[contenteditable="true"], [role="textbox"]');
                        if (inputEl) {
                            // Capture the initial turn count BEFORE executing the prompt to ignore previous history
                            const initialTurnCount = queryShadowSelectorAll('ms-chat-turn').length;

                            if (inputEl.tagName === 'DIV') {
                                inputEl.textContent = promptText;
                            } else {
                                inputEl.value = promptText;
                            }
                            inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                            inputEl.dispatchEvent(new Event('change', { bubbles: true }));

                            setTimeout(() => {
                                let parent = inputEl.parentElement;
                                let runButton = null;
                                
                                while (parent && !runButton) {
                                    runButton = parent.querySelector('ms-prompt-box ms-run-button button[aria-label="Run"], ms-prompt-box button[aria-label="Run"][type="submit"], button.run-button, button[aria-label="Run"], button[aria-label="Run prompt"], ms-run-button button[type="submit"].run-button');
                                    if (!runButton) {
                                        const containerButtons = parent.querySelectorAll('button');
                                        for (let i = 0; i < containerButtons.length; i++) {
                                            const btn = containerButtons[i];
                                            const text = (btn.textContent || '').trim();
                                            if (text.startsWith('Run') || btn.classList.contains('run-button')) {
                                                runButton = btn;
                                                break;
                                            }
                                        }
                                    }
                                    if (parent.tagName === 'BODY') {
                                        break;
                                    }
                                    parent = parent.parentElement;
                                }

                                if (runButton) {
                                    runButton.click();
                                } else {
                                    const enterEvent = new KeyboardEvent('keydown', {
                                        key: 'Enter', code: 'Enter', keyCode: 13, ctrlKey: true, metaKey: true, bubbles: true, cancelable: true
                                    });
                                    inputEl.dispatchEvent(enterEvent);
                                }
                                startObserving(initialTurnCount);
                            }, 250);
                        } else {
                            // Retry query in guest frame to adapt to dynamic client-side DOM loads
                            fillRetries++;
                            if (fillRetries < 40) {
                                setTimeout(findAndFillInput, 500);
                            }
                        }
                    }

                    let observer = window.__kcObserver;
                    function startObserving(initialCount) {
                        if (observer) observer.disconnect();
                        
                        const container = queryShadowSelector('ms-autoscroll-container, .conversation-container, .chat-history, [role="log"]');
                        if (!container) {
                            setTimeout(() => startObserving(initialCount), 1000);
                            return;
                        }

                        observer = new MutationObserver(() => {
                            const turns = queryShadowSelectorAll('ms-chat-turn');
                            if (turns.length > initialCount) {
                                // Find the latest model turn in the list to prevent targeting uninitialized user blocks
                                let modelContainer = null;
                                for (let i = turns.length - 1; i >= initialCount; i--) {
                                    const turn = turns[i];
                                    const container = turn.querySelector('.chat-turn-container.model');
                                    if (container) {
                                        modelContainer = container;
                                        break;
                                    }
                                }

                                if (modelContainer) {
                                    // Retrieve cmark nodes through deep shadow boundary searching
                                    const cmarkEls = queryShadowSelectorAll('ms-cmark-node, .model-content, .markdown', modelContainer);
                                    
                                    // Walks upwards crossing parent and shadow borders to determine if nested inside a reasoning section
                                    const isInsideThinking = (node) => {
                                        while (node) {
                                            const tag = node.tagName || "";
                                            if (tag === 'MS-THOUGHT-CHUNK' || 
                                                tag === 'MODEL-THOUGHTS' || 
                                                (node.classList && (
                                                    node.classList.contains('thinking') || 
                                                    node.classList.contains('thought-container')
                                                ))) {
                                                    return true;
                                                }
                                                node = node.parentNode || node.host;
                                            }
                                            return false;
                                        };

                                        // Filter out thinking blocks first
                                        const nonThinkingEls = cmarkEls.filter(el => !isInsideThinking(el));

                                        // Filter out any elements that are nested inside another element in the list to prevent duplication
                                        const uniqueEls = nonThinkingEls.filter(el => {
                                            return !nonThinkingEls.some(otherEl => otherEl !== el && otherEl.contains(el));
                                        });

                                        let combinedHTML = "";
                                        for (let j = 0; j < uniqueEls.length; j++) {
                                            const el = uniqueEls[j];
                                            
                                            // Clone the node to prevent live DOM mutations during processing
                                            const clone = el.cloneNode(true);
                                            
                                            // Extract and format display LaTeX blocks
                                            const mathBlocks = clone.querySelectorAll('ms-math-block, math-block');
                                            mathBlocks.forEach(block => {
                                                const rawTex = block.text || block.math || block.getAttribute('math') || block.getAttribute('value') || "";
                                                if (rawTex) {
                                                    block.outerHTML = "\\n\\n$$" + rawTex + "$$\\n\\n";
                                                }
                                            });

                                            // Extract and format inline LaTeX spans
                                            const mathInlines = clone.querySelectorAll('ms-math-inline, math-inline, span.math');
                                            mathInlines.forEach(inline => {
                                                const rawTex = inline.text || inline.math || inline.getAttribute('math') || inline.getAttribute('value') || "";
                                                if (rawTex) {
                                                    inline.outerHTML = " $" + rawTex + "$ ";
                                                } else {
                                                    const script = inline.querySelector('script[type="math/tex"]');
                                                    if (script) {
                                                        inline.outerHTML = " $" + script.textContent + "$ ";
                                                    }
                                                }
                                            });

                                            combinedHTML += clone.innerHTML + "\\n";
                                        }
                                        
                                        if (combinedHTML) {
                                            console.log("gemini-stream-chunk::" + encodeURIComponent("html-payload::" + combinedHTML));
                                        }
                                    }
                                }
                        });
                        observer.observe(container, { childList: true, subtree: true, characterData: true });
                        window.__kcObserver = observer;
                    }

                    findAndFillInput();
                })();
            `;
            webviewEl.executeJavaScript(injectionCode);
        };

        runAutomation();
    }

    handleStreamChunk(htmlContent: string) {
        if (!this.activeEditor || !this.streamStartPos || !this.streamEndPos) return;

        const startPos = this.streamStartPos;
        const endPos = this.streamEndPos;

        let fullMarkdown = "";

        if (htmlContent.startsWith("html-payload::")) {
            const content = htmlContent.substring("html-payload::".length);
            fullMarkdown = htmlToMarkdown(content);
        } else {
            fullMarkdown = htmlContent;
        }

        // Strip trailing spaces and trailing indents from blank lines
        fullMarkdown = fullMarkdown
            .split("\n")
            .map(line => line.trimEnd())
            .join("\n");

        // Limit consecutive blank lines between blocks to at most one empty line
        fullMarkdown = fullMarkdown.replace(/\n{3,}/g, "\n\n");

        // Normalize lists to eliminate double newline gaps between consecutive list elements
        fullMarkdown = fullMarkdown.replace(/\n\s*\n\s*([-*+]\s|\d+\.\s)/g, "\n$1");

        // Overwrite the entire streaming target range to prevent character slicing corruptions
        this.activeEditor.replaceRange(fullMarkdown, startPos, endPos);

        // Compute and update the next stream end coordinates dynamically
        const lines = fullMarkdown.split("\n");
        const lastLine = lines[lines.length - 1] ?? "";
        
        this.streamEndPos = {
            line: startPos.line + lines.length - 1,
            ch: lines.length > 1 ? lastLine.length : startPos.ch + fullMarkdown.length
        };
    }
}

// ── SETTINGS TAB CLASS ─────────────────────────────────────────────────
class KineticCompanionSettingTab extends PluginSettingTab {
    plugin: KineticCompanionPlugin;

    constructor(app: App, plugin: KineticCompanionPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Kinetic Companion Settings' });

        new Setting(containerEl)
            .setName('Typing Caret Sparkles')
            .setDesc('Toggle ON to spawn beautiful glowing kinetic sparkles behind your cursor as you type.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSparkles)
                .onChange(async (value) => {
                    this.plugin.settings.enableSparkles = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Heavy Slam Paste Effect')
            .setDesc('Toggle ON to trigger a satisfying, tactile stamp thud, screen shake, and dust particles whenever you paste text.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSlamPaste)
                .onChange(async (value) => {
                    this.plugin.settings.enableSlamPaste = value;
                    await this.plugin.saveSettings();
                }));
    }
}
```
## Main.ts V1
```typescript
import { App, Editor, Modal, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf, MarkdownView } from 'obsidian';
import * as path from 'path';
import * as fs from 'fs';

// ── CONFIGURATION & CONSTANTS ──────────────────────────────────────────

interface KineticCompanionSettings {
    enableSparkles: boolean;
    enableSlamPaste: boolean;
    autoApplyChanges: boolean;       // Automatically write files on stream finish
    buildExecutionCommand: string;    // Command to execute after applying files
    currentDir: string;              // Active workspace directory
}

const DEFAULT_SETTINGS: KineticCompanionSettings = {
    enableSparkles: true,
    enableSlamPaste: true,
    autoApplyChanges: false,
    buildExecutionCommand: 'npm run build',
    currentDir: ''
};

// ── CUSTOM INLINE SELECTION PROMPT MODAL ────────────────────────────────
class SelectionPromptModal extends Modal {
    onSubmit: (instruction: string) => void;
    inputEl!: HTMLInputElement;

    constructor(app: App, onSubmit: (instruction: string) => void) {
        super(app);
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h3", { text: "Kinetic Prompt Selection" });
        
        const desc = contentEl.createEl("p", { text: "How should Gemma 4 update your highlighted selection?" });
        desc.style.cssText = "color: var(--text-muted); font-size: 0.85em; margin-top: 10px;";

        this.inputEl = contentEl.createEl("input", { type: "text" });
        this.inputEl.style.width = "100%";
        this.inputEl.placeholder = "e.g., make it sound warmer, rewrite as bullet list...";
        
        setTimeout(() => this.inputEl.focus(), 20);

        this.scope.register([], "Enter", (evt) => {
            evt.preventDefault();
            this.submit();
        });
    }

    submit() {
        const value = this.inputEl.value.trim();
        if (value) {
            this.onSubmit(value);
        }
        this.close();
    }

    onClose() {
        this.contentEl.empty();
    }
}

// ── CORE PLUGIN IMPLEMENTATION ──────────────────────────────────────────
export default class KineticCompanionPlugin extends Plugin {
    settings!: KineticCompanionSettings;
    activeEditor: Editor | null = null;
    writtenTextLength: number = 0;
    audioCtx: AudioContext | null = null;
    streamCurrentPos: { line: number; ch: number } | null = null;

    async onload() {
        await this.loadSettings();

        // 1. Command: Prompt with Selection
        this.addCommand({
            id: 'kinetic-selection-prompt',
            name: 'Kinetic Companion: Prompt with Selection',
            hotkeys: [{ modifiers: ["Ctrl", "Meta"], key: "i" }],
            editorCallback: (editor: Editor) => {
                const selection = editor.getSelection().trim();
                if (!selection) {
                    new Notice("Please select some text to prompt with.");
                    return;
                }

                const promptModal = new SelectionPromptModal(this.app, (instruction) => {
                    const compiledPrompt = `${instruction}:\n\n${selection}\n\nNote: If you are suggesting code changes, please structure them exactly as:\nFILE: relative/path/to/file.ext\n\`\`\`language\n// code\n\`\`\``;
                    this.executeStreamSession(editor, compiledPrompt);
                });
                promptModal.open();
            }
        });

        // 2. Command: Manual Apply Code Changes & Build
        this.addCommand({
            id: 'kinetic-apply-changes',
            name: 'Kinetic Companion: Apply Code Changes & Build',
            callback: () => this.applyCodeChangesAndBuild(),
        });

        this.addRibbonIcon("comment-discussion", "Open Companion View", () => {
            this.activateView(true);
        });

        // 3. Editor Visualizers
        this.registerEvent(
            this.app.workspace.on('editor-change', (editor: Editor) => {
                if (this.settings.enableSparkles) {
                    this.spawnCursorParticle(editor);
                }
            })
        );

        this.registerEvent(
            this.app.workspace.on('editor-paste', (evt: ClipboardEvent, editor: Editor) => {
                if (this.settings.enableSlamPaste) {
                    this.triggerSlamEffect(editor);
                }
            })
        );

        this.addSettingTab(new KineticCompanionSettingTab(this.app, this));
    }

    async onunload() {
        if (this.audioCtx) {
            try {
                this.audioCtx.close();
            } catch(e) {}
        }
        this.streamCurrentPos = null;
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playSlamStamp() {
        this.initAudio();
        if (!this.audioCtx) return;
        try {
            const now = this.audioCtx.currentTime;
            const lowOsc = this.audioCtx.createOscillator();
            const lowGain = this.audioCtx.createGain();
            lowOsc.type = 'sawtooth';
            lowOsc.frequency.setValueAtTime(90, now);
            lowGain.gain.setValueAtTime(0.4, now);
            lowGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            lowOsc.connect(lowGain);
            lowGain.connect(this.audioCtx.destination);
            lowOsc.start(now);
            lowOsc.stop(now + 0.16);
        } catch(e) {}
    }

    spawnCursorParticle(editor: Editor) {
        try {
            const cursor = editor.getCursor();
            const coords = (editor as any).coordsAtPos(cursor);
            if (coords) {
                const particle = document.createElement("div");
                particle.className = "kc-cursor-particle";
                particle.style.left = `${coords.left}px`;
                particle.style.top = `${coords.top}px`;
                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 400);
            }
        } catch (e) {}
    }

    triggerSlamEffect(editor: Editor) {
        try {
            this.playSlamStamp();
            const cursor = editor.getCursor();
            const coords = (editor as any).coordsAtPos(cursor);
            if (coords) {
                const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (activeView) {
                    const el = activeView.containerEl;
                    el.classList.add("kc-shaking");
                    setTimeout(() => el.classList.remove("kc-shaking"), 150);
                }
            }
        } catch (e) {}
    }

    async activateView(reveal: boolean = true): Promise<WorkspaceLeaf | null> {
        const { workspace } = this.app;
        let leaf: WorkspaceLeaf | null | undefined = workspace.getLeavesOfType("webviewer").find(l => {
            const state = l.getViewState();
            const url = (state.state as any)?.url;
            return typeof url === "string" && url.includes("aistudio.google.com") && l.getRoot() === workspace.rightSplit;
        });

        if (!leaf) {
            leaf = workspace.getRightLeaf(false);
            if (!leaf) leaf = workspace.getLeaf('tab');
            if (leaf) {
                await leaf.setViewState({
                    type: 'webviewer',
                    state: { url: 'https://aistudio.google.com/', navigate: true },
                    active: true,
                });
            }
        }
        if (leaf && reveal) {
            if (workspace.rightSplit.collapsed) workspace.rightSplit.expand();
            workspace.revealLeaf(leaf);
        }
        return leaf || null;
    }

    async getReadyWebviewElement(view: any): Promise<any> {
        const webview = await new Promise<any>((resolve) => {
            const el = view.containerEl.querySelector("webview");
            if (el) { resolve(el); return; }
            const observer = new MutationObserver(() => {
                const el = view.containerEl.querySelector("webview");
                if (el) { observer.disconnect(); resolve(el); }
            });
            observer.observe(view.containerEl, { childList: true, subtree: true });
            setTimeout(() => { observer.disconnect(); resolve(null); }, 3000);
        });

        if (!webview) return null;

        await new Promise<void>((resolve) => {
            const isReady = () => { try { webview.isLoading(); return true; } catch (e) { return false; } };
            if (isReady()) { resolve(); return; }
            const onReady = () => { webview.removeEventListener("dom-ready", onReady); resolve(); };
            webview.addEventListener("dom-ready", onReady);
            setTimeout(() => { webview.removeEventListener("dom-ready", onReady); resolve(); }, 5000);
        });

        await new Promise<void>((resolve) => {
            if (!webview.isLoading()) { resolve(); return; }
            const onStop = () => { webview.removeEventListener("did-stop-loading", onStop); resolve(); };
            webview.addEventListener("did-stop-loading", onStop);
            setTimeout(() => { webview.removeEventListener("did-stop-loading", onStop); resolve(); }, 15000);
        });

        return webview;
    }

    // Parses active Markdown note, writes matching file declarations, and runs build
    async applyCodeChangesAndBuild() {
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!activeView) {
            new Notice("No active markdown file to parse.");
            return;
        }

        const text = activeView.editor.getValue();
        const cleanText = text.replace(/^>\s?/gm, ""); // Strip blockquote formatting prefixes

        // Extracts blocks: FILE: relative/path\r?\n```lang\ncode\n```
        const fileRegex = /FILE:\s*([^\s]+)\s*[\r\n]+```[a-zA-Z]*[\r\n]+([\s\S]*?)```/g;
        let match;
        let filesUpdated = 0;

        const adapter = this.app.vault.adapter as any;
        const vaultPath = typeof adapter.getBasePath === 'function' ? adapter.getBasePath() as string : '';
        const currentDir = this.settings.currentDir || vaultPath;

        if (!currentDir) {
            new Notice("Workspace directory not resolved. Run terminal commands or specify directory first.");
            return;
        }

        while ((match = fileRegex.exec(cleanText)) !== null) {
            const relativePath = match[1];
            const codeContent = match[2];

            if (relativePath && codeContent) {
                const fullPath = path.resolve(currentDir, relativePath);
                try {
                    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
                    fs.writeFileSync(fullPath, codeContent, "utf8");
                    new Notice(`Updated file: ${relativePath}`);
                    filesUpdated++;
                } catch (e: any) {
                    new Notice(`Error writing file ${relativePath}: ${e.message}`);
                }
            }
        }

        if (filesUpdated === 0) {
            new Notice("No file blocks (FILE: filepath) detected in this document.");
            return;
        }

        const buildCommand = this.settings.buildExecutionCommand?.trim();
        if (buildCommand) {
            new Notice(`Executing post-apply script: ${buildCommand}...`);
            const { exec } = require('child_process');
            exec(buildCommand, { cwd: currentDir }, (error: any, stdout: string, stderr: string) => {
                if (error) {
                    new Notice(`Compilation Failed!\n${stderr || error.message}`);
                } else {
                    new Notice(`Compilation Succeeded!\n${stdout}`);
                }
            });
        }
    }

    async executeStreamSession(editor: Editor, promptContent: string) {
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        const originalLeaf = activeView?.leaf;
        const originalCursor = editor.getCursor();

        const webviewerLeaf = await this.activateView(true);
        if (!webviewerLeaf) {
            new Notice("Could not open the Web Viewer. Please enable the 'Web Viewer' core plugin.");
            return;
        }

        if (originalLeaf) {
            this.app.workspace.setActiveLeaf(originalLeaf, { focus: true });
            editor.setCursor(originalCursor);
        }

        const view = webviewerLeaf.view;
        const webviewEl = await this.getReadyWebviewElement(view);
        if (!webviewEl) {
            new Notice("Could not find the embedded webview element.");
            return;
        }

        this.activeEditor = editor;
        this.writtenTextLength = 0;
        
        const cursor = editor.getCursor('to');
        editor.replaceRange("\n\n> 🎯 **Paced Outline:**\n> ", cursor);
        this.streamCurrentPos = { line: cursor.line + 3, ch: 2 };

        if (webviewEl._kcListener) {
            webviewEl.removeEventListener("console-message", webviewEl._kcListener);
        }

        const listener = (event: any) => {
            const message = event.message as string;
            if (message && message.startsWith("gemini-stream-chunk::")) {
                const chunkContent = message.substring("gemini-stream-chunk::".length);
                this.handleStreamChunk(chunkContent);
            } else if (message && message.startsWith("gemini-stream-finished::")) {
                if (this.settings.autoApplyChanges) {
                    this.applyCodeChangesAndBuild();
                } else {
                    new Notice("Stream complete. Run 'Apply Code Changes' command to write files and build.");
                }
            }
        };

        webviewEl.addEventListener("console-message", listener);
        webviewEl._kcListener = listener;

        const runAutomation = () => {
            const escapedPrompt = JSON.stringify(promptContent);
            const injectionCode = `
                (function() {
                    const promptText = ${escapedPrompt};

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

                    let fillRetries = 0;
                    function findAndFillInput() {
                        const inputEl = queryShadowSelector('textarea[aria-label="Type something"], textarea, div[contenteditable="true"], [role="textbox"]');
                        if (inputEl) {
                            if (inputEl.tagName === 'DIV') {
                                inputEl.textContent = promptText;
                            } else {
                                inputEl.value = promptText;
                            }
                            inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                            inputEl.dispatchEvent(new Event('change', { bubbles: true }));

                            setTimeout(() => {
                                let parent = inputEl.parentElement;
                                let runButton = null;
                                while (parent && !runButton) {
                                    runButton = parent.querySelector('button.run-button, button[aria-label="Run"], button[aria-label="Run prompt"]');
                                    if (!runButton) {
                                        const containerButtons = parent.querySelectorAll('button');
                                        for (let i = 0; i < containerButtons.length; i++) {
                                            const btn = containerButtons[i];
                                            const text = (btn.textContent || '').trim();
                                            if (text.startsWith('Run') || btn.classList.contains('run-button')) {
                                                runButton = btn;
                                                break;
                                            }
                                        }
                                    }
                                    if (parent.tagName === 'BODY') break;
                                    parent = parent.parentElement;
                                }

                                if (runButton) {
                                    runButton.click();
                                } else {
                                    const enterEvent = new KeyboardEvent('keydown', {
                                        key: 'Enter', code: 'Enter', keyCode: 13, ctrlKey: true, metaKey: true, bubbles: true, cancelable: true
                                    });
                                    inputEl.dispatchEvent(enterEvent);
                                }
                                startObserving();
                            }, 250);
                        } else {
                            fillRetries++;
                            if (fillRetries < 40) setTimeout(findAndFillInput, 500);
                        }
                    }

                    let observer = window.__kcObserver;
                    function startObserving() {
                        if (observer) observer.disconnect();
                        const container = queryShadowSelector('ms-autoscroll-container, .conversation-container, .chat-history, [role="log"]');
                        if (!container) {
                            setTimeout(startObserving, 1000);
                            return;
                        }

                        let isGenerating = false;

                        observer = new MutationObserver(() => {
                            const turns = queryShadowSelectorAll('ms-chat-turn');
                            if (turns.length > 0) {
                                for (let i = turns.length - 1; i >= 0; i--) {
                                    const turn = turns[i];
                                    const modelContainer = turn.querySelector('.chat-turn-container.model');
                                    if (modelContainer) {
                                        const markdownEls = queryShadowSelectorAll('ms-markdown, ms-text-chunk, .model-content, .markdown', modelContainer);
                                        let text = "";
                                        
                                        const isInsideThinking = (node) => {
                                            while (node) {
                                                const tag = node.tagName || "";
                                                if (tag === 'MS-THOUGHT-CHUNK' || tag === 'MODEL-THOUGHTS' || (node.classList && (node.classList.contains('thinking') || node.classList.contains('thought-container')))) {
                                                    return true;
                                                }
                                                node = node.parentNode || node.host;
                                            }
                                            return false;
                                        };

                                        for (let j = 0; j < markdownEls.length; j++) {
                                            const el = markdownEls[j];
                                            if (!isInsideThinking(el)) {
                                                text = el.textContent || "";
                                                break;
                                            }
                                        }
                                        
                                        if (text) {
                                            console.log("gemini-stream-chunk::" + text);
                                            break;
                                        }
                                    }
                                }
                            }

                            // Generation status tracking
                            const stopButton = queryShadowSelector('button[aria-label="Stop generation"], button.stop-button, ms-stop-button');
                            if (stopButton) {
                                isGenerating = true;
                            } else if (isGenerating) {
                                isGenerating = false;
                                console.log("gemini-stream-finished::");
                            }
                        });
                        observer.observe(container, { childList: true, subtree: true, characterData: true });
                        window.__kcObserver = observer;
                    }

                    findAndFillInput();
                })();
            `;
            webviewEl.executeJavaScript(injectionCode);
        };

        if (webviewEl.isLoading()) {
            const onDomReady = () => {
                runAutomation();
                webviewEl.removeEventListener("dom-ready", onDomReady);
            };
            webviewEl.addEventListener("dom-ready", onDomReady);
        } else {
            runAutomation();
        }
    }

    handleStreamChunk(fullText: string) {
        if (!this.activeEditor || !this.streamCurrentPos) return;

        const currentPos = this.streamCurrentPos;
        const diffText = fullText.substring(this.writtenTextLength);
        if (diffText.length > 0) {
            const formattedDiff = diffText.replace(/\n/g, "\n> ");
            this.activeEditor.replaceRange(formattedDiff, currentPos);

            const lines = formattedDiff.split("\n");
            const lastLine = lines[lines.length - 1] ?? "";
            if (lines.length > 1) {
                this.streamCurrentPos = {
                    line: currentPos.line + lines.length - 1,
                    ch: lastLine.length
                };
            } else {
                this.streamCurrentPos = {
                    line: currentPos.line,
                    ch: currentPos.ch + formattedDiff.length
                };
            }
            this.writtenTextLength = fullText.length;
        }
    }
}

// ── SETTINGS TAB CLASS ─────────────────────────────────────────────────
class KineticCompanionSettingTab extends PluginSettingTab {
    plugin: KineticCompanionPlugin;

    constructor(app: App, plugin: KineticCompanionPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Kinetic Companion Settings' });

        new Setting(containerEl)
            .setName('Typing Caret Sparkles')
            .setDesc('Toggle ON to spawn kinetic sparkles behind your cursor.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSparkles)
                .onChange(async (value) => {
                    this.plugin.settings.enableSparkles = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Heavy Slam Paste Effect')
            .setDesc('Toggle ON to trigger haptic thuds and shakes on pasting text.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSlamPaste)
                .onChange(async (value) => {
                    this.plugin.settings.enableSlamPaste = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Auto-Apply Generated File Changes')
            .setDesc('Toggle ON to automatically write extracted FILE code blocks to disk and execute the compiler once the stream finishes.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.autoApplyChanges)
                .onChange(async (value) => {
                    this.plugin.settings.autoApplyChanges = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Post-Apply Build Command')
            .setDesc('Specify the terminal compilation or test script to run after code is written to disk (e.g. npm run build, tsc, etc.).')
            .addText(text => text
                .setPlaceholder('npm run build')
                .setValue(this.plugin.settings.buildExecutionCommand || 'npm run build')
                .onChange(async (value) => {
                    this.plugin.settings.buildExecutionCommand = value.trim();
                    await this.plugin.saveSettings();
                }));
    }
}
```