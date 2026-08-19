module.exports = async ({ app, obsidian }) => {
    const LOG_PATH = 'Private/Obsidian-Memory-Alerts.md';
    let isProcessing = false;

    async function attributePluginsToLog() {
        if (isProcessing) return;
        isProcessing = true;

        try {
            const exists = await app.vault.adapter.exists(LOG_PATH);
            if (!exists) return;

            const content = await app.vault.adapter.read(LOG_PATH);
            
            // Only process if an incident is marked pending
            if (!content.includes('In-App Plugin Diagnostics pending...')) {
                return;
            }

            const plugins = app.plugins ? app.plugins.plugins : {};
            const pluginScores = [];

            for (const id in plugins) {
                const plugin = plugins[id];
                const name = plugin.manifest ? plugin.manifest.name : id;
                
                // 1. Fast DOM node count
                const domCount = document.querySelectorAll(`[class*="${id}"], [data-plugin="${id}"]`).length;
                
                // 2. Active workspace leaves
                let leafCount = 0;
                app.workspace.iterateAllLeaves(leaf => {
                    if (leaf.view && leaf.view.getViewType().includes(id)) {
                        leafCount++;
                    }
                });

                // 3. Active listeners & event names
                const eventNames = {};
                let totalListeners = 0;

                [app.workspace, app.vault, app.metadataCache].forEach(target => {
                    if (target && target._events) {
                        for (const evt in target._events) {
                            const cbs = target._events[evt];
                            if (Array.isArray(cbs)) {
                                cbs.forEach(cb => {
                                    const str = cb.fn ? cb.fn.toString() : cb.toString();
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
                    domCount,
                    leafCount,
                    totalListeners,
                    listenerSummary,
                    totalFootprintScore: domCount + (leafCount * 100) + (totalListeners * 20)
                });
            }

            pluginScores.sort((a, b) => b.totalFootprintScore - a.totalFootprintScore);

            // Format markdown breakdown
            let report = `\n### 🧩 Top Plugin Suspects Inside Process\n`;
            pluginScores.slice(0, 5).forEach((p, idx) => {
                report += `${idx + 1}. **${p.name}** (\`${p.id}\`):\n`;
                report += `   - **DOM Nodes:** ${p.domCount.toLocaleString()} elements | **Views:** ${p.leafCount} active\n`;
                if (p.totalListeners > 0) {
                    report += `   - **Active Listeners (${p.totalListeners}):** ${p.listenerSummary}\n`;
                }
            });
            report += `\n---\n`;

            // Replace pending line with complete diagnostic
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

    // 1. Check immediately on startup for any pending uncompleted logs
    setTimeout(attributePluginsToLog, 1000);

    // 2. Listen to BOTH create and modify events
    app.vault.on('create', (file) => {
        if (file.path === LOG_PATH) {
            setTimeout(attributePluginsToLog, 500);
        }
    });

    app.vault.on('modify', (file) => {
        if (file.path === LOG_PATH) {
            setTimeout(attributePluginsToLog, 500);
        }
    });

    console.log('[PluginAttributor] Active and listening for alert modifications.');
};