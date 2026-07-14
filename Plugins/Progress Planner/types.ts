import { TFile } from "obsidian";

export interface TaskNode {
    id: string; // File path
    file: TFile;
    basename: string;
    title: string;
    isGoal: boolean;
    isTask: boolean;
    parentNames: string[];
    children: TaskNode[];
    parents: TaskNode[];
    level: number;
    status: string;
}

export interface AgendaItem {
    text: string;
    status: string;
    date: string | null;
    rrule: string | null;
    time: string;
    tags: string;
    line: number;
    isProject: boolean;
    file: string;
    path: string;
    completeInstances: string[];
}

export interface ProgressPlannerSettings {
    skipPaths: string[];
    targetFolders: string[]; // List of target folders to look inside (e.g., ["Private", "Work"])
}

export const DEFAULT_SETTINGS: ProgressPlannerSettings = {
    skipPaths: [], // No paths skipped by default
    targetFolders: ["Private"]
};