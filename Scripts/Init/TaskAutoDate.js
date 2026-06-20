/**
 * Automatically appends completion date to checked tasks,
 * and removes it if they are unchecked, using a CodeMirror 6 Editor Extension.
 * This ensures it works seamlessly even when clicking checkboxes with a mouse.
 */
module.exports = function(context) {
    const { app, obsidian } = context;

    // Find the ScriptRunner plugin instance robustly.
    // Since class names can be minified during compilation, we locate the plugin 
    // by searching for its unique 'runScript' function and settings structure.
    let plugin = Object.values(app.plugins.plugins).find(
        p => p && typeof p.runScript === 'function' && p.settings && p.settings.startupScripts
    );

    // Fallback: Check common manifest IDs if signature lookup fails
    if (!plugin) {
        plugin = app.plugins.plugins['script-runner'] || app.plugins.plugins['obsidian-script-runner'];
    }

    if (!plugin) {
        console.error("Script Runner: Could not find ScriptRunner plugin instance.");
        return;
    }

    let isModifying = false;
    const { EditorView } = require('@codemirror/view');

    // Create a CodeMirror 6 update listener extension
    const autoDateExtension = EditorView.updateListener.of((update) => {
        // Guard to prevent infinite recursion during our own programmatic updates,
        // and check if any changes actually occurred in the document.
        if (isModifying || !update.docChanged) return;

        const linesToProcess = new Set();

        // Identify exactly which line numbers in the new document state were modified
        update.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
            try {
                const startLine = update.state.doc.lineAt(fromB).number;
                const endLine = update.state.doc.lineAt(toB).number;
                for (let i = startLine; i <= endLine; i++) {
                    linesToProcess.add(i);
                }
            } catch (e) {
                // Safely handle potential boundary errors
            }
        });

        const today = new Date().toISOString().split('T')[0];
        const dateMarkerRegex = /\s*✅\s*\d{4}-\d{2}-\d{2}/g;
        
        const checkedRegex = /^\s*([-*+]|\d+\.)\s+\[[xX]\]/;
        const uncheckedRegex = /^\s*([-*+]|\d+\.)\s+\[\s\]/;

        const changesToDispatch = [];

        for (const lineNum of linesToProcess) {
            try {
                const line = update.state.doc.line(lineNum);
                const lineText = line.text;

                if (checkedRegex.test(lineText)) {
                    // Task is checked. If it lacks a completion date, queue it to be appended.
                    if (!dateMarkerRegex.test(lineText)) {
                        const newLineText = lineText + ` ✅ ${today}`;
                        changesToDispatch.push({
                            from: line.from,
                            to: line.to,
                            insert: newLineText
                        });
                    }
                } else if (uncheckedRegex.test(lineText)) {
                    // Task is unchecked. If it has a completion date, queue it to be stripped.
                    if (dateMarkerRegex.test(lineText)) {
                        const newLineText = lineText.replace(dateMarkerRegex, '');
                        changesToDispatch.push({
                            from: line.from,
                            to: line.to,
                            insert: newLineText
                        });
                    }
                }
            } catch (e) {
                // Safely handle indexing edge cases
            }
        }

        // If we have changes, dispatch them asynchronously to avoid mutating
        // the state while CodeMirror is still in its update cycle.
        if (changesToDispatch.length > 0) {
            isModifying = true;
            setTimeout(() => {
                try {
                    update.view.dispatch({
                        changes: changesToDispatch,
                        userEvent: 'input' // Mimic standard user input so it behaves nicely in the undo history
                    });
                } catch (err) {
                    console.error("Script Runner: Error dispatching task updates:", err);
                } finally {
                    isModifying = false;
                }
            }, 0);
        }
    });

    // Register the editor extension. Obsidian handles unloading it automatically
    // when the ScriptRunner plugin is disabled, reloaded, or updated.
    plugin.registerEditorExtension(autoDateExtension);
    console.log("Script Runner: Registered CodeMirror 6 task auto-date extension.");
};