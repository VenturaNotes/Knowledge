import { Setting } from "obsidian";
import { ModeHandler } from "./ModeHandler";
import { parseDurationToSeconds, parseCategoryDurations, formatCategoryDurations, formatHumanReadableDuration, formatTime } from "../utils";
import { PacingSessionState } from "../types";
import PacingTimerPlugin from "../main";

// Helper to get active category duration based on current index
function getCategoryDuration(session: PacingSessionState): number {
    if (session.rotationCategoryDurations && session.rotationCategoryDurations.length > 0) {
        const idx = session.rotationIndex;
        if (session.rotationCategoryDurations[idx] !== undefined) {
            return session.rotationCategoryDurations[idx]!;
        }
        // Fallback to the last specified duration if category count > duration count
        return session.rotationCategoryDurations[session.rotationCategoryDurations.length - 1]!;
    }
    return session.rotationCategoryDuration || 900;
}

function advanceToNextCategory(session: PacingSessionState, plugin: PacingTimerPlugin) {
    plugin.playVictoryChime();
    session.rotationInWildcard = false;
    session.rotationWildcardElapsed = 0;
    if (session.rotationCategories.length > 0) {
        session.rotationIndex = (session.rotationIndex + 1) % session.rotationCategories.length;
    }
    session.rotationCategoryElapsed = 0;
    session.rotationSubGoalElapsed = 0;
    session.completedSegments += 1;
}

function skipToPreviousCategory(session: PacingSessionState, plugin: PacingTimerPlugin) {
    plugin.playVictoryChime();
    session.rotationInWildcard = false;
    session.rotationWildcardElapsed = 0;
    if (session.rotationCategories.length > 0) {
        session.rotationIndex = (session.rotationIndex - 1 + session.rotationCategories.length) % session.rotationCategories.length;
    }
    session.rotationCategoryElapsed = 0;
    session.rotationSubGoalElapsed = 0;
}

export const RotationMode: ModeHandler = {
    id: "rotation",
    displayName: "Category Rotation",
    buildSettings(container, plugin, config) {
        config.rotationContinuePrevious = config.rotationContinuePrevious ?? plugin.settings.rotationContinuePrevious;
        config.rotationCategoriesRaw = config.rotationCategoriesRaw ?? plugin.settings.rotationCategoriesRaw;
        
        config.rotationCategoryDurationRaw = config.rotationCategoryDurationRaw ?? formatCategoryDurations(
            plugin.settings.rotationCategoryDurations,
            plugin.settings.rotationCategoryDuration
        );
        config.rotationSubGoalDurationRaw = config.rotationSubGoalDurationRaw ?? formatHumanReadableDuration(plugin.settings.rotationSubGoalDuration);
        config.rotationWildcardDurationRaw = config.rotationWildcardDurationRaw ?? formatHumanReadableDuration(plugin.settings.rotationWildcardDuration);

        let catSetting: Setting, catDurSetting: Setting, subDurSetting: Setting, wcDurSetting: Setting;
        let catText: any, catDurText: any, subDurText: any, wcDurText: any;

        const updateDisabledState = (disabled: boolean) => {
            if (disabled && plugin.settings.lastRotationSession) {
                const saved = plugin.settings.lastRotationSession;
                if (saved.rotationCategories) config.rotationCategoriesRaw = saved.rotationCategories.join(", ");
                config.rotationCategoryDurationRaw = formatCategoryDurations(saved.rotationCategoryDurations, saved.rotationCategoryDuration);
                if (saved.rotationSubGoalDuration) config.rotationSubGoalDurationRaw = formatHumanReadableDuration(saved.rotationSubGoalDuration);
                if (saved.rotationWildcardDuration !== undefined) config.rotationWildcardDurationRaw = formatHumanReadableDuration(saved.rotationWildcardDuration);

                if (catText) catText.setValue(config.rotationCategoriesRaw);
                if (catDurText) catDurText.setValue(config.rotationCategoryDurationRaw);
                if (subDurText) subDurText.setValue(config.rotationSubGoalDurationRaw);
                if (wcDurText) wcDurText.setValue(config.rotationWildcardDurationRaw);
            }

            const applyDim = (setting: Setting, textControl: any) => {
                if (!setting) return;
                setting.setDisabled(disabled);
                if (setting.settingEl) {
                    setting.settingEl.style.opacity = disabled ? "0.4" : "1";
                    setting.settingEl.style.pointerEvents = disabled ? "none" : "auto";
                    setting.settingEl.style.transition = "opacity 0.15s ease";
                }
                if (textControl?.inputEl) {
                    textControl.inputEl.disabled = disabled;
                }
            };

            applyDim(catSetting, catText);
            applyDim(catDurSetting, catDurText);
            applyDim(subDurSetting, subDurText);
            applyDim(wcDurSetting, wcDurText);
        };

        new Setting(container)
            .setName("Continue Session")
            .setDesc("Lock settings and resume from your previous Category Rotation session.")
            .addToggle(t => t.setValue(config.rotationContinuePrevious).onChange(v => {
                config.rotationContinuePrevious = v;
                updateDisabledState(v);
            }));

        catSetting = new Setting(container)
            .setName("Categories")
            .setDesc("Comma-separated list rotated in order (e.g. 'Coding, Writing, Review').")
            .addText(t => { catText = t; t.setValue(config.rotationCategoriesRaw).onChange(v => config.rotationCategoriesRaw = v); });

        catDurSetting = new Setting(container)
            .setName("Category Duration")
            .setDesc("Target focus window per category. Enter one duration (e.g. '15m') or comma-separated for each (e.g. '15m, 30m, 10m').")
            .addText(t => { catDurText = t; t.setValue(config.rotationCategoryDurationRaw).onChange(v => config.rotationCategoryDurationRaw = v); });

        subDurSetting = new Setting(container)
            .setName("Sub-Goal Duration")
            .setDesc("Micro-task length inside a category (e.g. '5m').")
            .addText(t => { subDurText = t; t.setValue(config.rotationSubGoalDurationRaw).onChange(v => config.rotationSubGoalDurationRaw = v); });

        wcDurSetting = new Setting(container)
            .setName("Wildcard Duration")
            .setDesc("Open transition period between categories (e.g. '5m'). Set to 0 to disable.")
            .addText(t => { wcDurText = t; t.setValue(config.rotationWildcardDurationRaw).onChange(v => config.rotationWildcardDurationRaw = v); });

        updateDisabledState(config.rotationContinuePrevious);
    },
    saveSettings(config, settings) {
        settings.rotationContinuePrevious = config.rotationContinuePrevious;
        settings.rotationCategoriesRaw = config.rotationCategoriesRaw;
        const parsedCat = parseCategoryDurations(config.rotationCategoryDurationRaw);
        settings.rotationCategoryDuration = parsedCat.fallback;
        settings.rotationCategoryDurations = parsedCat.durations;

        settings.rotationSubGoalDuration = parseDurationToSeconds(config.rotationSubGoalDurationRaw) || 300;
        const parsedWildcard = parseDurationToSeconds(config.rotationWildcardDurationRaw);
        settings.rotationWildcardDuration = isNaN(parsedWildcard) ? 300 : parsedWildcard;
    },
    createSessionState(config, plugin) {
        if (config.rotationContinuePrevious && plugin?.settings.lastRotationSession) {
            const saved = plugin.settings.lastRotationSession;
            return {
                rotationCategories: saved.rotationCategories || [],
                rotationCategoryDuration: saved.rotationCategoryDuration || 900,
                rotationCategoryDurations: saved.rotationCategoryDurations || [saved.rotationCategoryDuration || 900],
                rotationSubGoalDuration: saved.rotationSubGoalDuration || 300,
                rotationWildcardDuration: saved.rotationWildcardDuration ?? 300,
                rotationIndex: saved.rotationIndex || 0,
                rotationCategoryElapsed: saved.rotationCategoryElapsed || 0,
                rotationSubGoalElapsed: saved.rotationSubGoalElapsed || 0,
                rotationInWildcard: saved.rotationInWildcard || false,
                rotationWildcardElapsed: saved.rotationWildcardElapsed || 0,
                rotationInInterrupt: false,
                rotationInterruptElapsed: 0,
                completedSegments: saved.completedSegments || 0
            };
        }

        const parsedCat = parseCategoryDurations(config.rotationCategoryDurationRaw);
        const parsedWildcard = parseDurationToSeconds(config.rotationWildcardDurationRaw);
        return {
            rotationCategories: config.rotationCategoriesRaw.split(",").map((c: string) => c.trim()).filter((c: string) => c.length > 0),
            rotationCategoryDuration: parsedCat.fallback,
            rotationCategoryDurations: parsedCat.durations,
            rotationSubGoalDuration: parseDurationToSeconds(config.rotationSubGoalDurationRaw) || 300,
            rotationWildcardDuration: isNaN(parsedWildcard) ? 300 : parsedWildcard,
            rotationIndex: 0, rotationCategoryElapsed: 0, rotationSubGoalElapsed: 0, rotationInWildcard: false, rotationWildcardElapsed: 0, rotationInInterrupt: false, rotationInterruptElapsed: 0
        };
    },
    tick(session, plugin, deltaSeconds) {
        if (session.rotationInInterrupt) {
            const intLeft = session.rotationSubGoalDuration - session.rotationInterruptElapsed;
            if (deltaSeconds < intLeft) {
                session.rotationInterruptElapsed += deltaSeconds;
            } else {
                session.rotationInterruptElapsed = session.rotationSubGoalDuration;
                plugin.triggerGlassAlarmSequence();
            }
            return;
        }
        
        if (session.rotationInWildcard) {
            const wcLeft = session.rotationWildcardDuration - session.rotationWildcardElapsed;
            if (deltaSeconds < wcLeft) session.rotationWildcardElapsed += deltaSeconds;
            else { session.rotationWildcardElapsed = session.rotationWildcardDuration; plugin.triggerGlassAlarmSequence(); }
            return;
        }

        session.rotationCategoryElapsed += deltaSeconds;
        const subLeft = session.rotationSubGoalDuration - session.rotationSubGoalElapsed;
        if (deltaSeconds < subLeft) session.rotationSubGoalElapsed += deltaSeconds;
        else { session.rotationSubGoalElapsed = session.rotationSubGoalDuration; plugin.triggerGlassAlarmSequence(); }
    },
    onComplete(session, plugin) {
        plugin.stopAlarmSequence();

        if (session.rotationInInterrupt) {
            plugin.playHeroSound();
            session.rotationInterruptElapsed = 0;
            return;
        }

        if (session.rotationInWildcard) {
            advanceToNextCategory(session, plugin);
            return;
        }

        const currentCatDuration = getCategoryDuration(session);
        if (session.rotationCategoryElapsed >= currentCatDuration) {
            if (session.rotationWildcardDuration > 0) {
                plugin.playVictoryChime();
                session.rotationInWildcard = true;
                session.rotationWildcardElapsed = 0;
            } else {
                advanceToNextCategory(session, plugin);
            }
        } else {
            plugin.playHeroSound();
            session.rotationSubGoalElapsed = 0;
        }
    },
    onSkip(session, plugin) {
        if (session.rotationInInterrupt) return;
        plugin.stopAlarmSequence();

        const currentCatDuration = getCategoryDuration(session);
        if (session.rotationInWildcard) {
            advanceToNextCategory(session, plugin);
        } else {
            if (session.rotationWildcardDuration > 0 && session.rotationCategoryElapsed < currentCatDuration) {
                plugin.playVictoryChime();
                session.rotationCategoryElapsed = currentCatDuration;
                session.rotationInWildcard = true;
                session.rotationWildcardElapsed = 0;
            } else {
                advanceToNextCategory(session, plugin);
            }
        }
    },
    onSkipBack(session, plugin) {
        if (session.rotationInInterrupt) return;
        plugin.stopAlarmSequence();
        skipToPreviousCategory(session, plugin);
    },
    onInterrupt(session, plugin) {
        plugin.stopAlarmSequence();

        if (session.rotationInInterrupt) {
            session.rotationInInterrupt = false;
            session.rotationInterruptElapsed = 0;
            plugin.showOverlay("⚡ Interrupt ended");
        } else {
            session.rotationInInterrupt = true;
            session.rotationInterruptElapsed = 0;
            plugin.showOverlay("⚡ Interrupt started");
        }
    },
    renderStatusBar(session, plugin, clockPrefix, pauseText, displayTitle) {
        let bodyHTML = "";

        if (session.rotationInInterrupt) {
            const intRemaining = Math.max(0, session.rotationSubGoalDuration - session.rotationInterruptElapsed);
            bodyHTML = `⚡ Interrupt&nbsp;${formatTime(intRemaining)}`;
        } else if (session.rotationInWildcard) {
            bodyHTML = `🎲 Wildcard&nbsp;${formatTime(Math.max(0, session.rotationWildcardDuration - session.rotationWildcardElapsed))}`;
        } else {
            const currentCat = session.rotationCategories[session.rotationIndex] || "—";
            const currentCatDuration = getCategoryDuration(session);
            const catRemaining = currentCatDuration - session.rotationCategoryElapsed;
            const catStr = catRemaining >= 0 ? formatTime(catRemaining) : `-${formatTime(Math.abs(catRemaining))}`;
            const catStyle = catRemaining < 0 ? "color: #f59e0b; font-weight: bold;" : "";
            bodyHTML = `${currentCat}&nbsp;[<span style="${catStyle}">${catStr}</span>]&nbsp;Sub:${formatTime(Math.max(0, session.rotationSubGoalDuration - session.rotationSubGoalElapsed))}`;
        }
        return `${clockPrefix}⏱️ [${bodyHTML}]${pauseText}`;
    }
};