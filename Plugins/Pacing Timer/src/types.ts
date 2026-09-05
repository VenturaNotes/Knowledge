export type TimerMode = "default" | "segmented" | "stacking" | "rotation";

export interface PacingSessionState {
    mode: TimerMode;
    title: string;
    initialSegmentDuration: number;
    targetSegmentDuration: number;
    totalSegments: number;
    defaultTotalTime: number;
    defaultCountEnabled?: boolean;
    completedSegments: number;
    cumulativeDelta: number;
    globalTimeElapsed: number;
    segmentTimeElapsed: number;
    isRunning: boolean;
    isFinished: boolean;
    lastTickTime: number;

    // Classic Pacing Elastic Quota & Telemetry
    segmentedVaultThreshold?: number;
    segmentedLevel?: number;
    segmentedCountUp?: boolean;
    currentQuota?: number;
    maxTargetSegments?: number;
    totalWorkTime?: number;
    benchmarkPace?: number;
    hardStopTotalSeconds?: number;
    earlyFinishBanked?: number;

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
    rotationCategoryDuration: number;
    rotationCategoryDurations?: number[];
    rotationInterruptDuration?: number;
    rotationInInterrupt: boolean;
    rotationInterruptElapsed: number;
}

export function createBlankSession(): PacingSessionState {
    return {
        mode: "default", 
        title: "", 
        initialSegmentDuration: 0, 
        targetSegmentDuration: 0,
        totalSegments: 0, 
        defaultTotalTime: 0, 
        defaultCountEnabled: false, 
        completedSegments: 0, 
        cumulativeDelta: 0,
        globalTimeElapsed: 0, 
        segmentTimeElapsed: 0, 
        isRunning: true, 
        isFinished: false,
        lastTickTime: Date.now(),

        segmentedVaultThreshold: 300,
        segmentedLevel: 0,
        segmentedCountUp: false,
        currentQuota: 10,
        maxTargetSegments: 10,
        totalWorkTime: 0,
        benchmarkPace: 60,
        hardStopTotalSeconds: 600,
        earlyFinishBanked: 0,

        stackingIsActive: false, 
        stackingLevel: 1, 
        stackingTotalTimeLeft: 0,
        stackingSectionTimeLeft: 0, 
        stackingCurrentSplitElapsed: 0, 
        stackingGlobalSumCount: 0,
        stackingGlobalTotalSplits: 0, 
        stackingLastSplitDelta: 0, 
        stackingPendingDowngrade: false,
        rotationCategories: [], 
        rotationIndex: 0, 
        rotationCategoryElapsed: 0,
        rotationCategoryDuration: 0, 
        rotationCategoryDurations: [],
        rotationInterruptDuration: 300,
        rotationInInterrupt: false, 
        rotationInterruptElapsed: 0
    };
}

export interface PacingTimerSettings {
    cache: { selectedMode: TimerMode; rawTitle: string; };
    activeSession: PacingSessionState | null;
    defaultCountEnabled: boolean;
    stackingGoal: number;
    stackingGoalPositiveOnly: boolean;
    stackingUseGlobalDuration: boolean;
    showCurrentTime: boolean;
    rotationCategoriesRaw: string;
    rotationCategoryDuration: number;
    rotationCategoryDurations?: number[];
    rotationInterruptDuration: number;
    rotationContinuePrevious: boolean;
    lastRotationSession?: Partial<PacingSessionState> | null;

    // Classic Pacing persistent state
    segmentedInputMode?: "total" | "segment";
    segmentedTotalTimeRaw?: string;
    segmentedSegmentDurationRaw?: string;
    segmentedSegmentsRaw?: string;
    segmentedVaultThresholdRaw?: string;
    segmentedCountUp?: boolean;
}

export const DEFAULT_SETTINGS: PacingTimerSettings = {
    cache: { selectedMode: "stacking", rawTitle: "" },
    activeSession: null,
    defaultCountEnabled: false,
    stackingGoal: 900,
    stackingGoalPositiveOnly: false,
    stackingUseGlobalDuration: false,
    showCurrentTime: false,
    rotationCategoriesRaw: "",
    rotationCategoryDuration: 900,
    rotationCategoryDurations: [900],
    rotationInterruptDuration: 300,
    rotationContinuePrevious: false,
    lastRotationSession: null,

    // Classic Pacing defaults
    segmentedInputMode: "total",
    segmentedTotalTimeRaw: "10m",
    segmentedSegmentDurationRaw: "1m",
    segmentedSegmentsRaw: "10",
    segmentedVaultThresholdRaw: "5m",
    segmentedCountUp: false
};