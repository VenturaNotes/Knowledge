/**
 * Galactic Sector Background Previewer (Standalone)
 * Controls:
 * - Keys [1 - 5]: Switch sector layouts
 * - Key [W]: Trigger a 2-second Hyperjump Warp
 * - Key [Escape]: Exit the previewer safely
 */
const runSectorPreviewer = async () => {
    const CANVAS_PREVIEW_ID = "pacing-timer-sector-preview-canvas";
    let isDeactivated = false;

    // 1. Clean up old previewer instances
    const cleanUp = () => {
        isDeactivated = true;
        const existingCanvas = document.getElementById(CANVAS_PREVIEW_ID);
        if (existingCanvas) existingCanvas.remove();
        
        if (window._previewKeyDownHandler) {
            window.removeEventListener("keydown", window._previewKeyDownHandler, { capture: true });
            delete window._previewKeyDownHandler;
        }
    };
    cleanUp();
    isDeactivated = false;

    // 2. Setup Sector Layout Definitions
    let currentSectorIndex = 0;
    let isWarpActive = false;
    let warpTimeStart = 0;

    const SECTORS = [
        { name: "Asteroid Belt", bgParticlesColor: "rgba(166, 173, 203, 0.45)", accentColor: "#00f0ff" },
        { name: "Orion Nebula", bgParticlesColor: "rgba(245, 194, 231, 0.45)", accentColor: "#ff00ea" },
        { name: "Binary Sun System", bgParticlesColor: "rgba(249, 226, 175, 0.45)", accentColor: "#f9e2af" },
        { name: "The Void", bgParticlesColor: "rgba(166, 227, 161, 0.35)", accentColor: "#39ff14" },
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

    // 3. Create Full-Screen Canvas Overlay
    const canvas = document.createElement("canvas");
    canvas.id = CANVAS_PREVIEW_ID;
    Object.assign(canvas.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        pointerEvents: "none", // Click-through enabled
        zIndex: "999999"
    });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    // 4. Animation Loop
    let loopId = null;
    const renderLoop = () => {
        if (isDeactivated) return;

        // Auto scale to window resizing
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const now = Date.now();
        const activeSector = SECTORS[currentSectorIndex];

        // --- Render Sector-Specific Overlays ---
        if (!isWarpActive) {
            if (activeSector.name === "Orion Nebula") {
                // Soft magenta nebula dust gradient
                const grad = ctx.createRadialGradient(canvas.width * 0.7, canvas.height * 0.4, 0, canvas.width * 0.7, canvas.height * 0.4, canvas.width * 0.8);
                grad.addColorStop(0, "rgba(255, 0, 234, 0.08)");
                grad.addColorStop(1, "rgba(0, 0, 0, 0)");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            } 
            else if (activeSector.name === "Binary Sun System") {
                // Warm, yellow solar lighting overlay
                const grad = ctx.createRadialGradient(canvas.width * 0.15, 0, 0, canvas.width * 0.15, 0, canvas.width * 0.7);
                grad.addColorStop(0, "rgba(255, 215, 0, 0.15)");
                grad.addColorStop(0.5, "rgba(255, 140, 0, 0.06)");
                grad.addColorStop(1, "rgba(0, 0, 0, 0)");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            else if (activeSector.name === "The Void") {
                // Deep purple event horizon center
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                
                const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, canvas.width * 0.45);
                grad.addColorStop(0, "rgba(13, 0, 26, 0.7)"); 
                grad.addColorStop(0.25, "rgba(102, 0, 153, 0.2)"); 
                grad.addColorStop(1, "rgba(0, 0, 0, 0)");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Event Horizon center core
                ctx.fillStyle = "rgba(0, 0, 0, 0.96)";
                ctx.beginPath();
                ctx.arc(centerX, centerY, 18, 0, Math.PI * 2);
                ctx.fill();
                
                // Pulsing outer blackhole ring
                ctx.strokeStyle = "rgba(102, 0, 153, 0.55)";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(centerX, centerY, 20 + Math.sin(now * 0.005) * 1.5, 0, Math.PI * 2);
                ctx.stroke();
            }
            else if (activeSector.name === "Cosmic Outpost Orbit") {
                // Cybernetic green telemetry grid overlay
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

        // --- Render Scrolling Starfield (With warp stretch & Void Gravity) ---
        ctx.strokeStyle = SECTORS[currentSectorIndex].bgParticlesColor;
        ctx.lineWidth = 1.5;
        stars.forEach(star => {
            let vy = star.vy;
            let vx = star.vx;

            // Apply gravitational pull mechanics inside "The Void"
            if (!isWarpActive && activeSector.name === "The Void") {
                const dx = (canvas.width / 2) - star.x;
                const dy = (canvas.height / 2) - star.y;
                const dist = Math.hypot(dx, dy);
                if (dist > 25) {
                    vx += (dx / dist) * 0.18;
                    vy += (dy / dist) * 0.18;
                } else {
                    star.x = Math.random() * canvas.width;
                    star.y = Math.random() * canvas.height;
                    vx = (Math.random() - 0.5) * 0.1;
                    vy = Math.random() * 0.8 + 0.2;
                }
            }

            star.y += vy * (isWarpActive ? 25 : 1);
            star.x += vx * (isWarpActive ? 25 : 1);
            
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            const stretch = isWarpActive ? 35 : 2;
            ctx.lineTo(star.x - vx * stretch, star.y - vy * stretch);
            ctx.stroke();

            // Wrapping
            if (star.y > window.innerHeight) star.y = 0;
            if (star.x > window.innerWidth) star.x = 0;
            if (star.x < 0) star.x = window.innerWidth;
        });

        // Handle Warp Timer transition
        if (isWarpActive && now - warpTimeStart > 2000) {
            isWarpActive = false;
            // Cycle to the next sector automatically if no key was pressed
            currentSectorIndex = (currentSectorIndex + 1) % SECTORS.length;
        }

        // --- Render On-Screen Instructions Legend (Translucent) ---
        ctx.save();
        ctx.font = "bold 11px monospace";
        ctx.fillStyle = "rgba(139, 162, 255, 0.4)";
        ctx.textAlign = "left";
        
        ctx.fillText(`📡 CURRENT SECTOR: ${activeSector.name.toUpperCase()}`, 30, 45);
        ctx.fillText("---------------------------------------------", 30, 60);
        ctx.fillText("• Press [1]: Asteroid Belt", 30, 75);
        ctx.fillText("• Press [2]: Orion Nebula (Translucent Pink Glow)", 30, 90);
        ctx.fillText("• Press [3]: Binary Sun (Warm Yellow Solar Light)", 30, 105);
        ctx.fillText("• Press [4]: The Void (Gravitational Black Hole Pull)", 30, 120);
        ctx.fillText("• Press [5]: Cosmic Outpost (Cybernetic Grid Overlay)", 30, 135);
        ctx.fillText("• Press [W]: Trigger a 2s Hyperwarp Transition", 30, 155);
        ctx.fillText("• Press [Escape]: Close Sector Previewer", 30, 175);
        ctx.restore();

        loopId = requestAnimationFrame(renderLoop);
    };

    loopId = requestAnimationFrame(renderLoop);

    // 5. Setup Keyboard Control Hooks
    window._previewKeyDownHandler = (e) => {
        // Exit safely
        if (e.key === "Escape") {
            cleanUp();
            if (loopId) cancelAnimationFrame(loopId);
            return;
        }

        // Switch Sectors
        if (e.key === "1") { currentSectorIndex = 0; isWarpActive = false; }
        else if (e.key === "2") { currentSectorIndex = 1; isWarpActive = false; }
        else if (e.key === "3") { currentSectorIndex = 2; isWarpActive = false; }
        else if (e.key === "4") { currentSectorIndex = 3; isWarpActive = false; }
        else if (e.key === "5") { currentSectorIndex = 4; isWarpActive = false; }

        // Trigger Warp Speed Transition
        if (e.key === "w" || e.key === "W") {
            if (!isWarpActive) {
                isWarpActive = true;
                warpTimeStart = Date.now();
            }
        }
    };
    window.addEventListener("keydown", window._previewKeyDownHandler, { capture: true });
};

// Auto-run the previewer
runSectorPreviewer();