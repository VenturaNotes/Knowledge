export type TimerMode = "default" | "segmented" | "rotation";

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
    segmentedCountUp?: boolean;
    currentQuota?: number;
    maxTargetSegments?: number;
    totalWorkTime?: number;
    benchmarkPace?: number;
    hardStopTotalSeconds?: number;
    earlyFinishBanked?: number;

    // Variable / Custom Segment Durations
    customSegmentDurations?: number[];
    paceMultiplier?: number;
    totalBaseWorkTime?: number;

    // Project & Daily Stint metadata
    projectId?: string;
    projectName?: string;
    projectGoal?: number;
    projectCompletedInitial?: number;
    stintInitialGoal?: number;

    // Rotation Mode
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

        segmentedVaultThreshold: 180,
        segmentedCountUp: false,
        currentQuota: 10,
        maxTargetSegments: 10,
        totalWorkTime: 0,
        benchmarkPace: 60,
        hardStopTotalSeconds: 600,
        earlyFinishBanked: 0,

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

export interface SavedSessionRecord {
    id: string;
    name: string;
    savedAt: number;
    totalProjectGoal: number;
    totalProjectCompleted: number;
    totalWorkTime: number;
    benchmarkPace: number;
    customSegmentDurations?: number[];
    paceMultiplier?: number;
    totalBaseWorkTime?: number;
    session: PacingSessionState;
}

export interface PacingTimerSettings {
    cache: { selectedMode: TimerMode; rawTitle: string; };
    activeSession: PacingSessionState | null;
    defaultCountEnabled: boolean;
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
    segmentedCountUp?: boolean;

    // Named Projects / Sessions
    savedSessions?: Record<string, SavedSessionRecord>;
}

export const DEFAULT_SETTINGS: PacingTimerSettings = {
    cache: { selectedMode: "segmented", rawTitle: "" },
    activeSession: null,
    defaultCountEnabled: false,
    showCurrentTime: false,
    rotationCategoriesRaw: "",
    rotationCategoryDuration: 900,
    rotationCategoryDurations: [900],
    rotationInterruptDuration: 300,
    rotationContinuePrevious: false,
    lastRotationSession: null,

    segmentedInputMode: "total",
    segmentedTotalTimeRaw: "10m",
    segmentedSegmentDurationRaw: "1m",
    segmentedSegmentsRaw: "10",
    segmentedCountUp: false,

    savedSessions: {}
};