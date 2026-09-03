export interface AirSketchSettings {
    port: number;
    drawingsFolder: string;
    isPrivate: boolean;
    authToken: string;
}

export interface ActiveDrawingState {
    svgFile: string;
    markdownNote: string;
}

export const DEFAULT_SETTINGS: AirSketchSettings = {
    port: 4444,
    drawingsFolder: 'Private/Drawings',
    isPrivate: true,
    authToken: ''
};