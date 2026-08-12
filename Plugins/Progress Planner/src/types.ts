import { TFile } from "obsidian";

export interface GraphNode {
    id: string;                
    kind: "file" | "checkbox";
    title: string;
    isGoal: boolean;
    isTask: boolean;
    children: GraphNode[];
    parents: GraphNode[];
    level: number;
    status: string;            
    impact: "" | "low" | "medium" | "high"; 
}

export interface TaskNode extends GraphNode {
    kind: "file";
    file: TFile;
    basename: string;
    parentNames: string[];     
    parentPaths: (string | null)[]; // NEW: pre-resolved paths from getFirstLinkpathDest
}

export interface CheckboxNode extends GraphNode {
    kind: "checkbox";
    blockId: string;           
    sourceFile: TFile;
    sourceLine: number;
}

export interface GraphEdge {
    parentId: string;
    childId: string;
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
    parentLink: string | null;     
    parentLinkPath: string | null; 
}

export interface GoalContainer {
    name: string;
    goalIds: string[]; 
}

export interface ProgressPlannerSettings {
    skipPaths: string[];
    targetFolders: string[]; 
    quickCaptureFile: string; 
    goalContainers: GoalContainer[]; 
    hubChildThreshold: number; 
    hubMinImpact: "low" | "medium" | "high"; 
}

export const DEFAULT_SETTINGS: ProgressPlannerSettings = {
    skipPaths: [], 
    targetFolders: ["Private"],
    quickCaptureFile: "",
    goalContainers: [],
    hubChildThreshold: 12,
    hubMinImpact: "medium"
};