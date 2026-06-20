module.exports = async function({ app, obsidian }) {
    const activeView = app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    if (!activeView) return;

    const editor = activeView.editor;

    // --- Core Footnote Regular Expressions ---
    const reKey = /\[\^(.+?(?=\]))\]/gi;
    const reDefinition = /^\[\^([^\]]+)\]\:/;

    function isNumeric(value) {
        return !isNaN(value - parseFloat(value));
    }

    // Process the editor content
    try {
        tidyFootnotes(editor);
    } catch (error) {
        console.error("Error running Tidy Footnotes:", error);
    }

    function tidyFootnotes(editor) {
        let markers = [];
        let definitions = new Map();
        let firstDefinitionLine = -1;
        let definitionsIndexed = new Map();
        const lineCount = editor.lineCount();
        let prevKey = "";

        for (let i = 0; i < lineCount; i++) {
            const line = editor.getLine(i);
            let isDefinition = false;
            let match;

            if (prevKey.length) {
                const hasIndent = /^[ \t]/.test(line);
                const isLastLine = i === lineCount - 1;
                if (hasIndent || (line.length === 0 && !isLastLine)) {
                    const value = definitions.get(prevKey);
                    definitions.set(prevKey, value + "\n" + line);
                    markers[markers.length - 1].length++;
                    continue;
                } else {
                    prevKey = "";
                }
            }

            while ((match = reDefinition.exec(line)) !== null) {
                if (match.length < 1) return;
                isDefinition = true;
                let key = match[1];
                let value = line.substring(match[0].length);
                definitions.set(key, value);
                prevKey = key;
                let marker = {
                    key,
                    line: i,
                    index: 0,
                    length: 0,
                    isDefinition: true
                };
                markers.push(marker);
                if (firstDefinitionLine === -1) {
                    firstDefinitionLine = i;
                }
                break;
            }

            if (isDefinition) continue;

            // Reset regex search index for safety
            reKey.lastIndex = 0;
            while ((match = reKey.exec(line)) !== null) {
                if (match.length < 1) return;
                let key = match[1];
                let marker = {
                    key,
                    line: i,
                    index: match.index,
                    length: match[0].length,
                    isDefinition: false
                };
                markers.push(marker);
                if (!definitionsIndexed.has(key)) {
                    definitionsIndexed.set(key, {
                        key,
                        newKey: key,
                        isNumber: isNumeric(key),
                        value: ""
                    });
                }
            }
        }

        definitions.forEach((value, key) => {
            definitionsIndexed.set(key, {
                key,
                newKey: key,
                isNumber: isNumeric(key),
                value
            });
        });

        let count = 1;
        let definitionsStr = "";
        definitionsIndexed.forEach((definition, marker) => {
            let key = definition.key;
            if (definition.isNumber) {
                const current = definitionsIndexed.get(marker);
                key = count.toString();
                definitionsIndexed.set(marker, {
                    ...current,
                    newKey: key
                });
                count++;
            }
            definitionsStr += `[^${key}]:${definition.value}\n`;
        });

        const markersCount = markers.length;
        for (let i = markersCount - 1; i >= 0; i--) {
            const marker = markers[i];
            const markerLine = marker.line;

            if (marker.isDefinition) {
                let rangeStart, rangeEnd;
                const lineEnd = markerLine + 1 + marker.length;
                if (lineEnd === editor.lineCount()) {
                    rangeStart = { line: markerLine, ch: 0 };
                    rangeEnd = { line: lineEnd - 1, ch: Infinity };
                } else {
                    rangeStart = { line: markerLine, ch: 0 };
                    rangeEnd = { line: lineEnd, ch: 0 };
                }
                if (markerLine === firstDefinitionLine) {
                    editor.replaceRange(definitionsStr, rangeStart, rangeEnd);
                    continue;
                }
                editor.replaceRange("", rangeStart, rangeEnd);
                continue;
            }

            const definition = definitionsIndexed.get(marker.key);
            const newKey = definition.newKey;
            if (marker.key === newKey) continue;

            const line = editor.getLine(markerLine);
            const prefix = line.substring(0, marker.index);
            const newMarker = `[^${newKey}]`;
            const suffix = line.substring(marker.index + marker.length);
            const newLine = prefix + newMarker + suffix;
            editor.replaceRange(
                newLine,
                { line: markerLine, ch: 0 },
                { line: markerLine, ch: Infinity }
            );
        }

        if (firstDefinitionLine == -1) {
            const lineCount2 = editor.lineCount();
            editor.replaceRange(
                "\n\n" + definitionsStr,
                { line: lineCount2, ch: 0 },
                { line: lineCount2, ch: Infinity }
            );
        }
    }
};