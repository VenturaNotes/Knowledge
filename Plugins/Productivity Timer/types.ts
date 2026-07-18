export interface TimerSegment {
	id: string;
	timer_id: string;
	started_at: string;
	ended_at: string;
	duration_seconds: number;
}

export interface Timer {
	id: string;
	parent_id: string | null;
	name: string;
	estimate_seconds: number;
	tracked_seconds: number;
	is_running: boolean;
	rotation_enabled: boolean;
	is_rotation_running: boolean;
	is_last_active: boolean;
	sort_order: number;
	last_started_at: string | null;
	created_at: string;
	visual_seconds?: number;
	segments?: TimerSegment[];
}

export interface SessionEntry {
	timer_name: string;
	estimate_seconds: number;
	tracked_seconds: number;
}

export interface Session {
	id: string;
	date: string;
	completed_at: string;
	entries: SessionEntry[];
}

export interface PluginSettings {
	supabaseUrl: string;
	supabaseKey: string;
	windowX: number;
	windowY: number;
	windowWidth: number;
	windowHeight: number;
	collapsedParentIds?: string[]; // Persists collapsed states across mobile and desktop (10)
}

export const DEFAULT_SETTINGS: PluginSettings = {
	supabaseUrl: "",
	supabaseKey: "",
	windowX: 100,
	windowY: 100,
	windowWidth: 480,
	windowHeight: 520,
	collapsedParentIds: []
};

export const ICONS = {
	play: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>`,
	pause: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
	trash: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14H6L5,6"/><path d="M10,11v6M14,11v6"/><path d="M9,6V4h6v2"/></svg>`,
	loop: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>`,
	plus: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`
};