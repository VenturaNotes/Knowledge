export type TimerMode = "default" | "segmented" | "stacking" | "rotation";

export interface PacingSessionState {
    mode: TimerMode;
    title: string;
    initialSegmentDuration: number;
    targetSegmentDuration: number;
    totalSegments: number;
    defaultTotalTime: number;
    completedSegments: number;
    cumulativeDelta: number;
    globalTimeElapsed: number;
    segmentTimeElapsed: number;
    isRunning: boolean;
    isFinished: boolean;
    lastTickTime: number;

    stackingIsActive: boolean;
    stackingLevel: number;
    stackingTotalTimeLeft: number;
    stackingSectionTimeLeft: number;
    stackingCurrentSplitElapsed: number;
    stackingGlobalSumCount: number;
    stackingGlobalTotalSplits: number;
    stackingLastSplitDelta: number;
    stackingPendingDowngrade: boolean;

    rotationCategories: string[];
    rotationIndex: number;
    rotationCategoryElapsed: number;
    rotationSubGoalElapsed: number;
    rotationCategoryDuration: number;
    rotationCategoryDurations?: number[];
    rotationSubGoalDuration: number;
    rotationWildcardDuration: number;
    rotationInWildcard: boolean;
    rotationWildcardElapsed: number;
    rotationInInterrupt: boolean;
    rotationInterruptElapsed: number;
}

export function createBlankSession(): PacingSessionState {
    return {
        mode: "default", title: "", initialSegmentDuration: 0, targetSegmentDuration: 0,
        totalSegments: 0, defaultTotalTime: 0, completedSegments: 0, cumulativeDelta: 0,
        globalTimeElapsed: 0, segmentTimeElapsed: 0, isRunning: true, isFinished: false,
        lastTickTime: Date.now(), stackingIsActive: false, stackingLevel: 1, stackingTotalTimeLeft: 0,
        stackingSectionTimeLeft: 0, stackingCurrentSplitElapsed: 0, stackingGlobalSumCount: 0,
        stackingGlobalTotalSplits: 0, stackingLastSplitDelta: 0, stackingPendingDowngrade: false,
        rotationCategories: [], rotationIndex: 0, rotationCategoryElapsed: 0, rotationSubGoalElapsed: 0,
        rotationCategoryDuration: 0, rotationCategoryDurations: [], rotationSubGoalDuration: 0, rotationWildcardDuration: 0,
        rotationInWildcard: false, rotationWildcardElapsed: 0, rotationInInterrupt: false, rotationInterruptElapsed: 0
    };
}

export interface PacingTimerSettings {
    cache: { selectedMode: TimerMode; rawTitle: string; };
    activeSession: PacingSessionState | null;
    stackingGoal: number;
    stackingGoalPositiveOnly: boolean;
    stackingUseGlobalDuration: boolean;
    showCurrentTime: boolean;
    rotationCategoriesRaw: string;
    rotationCategoryDuration: number;
    rotationCategoryDurations?: number[];
    rotationSubGoalDuration: number;
    rotationWildcardDuration: number;
    rotationContinuePrevious: boolean;
    lastRotationSession?: Partial<PacingSessionState> | null;
}

export const DEFAULT_SETTINGS: PacingTimerSettings = {
    cache: { selectedMode: "stacking", rawTitle: "" },
    activeSession: null,
    stackingGoal: 900,
    stackingGoalPositiveOnly: false,
    stackingUseGlobalDuration: false,
    showCurrentTime: false,
    rotationCategoriesRaw: "",
    rotationCategoryDuration: 900,
    rotationCategoryDurations: [900],
    rotationSubGoalDuration: 300,
    rotationWildcardDuration: 300,
    rotationContinuePrevious: false,
    lastRotationSession: null
};