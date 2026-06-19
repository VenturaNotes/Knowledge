module.exports = async function({ app, obsidian }) {
    const file = app.workspace.getActiveFile();
    if (!file) return;

    try {
        // Initialize the aliases property if not already present
        await app.fileManager.processFrontMatter(file, (fm) => {
            if (fm.aliases === undefined) {
                // Initialize as an empty array/string so it generates a proper empty state
                fm.aliases = ""; 
            }
        });

        const activeView = app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (activeView) {
            const editor = activeView.editor;
            editor.focus();

            // Give Live Preview a moment to compile and render the updated YAML properties block
            setTimeout(() => {
                const container = activeView.contentEl;
                const aliasesProperty = container.querySelector('.metadata-property[data-property-key="aliases"]');
                
                // --- Approach 1: Focus Visual Properties UI (Live Preview) ---
                if (aliasesProperty) {
                    const valueContainer = aliasesProperty.querySelector('.metadata-property-value');
                    if (valueContainer) {
                        // Locate the focusable input/contenteditable region in the block
                        const focusTarget = valueContainer.querySelector('input, [contenteditable="true"], .multi-select-input, .multi-select-container, [tabindex="0"]');
                        if (focusTarget) {
                            focusTarget.focus();
                            if (typeof focusTarget.click === 'function') {
                                focusTarget.click();
                            }
                            return; // Visual block focused successfully!
                        }
                    }
                }

                // --- Approach 2: Fallback to Editor Text Cursor (Source Mode) ---
                const value = editor.getValue();
                const lines = value.split("\n");
                
                let targetLine = -1;
                let inFrontmatter = false;
                
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (line === "---") {
                        if (!inFrontmatter) {
                            inFrontmatter = true;
                        } else {
                            break; 
                        }
                    } else if (inFrontmatter && line.startsWith("aliases:")) {
                        targetLine = i;
                        break;
                    }
                }

                if (targetLine !== -1) {
                    const lineContent = lines[targetLine];
                    let chPos = lineContent.length;
                    if (lineContent.endsWith('""')) {
                        chPos = lineContent.length - 1; 
                    }
                    editor.setCursor({ line: targetLine, ch: chPos });
                }
            }, 150);
        }
    } catch (error) {
        console.error("Error updating frontmatter for aliases:", error);
    }
};