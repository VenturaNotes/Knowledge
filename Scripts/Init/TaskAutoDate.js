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

        const linesToAddDate = new Set();
        const linesToRemoveDate = new Set();

        const checkedRegex = /^\s*([-*+]|\d+\.)\s+\[[xX]\]/;
        const uncheckedRegex = /^\s*([-*+]|\d+\.)\s+\[\s\]/;

        // Analyze changes to detect checkbox transitions
        update.changes.iterChanges((fromA, toA, fromB, toB) => {
            try {
                const startLineA = update.startState.doc.lineAt(fromA).number;
                const endLineA = update.startState.doc.lineAt(toA).number;
                const startLineB = update.state.doc.lineAt(fromB).number;
                const endLineB = update.state.doc.lineAt(toB).number;

                // Ensure we are comparing matching lines within a stable block structure
                if (endLineA - startLineA === endLineB - startLineB) {
                    for (let i = 0; i <= (endLineA - startLineA); i++) {
                        const lineA = update.startState.doc.line(startLineA + i);
                        const lineB = update.state.doc.line(startLineB + i);

                        const wasChecked = checkedRegex.test(lineA.text);
                        const wasUnchecked = uncheckedRegex.test(lineA.text);
                        const isChecked = checkedRegex.test(lineB.text);
                        const isUnchecked = uncheckedRegex.test(lineB.text);

                        // Only queue additions/removals if the checkbox state transitioned
                        if (!wasChecked && isChecked) {
                            linesToAddDate.add(startLineB + i);
                        } else if (wasChecked && isUnchecked) {
                            linesToRemoveDate.add(startLineB + i);
                        }
                    }
                }
            } catch (e) {
                // Safely handle potential boundary errors
            }
        });

        const today = new Date().toISOString().split('T')[0];
        const dateMarkerRegex = /\s*✅\s*\d{4}-\d{2}-\d{2}/g;
        const changesToDispatch = [];

        // Process additions
        for (const lineNum of linesToAddDate) {
            try {
                const line = update.state.doc.line(lineNum);
                const lineText = line.text;
                if (!dateMarkerRegex.test(lineText)) {
                    const newLineText = lineText + ` ✅ ${today}`;
                    changesToDispatch.push({
                        from: line.from,
                        to: line.to,
                        insert: newLineText
                    });
                }
            } catch (e) {
                // Safely handle indexing edge cases
            }
        }

        // Process removals
        for (const lineNum of linesToRemoveDate) {
            try {
                const line = update.state.doc.line(lineNum);
                const lineText = line.text;
                if (dateMarkerRegex.test(lineText)) {
                    const newLineText = lineText.replace(dateMarkerRegex, '');
                    changesToDispatch.push({
                        from: line.from,
                        to: line.to,
                        insert: newLineText
                    });
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