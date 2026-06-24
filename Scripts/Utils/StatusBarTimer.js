const { Modal, Setting } = require('obsidian');

// Helper: Standard HH:MM:SS Formatter (padded 2-digit format e.g. 00:00:00)
const formatTimeHMS = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

// Helper: Dynamic Time Formatter (removes leading zero on minutes < 10) [1]
const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString()}:${secs.toString().padStart(2, '0')}`;
};

// Helper: Smart Pacing Delta Formatter (supports lock-secured dynamic bounds)
const formatDelta = (seconds) => {
    const neg = seconds < 0;
    const abs_s = Math.abs(seconds);
    const mins = Math.floor(abs_s / 60);
    const secs = abs_s % 60;
    
    // Only return minutes block if delta contains minutes
    if (mins > 0) {
        return `${neg ? "-" : ""}${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return `${neg ? "-" : ""}${secs}`;
};

// Smart Duration Parser Engine
const parseDurationToSeconds = (input) => {
    if (!input) return 0;
    const str = input.trim().toLowerCase();
    
    // 1. Handle Colon formats (MM:SS or HH:MM:SS)
    if (/^\d+(?::\d+){1,2}$/.test(str)) {
        const parts = str.split(':').map(Number);
        if (parts.length === 2) {
            return parts[0] * 60 + parts[1]; // MM:SS
        } else if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
        }
    }

    // 2. Regex matches for typical written formats
    const hrMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:h|hr|hrs|hour|hours)/);
    const minMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:m|min|mins|minute|minutes)/);
    const secMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:s|sec|secs|second|seconds)/);

    let totalSeconds = 0;
    let matchedAny = false;

    if (hrMatch) {
        totalSeconds += parseFloat(hrMatch[1]) * 3600;
        matchedAny = true;
    }
    if (minMatch) {
        totalSeconds += parseFloat(minMatch[1]) * 60;
        matchedAny = true;
    }
    if (secMatch) {
        totalSeconds += parseFloat(secMatch[1]);
        matchedAny = true;
    }

    if (matchedAny) {
        return Math.round(totalSeconds);
    }

    // 3. Fallback to raw numeric parsing (assume seconds if no unit is found)
    const fallback = parseFloat(str);
    return !isNaN(fallback) ? Math.round(fallback) : 0;
};

// 1. Native Obsidian Configuration Modal Class
class PacingSetupModal extends Modal {
    constructor(app, onSubmit) {
        super(app);
        this.onSubmit = onSubmit;
        
        // Read configuration cache from the window [1]
        const cache = window["pacingCockpitCache"] || {};
        this.isDefaultMode = cache.isDefaultMode !== false; // Default to Simple Countdown (ON) if cache is empty
        this.rawTitle = (cache.rawTitle && cache.rawTitle !== "undefined") ? cache.rawTitle : ""; // Optional session title cache
        
        this.rawTotalTimeSegmented = "10m"; 
        this.rawSegments = "10";
        this.rawDefaultTotalTime = "10m";
        
        // Input and toggle component references for keyboard interactions
        this.toggleComponent = null;
        this.titleInputText = null;
        this.segmentedInputText = null;
        this.segmentsInputText = null;
        this.defaultInputText = null;
        this.calculationEl = null; // Live preview DOM element
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        
        // Secure vertical dimensions and layout to prevent layout shifting
        contentEl.style.display = "flex";
        contentEl.style.flexDirection = "column";
        contentEl.style.minHeight = "360px"; // Raised to 360px to accommodate the new title field safely

        contentEl.createEl("h3", { text: "⏱️ Pacing Setup" });

        // Use an expanding container for the input parameters
        const formContainer = contentEl.createDiv();
        formContainer.style.flexGrow = "1";

        // Toggle Switch: ON = Simple Countdown, OFF = Segmented Mode
        new Setting(formContainer)
            .setName("Simple Countdown")
            .setDesc("Enable for an overall timer. Disable for dynamic segmented pacing. (Cmd+Ctrl+C to toggle)")
            .addToggle(toggle => {
                this.toggleComponent = toggle;
                toggle.setValue(this.isDefaultMode)
                    .onChange(value => {
                        this.isDefaultMode = value;
                        this.toggleSettingsContainers();
                    });
            });

        // Optional Session Title Input Box (Globally visible)
        new Setting(formContainer)
            .setName("Session Title")
            .setDesc("Optional label to show on the status bar (e.g. 'Writing', 'Code').")
            .addText(text => {
                this.titleInputText = text;
                text.setValue(this.rawTitle)
                    .setPlaceholder("G"); // Default fallback label is "G"
            });

        // Container for Segmented Settings
        this.segmentedContainer = formContainer.createDiv({ cls: "pacing-segmented-settings" });
        new Setting(this.segmentedContainer)
            .setName("Total Session Time")
            .setDesc("Supports formats like '10m', '1.5h', '12:30', or '600'.")
            .addText(text => {
                this.segmentedInputText = text;
                text.setValue(this.rawTotalTimeSegmented)
                    .onChange(() => {
                        this.updateCalculationPreview();
                    });
            });

        new Setting(this.segmentedContainer)
            .setName("Total Target Segments")
            .setDesc("The total number of segments you want to complete within this time.")
            .addText(text => {
                this.segmentsInputText = text;
                text.setValue(this.rawSegments)
                    .onChange(() => {
                        this.updateCalculationPreview();
                    });
            });

        // Live Calculation Preview Element for Segmented Mode
        this.calculationEl = this.segmentedContainer.createEl("p", { cls: "pacing-calculation-preview" });
        this.calculationEl.style.color = "var(--text-muted)";
        this.calculationEl.style.fontSize = "0.85em";
        this.calculationEl.style.marginTop = "10px";
        this.calculationEl.style.paddingLeft = "4px";

        // Container for Default Countdown Settings
        this.defaultContainer = formContainer.createDiv({ cls: "pacing-default-settings" });
        new Setting(this.defaultContainer)
            .setName("Total Session Duration")
            .setDesc("Supports formats like '15 minutes', '20m', '12:30', or '600'.")
            .addText(text => {
                this.defaultInputText = text;
                text.setValue(this.rawDefaultTotalTime);
            });

        // Render visibility based on initial state
        this.toggleSettingsContainers();

        // Footer container to keep the button locked at the bottom
        const footerContainer = contentEl.createDiv();
        footerContainer.style.marginTop = "auto";

        new Setting(footerContainer)
            .addButton(btn => btn
                .setButtonText("Launch Engine")
                .setCta()
                .onClick(() => {
                    this.submitForm();
                }));

        // Register the standalone Enter key to launch the modal
        this.scope.register([], "Enter", (evt) => {
            evt.preventDefault();
            this.submitForm();
        });

        // Register Command + Enter (Mac) to also launch the modal
        this.scope.register(["Meta"], "Enter", (evt) => {
            evt.preventDefault();
            this.submitForm();
        });

        // Register Ctrl + Enter (Windows/Linux) to also launch the modal
        this.scope.register(["Ctrl"], "Enter", (evt) => {
            evt.preventDefault();
            this.submitForm();
        });

        // Register Command + Control + C (supports Dvorak layout) inside the modal [1]
        this.scope.register(["Meta", "Ctrl"], "c", (evt) => {
            evt.preventDefault();
            this.isDefaultMode = !this.isDefaultMode;
            if (this.toggleComponent) {
                this.toggleComponent.setValue(this.isDefaultMode);
            }
            this.toggleSettingsContainers();
        });
    }

    toggleSettingsContainers() {
        if (this.isDefaultMode) {
            this.segmentedContainer.style.display = "none";
            this.defaultContainer.style.display = "block";
            
            if (this.defaultInputText) {
                this.defaultInputText.setValue("");
                setTimeout(() => this.defaultInputText.inputEl.focus(), 10);
            }
        } else {
            this.segmentedContainer.style.display = "block";
            this.defaultContainer.style.display = "none";
            
            this.updateCalculationPreview();
            if (this.segmentedInputText) {
                this.segmentedInputText.setValue("");
                setTimeout(() => this.segmentedInputText.inputEl.focus(), 10);
            }
            if (this.segmentsInputText) {
                this.segmentsInputText.setValue("10"); // Reset default count to 10
            }
        }
    }

    // Live calculation preview builder using 00:00:00 formatting
    updateCalculationPreview() {
        if (!this.calculationEl) return;

        // Read direct from text elements to ensure we are always reading the latest state
        const segmentsVal = this.segmentsInputText ? this.segmentsInputText.getValue().trim() : "";
        const timeVal = this.segmentedInputText ? this.segmentedInputText.getValue().trim() : "";

        const parsedSegments = parseInt(segmentsVal, 10);
        const parsedTotalTime = parseDurationToSeconds(timeVal);

        if (parsedSegments > 0 && parsedTotalTime > 0) {
            const segmentDuration = Math.round(parsedTotalTime / parsedSegments);
            this.calculationEl.textContent = `🎯 Each segment will take: ${formatTimeHMS(segmentDuration)}`;
        } else {
            this.calculationEl.textContent = "🎯 Enter total time and segments to see target calculations...";
        }
    }

    submitForm() {
        // Read fresh strings directly from input boxes, bypassing enter keydown race conditions
        const rawTitleVal = this.titleInputText ? this.titleInputText.getValue().trim() : "";
        const cleanTitle = (rawTitleVal && rawTitleVal !== "undefined") ? rawTitleVal : "";

        const rawSegmentsVal = this.segmentsInputText ? this.segmentsInputText.getValue().trim() : "10";
        const parsedSegments = parseInt(rawSegmentsVal, 10) || 10;
        
        const rawSegmentedTimeVal = this.segmentedInputText ? this.segmentedInputText.getValue().trim() : "10m";
        const parsedTotalTimeSegmented = parseDurationToSeconds(rawSegmentedTimeVal) || 600;
        const calculatedSegmentDuration = Math.max(1, Math.round(parsedTotalTimeSegmented / parsedSegments));

        const rawDefaultTimeVal = this.defaultInputText ? this.defaultInputText.getValue().trim() : "10m";
        const parsedDefaultTotalTime = parseDurationToSeconds(rawDefaultTimeVal) || 600;

        // Save state configuration to cache before closing [1]
        window["pacingCockpitCache"] = {
            isDefaultMode: this.isDefaultMode,
            rawTitle: cleanTitle
        };

        this.onSubmit({
            mode: this.isDefaultMode ? "default" : "segmented",
            title: cleanTitle || "G", // Default to "G" if field is empty [1]
            duration: calculatedSegmentDuration,
            segments: parsedSegments,
            defaultTotalTime: parsedDefaultTotalTime
        });
        this.close();
    }

    onClose() {
        this.contentEl.empty();
    }
}

// 2. Main Script Export
module.exports = async (params) => {
    const STATE_KEY = "obsidianPacingCockpitState";

    // Helper: Dynamic Time Formatter (removes leading zero on minutes < 10) [1]
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString()}:${secs.toString().padStart(2, '0')}`;
    };

    // Helper: Smart Pacing Delta Formatter (supports lock-secured dynamic bounds)
    const formatDelta = (seconds) => {
        const neg = seconds < 0;
        const abs_s = Math.abs(seconds);
        const mins = Math.floor(abs_s / 60);
        const secs = abs_s % 60;
        
        // Only return minutes block if delta contains minutes
        if (mins > 0) {
            return `${neg ? "-" : ""}${mins}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${neg ? "-" : ""}${mins}:${secs.toString().padStart(2, '0')}`;
        }
    };

    // Helper: Cheerful Ascending "Music Box" Alarm Generator (C Major Cascade)
    const playAlarmSound = (state) => {
        if (!state.audioCtx) {
            state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = state.audioCtx;
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        try {
            const now = ctx.currentTime;
            
            // Synthesizes a single bright, warm, pure music box tone
            const triggerNote = (freq, startTime, volume) => {
                const osc = ctx.createOscillator();
                const gainNode = ctx.createGain();

                osc.type = 'sine'; // Completely pure waves - no harsh overtones or buzz
                osc.frequency.setValueAtTime(freq, startTime);

                // Music box tine model: instant strike, elegant dampening decay (800ms)
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.005);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.8);

                osc.connect(gainNode);
                gainNode.connect(ctx.destination);
                
                osc.start(startTime);
                osc.stop(startTime + 0.85);
            };

            // Play an ascending, magical C Major arpeggio sweep (50ms staggering)
            triggerNote(523.25, now, 0.20);        // C5 (Warm, supportive root)
            triggerNote(659.25, now + 0.05, 0.20); // E5 (Optimistic, bright major third)
            triggerNote(783.99, now + 0.10, 0.20); // G5 (Stable, resonant fifth)
            triggerNote(1046.50, now + 0.15, 0.25); // C6 (Sweet, sparkling octave bell)
        } catch (e) {
            console.warn("Music box alarm audio generation failed:", e);
        }
    };

    // Helper: Procedural mechanical click sound generator
    const playMechClack = (state) => {
        if (!state.audioCtx) {
            state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = state.audioCtx;
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        try {
            // High-frequency mechanical contact click (Sine wave sweep)
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
            
            gain.gain.setValueAtTime(0.35, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.04);

            // Low-frequency key bottoming thud (Triangle wave sweep)
            const lowOsc = ctx.createOscillator();
            const lowGain = ctx.createGain();
            lowOsc.type = 'triangle';
            lowOsc.frequency.setValueAtTime(150, ctx.currentTime);
            lowOsc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);
            
            lowGain.gain.setValueAtTime(0.25, ctx.currentTime);
            lowGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            
            lowOsc.connect(lowGain);
            lowGain.connect(ctx.destination);
            lowOsc.start();
            lowOsc.stop(ctx.currentTime + 0.08);
        } catch (e) {
            console.warn("Audio Context blocked or failed:", e);
        }
    };

    // Helper: Core status bar updates
    const updateStatusBar = (state) => {
        const pauseText = state.isRunning ? "" : " <span style='color: var(--text-muted);'>(Paused)</span>";
        
        // Double-check and sanitize title dynamically to guarantee no "undefined" leaks [1]
        const displayTitle = (state.title && state.title !== "undefined") ? state.title : "G";

        // Render loop for DEFAULT MODE
        if (state.mode === "default") {
            const globalTimeLimit = state.defaultTotalTime;
            const globalTimeRemaining = Math.max(0, globalTimeLimit - state.globalTimeElapsed);
            
            let globalColor = "";
            if (globalTimeRemaining === 0) {
                globalColor = "color: #ef4444;";
            }

            // Forced non-collapsible HTML space entity (&nbsp;) after the colon inside Default Mode [4]
            state.statusBarItem.innerHTML = `⏱️ [${displayTitle} :&nbsp;<span style="${globalColor}">${formatTime(globalTimeRemaining)}</span>]${pauseText}`;
            return;
        }

        // Render loop for SEGMENTED MODE
        const globalTimeLimit = state.initialSegmentDuration * state.totalSegments;
        const globalTimeRemaining = Math.max(0, globalTimeLimit - state.globalTimeElapsed);
        const segmentTimeLeft = state.targetSegmentDuration - state.segmentTimeElapsed;

        // Segment Countdown String (Red on negatives, default color on positives)
        let segStr = "";
        let segmentStyle = "";
        if (segmentTimeLeft >= 0) {
            segStr = formatTime(segmentTimeLeft);
        } else {
            segStr = `-${formatTime(Math.abs(segmentTimeLeft))}`;
            segmentStyle = "color: #ef4444; font-weight: bold;";
        }

        // Live Ghost Car Delta
        let globalOvertime = 0;
        if (state.segmentTimeElapsed > state.initialSegmentDuration) {
            globalOvertime = state.segmentTimeElapsed - state.initialSegmentDuration;
        }
        
        const liveDelta = state.cumulativeDelta - globalOvertime;
        const deltaSign = liveDelta >= 0 ? "+" : "";
        const deltaStr = formatDelta(liveDelta); // Formats dynamically (H:MM:SS or M:SS depending on necessity)
        
        let deltaStyle = "";
        if (liveDelta > 0) {
            deltaStyle = "color: #10b981;"; // Green (Ahead)
        } else if (liveDelta < 0) {
            deltaStyle = "color: #ef4444;"; // Red (Behind)
        }

        // Segment remainder format (e.g. "(9)" remaining)
        const segmentsRemaining = Math.max(0, state.totalSegments - state.completedSegments);

        // Standard original segmented output: [G:04:55] [S:00:25] (Compact formatting with no spaces around colons) [1]
        state.statusBarItem.innerHTML = `⏱️ [${displayTitle}:${formatTime(globalTimeRemaining)}] [S:${segStr}] [Δ:${deltaStr}] (${segmentsRemaining})${pauseText}`;
    };

    // Helper: Step to next segment
    const completeSegment = (state) => {
        playMechClack(state);
        
        const savedOffset = state.initialSegmentDuration - state.segmentTimeElapsed;
        state.cumulativeDelta += savedOffset;
        
        state.completedSegments++;
        state.segmentTimeElapsed = 0;

        const liveDelta = state.cumulativeDelta;

        if (state.completedSegments >= state.totalSegments) {
            state.isRunning = false;
            state.isFinished = true; // Mark session as fully finished
            if (state.timerId) {
                clearInterval(state.timerId);
            }
            if (state.alarmId) {
                clearInterval(state.alarmId);
            }
            state.statusBarItem.textContent = `🏆 Finished! Δ:${formatDelta(liveDelta)}`;
            state.statusBarItem.style.color = '#10b981';
        } else {
            // Recalculate segment target only if we are behind (cumulativeDelta < 0)
            const remainingSegments = state.totalSegments - state.completedSegments;
            if (remainingSegments > 0) {
                if (state.cumulativeDelta < 0) {
                    // Compress segment window to force recovery
                    const adjusted = state.initialSegmentDuration + (state.cumulativeDelta / remainingSegments);
                    state.targetSegmentDuration = Math.max(1, Math.round(adjusted));
                } else {
                    // Lock to initial segment duration to prevent lazy expansion
                    state.targetSegmentDuration = state.initialSegmentDuration;
                }
            }
            updateStatusBar(state);
        }
    };

    // Helper: Pause / Resume trigger
    const togglePause = (state) => {
        state.isRunning = !state.isRunning;
        if (!state.isRunning) {
            // Stop independent alarm loop immediately when paused
            if (state.alarmId) {
                clearInterval(state.alarmId);
                state.alarmId = null;
            }
        } else {
            // Re-anchor baseline system clock reference immediately upon resuming
            state.lastTickTime = Date.now();
        }
        updateStatusBar(state);
    };

    // Helper: Safely tear down active resources and open a fresh setup modal
    const resetAndReopen = (state) => {
        if (state.statusBarItem) {
            state.statusBarItem.remove();
        }
        if (state.timerId) {
            clearInterval(state.timerId);
        }
        if (state.alarmId) {
            clearInterval(state.alarmId);
        }
        app.commands.removeCommand("pacing-cockpit-pause");
        app.commands.removeCommand("pacing-cockpit-complete");
        
        delete window[STATE_KEY];
        
        launchCockpit();
    };

    // Scope-isolated launcher
    const launchCockpit = () => {
        const modal = new PacingSetupModal(app, (config) => {
            const statusBarItem = document.createElement("div");
            statusBarItem.classList.add("status-bar-item", "status-bar-pacing-cockpit");
            statusBarContainer.appendChild(statusBarItem); // Append [1]

            // Initialize state on window
            window[STATE_KEY] = {
                statusBarItem: statusBarItem,
                mode: config.mode,
                title: config.title, // Store the custom session title [1]
                initialSegmentDuration: config.duration,
                targetSegmentDuration: config.duration,
                totalSegments: config.segments,
                defaultTotalTime: config.defaultTotalTime,
                completedSegments: 0,
                cumulativeDelta: 0, 
                globalTimeElapsed: 0,
                segmentTimeElapsed: 0,
                isRunning: true,
                isFinished: false, // Track segment completion state
                timerId: null,
                alarmId: null,
                lastTickTime: Date.now(), // Secure system clock baseline timestamp [1]
                audioCtx: null
            };

            const state = window[STATE_KEY];

            // Register Global Native Commands
            app.commands.addCommand({
                id: "pacing-cockpit-pause",
                name: "Pacing Cockpit: Pause/Resume Session",
                hotkeys: [{ modifiers: ["Ctrl", "Meta"], key: "c" }],
                callback: () => {
                    const currentState = window[STATE_KEY];
                    if (currentState) {
                        togglePause(currentState);
                    }
                }
            });

            app.commands.addCommand({
                id: "pacing-cockpit-complete",
                name: "Pacing Cockpit: Complete Segment / Reset",
                hotkeys: [{ modifiers: ["Ctrl"], key: " " }],
                callback: () => {
                    const currentState = window[STATE_KEY];
                    if (currentState) {
                        // In Default Mode: stop timer and immediately reload configuration modal
                        if (currentState.mode === "default") {
                            resetAndReopen(currentState);
                            return;
                        }
                        // In Segmented Mode: if finished, pressing complete reloads modal
                        if (currentState.isFinished) {
                            resetAndReopen(currentState);
                            return;
                        }
                        if (!currentState.isRunning) return;
                        completeSegment(currentState);
                    }
                }
            });

            // Run background pacing updates
            state.timerId = setInterval(() => {
                const currentState = window[STATE_KEY];
                if (currentState) {
                    const now = Date.now();
                    // Measure actual wall-clock duration passed [1]
                    const deltaSeconds = Math.floor((now - currentState.lastTickTime) / 1000);
                    
                    if (deltaSeconds >= 1) {
                        if (currentState.isRunning) {
                            // Safely increment elapsed metrics by the true real-world delta [1]
                            currentState.globalTimeElapsed += deltaSeconds;
                            currentState.segmentTimeElapsed += deltaSeconds;
                            
                            // Rhythmic alarm trigger for Default Mode overtime (using cheerful music box arpeggio)
                            if (currentState.mode === "default" && currentState.globalTimeElapsed >= currentState.defaultTotalTime) {
                                // Spawn a dedicated, independent audio interval if it hasn't started yet
                                if (!currentState.alarmId) {
                                    playAlarmSound(currentState); // Play immediately on crossing zero
                                    
                                    // Spawns a dedicated audio thread that repeats exactly at your custom speed [3]
                                    currentState.alarmId = setInterval(() => {
                                        const activeState = window[STATE_KEY];
                                        if (activeState && activeState.isRunning) {
                                            playAlarmSound(activeState);
                                        }
                                    }, 1500); // <-- CHANGE THIS VALUE (in milliseconds) to adjust speed! [3]
                                }
                            }
                        }
                        // Save remaining milliseconds fraction to prevent timer drift [1]
                        currentState.lastTickTime += deltaSeconds * 1000;
                        updateStatusBar(currentState);
                    }
                }
            }, 200);

            updateStatusBar(state);
        });

        modal.open();
    };

    // 1. TOGGLE OFF (If already active, clean up resources)
    if (window[STATE_KEY]) {
        const state = window[STATE_KEY];

        if (state.statusBarItem) {
            state.statusBarItem.remove();
        }
        if (state.timerId) {
            clearInterval(state.timerId);
        }
        if (state.alarmId) {
            clearInterval(state.alarmId);
        }
        
        app.commands.removeCommand("pacing-cockpit-pause");
        app.commands.removeCommand("pacing-cockpit-complete");

        delete window[STATE_KEY];
        return;
    }

    // Locate the status bar container [1]
    const statusBarContainer = document.querySelector(".status-bar");
    if (!statusBarContainer) {
        console.error("Error: Could not find Obsidian status bar.");
        return;
    }

    // 2. TOGGLE ON
    launchCockpit();
};