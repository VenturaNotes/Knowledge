import { requestUrl } from "obsidian";
import { generateUUID } from "./types";

export class SupabaseClient {
	private url: string;
	private key: string;
	private realtimeWs: WebSocket | null = null;
	private realtimeCallbacks: Map<string, (payload: any) => void> = new Map();
	private heartbeatInterval: any = null;
	private lastMessageAt: number = Date.now();
	private onStaleConnectionCallback: (() => void) | null = null;

	private queue: any[] = [];
	private onQueueChanged: (() => void) | null = null;

	constructor(url: string, key: string) {
		this.url = url.replace(/\/$/, "");
		this.key = key;
	}

	public setQueue(queue: any[], onQueueChanged: () => void) {
		this.queue = queue;
		this.onQueueChanged = onQueueChanged;
	}

	public onStaleConnection(callback: () => void) {
		this.onStaleConnectionCallback = callback;
	}

	private queueAction(type: "INSERT" | "UPDATE" | "DELETE", table: string, data?: any, match?: string) {
		const action = {
			id: `offline-${Date.now()}-${generateUUID().substring(0, 8)}`,
			type,
			table,
			data,
			match,
			timestamp: Date.now()
		};
		this.queue.push(action);
		if (this.onQueueChanged) {
			this.onQueueChanged();
		}
	}

	private headers(extra: Record<string, string> = {}): Record<string, string> {
		return {
			"Content-Type": "application/json",
			"apikey": this.key,
			"Authorization": `Bearer ${this.key}`,
			...extra
		};
	}

	private calibrateOffset(headers: Record<string, string> | Headers) {
		let serverDateStr: string | null = null;
		if (headers instanceof Headers) {
			serverDateStr = headers.get("date");
		} else if (headers && typeof headers === "object") {
			serverDateStr = headers["date"] || headers["Date"] || null;
		}
		if (serverDateStr) {
			const serverTime = new Date(serverDateStr).getTime();
			if (!isNaN(serverTime)) {
				const localTime = Date.now();
				(window as any).ptServerClockOffset = serverTime - localTime;
			}
		}
	}

	async select(table: string, query = ""): Promise<any[]> {
		try {
			const res = await requestUrl({
				url: `${this.url}/rest/v1/${table}?${query}`,
				method: "GET",
				headers: this.headers({ "Accept": "application/json" }),
				throw: true
			});
			this.calibrateOffset(res.headers);
			return res.json;
		} catch (e: any) {
			if (!navigator.onLine) {
				return [];
			}
			throw new Error(`Select failed on ${table}: ${e?.message || e}`);
		}
	}

	async insert(table: string, data: any): Promise<any> {
		if (!navigator.onLine) {
			this.queueAction("INSERT", table, data);
			return null;
		}
		try {
			return await this.insertBypassQueue(table, data);
		} catch (e: any) {
			if (e?.status && e.status >= 400 && e.status < 500) {
				console.error(`PostgREST 4xx Error on ${table}:`, e);
				throw e;
			}
			this.queueAction("INSERT", table, data);
			return null;
		}
	}

	async update(table: string, data: any, match: string): Promise<any> {
		if (!navigator.onLine) {
			this.queueAction("UPDATE", table, data, match);
			return null;
		}
		try {
			return await this.updateBypassQueue(table, data, match);
		} catch (e: any) {
			if (e?.status && e.status >= 400 && e.status < 500) {
				console.error(`PostgREST 4xx Error on ${table}:`, e);
				throw e;
			}
			this.queueAction("UPDATE", table, data, match);
			return null;
		}
	}

	async delete(table: string, match: string): Promise<void> {
		if (!navigator.onLine) {
			this.queueAction("DELETE", table, undefined, match);
			return;
		}
		try {
			await this.deleteBypassQueue(table, match);
		} catch (e: any) {
			this.queueAction("DELETE", table, undefined, match);
		}
	}

	async insertBypassQueue(table: string, data: any): Promise<any> {
		const res = await requestUrl({
			url: `${this.url}/rest/v1/${table}`,
			method: "POST",
			headers: this.headers({ "Prefer": "return=representation" }),
			body: JSON.stringify(data),
			throw: true
		});
		this.calibrateOffset(res.headers);
		return res.json;
	}

	async updateBypassQueue(table: string, data: any, match: string): Promise<any> {
		const res = await requestUrl({
			url: `${this.url}/rest/v1/${table}?${match}`,
			method: "PATCH",
			headers: this.headers({ "Prefer": "return=representation" }),
			body: JSON.stringify(data),
			throw: true
		});
		this.calibrateOffset(res.headers);
		return res.json;
	}

	async deleteBypassQueue(table: string, match: string): Promise<void> {
		await requestUrl({
			url: `${this.url}/rest/v1/${table}?${match}`,
			method: "DELETE",
			headers: this.headers(),
			throw: true
		});
	}

	private sendJoin(ws: WebSocket, table: string) {
		if (ws.readyState !== WebSocket.OPEN) return;
		ws.send(JSON.stringify({
			topic: `realtime:public:${table}`,
			event: "phx_join",
			payload: {
				config: {
					postgres_changes: [
						{
							event: "*",
							schema: "public",
							table: table
						}
					]
				},
				access_token: this.key
			},
			ref: String(Date.now()),
		}));
	}

	subscribeToTable(table: string, callback: (payload: any) => void) {
		this.realtimeCallbacks.set(table, callback);

		if (this.realtimeWs && this.realtimeWs.readyState === WebSocket.OPEN) {
			this.sendJoin(this.realtimeWs, table);
			return;
		}

		if (this.realtimeWs && this.realtimeWs.readyState === WebSocket.CONNECTING) {
			return;
		}

		this.cleanupSockets();

		const wsUrl = this.url.replace("https://", "wss://").replace("http://", "ws://")
			+ "/realtime/v1/websocket?apikey=" + this.key + "&vsn=1.0.0";

		const ws = new WebSocket(wsUrl);
		this.realtimeWs = ws;
		(window as any).ptRealtimeWs = ws;

		ws.onopen = () => {
			if (ws.readyState !== WebSocket.OPEN) return;
			this.lastMessageAt = Date.now();

			for (const t of this.realtimeCallbacks.keys()) {
				this.sendJoin(ws, t);
			}

			let refCounter = 2;
			this.heartbeatInterval = setInterval(() => {
				if (ws.readyState === WebSocket.OPEN) {
					if (Date.now() - this.lastMessageAt > 45000) {
						this.onStaleConnectionCallback?.();
						return;
					}
					ws.send(JSON.stringify({
						topic: "phoenix",
						event: "heartbeat",
						payload: {},
						ref: String(refCounter++)
					}));
				}
			}, 20000);
		};

		ws.onmessage = (event) => {
			this.lastMessageAt = Date.now();
			try {
				const msg = JSON.parse(event.data);
				if (msg.event === "postgres_changes") {
					const topic = msg.topic || "";
					for (const [t, cb] of this.realtimeCallbacks.entries()) {
						if (topic === `realtime:public:${t}` || topic.endsWith(`:${t}`)) {
							cb(msg.payload);
						}
					}
				}
			} catch {}
		};

		ws.onerror = () => {};
		ws.onclose = () => {
			if (this.heartbeatInterval) {
				clearInterval(this.heartbeatInterval);
				this.heartbeatInterval = null;
			}
			setTimeout(() => {
				if (this.realtimeCallbacks.size > 0) {
					this.reconnect();
				}
			}, 3000);
		};
	}

	private cleanupSockets() {
		if (this.heartbeatInterval) {
			clearInterval(this.heartbeatInterval);
			this.heartbeatInterval = null;
		}
		if (this.realtimeWs) {
			this.realtimeWs.onopen = null;
			this.realtimeWs.onmessage = null;
			this.realtimeWs.onerror = null;
			this.realtimeWs.onclose = null;
			try { this.realtimeWs.close(); } catch {}
			this.realtimeWs = null;
		}
		if ((window as any).ptRealtimeWs) {
			try { (window as any).ptRealtimeWs.close(); } catch {}
			(window as any).ptRealtimeWs = null;
		}
	}

	reconnect() {
		this.cleanupSockets();
		const callbacks = new Map(this.realtimeCallbacks);
		this.realtimeCallbacks.clear();
		for (const [table, callback] of callbacks.entries()) {
			this.subscribeToTable(table, callback);
		}
	}

	disconnect() {
		this.realtimeCallbacks.clear();
		this.cleanupSockets();
	}
}