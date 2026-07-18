export class SupabaseClient {
	private url: string;
	private key: string;
	private realtimeWs: WebSocket | null = null;
	private realtimeCallbacks: Map<string, (payload: any) => void> = new Map();
	private heartbeatInterval: any = null;

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

	private queueAction(type: "INSERT" | "UPDATE" | "DELETE", table: string, data?: any, match?: string) {
		const action = {
			id: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
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

	private headers() {
		return {
			"Content-Type": "application/json",
			"apikey": this.key,
			"Authorization": `Bearer ${this.key}`,
		};
	}

	private calibrateOffset(headers: Headers) {
		const serverDateStr = headers.get("date");
		if (serverDateStr) {
			const serverTime = new Date(serverDateStr).getTime();
			const localTime = Date.now();
			(window as any).ptServerClockOffset = serverTime - localTime;
		}
	}

	async select(table: string, query = ""): Promise<any[]> {
		const res = await fetch(`${this.url}/rest/v1/${table}?${query}`, {
			headers: { ...this.headers(), "Accept": "application/json" },
		});
		if (!res.ok) throw new Error(await res.text());
		this.calibrateOffset(res.headers);
		return res.json();
	}

	async insert(table: string, data: any): Promise<any> {
		if (!navigator.onLine) {
			this.queueAction("INSERT", table, data);
			return null;
		}
		try {
			return await this.insertBypassQueue(table, data);
		} catch (e) {
			const err = e as any;
			if (e instanceof TypeError || err?.message?.includes("fetch") || !navigator.onLine) {
				this.queueAction("INSERT", table, data);
				return null;
			}
			throw e;
		}
	}

	async update(table: string, data: any, match: string): Promise<any> {
		if (!navigator.onLine) {
			this.queueAction("UPDATE", table, data, match);
			return null;
		}
		try {
			return await this.updateBypassQueue(table, data, match);
		} catch (e) {
			const err = e as any;
			if (e instanceof TypeError || err?.message?.includes("fetch") || !navigator.onLine) {
				this.queueAction("UPDATE", table, data, match);
				return null;
			}
			throw e;
		}
	}

	async delete(table: string, match: string): Promise<void> {
		if (!navigator.onLine) {
			this.queueAction("DELETE", table, undefined, match);
			return;
		}
		try {
			await this.deleteBypassQueue(table, match);
		} catch (e) {
			const err = e as any;
			if (e instanceof TypeError || err?.message?.includes("fetch") || !navigator.onLine) {
				this.queueAction("DELETE", table, undefined, match);
				return;
			}
			throw e;
		}
	}

	// Raw network actions that skip queueing rules (used by the background sync process)
	async insertBypassQueue(table: string, data: any): Promise<any> {
		const res = await fetch(`${this.url}/rest/v1/${table}`, {
			method: "POST",
			headers: { ...this.headers(), "Prefer": "return=representation" },
			body: JSON.stringify(data),
		});
		if (!res.ok) throw new Error(await res.text());
		this.calibrateOffset(res.headers);
		const text = await res.text();
		if (!text) return null;
		try {
			return JSON.parse(text);
		} catch {
			return null;
		}
	}

	async updateBypassQueue(table: string, data: any, match: string): Promise<any> {
		const res = await fetch(`${this.url}/rest/v1/${table}?${match}`, {
			method: "PATCH",
			headers: { ...this.headers(), "Prefer": "return=representation" },
			body: JSON.stringify(data),
		});
		if (!res.ok) throw new Error(await res.text());
		this.calibrateOffset(res.headers);
		const text = await res.text();
		if (!text) return null;
		try {
			return JSON.parse(text);
		} catch {
			return null;
		}
	}

	async deleteBypassQueue(table: string, match: string): Promise<void> {
		const res = await fetch(`${this.url}/rest/v1/${table}?${match}`, {
			method: "DELETE",
			headers: this.headers(),
		});
		if (!res.ok) throw new Error(await res.text());
	}

	subscribeToTable(table: string, callback: (payload: any) => void) {
		const wsUrl = this.url.replace("https://", "wss://").replace("http://", "ws://")
			+ "/realtime/v1/websocket?apikey=" + this.key + "&vsn=1.0.0";

		// Safeguard 1: If we are already connected or in the process of connecting, exit early
		if (this.realtimeWs && (this.realtimeWs.readyState === WebSocket.CONNECTING || this.realtimeWs.readyState === WebSocket.OPEN)) {
			this.realtimeCallbacks.set(table, callback);
			return;
		}

		// Safeguard 2: Cleanly nullify event listeners on old sockets before closing to prevent loop cascades
		if ((window as any).ptRealtimeWs) {
			const oldGlobalWs = (window as any).ptRealtimeWs as WebSocket;
			oldGlobalWs.onopen = null;
			oldGlobalWs.onmessage = null;
			oldGlobalWs.onerror = null;
			oldGlobalWs.onclose = null;
			try { oldGlobalWs.close(); } catch {}
			(window as any).ptRealtimeWs = null;
		}

		if (this.realtimeWs) {
			this.realtimeWs.onopen = null;
			this.realtimeWs.onmessage = null;
			this.realtimeWs.onerror = null;
			this.realtimeWs.onclose = null;
			try { this.realtimeWs.close(); } catch {}
			this.realtimeWs = null;
		}

		if (this.heartbeatInterval) {
			clearInterval(this.heartbeatInterval);
			this.heartbeatInterval = null;
		}
		
		this.realtimeCallbacks.set(table, callback);

		const ws = new WebSocket(wsUrl);
		this.realtimeWs = ws;
		(window as any).ptRealtimeWs = ws;

		ws.onopen = () => {
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
				ref: "1",
			}));

			let refCounter = 2;
			this.heartbeatInterval = setInterval(() => {
				if (ws.readyState === WebSocket.OPEN) {
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
			try {
				const msg = JSON.parse(event.data);
				if (msg.event === "postgres_changes") {
					const cb = this.realtimeCallbacks.get(table);
					if (cb && msg.payload) {
						cb(msg.payload);
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
				if (this.realtimeCallbacks.has(table)) {
					this.subscribeToTable(table, callback);
				}
			}, 3000);
		};
	}

	reconnect() {
		const callbacks = new Map(this.realtimeCallbacks);
		this.realtimeCallbacks.clear();
		for (const [table, callback] of callbacks.entries()) {
			this.subscribeToTable(table, callback);
		}
	}

	disconnect() {
		this.realtimeCallbacks.clear();
		if (this.heartbeatInterval) {
			clearInterval(this.heartbeatInterval);
			this.heartbeatInterval = null;
		}
		if (this.realtimeWs) {
			this.realtimeWs.close();
			this.realtimeWs = null;
		}
		if ((window as any).ptRealtimeWs) {
			try { (window as any).ptRealtimeWs.close(); } catch {}
			(window as any).ptRealtimeWs = null;
		}
	}
}