/**
 * Pacing Timer Sci-Fi Visual Sandbox
 * Run this script to test out the Space Invaders / Laser Grid visual.
 * Implements direct cursor-to-HUD laser trajectories and audio synthesis.
 */
module.exports = async (params) => {
    const { app } = params;
    const { MarkdownView, Notice } = require("obsidian");

    const view = app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) {
        new Notice("⚠️ Please open a Markdown note first to test cursor effects.");
        return;
    }

    const SANDBOX_DASHBOARD_ID = "pacing-timer-sandbox-dashboard";
    const CANVAS_OVERLAY_ID = "pacing-timer-sandbox-canvas";
    const HUD_BAR_ID = "pacing-timer-sandbox-hud";

    // 1. Clean up old sandbox instances
    const cleanUp = () => {
        const existingDashboard = document.getElementById(SANDBOX_DASHBOARD_ID);
        if (existingDashboard) existingDashboard.remove();
        const existingCanvas = document.getElementById(CANVAS_OVERLAY_ID);
        if (existingCanvas) existingCanvas.remove();
        const existingHUD = document.getElementById(HUD_BAR_ID);
        if (existingHUD) existingHUD.remove();
        
        // Remove event listeners
        if (window._sandboxKeyDownHandler) {
            window.removeEventListener("keydown", window._sandboxKeyDownHandler, { capture: true });
            delete window._sandboxKeyDownHandler;
        }
        
        // Clear active timer wrappers
        const cmWrapper = view.contentEl.querySelector(".cm-editor");
        if (cmWrapper) {
            cmWrapper.style.boxShadow = "none";
            cmWrapper.style.border = "none";
        }
    };
    
    cleanUp();

    // Inject shake and flash keyframes
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
                @keyframes pacing-alien-flash {
                    0% { filter: brightness(1) invert(0); }
                    50% { filter: brightness(3) invert(1); }
                    100% { filter: brightness(1) invert(0); }
                }
            `;
            document.head.appendChild(style);
        }
    };
    injectStyles();

    // 2. Setup Orbital HUD Bar
    const editorEl = view.contentEl.querySelector(".cm-editor");
    if (!editorEl) return;

    const hudBar = document.createElement("div");
    hudBar.id = HUD_BAR_ID;
    Object.assign(hudBar.style, {
        width: "100%",
        height: "40px",
        background: "#0c0f1d",
        borderBottom: "2px solid #00f0ff",
        boxShadow: "0 0 10px rgba(0, 240, 255, 0.2)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#00f0ff",
        userSelect: "none"
    });
    
    // Grid pattern design
    hudBar.innerHTML = `
        <div style="position: absolute; inset: 0; background-image: linear-gradient(rgba(0,240,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.05) 1px, transparent 1px); background-size: 15px 15px; opacity: 0.7; pointer-events: none;"></div>
        <div style="z-index: 2; pointer-events: none; font-weight: bold; text-shadow: 0 0 5px #00f0ff;">🛰️ ORBITAL RADAR: SHIELDS STABLE</div>
        <div id="sandbox-alien" style="position: absolute; left: 50%; top: 4px; font-size: 26px; z-index: 3; transition: transform 0.05s linear; filter: drop-shadow(0 0 8px #ff2a6d);">🛸</div>
        <div style="z-index: 2; pointer-events: none; font-weight: bold; text-shadow: 0 0 5px #00f0ff;">CHARGE: 100%</div>
    `;
    editorEl.prepend(hudBar);

    const alienEl = hudBar.querySelector("#sandbox-alien");
    let alienDirection = 1;
    let alienPercent = 50;

    // 3. Setup Body Canvas Overlay
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
    let audioCtx = null;

    // 4. Procedural Sound Synthesizer
    const playSound = (type) => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        try {
            const now = audioCtx.currentTime;
            
            if (type === "laser") {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(1400, now);
                osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.13);
            } 
            else if (type === "plasma") {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "triangle";
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.linearRampToValueAtTime(500, now + 0.1);
                osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);
                gain.gain.setValueAtTime(0.35, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.26);
            }
            else if (type === "beam") {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(80, now);
                osc.frequency.linearRampToValueAtTime(120, now + 0.4);
                gain.gain.setValueAtTime(0.5, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.46);
            }
            else if (type === "explosion") {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "triangle";
                osc.frequency.setValueAtTime(120, now);
                osc.frequency.exponentialRampToValueAtTime(20, now + 0.35);
                gain.gain.setValueAtTime(0.4, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.36);
            }
        } catch (e) {
            console.warn("Audio Blocked:", e);
        }
    };

    // 5. Screen Shake helper
    const triggerScreenShake = () => {
        if (!editorEl) return;
        editorEl.style.animation = "none";
        editorEl.offsetHeight; // Reflow
        editorEl.style.animation = "pacing-sandbox-shake 0.15s cubic-bezier(.36,.07,.19,.97) both";
        setTimeout(() => { editorEl.style.animation = "none"; }, 150);
    };

    // Flash alien helper
    const flashAlien = () => {
        if (!alienEl) return;
        alienEl.style.animation = "none";
        alienEl.offsetHeight;
        alienEl.style.animation = "pacing-alien-flash 0.1s ease-out";
        setTimeout(() => { alienEl.style.animation = "none"; }, 100);
    };

    const getCursorCoordinates = () => {
        const activeView = app.workspace.getActiveViewOfType(MarkdownView);
        if (!activeView) return null;
        const cm = activeView.editor.cm;
        if (!cm) return null;
        const head = cm.state.selection.main.head;
        const coords = cm.coordsAtPos(head);
        return coords ? { x: coords.left, y: coords.top } : null;
    };

    // Fetch exact current screen position of the sliding alien
    const getAlienCoordinates = () => {
        if (!alienEl) return null;
        const r = alienEl.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };

    const triggerFloatingText = (label, x, y, color = "#ff2a6d") => {
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

        setTimeout(() => {
            floatText.style.opacity = "0";
            floatText.style.transform += " translateY(-15px)";
            setTimeout(() => floatText.remove(), 600);
        }, 350);
    };

    // 6. Game Physics Loop (Lasers, Spark Particles, and Shockwaves)
    let loopId = null;
    const updatePhysics = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const hudRect = hudBar.getBoundingClientRect();
        const targetY = hudRect.bottom;

        // Slide alien back and forth on defensive line
        alienPercent += alienDirection * 0.45;
        if (alienPercent >= 90) { alienPercent = 90; alienDirection = -1; }
        if (alienPercent <= 10) { alienPercent = 10; alienDirection = 1; }
        alienEl.style.left = `${alienPercent}%`;

        // Update standard particle/shockwave arrays
        for (let i = activeParticles.length - 1; i >= 0; i--) {
            const p = activeParticles[i];
            p.life++;
            if (p.life >= p.maxLife) { activeParticles.splice(i, 1); continue; }
            
            const progress = p.life / p.maxLife;
            const alpha = 1 - progress;

            if (p.type === "spark") {
                p.x += p.vx; p.y += p.vy;
                ctx.fillStyle = p.color;
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            } else if (p.type === "shockwave") {
                ctx.strokeStyle = p.color;
                ctx.lineWidth = p.size * alpha;
                ctx.globalAlpha = alpha;
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 10 * alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.startRadius + (p.maxRadius - p.startRadius) * progress, 0, Math.PI * 2);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }

        // Update moving laser/plasma projectiles
        for (let i = activeProjectiles.length - 1; i >= 0; i--) {
            const proj = activeProjectiles[i];
            proj.life++;

            if (proj.style === "laser") {
                const progress = proj.life / proj.maxLife;
                const currentY = proj.startY + (targetY - proj.startY) * progress;

                // Draw high-tech dual neon beams
                ctx.strokeStyle = proj.color;
                ctx.lineWidth = 3;
                ctx.shadowColor = proj.color;
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.moveTo(proj.startX - 6, proj.startY);
                ctx.lineTo(proj.startX - 6, currentY);
                ctx.moveTo(proj.startX + 6, proj.startY);
                ctx.lineTo(proj.startX + 6, currentY);
                ctx.stroke();
                ctx.shadowBlur = 0;

                if (proj.life >= proj.maxLife) {
                    activeProjectiles.splice(i, 1);
                    onImpact(proj.startX, targetY, "laser");
                }
            } 
            else if (proj.style === "plasma") {
                const progress = proj.life / proj.maxLife;
                const alienPos = getAlienCoordinates();
                const endPoint = alienPos || { x: proj.startX, y: targetY };

                // Calculate organic arcing homing missile trajectory curves
                const cx = proj.startX + (endPoint.x - proj.startX) * progress;
                const cy = proj.startY + (endPoint.y - proj.startY) * progress;
                const arcDir = proj.startX < endPoint.x ? 1 : -1;
                const curveOffset = Math.sin(progress * Math.PI) * -85 * arcDir;

                const currentX = cx + curveOffset;
                const currentY = cy;

                // Draw glowing core energy sphere
                ctx.fillStyle = proj.color;
                ctx.shadowColor = proj.color;
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                if (proj.life >= proj.maxLife) {
                    activeProjectiles.splice(i, 1);
                    onImpact(endPoint.x, endPoint.y, "plasma");
                }
            }
            else if (proj.style === "megabeam") {
                const progress = proj.life / proj.maxLife;
                ctx.strokeStyle = proj.color;
                ctx.shadowColor = proj.color;
                ctx.shadowBlur = 20 * (1 - progress);
                ctx.lineWidth = 45 * (1 - progress);
                ctx.globalAlpha = 1 - progress;
                ctx.beginPath();
                ctx.moveTo(proj.startX, proj.startY);
                ctx.lineTo(proj.startX, targetY);
                ctx.stroke();
                ctx.shadowBlur = 0;
                ctx.globalAlpha = 1.0;

                if (proj.life >= proj.maxLife) {
                    activeProjectiles.splice(i, 1);
                }
            }
        }

        ctx.globalAlpha = 1.0;
        loopId = requestAnimationFrame(updatePhysics);
    };

    // Collision Handler
    const onImpact = (x, y, style) => {
        playSound("explosion");
        triggerScreenShake();
        flashAlien();

        // 1. Expanding energy shockwave on grid
        activeParticles.push({
            type: "shockwave",
            x: x,
            y: y,
            startRadius: 5,
            maxRadius: style === "plasma" ? 75 : 45,
            size: style === "plasma" ? 5 : 3,
            color: style === "plasma" ? "#ff00ea" : "#00f0ff",
            life: 0,
            maxLife: 20
        });

        // 2. Exploding spark debris
        const sparkCount = style === "plasma" ? 25 : 12;
        const sparkColor = style === "plasma" ? "#ff00ea" : "#00f0ff";
        for (let i = 0; i < sparkCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 1.5;
            activeParticles.push({
                type: "spark",
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed + 0.5, // slight downward fall
                size: Math.random() * 2.5 + 1,
                color: sparkColor,
                life: 0,
                maxLife: Math.random() * 15 + 15
            });
        }

        // 3. Floating Neon Damage Text
        if (style === "plasma") {
            triggerFloatingText("CRIT -350!", x, y, "#ff00ea");
        } else {
            triggerFloatingText("-120", x, y, "#00f0ff");
        }
    };

    // 7. Weapon Launchers
    const triggerLaserStrike = () => {
        const coords = getCursorCoordinates();
        if (!coords) return;
        playSound("laser");
        activeProjectiles.push({
            style: "laser",
            startX: coords.x,
            startY: coords.y,
            life: 0,
            maxLife: 15,
            color: "#00f0ff"
        });
    };

    const triggerPlasmaBolt = () => {
        const coords = getCursorCoordinates();
        if (!coords) return;
        playSound("plasma");
        activeProjectiles.push({
            style: "plasma",
            startX: coords.x,
            startY: coords.y,
            life: 0,
            maxLife: 35,
            color: "#ff00ea"
        });
    };

    const triggerMegaBeam = () => {
        const coords = getCursorCoordinates();
        if (!coords) return;
        playSound("beam");
        triggerScreenShake();
        flashAlien();
        
        const hudRect = hudBar.getBoundingClientRect();
        
        activeProjectiles.push({
            style: "megabeam",
            startX: coords.x,
            startY: coords.y,
            life: 0,
            maxLife: 25,
            color: "#39ff14"
        });

        // Giant collateral shockwave covering the defensive line
        activeParticles.push({
            type: "shockwave",
            x: coords.x,
            y: hudRect.bottom,
            startRadius: 20,
            maxRadius: 180,
            size: 8,
            color: "#39ff14",
            life: 0,
            maxLife: 30
        });

        triggerFloatingText("VAPORIZED -999!", coords.x, hudRect.bottom, "#39ff14");
    };

    // Start rendering loops
    loopId = requestAnimationFrame(updatePhysics);

    // 8. Setup Global Keyboard Interception inside Editor (Ctrl + Space)
    window._sandboxKeyDownHandler = (e) => {
        const isCtrl = e.metaKey || e.ctrlKey;
        if (isCtrl && !e.shiftKey && !e.altKey && (e.key === " " || e.key === "space")) {
            e.preventDefault();
            e.stopPropagation();
            triggerLaserStrike();
        }
    };
    window.addEventListener("keydown", window._sandboxKeyDownHandler, { capture: true });

    // 9. Floating Sandbox Control Dashboard
    const dashboard = document.createElement("div");
    dashboard.id = SANDBOX_DASHBOARD_ID;
    Object.assign(dashboard.style, {
        position: "fixed",
        top: "130px",
        right: "20px",
        width: "230px",
        background: "#0c0f1d",
        border: "1px solid #00f0ff",
        borderRadius: "10px",
        padding: "14px",
        zIndex: "1000000",
        fontFamily: "monospace",
        color: "#00f0ff",
        boxShadow: "0 8px 24px rgba(0, 240, 255, 0.15)",
        userSelect: "none"
    });

    dashboard.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 12px; border-bottom: 1px solid #00f0ff; padding-bottom: 6px; display: flex; justify-content: space-between; align-items: center; text-shadow: 0 0 5px #00f0ff;">
            <span>🕹️ LASER SANDBOX</span>
            <span id="sandbox-close" style="cursor: pointer; opacity: 0.6; font-size: 11px;">✕</span>
        </div>
        <p style="font-size: 9px; color: #8ba2ff; margin-top: 0; margin-bottom: 12px; line-height: 1.4;">
            Put your text cursor in your note, then use:
            <br>• <b style="color: #00f0ff;">Ctrl + Space</b> to fire standard lasers!
            <br>• Or use the dashboard controls below.
        </p>
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <button id="btn-lasers" style="width: 100%; text-align: left; background: #161a36; color: #00f0ff; border: 1px solid #00f0ff; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold; font-family: monospace; text-shadow: 0 0 3px #00f0ff;">
                ⚡ Attack 1: Dual Lasers
            </button>
            <button id="btn-plasma" style="width: 100%; text-align: left; background: #161a36; color: #ff00ea; border: 1px solid #ff00ea; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold; font-family: monospace; text-shadow: 0 0 3px #ff00ea;">
                🔮 Attack 2: Homing Bolt
            </button>
            <button id="btn-megabeam" style="width: 100%; text-align: left; background: #161a36; color: #39ff14; border: 1px solid #39ff14; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold; font-family: monospace; text-shadow: 0 0 3px #39ff14;">
                🟢 Special: Mega-Beam
            </button>
        </div>
    `;

    document.body.appendChild(dashboard);

    // Bind Button actions
    dashboard.querySelector("#btn-lasers").addEventListener("click", () => triggerLaserStrike());
    dashboard.querySelector("#btn-plasma").addEventListener("click", () => triggerPlasmaBolt());
    dashboard.querySelector("#btn-megabeam").addEventListener("click", () => triggerMegaBeam());

    // Dismiss Sandbox on Close Click
    dashboard.querySelector("#sandbox-close").addEventListener("click", () => {
        cleanUp();
        if (loopId) cancelAnimationFrame(loopId);
        new Notice("Space Shooter sandbox deactivated.");
    });
};