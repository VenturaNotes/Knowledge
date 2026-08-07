import { ModeHandler } from "./ModeHandler";
import { DefaultMode } from "./DefaultMode";
import { SegmentedMode } from "./SegmentedMode";
import { StackingMode } from "./StackingMode";
import { RotationMode } from "./RotationMode";

export const ModeRegistry: Record<string, ModeHandler> = {
    default: DefaultMode,
    segmented: SegmentedMode,
    stacking: StackingMode,
    rotation: RotationMode
};