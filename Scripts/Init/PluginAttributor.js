module.exports = async ({ app, obsidian }) => {
    const LOG_PATH = 'Private/Obsidian-Memory-Alerts.md';
    let isProcessing = false;

    // Helper: Estimate memory footprint of a JavaScript object in KB
    function estimateMemoryKB(obj, depth = 0, seen = new WeakSet()) {
        if (depth > 5 || obj === null || typeof obj !== 'object') {
            if (typeof obj === 'string') return (obj.length * 2) / 1024;
            if (typeof obj === 'number') return 8 / 1024;
            return 0;
        }
        if (seen.has(obj)) return 0;
        seen.add(obj);

        let kb = 0;
        try {
            if (Array.isArray(obj)) {
                for (let i = 0; i < Math.min(obj.length, 1000); i++) {
                    kb += estimateMemoryKB(obj[i], depth + 1, seen);
                }
            } else if (obj instanceof Map || obj instanceof Set) {
                for (const val of obj.values()) {
                    kb += estimateMemoryKB(val, depth + 1, seen);
                }
            } else {
                for (const k of Object.keys(obj)) {
                    if (['app', 'manifest', 'containerEl', 'leaf', 'workspace'].includes(k)) continue;
                    kb += (k.length * 2) / 1024 + estimateMemoryKB(obj[k], depth + 1, seen);
                }
            }
        } catch (e) {}
        return kb;
    }

    async function attributePluginsToLog() {
        if (isProcessing) return;
        isProcessing = true;

        try {
            const exists = await app.vault.adapter.exists(LOG_PATH);
            if (!exists) return;

            const content = await app.vault.adapter.read(LOG_PATH);
            if (!content.includes('In-App Plugin Diagnostics pending...')) {
                return;
            }

            // 1. Audit Core Obsidian Metadata Footprint
            const fileCacheCount = Object.keys(app.metadataCache.fileCache || {}).length;
            const resolvedLinksCount = Object.keys(app.metadataCache.resolvedLinks || {}).length;
            
            // 2. Audit Workspace Leaves (Open/Background Tabs)
            let totalLeaves = 0;
            const leafTypeCounts = {};
            app.workspace.iterateAllLeaves(leaf => {
                totalLeaves++;
                const viewType = leaf.view ? leaf.view.getViewType() : 'unknown';
                leafTypeCounts[viewType] = (leafTypeCounts[viewType] || 0) + 1;
            });

            const topLeafTypes = Object.entries(leafTypeCounts)
                .map(([type, count]) => `${count}x '${type}'`)
                .join(', ');

            // 3. Deep In-Memory Plugin Inspection
            const plugins = app.plugins ? app.plugins.plugins : {};
            const pluginScores = [];

            for (const id in plugins) {
                const plugin = plugins[id];
                const name = plugin.manifest ? plugin.manifest.name : id;

                // Estimate internal data structure size
                let internalDataKB = 0;
                let topProperty = 'None';
                let maxPropKB = 0;

                for (const key of Object.keys(plugin)) {
                    if (['app', 'manifest', 'containerEl', 'leaf', 'workspace'].includes(key)) continue;
                    try {
                        const propKB = estimateMemoryKB(plugin[key]);
                        internalDataKB += propKB;
                        if (propKB > maxPropKB) {
                            maxPropKB = propKB;
                            topProperty = `${key} (${propKB.toFixed(1)} KB)`;
                        }
                    } catch (e) {}
                }

                // Count listeners
                let totalListeners = 0;
                const eventNames = {};
                [app.workspace, app.vault, app.metadataCache].forEach(target => {
                    if (target && target._events) {
                        for (const evt in target._events) {
                            const cbs = target._events[evt];
                            if (Array.isArray(cbs)) {
                                cbs.forEach(cb => {
                                    const str = (cb.fn || cb).toString();
                                    if (str.includes(id)) {
                                        totalListeners++;
                                        eventNames[evt] = (eventNames[evt] || 0) + 1;
                                    }
                                });
                            }
                        }
                    }
                });

                const listenerSummary = Object.entries(eventNames)
                    .map(([evt, count]) => `${count}x '${evt}'`)
                    .join(', ') || 'None';

                pluginScores.push({
                    id,
                    name,
                    internalDataKB,
                    topProperty,
                    totalListeners,
                    listenerSummary,
                    score: internalDataKB + (totalListeners * 50)
                });
            }

            pluginScores.sort((a, b) => b.score - a.score);

            // Format markdown report
            let report = `\n### 🧩 Deep In-App Memory Breakdown\n`;
            report += `• **Workspace Leaves:** ${totalLeaves} total active views (${topLeafTypes})\n`;
            report += `• **Core Vault Cache:** ${fileCacheCount.toLocaleString()} indexed files, ${resolvedLinksCount.toLocaleString()} link nodes\n\n`;
            report += `#### Top Plugin Suspects by Internal Heap State:\n`;
            
            pluginScores.slice(0, 5).forEach((p, idx) => {
                report += `${idx + 1}. **${p.name}** (\`${p.id}\`):\n`;
                report += `   - **Internal State Size:** ~${p.internalDataKB.toFixed(1)} KB (Heaviest key: \`${p.topProperty}\`)\n`;
                if (p.totalListeners > 0) {
                    report += `   - **Active Listeners (${p.totalListeners}):** ${p.listenerSummary}\n`;
                }
            });
            report += `\n---\n`;

            const updatedContent = content.replace(
                '- **Status:** In-App Plugin Diagnostics pending...',
                report
            );

            await app.vault.adapter.write(LOG_PATH, updatedContent);
        } catch (err) {
            console.error('[PluginAttributor] Error updating memory log:', err);
        } finally {
            isProcessing = false;
        }
    }

    setTimeout(attributePluginsToLog, 1000);

    app.vault.on('create', (file) => {
        if (file.path === LOG_PATH) setTimeout(attributePluginsToLog, 500);
    });

    app.vault.on('modify', (file) => {
        if (file.path === LOG_PATH) setTimeout(attributePluginsToLog, 500);
    });

    console.log('[PluginAttributor] Deep in-memory auditor loaded.');
};