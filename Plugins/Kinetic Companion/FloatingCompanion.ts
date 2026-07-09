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