/**
 * Pacing Timer Visual Sandbox (V3)
 * Full Interactive Prototypes for:
 * 1. Energy Economy
 * 2. Loot Drops & Crate Catching
 * 3. Rhythm Parry Timing
 * 4. Space Mine Aiming & Sweeping
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

    // Dynamic Game State
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let energyCells = 100;
    let activePowerUp = null;
    let powerUpTimeLeft = 0;
    let underSiege = false;

    const trackMouse = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    };

    // 1. Clean up old sandbox instances and global listeners
    const cleanUp = () => {
        const existingDashboard = document.getElementById(SANDBOX_DASHBOARD_ID);
        if (existingDashboard) existingDashboard.remove();
        const existingCanvas = document.getElementById(CANVAS_OVERLAY_ID);
        if (existingCanvas) existingCanvas.remove();
        const existingHUD = document.getElementById(HUD_BAR_ID);
        if (existingHUD) existingHUD.remove();
        
        if (window._sandboxKeyDownHandler) {
            window.removeEventListener("keydown", window._sandboxKeyDownHandler, { capture: true });
            delete window._sandboxKeyDownHandler;
        }
        if (window._sandboxMouseMoveHandler) {
            window.removeEventListener("mousemove", window._sandboxMouseMoveHandler, { capture: true });
            delete window._sandboxMouseMoveHandler;
        }
        
        const cmWrapper = view.contentEl.querySelector(".cm-editor");
        if (cmWrapper) {
            cmWrapper.style.boxShadow = "none";
            cmWrapper.style.border = "none";
        }
    };
    
    cleanUp();

    // Register mouse coordinates
    window._sandboxMouseMoveHandler = trackMouse;
    window.addEventListener("mousemove", window._sandboxMouseMoveHandler, { capture: true });

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
    
    hudBar.innerHTML = `
        <div style="position: absolute; inset: 0; background-image: linear-gradient(rgba(0,240,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.05) 1px, transparent 1px); background-size: 15px 15px; opacity: 0.7; pointer-events: none;"></div>
        <div style="z-index: 2; pointer-events: none; font-weight: bold; text-shadow: 0 0 5px #00f0ff;">🛰️ ORBITAL RADAR: SHIELDS STABLE</div>
        <div id="sandbox-alien" style="position: absolute; left: 50%; top: 4px; font-size: 26px; z-index: 3; transition: transform 0.05s linear; filter: drop-shadow(0 0 8px #ff2a6d);">🛸</div>
        <div id="sandbox-powerup-text" style="z-index: 2; pointer-events: none; font-weight: bold; text-shadow: 0 0 5px #00f0ff;">POWER-UP: NONE</div>
    `;
    editorEl.prepend(hudBar);

    const alienEl = hudBar.querySelector("#sandbox-alien");
    const powerUpTextEl = hudBar.querySelector("#sandbox-powerup-text");
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
    const activeLootCrates = [];
    const activeMines = [];
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
            else if (type === "parry") {
                // Heavy metallic clang
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(40, now + 0.4);
                gain.gain.setValueAtTime(0.6, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
                
                const highOsc = audioCtx.createOscillator();
                const highGain = audioCtx.createGain();
                highOsc.type = "sine";
                highOsc.frequency.setValueAtTime(1200, now);
                highOsc.frequency.exponentialRampToValueAtTime(300, now + 0.15);
                highGain.gain.setValueAtTime(0.3, now);
                highGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

                osc.connect(gain);
                gain.connect(audioCtx.destination);
                highOsc.connect(highGain);
                highGain.connect(audioCtx.destination);

                osc.start(now);
                osc.stop(now + 0.45);
                highOsc.start(now);
                highOsc.stop(now + 0.2);
            }
            else if (type === "powerup") {
                // Ascending melodic chime
                const triggerNote = (freq, start, dur) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(freq, start);
                    gain.gain.setValueAtTime(0, start);
                    gain.gain.linearRampToValueAtTime(0.2, start + 0.01);
                    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(start);
                    osc.stop(start + dur + 0.05);
                };
                triggerNote(523.25, now, 0.15);
                triggerNote(659.25, now + 0.06, 0.15);
                triggerNote(783.99, now + 0.12, 0.15);
                triggerNote(1046.50, now + 0.18, 0.3);
            }
        } catch (e) {
            console.warn("Audio Blocked:", e);
        }
    };

    // Screen Shake helper
    const triggerScreenShake = () => {
        if (!editorEl) return;
        editorEl.style.animation = "none";
        editorEl.offsetHeight; // Reflow
        editorEl.style.animation = "pacing-sandbox-shake 0.15s cubic-bezier(.36,.07,.19,.97) both";
        setTimeout(() => { editorEl.style.animation = "none"; }, 150);
    };

    const flashAlien = () => {
        if (!alienEl) return;
        alienEl.style.animation = "none";
        alienEl.offsetHeight;
        alienEl.style.animation = "pacing-alien-flash 0.1s ease-out";
        setTimeout(() => { alienEl.style.animation = "none"; }, 100);
    };

    const getCursorCoordinates = () => {
        return { x: mouseX, y: mouseY };
    };

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

    // 5. Game Physics Loop (Rendering 4 Gamification Systems)
    let loopId = null;
    const updatePhysics = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const hudRect = hudBar.getBoundingClientRect();
        const targetY = hudRect.bottom;
        const now = Date.now();

        // Stencil the rhythm parry timing window (Pulsing Red target around the alien)
        const parryCycle = now % 3000; // 3-second breathing loop
        const parryActive = parryCycle >= 2300 && parryCycle <= 2800; // 500ms window

        // Dynamic target position calculations
        if (underSiege) {
            alienPercent = 10; // Alien sits aggressively on your left shields
        } else if (activePowerUp === "TIME FREEZE") {
            // Alien frozen in space — doesn't slide
        } else {
            // Normal back-and-forth flight
            alienPercent += alienDirection * 0.45;
            if (alienPercent >= 90) { alienPercent = 90; alienDirection = -1; }
            if (alienPercent <= 10) { alienPercent = 10; alienDirection = 1; }
        }
        alienEl.style.left = `${alienPercent}%`;

        const alienPos = getAlienCoordinates();

        // Draw rhythmic parry target indicators under siege
        if (underSiege && parryActive && alienPos) {
            ctx.strokeStyle = "#ff2a6d";
            ctx.lineWidth = 3;
            ctx.shadowColor = "#ff2a6d";
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(alienPos.x, alienPos.y, 22 + Math.sin(now * 0.02) * 4, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        // --- Render System 1: Tense Space Mines (Aiming Tracker) ---
        for (let i = activeMines.length - 1; i >= 0; i--) {
            const mine = activeMines[i];
            if (!mine.active) { activeMines.splice(i, 1); continue; }

            mine.x -= 1.8; // Slide towards your base

            // Draw floating spiky mines
            ctx.strokeStyle = "#f38ba8";
            ctx.lineWidth = 2;
            ctx.fillStyle = "#11111b";
            ctx.beginPath();
            ctx.arc(mine.x, targetY - 4, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Draw warning spikes
            ctx.strokeStyle = "#f38ba8";
            ctx.beginPath();
            for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
                const sX = mine.x + Math.cos(angle) * 7;
                const sY = targetY - 4 + Math.sin(angle) * 7;
                const eX = mine.x + Math.cos(angle) * 11;
                const eY = targetY - 4 + Math.sin(angle) * 11;
                ctx.moveTo(sX, sY);
                ctx.lineTo(eX, eY);
            }
            ctx.stroke();

            // Check if mine breached your defensive boundary (left wall)
            if (mine.x <= 35) {
                mine.active = false;
                triggerScreenShake();
                playSound("explosion");
                triggerFloatingText("💔 DAMAGE! -100HP", 60, targetY, "#f38ba8");
            }
        }

        // --- Render System 2: Falling Crate Collection (RNG Powerups) ---
        for (let i = activeLootCrates.length - 1; i >= 0; i--) {
            const crate = activeLootCrates[i];
            crate.y += 1.8; // Gravitational fall

            // Draw glowing cargo emojis
            ctx.font = "22px serif";
            ctx.shadowColor = "#f9e2af";
            ctx.shadowBlur = 8;
            ctx.fillText("🎁", crate.x - 11, crate.y + 7);
            ctx.shadowBlur = 0;

            // Collision Check: Capture cargo with your mouse pointer (Aiming skill)
            const dist = Math.hypot(mouseX - crate.x, mouseY - crate.y);
            if (dist < 25) {
                activeLootCrates.splice(i, 1);
                collectCrate(crate.x, crate.y);
                continue;
            }

            // Remove if crate falls below viewport boundaries
            if (crate.y > window.innerHeight + 20) {
                activeLootCrates.splice(i, 1);
            }
        }

        // Render basic particles/shockwaves
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

        // Render traveling projectiles
        for (let i = activeProjectiles.length - 1; i >= 0; i--) {
            const proj = activeProjectiles[i];
            proj.life++;

            const progress = proj.life / proj.maxLife;
            const endPoint = alienPos || { x: proj.startX, y: targetY };

            if (proj.style === "laser") {
                const currentX = proj.startX + (endPoint.x - proj.startX) * progress;
                const currentY = proj.startY + (endPoint.y - proj.startY) * progress;

                const angle = Math.atan2(endPoint.y - proj.startY, endPoint.x - proj.startX);
                const spacing = 7;
                const px = -Math.sin(angle) * spacing;
                const py = Math.cos(angle) * spacing;

                ctx.strokeStyle = proj.color;
                ctx.lineWidth = 3;
                ctx.shadowColor = proj.color;
                ctx.shadowBlur = 8;
                ctx.beginPath();
                
                // Draw normal or triple-shot lasers (RNG Modifier)
                if (activePowerUp === "TRIPLE-SHOT") {
                    ctx.lineWidth = 2.5;
                    // Left laser
                    ctx.moveTo(proj.startX + px * 1.5, proj.startY + py * 1.5);
                    ctx.lineTo(currentX + px * 1.5, currentY + py * 1.5);
                    // Center laser
                    ctx.moveTo(proj.startX, proj.startY);
                    ctx.lineTo(currentX, currentY);
                    // Right laser
                    ctx.moveTo(proj.startX - px, proj.startY - py);
                    ctx.lineTo(currentX - px, currentY - py);
                } else {
                    // Standard Dual Lasers
                    ctx.moveTo(proj.startX + px, proj.startY + py);
                    ctx.lineTo(currentX + px, currentY + py);
                    ctx.moveTo(proj.startX - px, proj.startY - py);
                    ctx.lineTo(currentX - px, currentY - py);
                }
                ctx.stroke();
                ctx.shadowBlur = 0;

                if (proj.life >= proj.maxLife) {
                    activeProjectiles.splice(i, 1);
                    onImpact(endPoint.x, endPoint.y, "laser", parryActive);
                }
            } 
            else if (proj.style === "plasma") {
                const cx = proj.startX + (endPoint.x - proj.startX) * progress;
                const cy = proj.startY + (endPoint.y - proj.startY) * progress;
                const arcDir = proj.startX < endPoint.x ? 1 : -1;
                const curveOffset = Math.sin(progress * Math.PI) * -85 * arcDir;

                const currentX = cx + curveOffset;
                const currentY = cy;

                ctx.fillStyle = proj.color;
                ctx.shadowColor = proj.color;
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                if (proj.life >= proj.maxLife) {
                    activeProjectiles.splice(i, 1);
                    onImpact(endPoint.x, endPoint.y, "plasma", parryActive);
                }
            }
            else if (proj.style === "megabeam") {
                ctx.strokeStyle = proj.color;
                ctx.shadowColor = proj.color;
                ctx.shadowBlur = 20 * (1 - progress);
                ctx.lineWidth = 45 * (1 - progress);
                ctx.globalAlpha = 1 - progress;
                ctx.beginPath();
                ctx.moveTo(proj.startX, proj.startY);
                ctx.lineTo(endPoint.x, endPoint.y);
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

    // Power-up Collector
    const collectCrate = (x, y) => {
        playSound("powerup");
        const list = ["TRIPLE-SHOT", "TIME FREEZE", "SHIELD BOOST"];
        activePowerUp = list[Math.floor(Math.random() * list.length)];
        
        powerUpTextEl.textContent = `POWER-UP: ${activePowerUp}`;
        powerUpTextEl.style.color = "#f9e2af";
        powerUpTextEl.style.textShadow = "0 0 8px #f9e2af";

        triggerFloatingText(`+🎁 ${activePowerUp}!`, x, y, "#f9e2af");

        // Expire active powerups after 12 seconds
        setTimeout(() => {
            activePowerUp = null;
            powerUpTextEl.textContent = "POWER-UP: NONE";
            powerUpTextEl.style.color = "#00f0ff";
            powerUpTextEl.style.textShadow = "0 0 5px #00f0ff";
        }, 12000);
    };

    // Collision Handler with System 3 Rhythm Parry integration
    const onImpact = (x, y, style, wasParryWindowOpen) => {
        flashAlien();

        // Detect System 3: Perfect Parry execution
        if (underSiege && wasParryWindowOpen) {
            playSound("parry");
            triggerScreenShake();
            underSiege = false; // Push back alien from active siege
            
            // Large golden blast wave
            activeParticles.push({
                type: "shockwave",
                x: x,
                y: y,
                startRadius: 20,
                maxRadius: 250,
                size: 8,
                color: "#ff8700",
                life: 0,
                maxLife: 35
            });

            triggerFloatingText("🛡️ PERFECT PARRY! HP RESET", x, y, "#ff8700");
            
            // Explode heavy gold particle burst
            for (let i = 0; i < 30; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 8 + 3;
                activeParticles.push({
                    type: "spark",
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: Math.random() * 3.5 + 1.5,
                    color: "#ff8700",
                    life: 0,
                    maxLife: Math.random() * 20 + 20
                });
            }
            return;
        }

        playSound("explosion");

        // RNG Loop Drop Trigger: 30% chance on standard defeat
        if (Math.random() < 0.3) {
            activeLootCrates.push({ x: x, y: y });
        }

        // Spawn standard damage particles
        activeParticles.push({
            type: "shockwave",
            x: x,
            y: y,
            startRadius: 10,
            maxRadius: 100,
            size: 3,
            color: style === "plasma" ? "#ff40ab" : "#00f0ff",
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
                color: style === "plasma" ? "#ff40ab" : "#00f0ff",
                life: 0,
                maxLife: Math.random() * 15 + 15
            });
        }

        triggerFloatingText(style === "plasma" ? "CRIT -350!" : "-120", x, y, style === "plasma" ? "#ff00ea" : "#00f0ff");
    };

    // 6. Weapon Launchers (Sourcing coordinates from mouse tracking)
    const triggerLaserStrike = () => {
        // --- System 4: Target Sweeper Check ---
        // Verify if your mouse pointer coordinates are centered on any floating space mine
        for (let i = activeMines.length - 1; i >= 0; i--) {
            const mine = activeMines[i];
            const dist = Math.hypot(mouseX - mine.x, mouseY - (hudBar.getBoundingClientRect().bottom - 20));
            if (dist < 28) {
                mine.active = false;
                onImpact(mine.x, hudBar.getBoundingClientRect().bottom - 4, "laser", false);
                triggerFloatingText("🎯 MINE DEFUSED!", mine.x, mouseY, "#39ff14");
                return; // Consume attack to sweep mine
            }
        }

        // Deduct energy cell costs if Stacking Mode Economy is active
        if (energyCells < 5) {
            triggerFloatingText("🚫 LOW ENERGY!", mouseX, mouseY, "#f38ba8");
            return;
        }

        playSound("laser");
        activeProjectiles.push({
            style: "laser",
            startX: mouseX,
            startY: mouseY,
            life: 0,
            maxLife: 15,
            color: "#00f0ff"
        });
    };

    const triggerPlasmaBolt = () => {
        if (energyCells < 30) {
            triggerFloatingText("🚫 NEED 30 ENERGY!", mouseX, mouseY, "#f38ba8");
            return;
        }
        energyCells -= 30;
        updateDashboardCells();

        const coords = getCursorCoordinates();
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
        if (energyCells < 100) {
            triggerFloatingText("🚫 NEED 100 ENERGY!", mouseX, mouseY, "#f38ba8");
            return;
        }
        energyCells -= 100;
        updateDashboardCells();

        const coords = getCursorCoordinates();
        playSound("beam");
        triggerScreenShake();
        flashAlien();
        
        const alienPos = getAlienCoordinates();
        const endPoint = alienPos || { x: coords.x, y: targetY };
        
        activeProjectiles.push({
            style: "megabeam",
            startX: coords.x,
            startY: coords.y,
            life: 0,
            maxLife: 25,
            color: "#39ff14"
        });

        activeParticles.push({
            type: "shockwave",
            x: endPoint.x,
            y: endPoint.y,
            startRadius: 20,
            maxRadius: 180,
            size: 8,
            color: "#39ff14",
            life: 0,
            maxLife: 30
        });

        triggerFloatingText("VAPORIZED -999!", endPoint.x, endPoint.y, "#39ff14");
    };

    const updateDashboardCells = () => {
        const cellEl = dashboard.querySelector("#energy-meter");
        if (cellEl) cellEl.textContent = `⚡ ENERGY: ${energyCells} CELLS`;
    };

    // Start rendering loops
    loopId = requestAnimationFrame(updatePhysics);

    // Setup Global Keyboard Interception (Ctrl + Space)
    window._sandboxKeyDownHandler = (e) => {
        const isCtrl = e.metaKey || e.ctrlKey;
        if (isCtrl && !e.shiftKey && !e.altKey && (e.key === " " || e.key === "space")) {
            e.preventDefault();
            e.stopPropagation();
            triggerLaserStrike();
        }
    };
    window.addEventListener("keydown", window._sandboxKeyDownHandler, { capture: true });

    // 7. Floating Sandbox Control Dashboard
    const dashboard = document.createElement("div");
    dashboard.id = SANDBOX_DASHBOARD_ID;
    Object.assign(dashboard.style, {
        position: "fixed",
        top: "130px",
        right: "20px",
        width: "240px",
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
        <div style="font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid #00f0ff; padding-bottom: 6px; display: flex; justify-content: space-between; align-items: center; text-shadow: 0 0 5px #00f0ff;">
            <span>🕹️ LASER SANDBOX V3</span>
            <span id="sandbox-close" style="cursor: pointer; opacity: 0.6; font-size: 11px;">✕</span>
        </div>
        
        <!-- System 1 UI: Energy Cells -->
        <div id="energy-meter" style="font-size: 10px; color: #e9e2af; font-weight: bold; margin-bottom: 10px;">⚡ ENERGY: 100 CELLS</div>

        <p style="font-size: 8px; color: #8ba2ff; margin-top: 0; margin-bottom: 12px; line-height: 1.3;">
            Move mouse pointer across screen to aim:
            <br>• <b style="color: #00f0ff;">Ctrl+Space</b>: Fire Standard Lasers (aim at space mines!).
            <br>• Powerups are absorbed by moving mouse pointer into falling crates.
        </p>
        
        <!-- Controls -->
        <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px;">
            <button id="btn-charge" style="width: 100%; text-align: left; background: #161a36; color: #e9e2af; border: 1px solid #e9e2af; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 9px; font-weight: bold; font-family: monospace;">
                🔋 Complete Task (+35 Energy)
            </button>
            <button id="btn-crate" style="width: 100%; text-align: left; background: #161a36; color: #f9e2af; border: 1px solid #f9e2af; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 9px; font-weight: bold; font-family: monospace;">
                🎁 Spawn Loot Crate (RNG Item)
            </button>
            <button id="btn-mine" style="width: 100%; text-align: left; background: #161a36; color: #f38ba8; border: 1px solid #f38ba8; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 9px; font-weight: bold; font-family: monospace;">
                🛰️ Spawn Space Mine (Aim Target)
            </button>
            <button id="btn-siege" style="width: 100%; text-align: left; background: #161a36; color: #ff2a6d; border: 1px solid #ff2a6d; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 9px; font-weight: bold; font-family: monospace;">
                🛡️ Toggle Under Siege Mode (Parry Test)
            </button>
        </div>

        <div style="border-top: 1px dashed #00f0ff; padding-top: 8px; display: flex; flex-direction: column; gap: 6px;">
            <button id="btn-lasers" style="width: 100%; text-align: left; background: #161a36; color: #00f0ff; border: 1px solid #00f0ff; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 9px; font-weight: bold; font-family: monospace;">
                ⚡ Dual Lasers (Cost: 0)
            </button>
            <button id="btn-plasma" style="width: 100%; text-align: left; background: #161a36; color: #ff00ea; border: 1px solid #ff00ea; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 9px; font-weight: bold; font-family: monospace;">
                🔮 Homing Bolt (Cost: 30)
            </button>
            <button id="btn-megabeam" style="width: 100%; text-align: left; background: #161a36; color: #39ff14; border: 1px solid #39ff14; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 9px; font-weight: bold; font-family: monospace;">
                🟢 Special: Angled Beam (Cost: 100)
            </button>
        </div>
    `;

    document.body.appendChild(dashboard);

    // Bind Button actions
    dashboard.querySelector("#btn-lasers").addEventListener("click", () => triggerLaserStrike());
    dashboard.querySelector("#btn-plasma").addEventListener("click", () => triggerPlasmaBolt());
    dashboard.querySelector("#btn-megabeam").addEventListener("click", () => triggerMegaBeam());

    // Task completions (Add energy)
    dashboard.querySelector("#btn-charge").addEventListener("click", () => {
        energyCells = Math.min(150, energyCells + 35);
        updateDashboardCells();
        triggerFloatingText("+35 ENERGY CELL", mouseX, mouseY, "#e9e2af");
    });

    // Crate Spawning
    dashboard.querySelector("#btn-crate").addEventListener("click", () => {
        activeLootCrates.push({ x: Math.random() * (window.innerWidth - 100) + 50, y: targetY });
    });

    // Mine Spawning
    dashboard.querySelector("#btn-mine").addEventListener("click", () => {
        activeMines.push({ x: window.innerWidth - 50, active: true });
    });

    // Siege Toggle (Rhythm Parry)
    dashboard.querySelector("#btn-siege").addEventListener("click", (e) => {
        underSiege = !underSiege;
        e.target.style.background = underSiege ? "#ff2a6d" : "#161a36";
        e.target.style.color = underSiege ? "#0c0f1d" : "#ff2a6d";
    });

    // Dismiss Sandbox on Close Click
    dashboard.querySelector("#sandbox-close").addEventListener("click", () => {
        cleanUp();
        if (loopId) cancelAnimationFrame(loopId);
        new Notice("Space Shooter sandbox deactivated.");
    });
};