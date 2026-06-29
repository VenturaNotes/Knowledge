/**
 * Pacing Timer Visual Sandbox (V26 - Minimalist Immersive Overlay)
 * Interactive Prototypes for:
 * 1. Zen Play Mode (Transparent fixed canvas overlay, zero shadow blurs for fast frame rendering)
 * 2. Distinct Galactic Overlays: Unique full-screen gradients, solar washes, and scanline grids per sector
 * 3. Random Sector Transitions: 2-second hyperspace star warp sequence (never jumps to the same sector twice)
 * 4. Slingshot Targeting & Reflector: Ctrl+Space (Standard laser/reflector), Ctrl+Cmd+C / Ctrl+Alt+C (Charges Super Cursor)
 * 5. Leak-Proof Engineering: Automatic pruning of detached Webviews/Iframes to allow garbage collection
 */
const runSandbox = async (params) => {
    const { app } = params || {};
    
    // Safely extract Obsidian workspace parameters
    let view = null;
    if (app && app.workspace && typeof require === "function") {
        try {
            const { MarkdownView, Notice } = require("obsidian");
            view = app.workspace.getActiveViewOfType(MarkdownView);
            new Notice("🌌 Space Shooter Overlay Active.\n• Tap Ctrl+Space: Reflector (Shine)\n• Drag Ctrl+Space: Laser (Asteroids)\n• Ctrl+Cmd+C: Charge Super Cursor\n• Press Escape to exit safely.");
        } catch (e) {
            console.warn("Obsidian workspace modules could not be initialized:", e);
        }
    }

    const CANVAS_OVERLAY_ID = "pacing-timer-sandbox-canvas";

    // --- Global Context Registry ---
    const context = {
        isDeactivated: false,
        loopId: null,
        audioCtx: null,
        attachedWebviews: [],
        attachedIframes: [],
        activeTimeouts: []
    };

    // Reusable canvas context to prevent high-frequency C++ heap allocations
    const parentMeasureCanvas = document.createElement("canvas");
    const parentMeasureCtx = parentMeasureCanvas ? parentMeasureCanvas.getContext("2d") : null;

    // Dynamic Game State
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetY = window.innerHeight; 
    let alienDirection = 1;
    let alienPercent = 50;
    let superCursorActive = false;

    // Caret and Cursor Visibility States
    let webviewCaretX = 0;
    let webviewCaretY = 0;
    let webviewCaretActive = false;
    let isMouseCursorVisible = true;

    // Progression
    let currentSectorIndex = 0;
    let isWarpActive = false;
    let warpTimeStart = 0;

    const SECTORS = [
        { name: "Asteroid Belt", bgParticlesColor: "rgba(166, 173, 203, 0.45)", accentColor: "#00f0ff" },
        { name: "Orion Nebula", bgParticlesColor: "rgba(245, 194, 231, 0.45)", accentColor: "#ff00ea" },
        { name: "Binary Sun System", bgParticlesColor: "rgba(249, 226, 175, 0.45)", accentColor: "#f9e2af" },
        { name: "Cosmic Outpost Orbit", bgParticlesColor: "rgba(203, 166, 247, 0.45)", accentColor: "#cba6f7" }
    ];

    // Starfield Generation
    const stars = [];
    for (let i = 0; i < 40; i++) {
        stars.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.1,
            vy: Math.random() * 0.8 + 0.2
        });
    }

    // Slingshot State
    let isSlingshotActive = false;
    let slingshotType = "standard"; 
    const slingshotAnchor = { x: 0, y: 0 };
    let activeShine = null; // Fox's Shine animation state

    // Target Spacecraft Stats
    const targetShip = {
        x: window.innerWidth / 2,
        y: 75, 
        hp: 1000,
        maxHp: 1000,
        isBoss: false,
        flashFrames: 0,
        shieldPulsing: 0 
    };

    const triggerMouseVisible = () => {
        isMouseCursorVisible = true;
    };

    const trackMouse = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        triggerMouseVisible();
    };

    // Helper to calculate caret coordinates in multiline textareas safely
    const getTextareaCaretCoordinates = (el, activeWin = window) => {
        const doc = activeWin.document;
        let mirror = doc.getElementById("pacing-timer-caret-mirror");
        if (!mirror) {
            mirror = doc.createElement("div");
            mirror.id = "pacing-timer-caret-mirror";
            Object.assign(mirror.style, {
                position: "absolute",
                visibility: "hidden",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                top: "0",
                left: "0",
                height: "auto"
            });
            doc.body.appendChild(mirror);
        }

        const styles = activeWin.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        
        mirror.style.width = el.clientWidth + "px";
        mirror.style.font = styles.font;
        mirror.style.lineHeight = styles.lineHeight;
        mirror.style.padding = styles.padding;
        mirror.style.boxSizing = styles.boxSizing;

        const textUpToCaret = el.value.substring(0, el.selectionStart);
        mirror.textContent = textUpToCaret;

        const marker = doc.createElement("span");
        marker.textContent = "|";
        mirror.appendChild(marker);

        const markerRect = marker.getBoundingClientRect();
        const mirrorRect = mirror.getBoundingClientRect();

        const x = rect.left + (markerRect.left - mirrorRect.left) - el.scrollLeft;
        const y = rect.top + (markerRect.top - mirrorRect.top) - el.scrollTop;

        return { x, y };
    };

    // Cached Google Docs caret lookup — re-queries DOM at most every 500ms
    let _cachedGDocsEl = undefined;
    let _gDocsCacheTime = 0;

    // Helper to query and track Google Docs blinking caret element
    const getGoogleDocsCaret = (activeWin = window) => {
        const doc = activeWin.document;
        const now = Date.now();
        if (now - _gDocsCacheTime > 500) {
            _gDocsCacheTime = now;
            _cachedGDocsEl = doc.querySelector('#kix-current-user-cursor-caret') ||
                             doc.querySelector('.kix-cursor-caret') ||
                             doc.querySelector('.kix-cursor') ||
                             doc.querySelector('.docs-text-ui-cursor-blink') ||
                             null;
        }
        if (!_cachedGDocsEl || !_cachedGDocsEl.isConnected) {
            _cachedGDocsEl = null;
            return null;
        }

        const caretEl = _cachedGDocsEl;
        const cursorContainer = caretEl.closest('.kix-cursor') || caretEl.parentElement;
        let rect = caretEl.getBoundingClientRect();

        // Overcome "display: none" layout exclusion when blinking off-phase
        if (rect.width === 0 && rect.height === 0 && cursorContainer) {
            const origParentDisplay = cursorContainer.style.display;
            const origParentVisibility = cursorContainer.style.visibility;
            const origParentOpacity = cursorContainer.style.opacity;

            const origChildDisplay = caretEl.style.display;
            const origChildVisibility = caretEl.style.visibility;
            const origChildOpacity = caretEl.style.opacity;

            cursorContainer.style.setProperty("display", "block", "important");
            cursorContainer.style.setProperty("visibility", "hidden", "important");
            cursorContainer.style.setProperty("opacity", "0", "important");

            caretEl.style.setProperty("display", "block", "important");
            caretEl.style.setProperty("visibility", "hidden", "important");
            caretEl.style.setProperty("opacity", "0", "important");

            rect = caretEl.getBoundingClientRect();

            cursorContainer.style.display = origParentDisplay;
            cursorContainer.style.visibility = origParentVisibility;
            cursorContainer.style.opacity = origParentOpacity;

            caretEl.style.display = origChildDisplay;
            caretEl.style.visibility = origChildVisibility;
            caretEl.style.opacity = origChildOpacity;
        }

        if (rect.width === 0 && rect.height === 0) return null;
        if (rect.left === 0 && rect.top === 0) return null;
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    };

    const updatePositionFromCaret = () => {
        if (isMouseCursorVisible) return;

        let activeEl = document.activeElement;
        
        if (activeEl && activeEl.tagName === "WEBVIEW") {
            if (webviewCaretActive) {
                mouseX = webviewCaretX;
                mouseY = webviewCaretY;
            }
            return;
        }

        let activeWindow = window;

        try {
            while (activeEl && (activeEl.tagName === "IFRAME")) {
                if (activeEl.contentDocument) {
                    activeWindow = activeEl.contentWindow || activeWindow;
                    activeEl = activeEl.contentDocument.activeElement;
                } else {
                    break;
                }
            }
        } catch (err) {}

        const gDocsCaret = getGoogleDocsCaret(activeWindow);
        if (gDocsCaret) {
            mouseX = gDocsCaret.x;
            mouseY = gDocsCaret.y;
            return;
        }

        if (!activeEl) return;
        
        const isEditable = 
            activeEl.tagName === "INPUT" || 
            activeEl.tagName === "TEXTAREA" || 
            activeEl.hasAttribute("contenteditable") || 
            activeEl.isContentEditable;
            
        if (!isEditable) return;

        try {
            if (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA") {
                const coords = getTextareaCaretCoordinates(activeEl, activeWindow);
                mouseX = coords.x;
                mouseY = coords.y;
                return;
            }

            const selection = activeWindow.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const rects = range.getClientRects();
                let rect = null;
                if (rects && rects.length > 0) {
                    rect = rects[rects.length - 1];
                }
                
                // Fallback for empty-rect in contenteditable (e.g. Claude chatbox, empty line after Shift+Enter)
                if (!rect || (rect.left === 0 && rect.top === 0)) {
                    const rangeBound = range.getBoundingClientRect();
                    if (rangeBound && (rangeBound.left !== 0 || rangeBound.top !== 0)) {
                        rect = rangeBound;
                    } else {
                        let node = range.startContainer;
                        if (node) {
                            if (node.nodeType === Node.TEXT_NODE) {
                                node = node.parentNode;
                            }
                            if (node && typeof node.getBoundingClientRect === "function") {
                                // Find a BR inside if it's an empty line element
                                let br = node.querySelector("br");
                                let measuredRect = br ? br.getBoundingClientRect() : null;
                                
                                if (measuredRect && (measuredRect.left !== 0 || measuredRect.top !== 0)) {
                                    rect = measuredRect;
                                } else {
                                    const nodeRect = node.getBoundingClientRect();
                                    const style = activeWindow.getComputedStyle(node);
                                    const paddingLeft = parseFloat(style.paddingLeft) || 0;
                                    const borderLeft = parseFloat(style.borderLeftWidth) || 0;
                                    
                                    rect = {
                                        left: nodeRect.left + paddingLeft + borderLeft,
                                        top: nodeRect.top
                                    };
                                }
                            }
                        }
                    }
                }

                if (rect && (rect.left !== 0 || rect.top !== 0)) {
                    if (activeWindow !== window) {
                        let currentEl = activeWindow.frameElement;
                        let offsetX = 0;
                        let offsetY = 0;
                        while (currentEl) {
                            const r = currentEl.getBoundingClientRect();
                            offsetX += r.left;
                            offsetY += r.top;
                            currentEl = currentEl.ownerDocument.defaultView.frameElement;
                        }
                        mouseX = rect.left + offsetX;
                        mouseY = rect.top + offsetY;
                    } else {
                        mouseX = rect.left;
                        mouseY = rect.top;
                    }
                }
            }
        } catch (e) {}
    };

    const cleanUp = () => {
        const prevContext = window._sandboxContext;
        if (prevContext) {
            prevContext.isDeactivated = true;

            if (prevContext.loopId) {
                cancelAnimationFrame(prevContext.loopId);
                prevContext.loopId = null;
            }

            if (prevContext.audioCtx) {
                prevContext.audioCtx.close().catch(() => {});
                prevContext.audioCtx = null;
            }

            if (prevContext.activeTimeouts) {
                prevContext.activeTimeouts.forEach(clearTimeout);
                prevContext.activeTimeouts.length = 0;
            }

            if (prevContext.attachedWebviews) {
                prevContext.attachedWebviews.forEach(({ element, keydown, keyup, consoleMsg, domReady, didNavigate }) => {
                    if (element) {
                        element.removeEventListener("keydown", keydown, { capture: true });
                        element.removeEventListener("keyup", keyup, { capture: true });
                        element.removeEventListener("console-message", consoleMsg);
                        if (domReady) element.removeEventListener("dom-ready", domReady);
                        if (didNavigate) element.removeEventListener("did-start-navigation", didNavigate);
                        delete element._hasSandboxKeys;
                    }
                });
                prevContext.attachedWebviews.length = 0;
            }

            if (prevContext.attachedIframes) {
                prevContext.attachedIframes.forEach(({ documentEl, mousemove, mousedown, keydown, keyup }) => {
                    if (documentEl) {
                        documentEl.removeEventListener("mousemove", mousemove, { capture: true });
                        documentEl.removeEventListener("pointermove", mousemove, { capture: true });
                        documentEl.removeEventListener("mousedown", mousedown, { capture: true });
                        documentEl.removeEventListener("pointerdown", mousedown, { capture: true });
                        documentEl.removeEventListener("keydown", keydown, { capture: true });
                        documentEl.removeEventListener("keyup", keyup, { capture: true });
                        if (documentEl.defaultView && documentEl.defaultView.frameElement) {
                            delete documentEl.defaultView.frameElement._hasSandboxListeners;
                        }
                    }
                });
                prevContext.attachedIframes.length = 0;
            }
        }

        const existingCanvas = document.getElementById(CANVAS_OVERLAY_ID);
        if (existingCanvas) existingCanvas.remove();
        
        if (window._sandboxKeyDownHandler) {
            window.removeEventListener("keydown", window._sandboxKeyDownHandler, { capture: true });
            delete window._sandboxKeyDownHandler;
        }
        if (window._sandboxKeyUpHandler) {
            window.removeEventListener("keyup", window._sandboxKeyUpHandler, { capture: true });
            delete window._sandboxKeyUpHandler;
        }
        if (window._sandboxMouseMoveHandler) {
            window.removeEventListener("mousemove", window._sandboxMouseMoveHandler, { capture: true });
            window.removeEventListener("pointermove", window._sandboxMouseMoveHandler, { capture: true });
            window.removeEventListener("mousedown", triggerMouseVisible, { capture: true });
            window.removeEventListener("pointerdown", triggerMouseVisible, { capture: true });
            
            document.removeEventListener("mousemove", window._sandboxMouseMoveHandler, { capture: true });
            document.removeEventListener("pointermove", window._sandboxMouseMoveHandler, { capture: true });
            document.removeEventListener("mousedown", triggerMouseVisible, { capture: true });
            document.removeEventListener("pointerdown", triggerMouseVisible, { capture: true });
            
            delete window._sandboxMouseMoveHandler;
        }
        if (window._sandboxWebviewScanInterval) {
            clearInterval(window._sandboxWebviewScanInterval);
            delete window._sandboxWebviewScanInterval;
        }

        const styleEl = document.getElementById("pacing-timer-sandbox-styles");
        if (styleEl) styleEl.remove();

        const mirrorEl = document.getElementById("pacing-timer-caret-mirror");
        if (mirrorEl) mirrorEl.remove();

        delete window.sandboxGrantCharge;
    };
    
    cleanUp();
    
    window._sandboxContext = context;

    window._sandboxMouseMoveHandler = trackMouse;
    window.addEventListener("mousemove", window._sandboxMouseMoveHandler, { capture: true });
    window.addEventListener("pointermove", window._sandboxMouseMoveHandler, { capture: true });
    window.addEventListener("mousedown", triggerMouseVisible, { capture: true });
    window.addEventListener("pointerdown", triggerMouseVisible, { capture: true });

    document.addEventListener("mousemove", window._sandboxMouseMoveHandler, { capture: true });
    document.addEventListener("pointermove", window._sandboxMouseMoveHandler, { capture: true });
    document.addEventListener("mousedown", triggerMouseVisible, { capture: true });
    document.addEventListener("pointerdown", triggerMouseVisible, { capture: true });

    const injectStyles = () => {
        const styleId = "pacing-timer-sandbox-styles";
        if (!document.getElementById(styleId)) {
            const style = document.createElement("style");
            style.id = styleId;
            style.textContent = `
                @keyframes pacing-sandbox-shake {
                    0% { transform: translate(2px, 1px) rotate(0deg); }
                    10% { transform: translate(-1px, -2px) rotate(-1deg); }
                    20% { transform: translate(-3px, 0px) rotate(1deg); }
                    30% { transform: translate(0px, 2px) rotate(0deg); }
                    40% { transform: translate(1px, -1px) rotate(1deg); }
                    50% { transform: translate(-1px, 2px) rotate(-1deg); }
                    60% { transform: translate(-3px, 1px) rotate(0deg); }
                    75% { transform: translate(2px, 1px) rotate(-1deg); }
                    90% { transform: translate(-1px, -1px) rotate(0deg); }
                    100% { transform: translate(0px, 0px) rotate(0deg); }
                }
            `;
            document.head.appendChild(style);
        }
    };
    injectStyles();

    const canvas = document.createElement("canvas");
    canvas.id = CANVAS_OVERLAY_ID;
    Object.assign(canvas.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: "999999"
    });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const activeProjectiles = [];
    const activeParticles = [];
    const activeAsteroids = [];
    let lastAsteroidSpawn = 0;

    const getDistanceToSegment = (px, py, x1, y1, x2, y2) => {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const len_sq = C * C + D * D;
        let param = -1;
        if (len_sq !== 0) param = dot / len_sq;

        let xx, yy;
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = px - xx;
        const dy = py - yy;
        return Math.hypot(dx, dy);
    };

    const playSound = (type) => {
        if (context.isDeactivated) return;
        if (!context.audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            context.audioCtx = new AudioContextClass();
        }
        if (context.audioCtx.state === 'closed') return;
        if (context.audioCtx.state === 'suspended') {
            context.audioCtx.resume();
        }
        try {
            const now = context.audioCtx.currentTime;
            
            if (type === "laser") {
                const osc = context.audioCtx.createOscillator();
                const gain = context.audioCtx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(1200, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                osc.connect(gain);
                gain.connect(context.audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.11);
            } 
            else if (type === "plasma") {
                const osc = context.audioCtx.createOscillator();
                const gain = context.audioCtx.createGain();
                osc.type = "triangle";
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.linearRampToValueAtTime(600, now + 0.15);
                osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);
                gain.gain.setValueAtTime(0.35, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                osc.connect(gain);
                gain.connect(context.audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.31);
            }
            else if (type === "shine") {
                const osc = context.audioCtx.createOscillator();
                const gain = context.audioCtx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(2500, now);
                osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.connect(gain);
                gain.connect(context.audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.09);
            }
            else if (type === "powerup") {
                const triggerNote = (freq, start, dur) => {
                    const osc = context.audioCtx.createOscillator();
                    const gain = context.audioCtx.createGain();
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(freq, start);
                    gain.gain.setValueAtTime(0, start);
                    gain.gain.linearRampToValueAtTime(0.2, start + 0.01);
                    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
                    osc.connect(gain);
                    gain.connect(context.audioCtx.destination);
                    osc.start(start);
                    osc.stop(start + dur + 0.05);
                };
                triggerNote(523.25, now, 0.12);
                triggerNote(659.25, now + 0.05, 0.12);
                triggerNote(783.99, now + 0.1, 0.12);
                triggerNote(1046.50, now + 0.15, 0.25);
            }
            else if (type === "deflect") {
                const osc = context.audioCtx.createOscillator();
                const gain = context.audioCtx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.linearRampToValueAtTime(1400, now + 0.05);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.connect(gain);
                gain.connect(context.audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.09);
            }
            else if (type === "explosion") {
                const osc = context.audioCtx.createOscillator();
                const gain = context.audioCtx.createGain();
                osc.type = "triangle";
                osc.frequency.setValueAtTime(120, now);
                osc.frequency.exponentialRampToValueAtTime(20, now + 0.35);
                gain.gain.setValueAtTime(0.4, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                osc.connect(gain);
                gain.connect(context.audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.36);
            }
        } catch (e) {
            console.warn("Audio Blocked:", e);
        }
    };

    // Self-pruning timeout wrapper — removes ID from activeTimeouts after firing
    const safeTimeout = (fn, delay) => {
        const id = setTimeout(() => {
            fn();
            const idx = context.activeTimeouts.indexOf(id);
            if (idx !== -1) context.activeTimeouts.splice(idx, 1);
        }, delay);
        context.activeTimeouts.push(id);
        return id;
    };

    const triggerScreenShake = () => {
        if (context.isDeactivated) return;
        const canvasEl = document.getElementById(CANVAS_OVERLAY_ID);
        if (!canvasEl) return;
        canvasEl.style.animation = "none";
        canvasEl.offsetHeight; 
        canvasEl.style.animation = "pacing-sandbox-shake 0.15s cubic-bezier(.36,.07,.19,.97) both";
        safeTimeout(() => { canvasEl.style.animation = "none"; }, 150);
    };

    const triggerFloatingText = (label, x, y, color = "#ff2a6d") => {
        if (context.isDeactivated) return;
        const floatText = document.createElement("div");
        floatText.textContent = label;
        Object.assign(floatText.style, {
            position: "fixed",
            left: `${x}px`,
            top: `${y - 15}px`,
            fontFamily: "monospace",
            fontSize: "18px",
            fontWeight: "bold",
            color: color,
            textShadow: `0 0 6px ${color}, 0 0 12px ${color}`,
            pointerEvents: "none",
            zIndex: "999999",
            transition: "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
            transform: "translate(-50%, 0) scale(0.6)",
            opacity: "0"
        });
        document.body.appendChild(floatText);
        floatText.offsetHeight;

        floatText.style.transform = `translate(calc(-50% + ${(Math.random() - 0.5) * 30}px), -40px) scale(1.1)`;
        floatText.style.opacity = "1";

        const t1 = safeTimeout(() => {
            if (context.isDeactivated) { floatText.remove(); return; }
            floatText.style.opacity = "0";
            floatText.style.transform += " translateY(-15px)";
            safeTimeout(() => floatText.remove(), 600);
        }, 350);
    };

    const spawnAsteroid = () => {
        if (isWarpActive) return; 
        const ast = {
            x: Math.random() < 0.5 ? -30 : window.innerWidth + 30,
            y: Math.random() * (window.innerHeight - 350) + 100,
            vx: Math.random() < 0.5 ? Math.random() * 0.8 + 0.4 : -(Math.random() * 0.8 + 0.4),
            vy: Math.random() * 0.4 + 0.1,
            size: Math.random() * 15 + 15,
            sprite: Math.random() < 0.5 ? "🪨" : "☄️",
            angle: Math.random() * Math.PI,
            spinSpeed: (Math.random() - 0.5) * 0.03
        };
        activeAsteroids.push(ast);
    };

    const triggerWarpSectorJump = () => {
        isWarpActive = true;
        warpTimeStart = Date.now();
        activeAsteroids.length = 0; 
        triggerFloatingText("🚀 INITIATING HYPERJUMP!", window.innerWidth / 2, window.innerHeight / 2, "#ffd700");
        playSound("powerup");
    };

    const triggerFoxShine = () => {
        playSound("shine");
        
        activeShine = {
            x: mouseX,
            y: mouseY,
            maxRadius: 60,
            currentRadius: 5,
            opacity: 1.0,
            life: 0,
            maxLife: 10
        };

        activeAsteroids.forEach(ast => {
            const dist = Math.hypot(mouseX - ast.x, mouseY - ast.y);
            if (dist < 65) {
                const angle = Math.atan2(ast.y - mouseY, ast.x - mouseX);
                const speed = 7.5; 
                ast.vx = Math.cos(angle) * speed;
                ast.vy = Math.sin(angle) * speed;
                
                triggerFloatingText("⭐️ REFLECTED!", ast.x, ast.y, "#54ebff");
                
                for (let p = 0; p < 5; p++) {
                    activeParticles.push({
                        type: "spark",
                        x: ast.x,
                        y: ast.y,
                        vx: Math.cos(angle + (Math.random() - 0.5)) * (speed * 0.8),
                        vy: Math.sin(angle + (Math.random() - 0.5)) * (speed * 0.8),
                        size: Math.random() * 2 + 1.5,
                        color: "#54ebff",
                        life: 0,
                        maxLife: 15
                    });
                }
            }
        });
    };

    const triggerSlingshotRelease = () => {
        if (isSlingshotActive) {
            const isSpecial = slingshotType === "special";
            isSlingshotActive = false;
            
            const dx = mouseX - slingshotAnchor.x;
            const dy = mouseY - slingshotAnchor.y;
            const slingshotForce = Math.min(65, Math.hypot(dx, dy) * 0.25);
            
            if (slingshotForce > 2.5) {
                const angle = Math.atan2(-dy, -dx);
                const vx = Math.cos(angle) * slingshotForce;
                const vy = Math.sin(angle) * slingshotForce;
                triggerLaserStrike(vx, vy, isSpecial);
            } else {
                triggerFoxShine();
            }

            if (isSpecial) {
                superCursorActive = false; 
            }
        }
    };

    // Game Physics Loop
    const updatePhysics = () => {
        if (context.isDeactivated) return; 

        updatePositionFromCaret();

        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        // Cap arrays to prevent unbounded growth during long idle sessions
        if (activeParticles.length > 300) activeParticles.splice(0, activeParticles.length - 300);
        if (activeProjectiles.length > 50) activeProjectiles.splice(0, activeProjectiles.length - 50);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        targetY = window.innerHeight; 
        const now = Date.now();

        const activeSector = SECTORS[currentSectorIndex];

        if (!isWarpActive) {
            if (activeSector.name === "Orion Nebula") {
                const grad = ctx.createRadialGradient(canvas.width * 0.7, canvas.height * 0.4, 0, canvas.width * 0.7, canvas.height * 0.4, canvas.width * 0.8);
                grad.addColorStop(0, "rgba(255, 0, 234, 0.08)");
                grad.addColorStop(1, "rgba(0, 0, 0, 0)");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            } 
            else if (activeSector.name === "Binary Sun System") {
                const grad = ctx.createRadialGradient(canvas.width * 0.15, 0, 0, canvas.width * 0.15, 0, canvas.width * 0.7);
                grad.addColorStop(0, "rgba(255, 215, 0, 0.15)");
                grad.addColorStop(0.5, "rgba(255, 140, 0, 0.06)");
                grad.addColorStop(1, "rgba(0, 0, 0, 0)");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            else if (activeSector.name === "Cosmic Outpost Orbit") {
                ctx.strokeStyle = "rgba(203, 166, 247, 0.06)";
                ctx.lineWidth = 1;
                const gridSize = 40;
                ctx.beginPath();
                for (let x = 0; x < canvas.width; x += gridSize) {
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, canvas.height);
                }
                for (let y = 0; y < canvas.height; y += gridSize) {
                    ctx.moveTo(0, y);
                    ctx.lineTo(canvas.width, y);
                }
                ctx.stroke();
            }
        }

        ctx.strokeStyle = SECTORS[currentSectorIndex].bgParticlesColor;
        ctx.lineWidth = 1.5;
        stars.forEach(star => {
            let vy = star.vy;
            let vx = star.vx;

            star.y += vy * (isWarpActive ? 25 : 1);
            star.x += vx * (isWarpActive ? 25 : 1);
            
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            const stretch = isWarpActive ? 35 : 2;
            ctx.lineTo(star.x - vx * stretch, star.y - vy * stretch);
            ctx.stroke();

            if (star.y > window.innerHeight) star.y = 0;
            if (star.x > window.innerWidth) star.x = 0;
            if (star.x < 0) star.x = window.innerWidth;
        });

        if (isWarpActive && now - warpTimeStart > 2000) {
            isWarpActive = false;
            let nextIndex = currentSectorIndex;
            while (nextIndex === currentSectorIndex) {
                nextIndex = Math.floor(Math.random() * SECTORS.length);
            }
            currentSectorIndex = nextIndex;
            
            triggerFloatingText(`🪐 REACHED: ${SECTORS[currentSectorIndex].name.toUpperCase()}`, window.innerWidth / 2, window.innerHeight / 2, SECTORS[currentSectorIndex].accentColor);
        }

        if (!isWarpActive && now - lastAsteroidSpawn > 2500 && activeAsteroids.length < 6) {
            spawnAsteroid();
            lastAsteroidSpawn = now;
        }

        if (!isWarpActive) {
            const speed = targetShip.isBoss ? 0.35 : 0.65;
            alienPercent += alienDirection * speed;
            if (alienPercent >= 90) { alienPercent = 90; alienDirection = -1; }
            if (alienPercent <= 10) { alienPercent = 10; alienDirection = 1; }
            targetShip.x = (alienPercent / 100) * window.innerWidth;

            ctx.save();
            if (targetShip.flashFrames > 0) {
                ctx.filter = "brightness(3) invert(1)";
                targetShip.flashFrames--;
            }
            ctx.font = targetShip.isBoss ? "55px serif" : "32px serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(targetShip.isBoss ? "👾" : "🛸", targetShip.x, targetShip.y);
            ctx.restore();

            if (targetShip.shieldPulsing > 0) {
                ctx.save();
                ctx.strokeStyle = `rgba(0, 240, 255, ${targetShip.shieldPulsing / 15})`;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(targetShip.x, targetShip.y, targetShip.isBoss ? 48 : 28, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
                targetShip.shieldPulsing--;
            }

            const barWidth = targetShip.isBoss ? 130 : 65;
            const barHeight = 5;
            const barX = targetShip.x - barWidth / 2;
            const barY = targetShip.y - (targetShip.isBoss ? 45 : 25);

            ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            const healthPct = Math.max(0, targetShip.hp / targetShip.maxHp);
            ctx.fillStyle = targetShip.isBoss ? "#ff00ea" : "#39ff14";
            ctx.fillRect(barX, barY, barWidth * healthPct, barHeight);

            if (targetShip.isBoss) {
                ctx.fillStyle = "#ff00ea";
                ctx.font = "bold 9px monospace";
                ctx.textAlign = "center";
                ctx.fillText(`MOTHER-SHIP: ${targetShip.hp}/${targetShip.maxHp}`, targetShip.x, barY - 6);
            }
        }

        let nearestAsteroidDist = Infinity; 
        for (let i = activeAsteroids.length - 1; i >= 0; i--) {
            const ast = activeAsteroids[i];
            ast.x += ast.vx;
            ast.y += ast.vy;
            ast.angle += ast.spinSpeed;

            ctx.save();
            ctx.translate(ast.x, ast.y);
            ctx.rotate(ast.angle);
            ctx.font = `${ast.size * 1.5}px serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(ast.sprite, 0, 0);
            ctx.restore();

            const distToCursor = Math.hypot(mouseX - ast.x, mouseY - ast.y);
            if (distToCursor < nearestAsteroidDist) {
                nearestAsteroidDist = distToCursor;
            }

            if (ast.vy > 0 && distToCursor < ast.size + 6) {
                activeAsteroids.splice(i, 1);
                triggerScreenShake();
                playSound("explosion");
                triggerFloatingText("💔 SHIELD IMPACT!", mouseX, mouseY - 15, "#ff3b30");
                continue;
            }

            if (ast.y > window.innerHeight + 50 || ast.y < -100 || ast.x < -100 || ast.x > window.innerWidth + 100) {
                activeAsteroids.splice(i, 1);
            }
        }

        if (nearestAsteroidDist < 120) {
            const proximityFactor = Math.max(0, 1 - nearestAsteroidDist / 120);
            ctx.save();
            ctx.strokeStyle = `rgba(0, 240, 255, ${proximityFactor * 0.6})`;
            ctx.lineWidth = 1.5 + proximityFactor * 1.5;
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, 18, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        if (activeShine) {
            activeShine.life++;
            const progress = activeShine.life / activeShine.maxLife;
            activeShine.currentRadius = activeShine.currentRadius + (activeShine.maxRadius - activeShine.currentRadius) * 0.3;
            activeShine.opacity = 1 - progress;

            ctx.save();
            ctx.strokeStyle = `rgba(84, 235, 255, ${activeShine.opacity})`;
            ctx.lineWidth = 2.5;

            ctx.beginPath();
            const hexRadius = activeShine.currentRadius;
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i + (now * 0.005);
                const hx = activeShine.x + Math.cos(angle) * hexRadius;
                const hy = activeShine.y + Math.sin(angle) * hexRadius;
                if (i === 0) ctx.moveTo(hx, hy);
                else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            ctx.stroke();

            ctx.strokeStyle = `rgba(255, 255, 255, ${activeShine.opacity * 0.8})`;
            ctx.beginPath();
            const innerRadius = hexRadius * 0.6;
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i - (now * 0.005);
                const hx = activeShine.x + Math.cos(angle) * innerRadius;
                const hy = activeShine.y + Math.sin(angle) * innerRadius;
                if (i === 0) ctx.moveTo(hx, hy);
                else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            ctx.stroke();

            ctx.fillStyle = `rgba(255, 255, 255, ${activeShine.opacity})`;
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                ctx.beginPath();
                ctx.arc(activeShine.x + Math.cos(angle) * (hexRadius * 0.45), activeShine.y + Math.sin(angle) * (hexRadius * 0.45), 2.5, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();

            if (activeShine.life >= activeShine.maxLife) {
                activeShine = null;
            }
        }

        if (superCursorActive) {
            ctx.save();
            ctx.strokeStyle = "rgba(255, 215, 0, 0.6)"; 
            ctx.lineWidth = 1.5;
            
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, 13 + Math.sin(now * 0.008) * 2, 0, Math.PI * 2);
            ctx.stroke();

            const offset = (now * 0.0018) % Math.PI;
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                const angle = offset + (Math.PI / 2) * i;
                ctx.moveTo(mouseX + Math.cos(angle) * 12, mouseY + Math.sin(angle) * 12);
                ctx.lineTo(mouseX + Math.cos(angle) * 21, mouseY + Math.sin(angle) * 21);
            }
            ctx.stroke();
            ctx.restore();
        }

        for (let i = activeParticles.length - 1; i >= 0; i--) {
            const p = activeParticles[i];
            p.life++;
            if (p.life >= p.maxLife) { activeParticles.splice(i, 1); continue; }
            
            const progress = p.life / p.maxLife;
            const alpha = 1 - progress;

            if (p.type === "spark") {
                p.x += p.vx; p.y += p.vy;
                ctx.save();
                ctx.fillStyle = p.color;
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            } else if (p.type === "shockwave") {
                ctx.save();
                ctx.strokeStyle = p.color;
                ctx.lineWidth = p.size * alpha;
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.startRadius + (p.maxRadius - p.startRadius) * progress, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }
        }

        if (isSlingshotActive) {
            const dx = mouseX - slingshotAnchor.x;
            const dy = mouseY - slingshotAnchor.y;
            const launchVx = -dx * 0.15;
            const launchVy = -dy * 0.15;

            ctx.save();
            ctx.strokeStyle = slingshotType === "special" ? "#ff00ea" : "#00f0ff";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(slingshotAnchor.x, slingshotAnchor.y, 14, 0, Math.PI * 2);
            ctx.stroke();

            ctx.strokeStyle = slingshotType === "special" ? "rgba(255, 0, 234, 0.7)" : "rgba(0, 240, 255, 0.7)";
            ctx.setLineDash([4, 6]);
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(slingshotAnchor.x, slingshotAnchor.y);
            ctx.lineTo(slingshotAnchor.x + launchVx * 12, slingshotAnchor.y + launchVy * 12);
            ctx.stroke();
            ctx.setLineDash([]); 

            ctx.strokeStyle = "#ff00ea";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(slingshotAnchor.x, slingshotAnchor.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();
            ctx.restore();
        }

        for (let i = activeProjectiles.length - 1; i >= 0; i--) {
            const proj = activeProjectiles[i];

            const prevX = proj.x;
            const prevY = proj.y;

            proj.x += proj.vx;
            proj.y += proj.vy;

            const angle = Math.atan2(proj.vy, proj.vx);
            const spacing = 7;
            const px = -Math.sin(angle) * spacing;
            const py = Math.cos(angle) * spacing;

            if (proj.style === "laser" || proj.style === "special") {
                ctx.save();
                ctx.strokeStyle = proj.color;
                ctx.lineWidth = proj.style === "special" ? 5.0 : 3;
                ctx.beginPath();

                ctx.moveTo(proj.x + px, proj.y + py);
                ctx.lineTo(prevX + px, prevY + py);
                ctx.moveTo(proj.x - px, proj.y - py);
                ctx.lineTo(prevX - px, prevY - py);
                
                ctx.stroke();
                ctx.restore();

                if (!isWarpActive) {
                    const distToShip = getDistanceToSegment(targetShip.x, targetShip.y, prevX, prevY, proj.x, proj.y);
                    const shipHitRadius = targetShip.isBoss ? 45 : 26; 
                    if (distToShip < shipHitRadius) {
                        activeProjectiles.splice(i, 1);
                        onImpact(targetShip.x, targetShip.y, proj.style, proj.damage);
                        continue;
                    }
                }

                let hitAsteroid = false;
                for (let a = activeAsteroids.length - 1; a >= 0; a--) {
                    const ast = activeAsteroids[a];
                    const distToAst = getDistanceToSegment(ast.x, ast.y, prevX, prevY, proj.x, proj.y);
                    if (distToAst < ast.size + 8) {
                        activeAsteroids.splice(a, 1); 
                        playSound("explosion");
                        
                        for (let p = 0; p < 8; p++) {
                            const angle = Math.random() * Math.PI * 2;
                            const speed = Math.random() * 3 + 1;
                            activeParticles.push({
                                type: "spark",
                                x: ast.x,
                                y: ast.y,
                                vx: Math.cos(angle) * speed,
                                vy: Math.sin(angle) * speed,
                                size: Math.random() * 2 + 1,
                                color: "#a6adc8",
                                life: 0,
                                maxLife: Math.random() * 10 + 10
                            });
                        }
                        triggerFloatingText("☄️ CLEARED!", ast.x, ast.y, "#a6adc8");

                        if (proj.style !== "special") {
                            hitAsteroid = true;
                            activeProjectiles.splice(i, 1);
                            break;
                        }
                    }
                }
                if (hitAsteroid) continue;

                if (proj.y < -50 || proj.y > window.innerHeight + 50 || proj.x < -50 || proj.x > window.innerWidth + 50) {
                    activeProjectiles.splice(i, 1);
                }
            }
        }

        context.loopId = requestAnimationFrame(updatePhysics);
    };

    // Collision Handler
    const onImpact = (x, y, style, damage = 0) => {
        targetShip.flashFrames = 5;
        
        if (style === "laser" && slingshotType === "standard") {
            playSound("deflect");
            targetShip.shieldPulsing = 15; 
            triggerFloatingText("🛡️ SHIELDS ABSORBING", targetShip.x, targetShip.y + 15, "#00f0ff");
            return;
        }

        if (damage > 0) {
            targetShip.hp -= damage;
            if (targetShip.hp <= 0) {
                playSound("explosion");
                triggerScreenShake();
                
                if (targetShip.isBoss) {
                    triggerWarpSectorJump();
                    
                    for (let i = 0; i < 40; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = Math.random() * 10 + 3;
                        activeParticles.push({
                            type: "spark",
                            x: targetShip.x,
                            y: targetShip.y,
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed,
                            size: Math.random() * 4 + 1.5,
                            color: "#39ff14",
                            life: 0,
                            maxLife: Math.random() * 30 + 20
                        });
                    }
                    
                    targetShip.isBoss = false;
                    targetShip.maxHp = 1000;
                    targetShip.hp = targetShip.maxHp;
                    targetShip.y = 75;
                } else {
                    triggerWarpSectorJump();
                    
                    for (let i = 0; i < 20; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = Math.random() * 6 + 2;
                        activeParticles.push({
                            type: "spark",
                            x: targetShip.x,
                            y: targetShip.y,
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed,
                            size: Math.random() * 3 + 1,
                            color: "#ff2a6d",
                            life: 0,
                            maxLife: Math.random() * 20 + 15
                        });
                    }

                    targetShip.isBoss = true;
                    targetShip.maxHp = 5000;
                    targetShip.hp = targetShip.maxHp;
                    targetShip.y = 85;
                }
            }
        }

        playSound("explosion");

        activeParticles.push({
            type: "shockwave",
            x: x,
            y: y,
            startRadius: 10,
            maxRadius: 100,
            size: 3,
            color: style === "special" ? "#ff00ea" : "#00f0ff",
            life: 0,
            maxLife: 20
        });

        for (let i = 0; i < 12; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 2;
            activeParticles.push({
                type: "spark",
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 2.5 + 1,
                color: slingshotType === "special" ? "#ff00ea" : "#00f0ff",
                life: 0,
                maxLife: Math.random() * 15 + 15
            });
        }

        if (damage > 0) {
            triggerFloatingText(`CRIT -${damage}!`, x, y, "#ff00ea");
        }
    };

    // Manual Weapon Launchers
    const triggerLaserStrike = (vx = 0, vy = -55, isSpecialShot = false) => {
        playSound(isSpecialShot ? "plasma" : "laser");

        const speedMagnitude = Math.hypot(vx, vy);
        const chargeDamage = Math.round(100 + Math.max(0, speedMagnitude - 15) * 8.5);

        activeProjectiles.push({
            style: isSpecialShot ? "special" : "laser",
            x: slingshotAnchor.x,
            y: slingshotAnchor.y,
            startY: slingshotAnchor.y,
            vx: vx,
            vy: vy,
            color: isSpecialShot ? "#ff00ea" : "#00f0ff",
            damage: isSpecialShot ? chargeDamage : 0 
        });
    };

    // Start rendering loops
    context.loopId = requestAnimationFrame(updatePhysics);

    // Global Keyboard Event Hooks
    let ctrlPressed = false;

    window._sandboxKeyDownHandler = (e) => {
        if (e.key === "Control" || e.key === "Meta") {
            ctrlPressed = true;
        }

        const isModifierOnly = e.key === "Control" || e.key === "Meta" || e.key === "Shift" || e.key === "Alt";
        const isGameShortcut = ((e.ctrlKey || ctrlPressed) && (e.key === " " || e.code === "Space")) ||
                               ((e.ctrlKey || ctrlPressed) && (e.metaKey || e.altKey) && (e.key === "c" || e.code === "KeyC"));
        
        if (!isModifierOnly && !isGameShortcut) {
            isMouseCursorVisible = false;
        }
        updatePositionFromCaret();

        const isCtrl = e.metaKey || e.ctrlKey || ctrlPressed;
        const isSpace = e.key === " " || e.key === "Spacebar" || e.code === "Space";

        // Deactivate overlay completely
        if (e.key === "Escape") {
            cleanUp();
            return;
        }

        const isSpecialTrigger = isCtrl && (e.metaKey || e.altKey) && (e.key === "c" || e.key === "C" || e.code === "KeyC");
        if (isSpecialTrigger) {
            e.preventDefault();
            e.stopPropagation();
            
            superCursorActive = true;
            playSound("powerup");
            triggerFloatingText("⚡ SUPER CURSOR CHARGED!", mouseX, mouseY, "#ffd700");
            return;
        }

        if (isSpace) {
            if (isCtrl && !isSlingshotActive) {
                e.preventDefault();
                e.stopPropagation();
                
                isSlingshotActive = true;
                slingshotType = superCursorActive ? "special" : "standard";
                slingshotAnchor.x = mouseX;
                slingshotAnchor.y = mouseY;
            }
        }
    };

    window._sandboxKeyUpHandler = (e) => {
        if (e.key === "Control" || e.key === "Meta") {
            ctrlPressed = false;
        }

        updatePositionFromCaret();

        if (isSlingshotActive) {
            const isSpaceRelease = e.key === " " || e.key === "Spacebar" || e.code === "Space";
            const isControlRelease = e.key === "Control" || e.key === "Meta";

            if (isSpaceRelease || isControlRelease) {
                triggerSlingshotRelease();
            }
        }
    };

    window.addEventListener("keydown", window._sandboxKeyDownHandler, { capture: true });
    window.addEventListener("keyup", window._sandboxKeyUpHandler, { capture: true });

    // Same-Origin Iframe Listener Injector & Electron Webview IPC Bridge (Leak-Proof)
    const scanAndBindWebviews = () => {
        const attachedWebviews = context.attachedWebviews;
        const attachedIframes = context.attachedIframes;

        // Deep-clean registry of detached Webviews before processing to free heap memory
        for (let i = attachedWebviews.length - 1; i >= 0; i--) {
            const item = attachedWebviews[i];
            if (!item.element || !item.element.isConnected) {
                try {
                    item.element.removeEventListener("keydown", item.keydown, { capture: true });
                    item.element.removeEventListener("keyup", item.keyup, { capture: true });
                    item.element.removeEventListener("console-message", item.consoleMsg);
                    if (item.domReady) item.element.removeEventListener("dom-ready", item.domReady);
                    if (item.didNavigate) item.element.removeEventListener("did-start-navigation", item.didNavigate);
                } catch (e) {}
                attachedWebviews.splice(i, 1);
            }
        }

        // Deep-clean registry of standard detached Iframes before processing to prevent memory leak
        for (let i = attachedIframes.length - 1; i >= 0; i--) {
            const item = attachedIframes[i];
            const iframe = (item.documentEl && item.documentEl.defaultView) ? item.documentEl.defaultView.frameElement : null;
            if (!iframe || !iframe.isConnected) {
                try {
                    item.documentEl.removeEventListener("mousemove", item.mousemove, { capture: true });
                    item.documentEl.removeEventListener("pointermove", item.mousemove, { capture: true });
                    item.documentEl.removeEventListener("mousedown", item.mousedown, { capture: true });
                    item.documentEl.removeEventListener("pointerdown", item.mousedown, { capture: true });
                    item.documentEl.removeEventListener("keydown", item.keydown, { capture: true });
                    item.documentEl.removeEventListener("keyup", item.keyup, { capture: true });
                } catch(e) {}
                attachedIframes.splice(i, 1);
            }
        }

        const webviews = document.querySelectorAll("webview");
        webviews.forEach(wv => {
            if (!wv._hasSandboxKeys) {
                wv._hasSandboxKeys = true;

                const boundKeyDown = (e) => {
                    // Stamp the webview element so OBS_MOUSE_VISIBLE debounce knows a keydown just happened
                    wv._lastSandboxKeydown = Date.now();
                    window._sandboxKeyDownHandler(e);
                };
                const boundKeyUp = window._sandboxKeyUpHandler;

                wv.addEventListener("keydown", boundKeyDown, { capture: true });
                wv.addEventListener("keyup", boundKeyUp, { capture: true });

                const handleConsoleMsg = (e) => {
                    if (e.message) {
                        if (e.message.startsWith('OBS_MOUSE_MOVE:')) {
                            const coordsStr = e.message.split('OBS_MOUSE_MOVE:')[1];
                            const coords = coordsStr.split(',');
                            const rect = wv.getBoundingClientRect();
                            mouseX = rect.left + parseFloat(coords[0]);
                            mouseY = rect.top + parseFloat(coords[1]);
                            // Only restore mouse-cursor mode if no keydown happened recently.
                            // Prevents the race: keydown sets isMouseCursorVisible=false,
                            // then an in-flight OBS_MOUSE_MOVE immediately flips it back.
                            if (Date.now() - (wv._lastSandboxKeydown || 0) > 300) {
                                isMouseCursorVisible = true;
                            }
                        }
                        else if (e.message === 'OBS_MOUSE_VISIBLE:true') {
                            if (Date.now() - (wv._lastSandboxKeydown || 0) > 300) {
                                isMouseCursorVisible = true;
                            }
                        }
                        else if (e.message === 'OBS_MOUSE_VISIBLE:false') {
                            isMouseCursorVisible = false;
                        }
                        else if (e.message.startsWith('OBS_CARET_MOVE:')) {
                            const coordsStr = e.message.split('OBS_CARET_MOVE:')[1];
                            const coords = coordsStr.split(',');
                            const rect = wv.getBoundingClientRect();
                            // Coords from injected script are already viewport-relative inside the webview.
                            // Only add the webview's own offset if it's not full-viewport (e.g. a panel/split).
                            const isFullViewport = rect.left < 2 && rect.top < 2;
                            webviewCaretX = isFullViewport ? parseFloat(coords[0]) : rect.left + parseFloat(coords[0]);
                            webviewCaretY = isFullViewport ? parseFloat(coords[1]) : rect.top + parseFloat(coords[1]);
                            webviewCaretActive = true;
                            if (!isMouseCursorVisible) {
                                mouseX = webviewCaretX;
                                mouseY = webviewCaretY;
                            }
                        }
                        else if (e.message === 'OBS_CARET_CLEAR') {
                            webviewCaretActive = false;
                        }
                        else if (e.message.startsWith('OBS_KEY_DOWN:SPACE:')) {
                            if (!isSlingshotActive) {
                                isSlingshotActive = true;
                                slingshotType = superCursorActive ? "special" : "standard";
                                slingshotAnchor.x = mouseX;
                                slingshotAnchor.y = mouseY;
                            }
                        }
                        else if (e.message.startsWith('OBS_KEY_DOWN:SPECIAL')) {
                            superCursorActive = true;
                            playSound("powerup");
                            triggerFloatingText("⚡ SUPER CURSOR CHARGED!", mouseX, mouseY, "#ffd700");
                        }
                        else if (e.message.startsWith('OBS_KEY_DOWN:ESCAPE')) {
                            cleanUp();
                        }
                        else if (e.message === 'OBS_KEY_UP') {
                            triggerSlingshotRelease();
                        }
                    }
                };

                wv.addEventListener('console-message', handleConsoleMsg);

                const injectScript = () => {
                    wv.executeJavaScript(`
                        if (!window._obsMouseTrackerInjected) {
                            window._obsMouseTrackerInjected = true;

                            let lastLoggedMove = 0;
                            let lastMouseX = -1;
                            let lastMouseY = -1;

                            const registerMove = (e) => {
                                const now = Date.now();
                                if (now - lastLoggedMove > 16) {
                                    const mx = e.clientX;
                                    const my = e.clientY;
                                    // Only send OBS_MOUSE_VISIBLE:true if the mouse actually moved.
                                    // Suppressing it on stationary-but-firing pointermove events
                                    // prevents the race that overrides caret tracking while typing.
                                    const didMove = mx !== lastMouseX || my !== lastMouseY;
                                    lastMouseX = mx;
                                    lastMouseY = my;
                                    console.log('OBS_MOUSE_MOVE:' + mx + ',' + my);
                                    if (didMove) console.log('OBS_MOUSE_VISIBLE:true');
                                    lastLoggedMove = now;
                                }
                            };

                            const forceVisible = () => {
                                console.log('OBS_MOUSE_VISIBLE:true');
                            };

                            window.addEventListener('mousemove', registerMove, { capture: true });
                            window.addEventListener('pointermove', registerMove, { capture: true });
                            window.addEventListener('mousedown', forceVisible, { capture: true });
                            window.addEventListener('pointerdown', forceVisible, { capture: true });

                            const getInputCaretX = (el) => {
                                const styles = window.getComputedStyle(el);
                                if (!window._obsMeasureCanvas) {
                                    window._obsMeasureCanvas = document.createElement('canvas');
                                }
                                const ctx2d = window._obsMeasureCanvas.getContext('2d');
                                ctx2d.font = styles.fontStyle + ' ' + styles.fontVariant + ' ' +
                                             styles.fontWeight + ' ' + styles.fontSize + ' ' +
                                             styles.fontFamily;
                                const textUpToCaret = el.value.substring(0, el.selectionStart);
                                const textWidth = ctx2d.measureText(textUpToCaret).width;

                                const rect = el.getBoundingClientRect();
                                const paddingLeft = parseFloat(styles.paddingLeft) || 0;
                                const x = rect.left + paddingLeft + textWidth - el.scrollLeft;
                                return Math.min(Math.max(x, rect.left + paddingLeft), rect.right - 4);
                            };

                            const getGoogleDocsCaret = () => {
                                const caretEl = document.querySelector('#kix-current-user-cursor-caret') || 
                                                document.querySelector('.kix-cursor-caret') || 
                                                document.querySelector('.kix-cursor') ||
                                                document.querySelector('.docs-text-ui-cursor-blink');
                                if (!caretEl) return null;
                                
                                const cursorContainer = caretEl.closest('.kix-cursor') || caretEl.parentElement;
                                let rect = caretEl.getBoundingClientRect();

                                if (rect.width === 0 && rect.height === 0 && cursorContainer) {
                                    const origParentDisplay = cursorContainer.style.display;
                                    const origParentVisibility = cursorContainer.style.visibility;
                                    const origParentOpacity = cursorContainer.style.opacity;

                                    const origChildDisplay = caretEl.style.display;
                                    const origChildVisibility = caretEl.style.visibility;
                                    const origChildOpacity = caretEl.style.opacity;

                                    cursorContainer.style.setProperty("display", "block", "important");
                                    cursorContainer.style.setProperty("visibility", "hidden", "important");
                                    cursorContainer.style.setProperty("opacity", "0", "important");

                                    caretEl.style.setProperty("display", "block", "important");
                                    caretEl.style.setProperty("visibility", "hidden", "important");
                                    caretEl.style.setProperty("opacity", "0", "important");

                                    rect = caretEl.getBoundingClientRect();

                                    cursorContainer.style.display = origParentDisplay;
                                    cursorContainer.style.visibility = origParentVisibility;
                                    cursorContainer.style.opacity = origParentOpacity;

                                    caretEl.style.display = origChildDisplay;
                                    caretEl.style.visibility = origChildVisibility;
                                    caretEl.style.opacity = origChildOpacity;
                                }

                                if (rect.width === 0 && rect.height === 0) return null;
                                if (rect.left === 0 && rect.top === 0) return null;
                                return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
                            };

                            const getCaretCoordinates = () => {
                                try {
                                    const gDocsCaret = getGoogleDocsCaret();
                                    if (gDocsCaret) return gDocsCaret;

                                    const activeEl = document.activeElement;
                                    if (!activeEl) return null;

                                    if (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA") {
                                        const styles = window.getComputedStyle(activeEl);
                                        const rect = activeEl.getBoundingClientRect();
                                        
                                        if (!window._obsMirrorDiv) {
                                            window._obsMirrorDiv = document.createElement('div');
                                            Object.assign(window._obsMirrorDiv.style, {
                                                position: 'absolute',
                                                visibility: 'hidden',
                                                whiteSpace: 'pre-wrap',
                                                wordBreak: 'break-all',
                                                top: '0',
                                                left: '0',
                                                height: 'auto'
                                            });
                                            document.body.appendChild(window._obsMirrorDiv);
                                        }

                                        window._obsMirrorDiv.style.width = activeEl.clientWidth + 'px';
                                        window._obsMirrorDiv.style.font = styles.font;
                                        window._obsMirrorDiv.style.lineHeight = styles.lineHeight;
                                        window._obsMirrorDiv.style.padding = styles.padding;
                                        window._obsMirrorDiv.style.boxSizing = styles.boxSizing;

                                        const textUpToCaret = activeEl.value.substring(0, activeEl.selectionStart);
                                        window._obsMirrorDiv.textContent = textUpToCaret;

                                        const marker = document.createElement('span');
                                        marker.textContent = '|';
                                        window._obsMirrorDiv.appendChild(marker);

                                        const markerRect = marker.getBoundingClientRect();
                                        const mirrorRect = window._obsMirrorDiv.getBoundingClientRect();

                                        const x = rect.left + (markerRect.left - mirrorRect.left) - activeEl.scrollLeft;
                                        const y = rect.top + (markerRect.top - mirrorRect.top) - activeEl.scrollTop;

                                        return { x, y };
                                    }

                                    const selection = window.getSelection();
                                    if (selection && selection.rangeCount > 0) {
                                        const range = selection.getRangeAt(0);
                                        const rects = range.getClientRects();
                                        let rect = null;
                                        if (rects && rects.length > 0) {
                                            rect = rects[rects.length - 1];
                                        }
                                        
                                        if (!rect || (rect.left === 0 && rect.top === 0)) {
                                            const rangeBound = range.getBoundingClientRect();
                                            if (rangeBound && (rangeBound.left !== 0 || rangeBound.top !== 0)) {
                                                rect = rangeBound;
                                            } else {
                                                let node = range.startContainer;
                                                if (node) {
                                                    if (node.nodeType === Node.TEXT_NODE) {
                                                        node = node.parentNode;
                                                    }
                                                    if (node && typeof node.getBoundingClientRect === "function") {
                                                        let br = node.querySelector("br");
                                                        let measuredRect = br ? br.getBoundingClientRect() : null;
                                                        if (measuredRect && (measuredRect.left !== 0 || measuredRect.top !== 0)) {
                                                            rect = measuredRect;
                                                        } else {
                                                            const nodeRect = node.getBoundingClientRect();
                                                            const style = window.getComputedStyle(node);
                                                            const paddingLeft = parseFloat(style.paddingLeft) || 0;
                                                            const borderLeft = parseFloat(style.borderLeftWidth) || 0;
                                                            rect = {
                                                                left: nodeRect.left + paddingLeft + borderLeft,
                                                                top: nodeRect.top
                                                            };
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                        if (rect && (rect.left !== 0 || rect.top !== 0)) {
                                            return { x: rect.left, y: rect.top };
                                        }
                                    }
                                } catch (e) {}
                                return null;
                            };

                            const updateCaret = () => {
                                const caret = getCaretCoordinates();
                                if (caret) {
                                    console.log('OBS_CARET_MOVE:' + caret.x + ',' + caret.y);
                                } else {
                                    console.log('OBS_CARET_CLEAR');
                                }
                            };

                            // Event-based triggers for standard inputs/textareas
                            document.addEventListener('selectionchange', updateCaret, { capture: true });
                            window.addEventListener('input', updateCaret, { capture: true });
                            window.addEventListener('keyup', updateCaret, { capture: true });
                            window.addEventListener('click', updateCaret, { capture: true });

                            let _lastCaretX = -1;
                            let _lastCaretY = -1;
                            let _rafFrame = 0;

                            const pollGDocsCaret = () => {
                                _rafFrame++;
                                if (_rafFrame % 2 === 0) {
                                    const caret = getGoogleDocsCaret();
                                    if (caret) {
                                        const cx = Math.round(caret.x);
                                        const cy = Math.round(caret.y);
                                        // Only emit if position actually changed (avoid console spam)
                                        if (cx !== _lastCaretX || cy !== _lastCaretY) {
                                            _lastCaretX = cx;
                                            _lastCaretY = cy;
                                            console.log('OBS_CARET_MOVE:' + cx + ',' + cy);
                                        }
                                    }
                                }
                                window.requestAnimationFrame(pollGDocsCaret);
                            };
                            window.requestAnimationFrame(pollGDocsCaret);

                            let ctrlPressed = false;

                            const handleGuestKeydown = (e) => {
                                if (e.key === "Control" || e.key === "Meta") {
                                    ctrlPressed = true;
                                }

                                const isCtrl = e.metaKey || e.ctrlKey || ctrlPressed;
                                const isSpace = e.key === " " || e.code === "Space";
                                const isSpecialTrigger = e.ctrlKey && (e.metaKey || e.altKey) && (e.key === "c" || e.code === "KeyC");
                                const isEscape = e.key === "Escape";

                                const isModifierOnly = e.key === "Control" || e.key === "Meta" || e.key === "Shift" || e.key === "Alt";
                                const isGameKey = isSpecialTrigger || (isCtrl && isSpace) || isEscape;
                                
                                if (!isModifierOnly && !isGameKey) {
                                    console.log('OBS_MOUSE_VISIBLE:false');
                                }

                                if (isSpace && isCtrl) {
                                    e.preventDefault();
                                    e.stopImmediatePropagation();
                                    console.log('OBS_KEY_DOWN:SPACE:');
                                }
                                if (isSpecialTrigger) {
                                    e.preventDefault();
                                    e.stopImmediatePropagation();
                                    console.log('OBS_KEY_DOWN:SPECIAL');
                                }
                                if (isEscape) {
                                    console.log('OBS_KEY_DOWN:ESCAPE');
                                }
                            };

                            const handleGuestKeyup = (e) => {
                                if (e.key === "Control" || e.key === "Meta") {
                                    ctrlPressed = false;
                                }

                                const isSpace = e.key === " " || e.code === "Space";
                                const isCtrlModifier = e.key === "Control" || e.key === "Meta";
                                const isCtrlActive = e.ctrlKey || e.metaKey || ctrlPressed;

                                if (isSpace && isCtrlActive) {
                                    // Bypass swallowed keydowns in GDocs by triggering down and up sequences sequentially on keyup
                                    console.log('OBS_KEY_DOWN:SPACE:');
                                    console.log('OBS_KEY_UP');
                                } else if (isSpace || isCtrlModifier) {
                                    console.log('OBS_KEY_UP');
                                }
                            };

                            const attachToFrame = (iframe) => {
                                if (!iframe) return;
                                // Abort previous listeners on this iframe before re-attaching
                                if (iframe._obsFrameController) {
                                    iframe._obsFrameController.abort();
                                }
                                const controller = new AbortController();
                                iframe._obsFrameController = controller;
                                const { signal } = controller;
                                try {
                                    const win = iframe.contentWindow;
                                    if (win) {
                                        win.addEventListener('keydown', handleGuestKeydown, { capture: true, signal });
                                        win.addEventListener('keyup', handleGuestKeyup, { capture: true, signal });
                                    }
                                } catch (err) {}

                                iframe.addEventListener('load', () => {
                                    try {
                                        const win = iframe.contentWindow;
                                        if (win) {
                                            // Re-abort and re-attach on each load (new JS context)
                                            if (iframe._obsFrameController) iframe._obsFrameController.abort();
                                            const c2 = new AbortController();
                                            iframe._obsFrameController = c2;
                                            win.addEventListener('keydown', handleGuestKeydown, { capture: true, signal: c2.signal });
                                            win.addEventListener('keyup', handleGuestKeyup, { capture: true, signal: c2.signal });
                                        }
                                    } catch (e) {}
                                });
                            };

                            window.addEventListener('keydown', handleGuestKeydown, { capture: true });
                            window.addEventListener('keyup', handleGuestKeyup, { capture: true });

                            document.querySelectorAll('iframe').forEach(attachToFrame);

                            if (window._obsMutationObserver) {
                                window._obsMutationObserver.disconnect();
                            }
                            window._obsMutationObserver = new MutationObserver((mutations) => {
                                for (const mutation of mutations) {
                                    for (const node of mutation.addedNodes) {
                                        if (node.tagName === 'IFRAME') {
                                            attachToFrame(node);
                                        }
                                    }
                                }
                            });
                            window._obsMutationObserver.observe(document.body, { childList: true, subtree: true });
                        }
                    `).catch(() => {});
                };

                // Inject immediate execution to capture fully-loaded active Webviews
                injectScript();

                wv.addEventListener('dom-ready', injectScript);
                wv.addEventListener('did-start-navigation', injectScript);
                wv.addEventListener('did-finish-load', injectScript);

                attachedWebviews.push({
                    element: wv,
                    keydown: boundKeyDown,
                    keyup: boundKeyUp,
                    consoleMsg: handleConsoleMsg,
                    domReady: injectScript,
                    didNavigate: injectScript
                });
            }
        });

        // Handle static standard same-origin iframes
        const iframes = document.querySelectorAll("iframe");
        iframes.forEach(iframe => {
            try {
                if (iframe.contentDocument && !iframe._hasSandboxListeners) {
                    iframe._hasSandboxListeners = true;
                    
                    const iframeDoc = iframe.contentDocument;
                    const boundMouseMove = (e) => {
                        const rect = iframe.getBoundingClientRect();
                        mouseX = rect.left + e.clientX;
                        mouseY = rect.top + e.clientY;
                        isMouseCursorVisible = true;
                    };
                    const boundMouseDown = () => {
                        isMouseCursorVisible = true;
                    };
                    const boundKeyDown = window._sandboxKeyDownHandler;
                    const boundKeyUp = window._sandboxKeyUpHandler;

                    iframeDoc.addEventListener("mousemove", boundMouseMove, { capture: true });
                    iframeDoc.addEventListener("pointermove", boundMouseMove, { capture: true });
                    iframeDoc.addEventListener("mousedown", boundMouseDown, { capture: true });
                    iframeDoc.addEventListener("pointerdown", boundMouseDown, { capture: true });
                    iframeDoc.addEventListener("keydown", boundKeyDown, { capture: true });
                    iframeDoc.addEventListener("keyup", boundKeyUp, { capture: true });

                    attachedIframes.push({
                        documentEl: iframeDoc,
                        mousemove: boundMouseMove,
                        mousedown: boundMouseDown,
                        keydown: boundKeyDown,
                        keyup: boundKeyUp
                    });
                }
            } catch (err) {}
        });
    };

    window._sandboxWebviewScanInterval = setInterval(scanAndBindWebviews, 2000);
    scanAndBindWebviews();
};

// Export to Obsidian modular environment or auto-run directly in global browsers/web viewers
if (typeof module !== "undefined" && module.exports) {
    module.exports = runSandbox;
} else {
    runSandbox({ app: typeof app !== "undefined" ? app : null });
}