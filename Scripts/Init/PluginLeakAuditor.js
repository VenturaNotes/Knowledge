module.exports = async ({ app, obsidian }) => {
    const { Notice } = obsidian;

    const CHECK_INTERVAL_MS = 60000; // Check every 60 seconds
    const SPIKE_ALERT_MB = 150;      // Alert if RAM spikes > 150 MB
    const REPORT_PATH = 'Private/Plugin-Leak-Audit.md';

    const pluginBaselines = new Map();
    let initialHeapMB = 0;
    const sessionStartTime = Date.now(); // Track when the monitoring session began

    /**
     * DYNAMICALLY scans global `window` and cross-references against
     * all loaded ScriptRunner .js scripts.
     */
    function inspectGlobalScriptFiles() {
        const detectedScripts = [];

        // 1. Dynamically retrieve all loaded script names from ScriptRunner
        let loadedScriptNames = [];
        const scriptRunnerPlugin = Object.values(app.plugins ? app.plugins.plugins : {}).find(
            p => p.loadedScripts && Array.isArray(p.loadedScripts)
        );

        if (scriptRunnerPlugin) {
            loadedScriptNames = scriptRunnerPlugin.loadedScripts.map(s => s.name);
        }

        // Standard built-in window properties to ignore
        const nativeWindowProps = new Set([
            'window', 'self', 'document', 'name', 'location', 'customElements', 'history',
            'locationbar', 'menubar', 'personalbar', 'scrollbars', 'statusbar', 'toolbar',
            'status', 'closed', 'frames', 'length', 'top', 'opener', 'parent', 'frameElement',
            'navigator', 'origin', 'external', 'screen', 'innerWidth', 'innerHeight',
            'scrollX', 'pageXOffset', 'scrollY', 'pageYOffset', 'visualViewport', 'screenX',
            'screenY', 'outerWidth', 'outerHeight', 'devicePixelRatio', 'clientInformation',
            'screenLeft', 'screenTop', 'styleMedia', 'isSecureContext', 'performance',
            'crypto', 'indexedDB', 'webkitStorageInfo', 'sessionStorage', 'localStorage',
            'electron', 'require', 'obsidian', 'app'
        ]);

        // 2. Scan window keys for matches against loaded script names
        for (const key in window) {
            if (!window.hasOwnProperty(key) || nativeWindowProps.has(key)) continue;

            const lowerKey = key.toLowerCase();
            let matchedScriptName = null;

            // Check if key matches any known ScriptRunner filename (e.g., 'GoogleAIStudioNotifier', 'DailyFile', etc.)
            for (const scriptName of loadedScriptNames) {
                const cleanName = scriptName.toLowerCase().replace(/[^a-z0-9]/g, '');
                if (cleanName && lowerKey.includes(cleanName)) {
                    matchedScriptName = `${scriptName}.js`;
                    break;
                }
            }

            // If it's a non-native custom global variable, record it
            if (matchedScriptName || (!key.startsWith('_') && !key.startsWith('webkit'))) {
                const val = window[key];
                let size = 1;

                if (Array.isArray(val)) {
                    size = val.length;
                } else if (val instanceof Map || val instanceof Set) {
                    size = val.size;
                } else if (val && typeof val === 'object') {
                    try { size = Object.keys(val).length; } catch (e) {}
                }

                detectedScripts.push({
                    scriptFile: matchedScriptName || `[Custom Global: window.${key}]`,
                    globalVariable: `window.${key}`,
                    type: typeof val,
                    size
                });
            }
        }

        return detectedScripts;
    }

    /**
     * Inspects a plugin object and returns its node count plus 
     * a breakdown of its top 3 largest internal properties.
     */
    function inspectPluginProperties(plugin) {
        if (!plugin || typeof plugin !== 'object') return { totalCount: 0, topProperties: [] };

        const propCounts = [];
        let totalCount = 0;

        for (const key in plugin) {
            if (key === 'app' || key === 'manifest' || key === 'containerEl' || key === 'leaf') continue;

            try {
                const val = plugin[key];
                let count = 0;

                if (Array.isArray(val)) {
                    count = val.length;
                } else if (val instanceof Map || val instanceof Set) {
                    count = val.size;
                } else if (val && typeof val === 'object') {
                    count = Object.keys(val).length;
                }

                totalCount += count;
                if (count > 0) {
                    propCounts.push({ property: key, count });
                }
            } catch (e) {}
        }

        propCounts.sort((a, b) => b.count - a.count);

        return {
            totalCount,
            topProperties: propCounts.slice(0, 3)
        };
    }

    /**
     * Counts active workspace event listeners
     */
    function countPluginEventListeners(pluginId) {
        let count = 0;
        const targets = [app.workspace, app.vault, app.metadataCache];

        for (const target of targets) {
            if (target && target._events) {
                for (const eventName in target._events) {
                    const callbacks = target._events[eventName];
                    if (Array.isArray(callbacks)) {
                        for (const cb of callbacks) {
                            const fnStr = cb.fn ? cb.fn.toString() : cb.toString();
                            if (fnStr.includes(pluginId) || (cb.ctx && cb.ctx.manifest && cb.ctx.manifest.id === pluginId)) {
                                count++;
                            }
                        }
                    }
                }
            }
        }
        return count;
    }

    /**
     * Captures baseline state for all community plugins
     */
    function captureAllPluginsSnapshot() {
        const plugins = app.plugins ? app.plugins.plugins : {};
        const snapshot = {};

        for (const id in plugins) {
            const plugin = plugins[id];
            const inspection = inspectPluginProperties(plugin);
            const listeners = countPluginEventListeners(id);

            snapshot[id] = {
                id,
                name: plugin.manifest ? plugin.manifest.name : id,
                stateSize: inspection.totalCount,
                topProperties: inspection.topProperties,
                listeners
            };
        }
        return snapshot;
    }

    /**
     * Formats elapsed time into human-readable format (e.g. "1 hr 15 mins")
     */
    function formatElapsedTime(ms) {
        const totalMinutes = Math.floor(ms / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours > 0) {
            return `${hours} hr ${minutes} mins`;
        }
        return `${minutes} mins`;
    }

    /**
     * Compares baseline against current state and formats markdown entry
     */
    function generateLeakReport() {
        const currentSnapshot = captureAllPluginsSnapshot();
        const activeScriptFiles = inspectGlobalScriptFiles();
        const currentHeapMB = (window.performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1);
        const rssMB = typeof process !== 'undefined' && process.memoryUsage ? (process.memoryUsage().rss / 1024 / 1024).toFixed(1) : 'N/A';
        const heapGrowth = (currentHeapMB - initialHeapMB).toFixed(1);
        const elapsedTimeStr = formatElapsedTime(Date.now() - sessionStartTime);

        const comparisons = [];

        for (const id in currentSnapshot) {
            const current = currentSnapshot[id];
            const baseline = pluginBaselines.get(id) || { stateSize: 0, listeners: 0 };

            const stateDelta = current.stateSize - baseline.stateSize;
            const listenerDelta = current.listeners - baseline.listeners;

            comparisons.push({
                id: current.id,
                name: current.name,
                stateDelta,
                listenerDelta,
                topProperties: current.topProperties,
                suspectScore: (stateDelta > 0 ? stateDelta : 0) + (listenerDelta * 50)
            });
        }

        comparisons.sort((a, b) => b.suspectScore - a.suspectScore);

        const now = new Date();
        let report = `## 🔍 Audit Entry — ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}\n`;
        report += `- **Elapsed Session Time:** ${elapsedTimeStr}\n`;
        report += `- **JS Heap:** ${currentHeapMB} MB (Grew by **+${heapGrowth} MB** since baseline)\n`;
        report += `- **Activity Monitor RAM (RSS):** ${rssMB} MB\n\n`;

        // Active ScriptRunner Files Section
        if (activeScriptFiles.length > 0) {
            report += `### 📜 Active ScriptRunner Files\n\n`;
            report += `| Script File | Target Variable | Type | State Size |\n`;
            report += `| :--- | :--- | :--- | :--- |\n`;
            activeScriptFiles.forEach(s => {
                report += `| **${s.scriptFile}** | \`${s.globalVariable}\` | \`${s.type}\` | ${s.size} |\n`;
            });
            report += `\n`;
        }

        // Top Suspect Plugins Section
        report += `### 🧩 Top Suspect Plugins\n\n`;
        comparisons.slice(0, 8).forEach((item, index) => {
            const level = item.suspectScore > 2000 ? '🔴 HIGH' : item.suspectScore > 500 ? '🟡 MEDIUM' : '🟢 LOW';
            const propsFormatted = item.topProperties.map(p => `\`${p.property}\` (${p.count.toLocaleString()} items)`).join(', ') || 'None';

            report += `#### #${index + 1}. ${item.name} (\`${item.id}\`) — ${level}\n`;
            report += `- **State Growth:** +${item.stateDelta.toLocaleString()} items\n`;
            report += `- **Event Listeners:** +${item.listenerDelta}\n`;
            report += `- **Largest Internal Variables:** ${propsFormatted}\n\n`;
        });

        return { report, topSuspect: comparisons[0], currentHeapMB, heapGrowth };
    }

    /**
     * Appends report to `Private/Plugin-Leak-Audit.md` history
     */
    async function saveReportToPrivateFolder(reportContent) {
        const folder = app.vault.getAbstractFileByPath('Private');
        if (!folder) {
            await app.vault.createFolder('Private');
        }

        let file = app.vault.getAbstractFileByPath(REPORT_PATH);
        if (file) {
            await app.vault.append(file, '\n\n---\n\n' + reportContent);
        } else {
            const header = `# 📜 Memory Leak Audit Log History\n\nSession started at ${new Date().toLocaleString()}\n\n---\n\n`;
            await app.vault.create(REPORT_PATH, header + reportContent);
        }
    }

    // --- Initialize Baseline ---
    const initialPlugins = captureAllPluginsSnapshot();
    for (const id in initialPlugins) {
        pluginBaselines.set(id, initialPlugins[id]);
    }

    initialHeapMB = (window.performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1);
    console.log(`[PluginLeakAuditor] Baseline captured. Heap: ${initialHeapMB} MB`);
    new Notice(`Memory Auditor Started (${initialHeapMB} MB RAM)`);

    // --- Command Palette Integration ---
    app.commands.addCommand({
        id: 'audit-plugin-memory-leaks',
        name: 'Diagnostics: Audit Plugins for Memory Leaks',
        callback: async () => {
            const { report, topSuspect, currentHeapMB } = generateLeakReport();
            await saveReportToPrivateFolder(report);

            if (topSuspect && topSuspect.suspectScore > 500) {
                new Notice(`🚨 Top Suspect: "${topSuspect.name}". Report appended to ${REPORT_PATH}`, 10000);
            } else {
                new Notice(`Memory report appended to ${REPORT_PATH} (${currentHeapMB} MB Heap)`);
            }
        }
    });

    // --- Background Interval ---
    if (!window._pluginAuditorInterval) {
        window._pluginAuditorInterval = setInterval(async () => {
            const currentHeapMB = (window.performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1);
            const diff = currentHeapMB - initialHeapMB;

            if (diff >= SPIKE_ALERT_MB) {
                const { report, topSuspect } = generateLeakReport();
                await saveReportToPrivateFolder(report);

                new Notice(`⚠️ RAM spiked by +${diff.toFixed(1)} MB! Report appended to ${REPORT_PATH}`, 12000);
                initialHeapMB = currentHeapMB; // Reset baseline threshold
            }
        }, CHECK_INTERVAL_MS);
    }
};