import * as http from 'http';
import * as path from 'path';
import { TFile } from 'obsidian';
import type AirSketchPlugin from './main';
import { getHtmlClient } from './client';

export class AirSketchServer {
    private server: http.Server | null = null;
    private sseClients: { res: http.ServerResponse, clientId: string }[] = [];

    constructor(private plugin: AirSketchPlugin) {}

    broadcastToClients(data: any, excludeClientId?: string) {
        const payload = `data: ${JSON.stringify(data)}\n\n`;
        this.sseClients = this.sseClients.filter(client => {
            if (excludeClientId && client.clientId === excludeClientId) return true;
            try {
                client.res.write(payload);
                return true;
            } catch {
                return false;
            }
        });
    }

    async start() {
        this.stop();

        const folderPath = this.plugin.getVaultDrawingsPath();
        if (!(await this.plugin.app.vault.adapter.exists(folderPath))) {
            await this.plugin.app.vault.adapter.mkdir(folderPath);
        }

        const HTML_CLIENT = getHtmlClient();

        this.server = http.createServer(async (req, res) => {
            const url = new URL(req.url ?? '/', `http://${req.headers.host}`);

            const cookies: Record<string, string> = {};
            (req.headers.cookie || '').split(';').forEach(c => {
                const [k, ...v] = c.trim().split('=');
                if (k && v.length > 0) cookies[k] = decodeURIComponent(v.join('='));
            });

            if ((url.pathname === '/' || url.pathname === '/index.html') && url.searchParams.has('token')) {
                const queryToken = url.searchParams.get('token');
                if (this.plugin.settings.isPrivate && queryToken === this.plugin.settings.authToken) {
                    res.writeHead(302, {
                        'Set-Cookie': `airsketch_token=${this.plugin.settings.authToken}; Max-Age=34560000; Path=/; SameSite=Lax`,
                        'Location': '/'
                    });
                    res.end();
                    return;
                }
            }

            if (this.plugin.settings.isPrivate) {
                const queryToken = url.searchParams.get('token');
                const headerToken = req.headers['x-airsketch-token'] as string | undefined;
                const cookieToken = cookies['airsketch_token'];
                const clientToken = queryToken || headerToken || cookieToken;

                if (clientToken !== this.plugin.settings.authToken) {
                    res.writeHead(401, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end('<h1>401 Unauthorized</h1><p>AirSketch Private Server Mode is active. A valid token is required.</p>');
                    return;
                }
            }

            if (url.pathname === '/' || url.pathname === '/index.html') {
                if (this.plugin.settings.isPrivate) {
                    res.setHeader('Set-Cookie', `airsketch_token=${this.plugin.settings.authToken}; Max-Age=34560000; Path=/; SameSite=Lax`);
                }
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(HTML_CLIENT);
            } else if (url.pathname === '/api/current') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ activeDoc: this.plugin.getActiveDoc() }));
            } else if (url.pathname === '/api/events') {
                if (this.plugin.settings.isPrivate) {
                    res.setHeader('Set-Cookie', `airsketch_token=${this.plugin.settings.authToken}; Max-Age=34560000; Path=/; SameSite=Lax`);
                }

                const clientId = url.searchParams.get('client') || Math.random().toString(36).slice(2);
                res.writeHead(200, {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'Access-Control-Allow-Origin': '*'
                });
                res.write('\n');
                const clientEntry = { res, clientId };
                this.sseClients.push(clientEntry);

                const activeDoc = this.plugin.getActiveDoc();
                if (activeDoc) {
                    res.write(`data: ${JSON.stringify({ type: 'switch', name: activeDoc.svgFile, markdownNote: activeDoc.markdownNote })}\n\n`);
                }

                req.on('close', () => {
                    this.sseClients = this.sseClients.filter(c => c !== clientEntry);
                });
            } else if (url.pathname === '/api/sync' && req.method === 'POST') {
                // Instant transient streaming across connected devices (in-memory, no disk writes)
                let body = '';
                req.on('data', chunk => body += chunk);
                req.on('end', () => {
                    try {
                        const data = JSON.parse(body);
                        this.broadcastToClients(data, data.senderId);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end('{"ok":true}');
                    } catch {
                        res.writeHead(400).end();
                    }
                });
            } else if (url.pathname === '/api/load') {
                const name = path.basename(url.searchParams.get('name') ?? '');
                const filePath = `${folderPath}/${name}`;
                try {
                    if (await this.plugin.app.vault.adapter.exists(filePath)) {
                        const content = await this.plugin.app.vault.adapter.read(filePath);
                        res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
                        res.end(content);
                    } else {
                        res.writeHead(404).end('Not found');
                    }
                } catch {
                    res.writeHead(500).end('Read error');
                }
            } else if (url.pathname === '/api/save' && req.method === 'POST') {
                let body = '';
                req.on('data', chunk => body += chunk);
                req.on('end', async () => {
                    try {
                        const { name, svg, state, senderId } = JSON.parse(body);
                        
                        const rawName = (name || 'scratchpad').replace(/\.svg$/i, '');
                        const cleanName = rawName.replace(/[^a-zA-Z0-9_-]/g, '_');
                        const fileName = `${cleanName}.svg`;
                        const filePath = `${folderPath}/${fileName}`;

                        const tFile = this.plugin.app.vault.getAbstractFileByPath(filePath);
                        if (tFile instanceof TFile) {
                            await this.plugin.app.vault.modify(tFile, svg);
                        } else {
                            await this.plugin.app.vault.adapter.write(filePath, svg);
                        }

                        this.plugin.refreshEmbeddedImages(fileName);

                        this.broadcastToClients({ 
                            type: 'doc-updated', 
                            name: fileName, 
                            state, 
                            senderId 
                        }, senderId);

                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, file: fileName }));
                    } catch (e: any) {
                        res.writeHead(500).end(e.message);
                    }
                });
            } else {
                res.writeHead(404).end();
            }
        });

        this.server.listen(this.plugin.settings.port, '0.0.0.0', () => {
            console.log(`[AirSketch] Server running on port ${this.plugin.settings.port} (Private: ${this.plugin.settings.isPrivate})`);
        });
    }

    stop() {
        if (this.server) {
            try { this.server.close(); } catch {}
            this.server = null;
        }
        this.sseClients.forEach(c => {
            try { c.res.end(); } catch {}
        });
        this.sseClients = [];
    }
}