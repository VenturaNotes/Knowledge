import { ModeHandler } from "./ModeHandler";
import { DefaultMode } from "./DefaultMode";
import { SegmentedMode } from "./SegmentedMode";
import { RotationMode } from "./RotationMode";

export const ModeRegistry: Record<string, ModeHandler> = {
    default: DefaultMode,
    segmented: SegmentedMode,
    rotation: RotationMode
};