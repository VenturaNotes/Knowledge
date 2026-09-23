// PluginAttributor.js - Reconciled Memory & Webview Lifecycle Auditor
// - Exact MB per plugin via segmented deep recursion (depth 5, 8ms slices)
// - Exact sub-property container deltas (e.g. 5,232 → 68,916 items)
// - Consolidated Plugin Card (Current RAM, Startup RAM, Net Growth, Heaviest Key)
// - Context-Aware Webview tracking (Webview Suite, Kinetic Companion, VaporNote, VirtualTabGroups)
module.exports = async ({ app, obsidian }) => {
    const LOG_PATH = 'Private/Obsidian-Memory-Alerts.md';
    const PENDING = '- **Status:** In-App Plugin Diagnostics pending...';
    const MAX_SAMPLES = 600;
    const SKIP_KEYS = new Set(['app', 'manifest', 'containerEl', 'leaf', 'workspace']);

    const prev = window._memAuditor;
    if (prev && prev.dispose) { try { prev.dispose(); } catch (e) {} }
    const samples = prev && prev.samples ? prev.samples : [];

    const tick = () => new Promise(r => setTimeout(r, 0));
    const isDom = v => typeof Node !== 'undefined' && v instanceof Node;
    const MB = 1048576;

    let lastYield = performance.now();
    const maybeYield = async () => {
        if (performance.now() - lastYield > 8) {
            await new Promise(r => setTimeout(r, 0));
            lastYield = performance.now();
        }
    };

    // ---------- 1. SEGMENTED DEEP RECURSION (Exact MB) ----------
    async function estimateMemoryKB(rootObj) {
        if (!rootObj || typeof rootObj !== 'object') {
            if (typeof rootObj === 'string') return (rootObj.length * 2) / 1024;
            if (typeof rootObj === 'number') return 8 / 1024;
            return 0;
        }

        let kb = 0;
        let count = 0;
        const stack = [{ obj: rootObj, depth: 0 }];
        const seen = new WeakSet();

        while (stack.length > 0) {
            count++;
            if ((count & 255) === 0) await maybeYield();

            const { obj, depth } = stack.pop();

            if (!obj || typeof obj !== 'object') {
                if (typeof obj === 'string') kb += (obj.length * 2) / 1024;
                else if (typeof obj === 'number') kb += 8 / 1024;
                continue;
            }

            if (depth > 5 || seen.has(obj)) continue;
            seen.add(obj);

            // Bypasses core application objects and DOM elements
            if (obj === app || obj === app.vault || obj === app.workspace || obj === window) continue;
            if (typeof Node !== 'undefined' && obj instanceof Node) continue;

            try {
                if (Array.isArray(obj)) {
                    const len = Math.min(obj.length, 1000);
                    for (let i = 0; i < len; i++) stack.push({ obj: obj[i], depth: depth + 1 });
                } else if (obj instanceof Map || obj instanceof Set) {
                    for (const val of obj.values()) stack.push({ obj: val, depth: depth + 1 });
                } else {
                    const keys = Object.keys(obj);
                    for (let i = 0; i < keys.length; i++) {
                        const k = keys[i];
                        if (SKIP_KEYS.has(k)) continue;
                        kb += (k.length * 2) / 1024;
                        stack.push({ obj: obj[k], depth: depth + 1 });
                    }
                }
            } catch (e) {}
        }
        return kb;
    }

    // ---------- 2. CONTAINER ITEM TRACKER ----------
    function measureContainer(v) {
        if (v == null || typeof v !== 'object') return null;
        if (v === app || v === app.vault || v === app.workspace || v === window || isDom(v)) return null;

        if (Array.isArray(v)) return v.length;
        if (v instanceof Map || v instanceof Set) return v.size;
        try { return Object.keys(v).length; } catch (e) { return null; }
    }

    function collectContainers(plugin) {
        const out = {};
        let keys;
        try { keys = Object.keys(plugin).slice(0, 150); } catch (e) { return out; }

        for (const k of keys) {
            if (SKIP_KEYS.has(k)) continue;
            let v;
            try { v = plugin[k]; } catch (e) { continue; }
            const count = measureContainer(v);
            if (count > 0) out[k] = count;

            // Inspect 1 level down for nested caches (e.g. taskCache.fileCache)
            if (v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Map) && !(v instanceof Set)) {
                try {
                    const subKeys = Object.keys(v).slice(0, 50);
                    for (const sk of subKeys) {
                        const subCount = measureContainer(v[sk]);
                        if (subCount > 0) out[`${k}.${sk}`] = subCount;
                    }
                } catch (e) {}
            }
        }
        return out;
    }

    // ---------- 3. DEFENSIVE CONTEXT-AWARE WEBVIEW AUDITOR ----------
    function auditWebviews() {
        const webviews = Array.from(document.querySelectorAll('webview'));
        const results = {
            total: webviews.length,
            visible: 0,
            managed: [],
            orphanedZombies: []
        };

        const activeLeaves = [];
        if (app.workspace && typeof app.workspace.iterateAllLeaves === 'function') {
            app.workspace.iterateAllLeaves(l => {
                if (l?.containerEl) activeLeaves.push(l);
            });
        }

        webviews.forEach((wv) => {
            let url = '';
            try {
                url = wv.getAttribute('src') || wv.src || (typeof wv.getURL === 'function' ? wv.getURL() : '') || 'about:blank';
            } catch (e) {
                url = 'about:blank';
            }

            let domain = 'about:blank';
            try {
                domain = new URL(url).hostname || url.substring(0, 30);
            } catch (e) {
                domain = url.substring(0, 30) || 'about:blank';
            }

            // Safely check plugin DOM contexts (immune to disabled plugins)
            const isKinetic = !!(wv.closest && wv.closest('.kc-floating-container'));
            const isVapor = !!(wv.closest && wv.closest('.vapornote-container'));
            const isVTGHidden = !!(wv.closest && wv.closest('.vtg-hidden'));

            const owningLeaf = activeLeaves.find(l => l.containerEl && l.containerEl.contains(wv));
            const viewType = owningLeaf?.view?.getViewType ? owningLeaf.view.getViewType() : '';
            const isAttached = document.body && document.body.contains(wv);

            const isVisible = isAttached && wv.offsetParent !== null && !isVTGHidden && !isKinetic;

            if (isVisible) {
                results.visible++;
            }

            if (isKinetic) {
                results.managed.push(`Kinetic Companion (${domain})`);
            } else if (isVapor) {
                results.managed.push(`VaporNote (${domain})`);
            } else if (viewType === 'custom-webview-view' || viewType === 'webviewer') {
                const groupState = isVTGHidden ? 'Hidden by Tab Groups' : (isVisible ? 'Active' : 'Background Tab');
                results.managed.push(`Webview Suite [${groupState}] (${domain})`);
            } else if (owningLeaf) {
                results.managed.push(`Workspace Tab (${domain})`);
            } else {
                results.orphanedZombies.push(`"${domain}" (Detached / Failed to Close)`);
            }
        });

        return results;
    }

    // ---------- 4. MEMORY SAMPLING ----------
    function memInfo() {
        const o = { heapMB: null, heapTotalMB: null, externalMB: null, buffersMB: null, rssMB: null };
        try {
            const u = process.memoryUsage();
            o.heapMB = u.heapUsed / MB;
            o.heapTotalMB = u.heapTotal / MB;
            o.externalMB = u.external / MB;
            o.buffersMB = (u.arrayBuffers || 0) / MB;
            o.rssMB = u.rss / MB;
        } catch (e) {
            if (performance.memory) o.heapMB = performance.memory.usedJSHeapSize / MB;
        }
        return o;
    }

    function blinkMB() {
        try {
            const u = require('electron').webFrame.getResourceUsage();
            let bytes = 0;
            for (const k of Object.keys(u)) bytes += (u[k] && u[k].size) || 0;
            return bytes / MB;
        } catch (e) { return null; }
    }

    async function inspectAllPlugins() {
        const plugins = app.plugins ? app.plugins.plugins : {};
        const pluginData = {};

        for (const id in plugins) {
            const plugin = plugins[id];
            let totalKB = 0;
            let topProp = 'None';
            let maxPropKB = 0;

            const keys = Object.keys(plugin);
            for (let i = 0; i < keys.length; i++) {
                const k = keys[i];
                if (SKIP_KEYS.has(k)) continue;

                try {
                    const propKB = await estimateMemoryKB(plugin[k]);
                    totalKB += propKB;
                    if (propKB > maxPropKB) {
                        maxPropKB = propKB;
                        topProp = `${k} (${propKB > 1024 ? (propKB / 1024).toFixed(1) + ' MB' : propKB.toFixed(0) + ' KB'})`;
                    }
                } catch (e) {}
            }

            const containers = collectContainers(plugin);
            pluginData[id] = { totalMB: totalKB / 1024, topProp, containers };
            await maybeYield();
        }
        return pluginData;
    }

    async function takeSample() {
        const pluginData = await inspectAllPlugins();
        const wvInfo = auditWebviews();

        const s = {
            t: Date.now(),
            ...memInfo(),
            blinkMB: blinkMB(),
            privateMB: null,
            dom: document.getElementsByTagName('*').length,
            webviews: wvInfo,
            plugins: pluginData
        };

        try {
            if (typeof process !== 'undefined' && process.getProcessMemoryInfo) {
                const info = await process.getProcessMemoryInfo();
                s.privateMB = info.private / 1024;
            }
        } catch (e) {}

        samples.push(s);
        if (samples.length > MAX_SAMPLES) samples.splice(1, samples.length - MAX_SAMPLES);
        return s;
    }

    // ---------- 5. REPORT BUILDER ----------
    const f1 = n => (n == null ? '?' : n.toFixed(1));

    function buildReport() {
        const first = samples[0] || samples[samples.length - 1];
        const cur = samples[samples.length - 1];
        const upMs = Date.now() - performance.timeOrigin;
        const h = Math.floor(upMs / 3600000);
        const m = Math.floor((upMs % 3600000) / 60000);
        const manifests = (app.plugins && app.plugins.manifests) || {};

        let r = `\n### 🧩 Deep Session Memory Audit (Uptime: ${h}h ${m}m)\n`;
        r += `• **Process Memory:** ${f1(cur.privateMB || cur.rssMB)} MB (JS Heap: ${f1(cur.heapMB)} MB | Blink Caches: ${f1(cur.blinkMB)} MB | External: ${f1(cur.externalMB)} MB)\n`;

        // Section A: Webview Status
        const wv = cur.webviews;
        r += `• **Webview Status:** ${wv.total} total (${wv.visible} visible on screen, ${wv.managed.length} managed by plugins`;
        if (wv.orphanedZombies.length > 0) {
            r += `, 🚨 **${wv.orphanedZombies.length} FAILED TO CLOSE**`;
        }
        r += `)\n`;

        if (wv.orphanedZombies.length > 0) {
            r += `  ↳ 🚨 **Unclosed Webview Leaks:** ${wv.orphanedZombies.join(', ')}\n`;
        } else if (wv.managed.length > 0) {
            const summary = {};
            wv.managed.forEach(name => summary[name] = (summary[name] || 0) + 1);
            r += `  ↳ *Active & Managed Webviews:* ${Object.entries(summary).map(([k, v]) => `${v}x ${k}`).join(', ')}\n`;
        }

        // Section B: Consolidated Plugin Card (Ranked by Current RAM, with Item Deltas)
        const currentRanked = Object.keys(cur.plugins).map(id => {
            const name = manifests[id]?.name || id;
            const currentMB = cur.plugins[id].totalMB;
            const startMB = first.plugins[id]?.totalMB ?? currentMB;
            const deltaMB = currentMB - startMB;

            const curContainers = cur.plugins[id].containers || {};
            const baseContainers = first.plugins[id]?.containers || {};
            const containerDeltas = [];

            for (const path of Object.keys(curContainers)) {
                const bCount = baseContainers[path] || 0;
                const cCount = curContainers[path] || 0;
                const delta = cCount - bCount;
                if (delta > 0) {
                    containerDeltas.push({ path, from: bCount, to: cCount, delta });
                }
            }
            containerDeltas.sort((a, b) => b.delta - a.delta);

            return { id, name, currentMB, startMB, deltaMB, topProp: cur.plugins[id].topProp, containerDeltas };
        }).sort((a, b) => b.currentMB - a.currentMB);

        r += `\n#### Top Plugins by RAM Footprint & Growth:\n`;
        currentRanked.slice(0, 5).forEach((p, i) => {
            let growthBadge = '';
            if (p.deltaMB > 1.0) {
                growthBadge = `🔺 **+${p.deltaMB.toFixed(1)} MB growth**`;
            } else if (p.deltaMB < -1.0) {
                growthBadge = `📉 **${p.deltaMB.toFixed(1)} MB freed**`;
            } else {
                growthBadge = `🟢 **Flat (+0.0 MB)**`;
            }

            r += `${i + 1}. **${p.name}** (\`${p.id}\`):\n`;
            r += `   - **RAM:** ~${p.currentMB.toFixed(1)} MB (Started: ~${p.startMB.toFixed(1)} MB | Net Growth: ${growthBadge})\n`;
            r += `   - **Heaviest Property:** \`${p.topProp}\`\n`;

            if (p.containerDeltas.length > 0) {
                r += `   - **Expanding Containers:**\n`;
                p.containerDeltas.slice(0, 3).forEach(cd => {
                    r += `     • \`${cd.path}\`: ${cd.from.toLocaleString()} → ${cd.to.toLocaleString()} items (+${cd.delta.toLocaleString()})\n`;
                });
            }
        });

        return r + `\n---\n`;
    }

    // ---------- 6. ATOMIC LOG PROCESSOR ----------
    let busy = false;
    async function processPending() {
        if (busy) return;
        busy = true;
        try {
            if (!(await app.vault.adapter.exists(LOG_PATH))) return;
            const raw = await app.vault.adapter.read(LOG_PATH);
            if (!raw.includes(PENDING)) return;

            const last = samples[samples.length - 1];
            if (!last || Date.now() - last.t > 15000) await takeSample();
            const report = buildReport();

            const file = app.vault.getAbstractFileByPath(LOG_PATH);
            if (file instanceof obsidian.TFile) {
                await app.vault.process(file, data => data.includes(PENDING) ? data.replace(PENDING, () => report) : data);
            } else {
                const fresh = await app.vault.adapter.read(LOG_PATH);
                await app.vault.adapter.write(LOG_PATH, fresh.replace(PENDING, () => report));
            }
        } catch (err) {
            console.error('[MemoryAuditor] Error:', err);
        } finally {
            busy = false;
        }
    }

    let debounce = null;
    const trigger = () => { clearTimeout(debounce); debounce = setTimeout(processPending, 400); };
    const onFile = file => { if (file.path === LOG_PATH) trigger(); };
    const refs = [app.vault.on('modify', onFile), app.vault.on('create', onFile)];

    // Lock baseline at 5 seconds post-startup
    const firstTimer = setTimeout(async () => { await takeSample(); trigger(); }, 5000);

    window._memAuditor = {
        samples, takeSample, buildReport,
        dispose() {
            refs.forEach(ref => app.vault.offref(ref));
            clearTimeout(firstTimer);
            clearTimeout(debounce);
        }
    };
    console.log('[MemoryAuditor] Consolidated auditor active (Exact MB + Items + Named Webviews).');
};