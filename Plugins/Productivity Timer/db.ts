export class SupabaseClient {
	private url: string;
	private key: string;
	private realtimeWs: WebSocket | null = null;
	private realtimeCallbacks: Map<string, (payload: any) => void> = new Map();

	constructor(url: string, key: string) {
		this.url = url.replace(/\/$/, "");
		this.key = key;
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

	async update(table: string, data: any, match: string): Promise<any> {
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

	async delete(table: string, match: string): Promise<void> {
		const res = await fetch(`${this.url}/rest/v1/${table}?${match}`, {
			method: "DELETE",
			headers: this.headers(),
		});
		if (!res.ok) throw new Error(await res.text());
	}

	subscribeToTable(table: string, callback: (payload: any) => void) {
		const wsUrl = this.url.replace("https://", "wss://").replace("http://", "ws://")
			+ "/realtime/v1/websocket?apikey=" + this.key + "&vsn=1.0.0";

		if ((window as any).ptRealtimeWs) {
			try { (window as any).ptRealtimeWs.close(); } catch {}
			(window as any).ptRealtimeWs = null;
		}

		if (this.realtimeWs) this.realtimeWs.close();
		this.realtimeCallbacks.set(table, callback);

		const ws = new WebSocket(wsUrl);
		this.realtimeWs = ws;
		(window as any).ptRealtimeWs = ws;

		ws.onopen = () => {
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
			setTimeout(() => {
				if (this.realtimeCallbacks.has(table)) this.subscribeToTable(table, callback);
			}, 3000);
		};
	}

	disconnect() {
		this.realtimeCallbacks.clear();
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