import { Setting } from "obsidian";
import { ModeHandler } from "./ModeHandler";
import { parseCategoryDurations, parseDurationToSeconds, formatCategoryDurations, formatHumanReadableDuration, formatTime } from "../utils";
import { PacingSessionState } from "../types";
import PacingTimerPlugin from "../main";

// Helper to get active category duration based on current index
function getCategoryDuration(session: PacingSessionState): number {
    if (session.rotationCategoryDurations && session.rotationCategoryDurations.length > 0) {
        const idx = session.rotationIndex;
        if (session.rotationCategoryDurations[idx] !== undefined) {
            return session.rotationCategoryDurations[idx]!;
        }
        return session.rotationCategoryDurations[session.rotationCategoryDurations.length - 1]!;
    }
    return session.rotationCategoryDuration || 900;
}

function advanceToNextCategory(session: PacingSessionState, plugin: PacingTimerPlugin) {
    plugin.playVictoryChime();
    if (session.rotationCategories.length > 0) {
        session.rotationIndex = (session.rotationIndex + 1) % session.rotationCategories.length;
    }
    session.rotationCategoryElapsed = 0;
    session.completedSegments += 1;
}

function skipToPreviousCategory(session: PacingSessionState, plugin: PacingTimerPlugin) {
    plugin.playVictoryChime();
    if (session.rotationCategories.length > 0) {
        session.rotationIndex = (session.rotationIndex - 1 + session.rotationCategories.length) % session.rotationCategories.length;
    }
    session.rotationCategoryElapsed = 0;
}

export const RotationMode: ModeHandler = {
    id: "rotation",
    displayName: "Category Rotation",
    buildSettings(container, plugin, config) {
        // 1. Detect current categories
        let initialCategories: string[] = [];
        if (plugin.session && plugin.session.mode === "rotation" && plugin.session.rotationCategories?.length) {
            initialCategories = [...plugin.session.rotationCategories];
        } else if (plugin.settings.lastRotationSession?.rotationCategories?.length) {
            initialCategories = [...plugin.settings.lastRotationSession.rotationCategories];
        } else if (plugin.settings.rotationCategoriesRaw) {
            initialCategories = plugin.settings.rotationCategoriesRaw.split(",").map(s => s.trim()).filter(s => s.length > 0);
        } else {
            initialCategories = ["Interview Prep", "Wildcard", "Maintenance", "Job Searching"];
        }

        config.rotationCategories = config.rotationCategories ?? initialCategories;

        // 2. Detect current active index
        let initialIndex = 0;
        if (plugin.session && plugin.session.mode === "rotation") {
            initialIndex = plugin.session.rotationIndex % (config.rotationCategories.length || 1);
        } else if (plugin.settings.lastRotationSession?.rotationIndex !== undefined) {
            initialIndex = plugin.settings.lastRotationSession.rotationIndex % (config.rotationCategories.length || 1);
        }
        config.rotationIndex = config.rotationIndex ?? initialIndex;

        config.rotationCategoryDurationRaw = config.rotationCategoryDurationRaw ?? formatCategoryDurations(
            plugin.settings.rotationCategoryDurations,
            plugin.settings.rotationCategoryDuration
        );

        config.rotationInterruptDurationRaw = config.rotationInterruptDurationRaw ?? formatHumanReadableDuration(
            plugin.settings.rotationInterruptDuration || 300
        );

        // --- Compact Unified Manager Container ---
        const managerCard = container.createDiv({ cls: "pacing-rotation-manager" });
        Object.assign(managerCard.style, {
            margin: "8px 0",
            padding: "10px 12px",
            borderRadius: "8px",
            background: "var(--background-secondary)",
            border: "1px solid var(--background-modifier-border)"
        });

        // Header
        const headerEl = managerCard.createDiv();
        Object.assign(headerEl.style, {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px"
        });
        headerEl.createEl("span", {
            text: "🔄 Rotation Categories",
            cls: "setting-item-name",
            attr: { style: "font-weight: 600; font-size: 0.9em;" }
        });
        headerEl.createEl("span", {
            text: "Drag to reorder • Double-click to rename • Click to set start",
            attr: { style: "font-size: 0.74em; color: var(--text-muted);" }
        });

        // Add Category Input Row
        const addRow = managerCard.createDiv();
        Object.assign(addRow.style, {
            display: "flex",
            gap: "6px",
            marginBottom: "8px"
        });

        const addInput = addRow.createEl("input", {
            type: "text",
            placeholder: "Add category and press Enter...",
            attr: { style: "flex-grow: 1; padding: 4px 8px; font-size: 0.85em; border-radius: 4px; border: 1px solid var(--background-modifier-border); background: var(--background-primary); color: var(--text-normal);" }
        });

        const addBtn = addRow.createEl("button", {
            text: "+ Add",
            attr: { style: "padding: 4px 12px; font-size: 0.82em; border-radius: 4px; cursor: pointer;" }
        });

        // Category List Container
        const listContainer = managerCard.createDiv();
        Object.assign(listContainer.style, {
            display: "flex",
            flexDirection: "column",
            gap: "3px",
            maxHeight: "300px",
            overflowY: "auto",
            paddingRight: "2px"
        });

        let draggedIdx: number | null = null;
        let editingIdx: number | null = null;

        const renderList = () => {
            listContainer.empty();
            const cats: string[] = config.rotationCategories;

            if (cats.length === 0) {
                listContainer.createEl("div", {
                    text: "No categories added. Type a name above to add.",
                    attr: { style: "color: var(--text-muted); font-size: 0.8em; text-align: center; padding: 8px;" }
                });
                return;
            }

            if (config.rotationIndex >= cats.length) {
                config.rotationIndex = Math.max(0, cats.length - 1);
            }

            cats.forEach((cat, idx) => {
                const isSelected = idx === config.rotationIndex;
                const isEditing = editingIdx === idx;

                const row = listContainer.createDiv();
                row.draggable = !isEditing;

                Object.assign(row.style, {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "3px 8px",
                    minHeight: "30px",
                    borderRadius: "4px",
                    background: isSelected ? "var(--background-modifier-active-hover)" : "var(--background-primary)",
                    border: isSelected ? "1px solid var(--interactive-accent)" : "1px solid var(--background-modifier-border)",
                    cursor: isEditing ? "default" : "grab",
                    transition: "border-color 0.15s ease, background-color 0.15s ease",
                    userSelect: "none"
                });

                // Drag & Drop Handlers
                row.addEventListener("dragstart", (e) => {
                    draggedIdx = idx;
                    if (e.dataTransfer) {
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", String(idx));
                    }
                    setTimeout(() => { row.style.opacity = "0.4"; }, 0);
                });

                row.addEventListener("dragend", () => {
                    draggedIdx = null;
                    row.style.opacity = "1";
                    row.style.borderTop = isSelected ? "1px solid var(--interactive-accent)" : "1px solid var(--background-modifier-border)";
                });

                row.addEventListener("dragover", (e) => {
                    e.preventDefault();
                    if (draggedIdx !== null && draggedIdx !== idx) {
                        row.style.borderTop = "2px solid var(--interactive-accent)";
                    }
                });

                row.addEventListener("dragleave", () => {
                    row.style.borderTop = isSelected ? "1px solid var(--interactive-accent)" : "1px solid var(--background-modifier-border)";
                });

                row.addEventListener("drop", (e) => {
                    e.preventDefault();
                    row.style.borderTop = isSelected ? "1px solid var(--interactive-accent)" : "1px solid var(--background-modifier-border)";
                    if (draggedIdx !== null && draggedIdx !== idx) {
                        const [movedItem] = cats.splice(draggedIdx, 1);
                        if (movedItem !== undefined) {
                            cats.splice(idx, 0, movedItem);
                        }

                        if (config.rotationIndex === draggedIdx) {
                            config.rotationIndex = idx;
                        } else if (draggedIdx < config.rotationIndex && idx >= config.rotationIndex) {
                            config.rotationIndex--;
                        } else if (draggedIdx > config.rotationIndex && idx <= config.rotationIndex) {
                            config.rotationIndex++;
                        }
                        renderList();
                    }
                });

                // Left side: Number, Title / Editable Input, Active Badge
                const leftSide = row.createDiv();
                Object.assign(leftSide.style, {
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    flexGrow: "1",
                    overflow: "hidden",
                    marginRight: "6px"
                });

                leftSide.createSpan({
                    text: "⋮⋮",
                    attr: { style: "color: var(--text-faint); font-size: 0.9em; cursor: grab;" }
                });

                leftSide.createSpan({
                    text: `${idx + 1}.`,
                    attr: { style: `font-size: 0.82em; font-weight: bold; color: ${isSelected ? "var(--text-accent)" : "var(--text-muted)"};` }
                });

                if (isEditing) {
                    const editInput = leftSide.createEl("input", {
                        type: "text",
                        value: cat,
                        attr: { style: "font-size: 0.85em; padding: 1px 6px; border-radius: 3px; border: 1px solid var(--interactive-accent); background: var(--background-primary); color: var(--text-normal); flex-grow: 1;" }
                    });
                    editInput.onclick = (e) => e.stopPropagation();
                    
                    const saveEdit = () => {
                        const newName = editInput.value.trim();
                        if (newName) cats[idx] = newName;
                        editingIdx = null;
                        renderList();
                    };

                    editInput.onkeydown = (e: KeyboardEvent) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            e.stopPropagation();
                            saveEdit();
                        } else if (e.key === "Escape") {
                            e.preventDefault();
                            e.stopPropagation();
                            editingIdx = null;
                            renderList();
                        }
                    };

                    editInput.onblur = () => saveEdit();
                    setTimeout(() => { editInput.focus(); editInput.select(); }, 10);
                } else {
                    const titleSpan = leftSide.createSpan({
                        text: cat,
                        attr: {
                            title: "Double-click to rename",
                            style: `font-size: 0.85em; font-weight: ${isSelected ? "600" : "400"}; color: var(--text-normal); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex-grow: 1;`
                        }
                    });

                    titleSpan.ondblclick = (e) => {
                        e.stopPropagation();
                        editingIdx = idx;
                        renderList();
                    };
                }

                if (isSelected && !isEditing) {
                    leftSide.createSpan({
                        text: "▶ Active",
                        attr: { style: "font-size: 0.7em; background: var(--interactive-accent); color: var(--text-on-accent); padding: 1px 6px; border-radius: 8px; font-weight: bold; flex-shrink: 0;" }
                    });
                }

                // Click sets start category
                row.onclick = (e) => {
                    if (isEditing) return;
                    if ((e.target as HTMLElement).tagName.toLowerCase() === "button") return;
                    config.rotationIndex = idx;
                    renderList();
                };

                // Right: Remove Button
                const rightSide = row.createDiv();
                Object.assign(rightSide.style, { display: "flex", alignItems: "center" });

                const deleteBtn = rightSide.createEl("button", {
                    text: "✕",
                    attr: {
                        title: "Remove Category",
                        style: "padding: 1px 5px; font-size: 0.75em; border-radius: 3px; border: none; background: transparent; cursor: pointer; color: var(--text-muted); line-height: 1;"
                    }
                });
                deleteBtn.onmouseenter = () => deleteBtn.style.color = "var(--text-error, #ef4444)";
                deleteBtn.onmouseleave = () => deleteBtn.style.color = "var(--text-muted)";
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    cats.splice(idx, 1);
                    if (config.rotationIndex >= cats.length) {
                        config.rotationIndex = Math.max(0, cats.length - 1);
                    }
                    renderList();
                };
            });
        };

        const handleAdd = () => {
            const val = addInput.value.trim();
            if (!val) return;
            const newItems = val.split(",").map(s => s.trim()).filter(s => s.length > 0);
            config.rotationCategories.push(...newItems);
            addInput.value = "";
            renderList();
            listContainer.scrollTop = listContainer.scrollHeight;
            addInput.focus();
        };

        addBtn.onclick = handleAdd;

        addInput.onkeydown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                handleAdd();
            }
        };

        renderList();

        // Duration Settings
        new Setting(container)
            .setName("Category Duration")
            .setDesc("Target focus duration per category. Enter one duration (e.g. '15m') or comma-separated for each (e.g. '15m, 30m, 10m').")
            .addText(t => {
                t.setValue(config.rotationCategoryDurationRaw).onChange(v => config.rotationCategoryDurationRaw = v);
            });

        new Setting(container)
            .setName("Interrupt Duration")
            .setDesc("Countdown window for quick interrupts (e.g. '5m', '3m', '60s').")
            .addText(t => {
                t.setValue(config.rotationInterruptDurationRaw).onChange(v => config.rotationInterruptDurationRaw = v);
            });
    },

    saveSettings(config, settings) {
        if (config.rotationCategories) {
            settings.rotationCategoriesRaw = config.rotationCategories.join(", ");
        }
        const parsedCat = parseCategoryDurations(config.rotationCategoryDurationRaw);
        settings.rotationCategoryDuration = parsedCat.fallback;
        settings.rotationCategoryDurations = parsedCat.durations;
        settings.rotationInterruptDuration = parseDurationToSeconds(config.rotationInterruptDurationRaw) || 300;
    },

    createSessionState(config, plugin) {
        const parsedCat = parseCategoryDurations(config.rotationCategoryDurationRaw);
        const categories: string[] = config.rotationCategories && config.rotationCategories.length > 0
            ? [...config.rotationCategories]
            : (config.rotationCategoriesRaw || "").split(",").map((c: string) => c.trim()).filter((c: string) => c.length > 0);

        const startIndex = Math.min(Math.max(0, config.rotationIndex ?? 0), Math.max(0, categories.length - 1));

        return {
            rotationCategories: categories,
            rotationCategoryDuration: parsedCat.fallback,
            rotationCategoryDurations: parsedCat.durations,
            rotationInterruptDuration: parseDurationToSeconds(config.rotationInterruptDurationRaw) || 300,
            rotationIndex: startIndex,
            rotationCategoryElapsed: 0,
            rotationInInterrupt: false,
            rotationInterruptElapsed: 0,
            completedSegments: 0
        };
    },

    tick(session, plugin, deltaSeconds) {
        if (session.rotationInInterrupt) {
            const intDuration = session.rotationInterruptDuration || 300;
            const intLeft = intDuration - session.rotationInterruptElapsed;
            if (deltaSeconds < intLeft) {
                session.rotationInterruptElapsed += deltaSeconds;
            } else {
                session.rotationInterruptElapsed = intDuration;
                plugin.triggerGlassAlarmSequence();
            }
            return;
        }

        session.rotationCategoryElapsed += deltaSeconds;
        const currentCatDuration = getCategoryDuration(session);
        if (session.rotationCategoryElapsed >= currentCatDuration) {
            plugin.triggerGlassAlarmSequence();
        }
    },

    onComplete(session, plugin) {
        // (1) In interrupt mode, Ctrl + Space resets the interrupt countdown timer
        if (session.rotationInInterrupt) {
            plugin.stopAlarmSequence();
            plugin.playHeroSound();
            session.rotationInterruptElapsed = 0;
            return;
        }

        const currentCatDuration = getCategoryDuration(session);
        
        // In normal mode, do not complete until countdown has reached zero
        if (session.rotationCategoryElapsed < currentCatDuration) {
            return;
        }

        plugin.stopAlarmSequence();
        advanceToNextCategory(session, plugin);
    },

    onSkip(session, plugin) {
        if (session.rotationInInterrupt) return;
        plugin.stopAlarmSequence();
        advanceToNextCategory(session, plugin);
    },

    onSkipBack(session, plugin) {
        if (session.rotationInInterrupt) return;
        plugin.stopAlarmSequence();
        skipToPreviousCategory(session, plugin);
    },

    onInterrupt(session, plugin) {
        plugin.stopAlarmSequence();

        // (2) Toggle interrupt mode silently without popup HUD overlay
        if (session.rotationInInterrupt) {
            session.rotationInInterrupt = false;
            session.rotationInterruptElapsed = 0;
        } else {
            session.rotationInInterrupt = true;
            session.rotationInterruptElapsed = 0;
        }
    },

    renderStatusBar(session, plugin, clockPrefix, pauseText, displayTitle) {
        let bodyHTML = "";

        if (session.rotationInInterrupt) {
            const intDuration = session.rotationInterruptDuration || 300;
            const remaining = intDuration - session.rotationInterruptElapsed;
            const isExpired = remaining <= 0;
            const intRemaining = Math.max(0, remaining);
            const intStyle = isExpired ? "color: #ef4444; font-weight: bold;" : "";
            bodyHTML = `⚡ Interrupt:&nbsp;<span style="${intStyle}">${formatTime(intRemaining)}</span>`;
        } else {
            const currentCat = session.rotationCategories[session.rotationIndex] || "—";
            const currentCatDuration = getCategoryDuration(session);
            const remaining = currentCatDuration - session.rotationCategoryElapsed;
            const isExpired = remaining <= 0;
            
            const catRemaining = Math.max(0, remaining);
            const catStr = formatTime(catRemaining);
            const catStyle = isExpired ? "color: #ef4444; font-weight: bold;" : "";
            
            bodyHTML = `${currentCat}:&nbsp;<span style="${catStyle}">${catStr}</span>`;
        }
        return `${clockPrefix}⏱️ [${bodyHTML}]${pauseText}`;
    }
};