import { TFile } from "obsidian";

/**
 * Common shape shared by anything that can appear as a node in the goals graph —
 * a file-backed goal/task (TaskNode) or a checkbox subtask (CheckboxNode).
 * The graph, physics engine, and renderer in DashboardView only ever need to
 * know about this shape; they never need to branch on "is this a file or a
 * checkbox" except at the few points that actually write back to disk.
 */
export interface GraphNode {
    id: string;                // TaskNode: file.path | CheckboxNode: "path#^anchor" or "path::line"
    kind: "file" | "checkbox";
    title: string;
    isGoal: boolean;
    isTask: boolean;
    children: GraphNode[];
    parents: GraphNode[];
    level: number;
    status: string;            // "" (open) | "done" | "canceled" etc.
    impact: "" | "low" | "medium" | "high"; // from #impact/low|medium|high — "" means untagged
}

export interface TaskNode extends GraphNode {
    kind: "file";
    file: TFile;
    basename: string;
    parentNames: string[];     // raw parsed frontmatter parent links, resolved into `parents` later
}

/**
 * A single checkbox line, tracked as a graph node ONLY if it participates in
 * the graph (has an anchor other nodes can reference, and/or links to a parent).
 * Every checkbox line still gets parsed into one of these — a checkbox with no
 * links at all just ends up with parents.length === 0 && children.length === 0,
 * which is exactly what makes it show up as an "orphan" in the sidebar instead
 * of on the canvas.
 */
export interface CheckboxNode extends GraphNode {
    kind: "checkbox";
    blockId: string;           // "" until ensureBlockAnchor() writes one to the file
    sourceFile: TFile;
    sourceLine: number;
}

/** A single directed parent -> child relationship, resolved from a wikilink. */
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
}

export interface GoalContainer {
    name: string;
    goalIds: string[]; // file.path of each #goal node in this preset
}

export interface ProgressPlannerSettings {
    skipPaths: string[];
    targetFolders: string[]; // List of target folders to look inside (e.g., ["Private", "Work"])
    quickCaptureFile: string; // Vault path a double-click on empty canvas appends new checkboxes to
    goalContainers: GoalContainer[]; // Saved multi-goal Focus Filter presets
}

export const DEFAULT_SETTINGS: ProgressPlannerSettings = {
    skipPaths: [], // No paths skipped by default
    targetFolders: ["Private"],
    quickCaptureFile: "",
    goalContainers: []
};