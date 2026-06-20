module.exports = async function({ app, obsidian }) {
    const mdView = app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    if (!mdView) return;
    
    const doc = mdView.editor;
    const cursorPosition = doc.getCursor();
    const lineText = doc.getLine(cursorPosition.line);

    // --- Core Regular Expressions ---
    const AllMarkers = /\[\^([^\[\]]+)\](?!:)/dg;
    const AllNumberedMarkers = /\[\^(\d+)\]/gi;
    const AllDetailsNameOnly = /\[\^([^\[\]]+)\]:/g;
    const DetailInLine = /\[\^([^\[\]]+)\]:/;
    const ExtractNameFromFootnote = /(\[\^)([^\[\]]+)(?=\])/;

    // --- Helper Functions ---
    function listExistingFootnoteDetails(doc) {
        let FootnoteDetailList = [];
        for (let i = 0; i < doc.lineCount(); i++) {
            let theLine = doc.getLine(i);
            let lineMatch = theLine.match(AllDetailsNameOnly);
            if (lineMatch) {
                let temp = lineMatch[0];
                temp = temp.replace("[^", "").replace("]:", "");
                FootnoteDetailList.push(temp);
            }
        }
        return FootnoteDetailList.length > 0 ? FootnoteDetailList : null;
    }

    function listExistingFootnoteMarkersAndLocations(doc) {
        let markerEntry;
        let FootnoteMarkerInfo = [];
        AllMarkers.lastIndex = 0; // Reset global search state
        for (let i = 0; i < doc.lineCount(); i++) {
            let theLine = doc.getLine(i);
            let lineMatch;
            while ((lineMatch = AllMarkers.exec(theLine)) != null) {
                markerEntry = {
                    footnote: lineMatch[0],
                    lineNum: i,
                    startIndex: lineMatch.index
                };
                FootnoteMarkerInfo.push(markerEntry);
            }
        }
        return FootnoteMarkerInfo;
    }

    function shouldJumpFromDetailToMarker(lineText, cursorPosition, doc) {
        let match = lineText.match(DetailInLine);
        if (match) {
            let s = match[0];
            let footnote = s.replace(":", "");
            for (let i = 0; i < doc.lineCount(); i++) {
                let scanLine = doc.getLine(i);
                if (i !== cursorPosition.line && scanLine.includes(footnote)) {
                    let cursorLocationIndex = scanLine.indexOf(footnote);
                    doc.setCursor({
                        line: i,
                        ch: cursorLocationIndex + footnote.length,
                    });
                    return true;
                }
            }
        }
        return false;
    }

    function shouldJumpFromMarkerToDetail(lineText, cursorPosition, doc) {
        let markerTarget = null;
        let FootnoteMarkerInfo = listExistingFootnoteMarkersAndLocations(doc);
        let currentLine = cursorPosition.line;
        let footnotesOnLine = FootnoteMarkerInfo.filter((markerEntry) => markerEntry.lineNum === currentLine);
        
        if (footnotesOnLine != null) {
            for (let i = 0; i < footnotesOnLine.length; i++) {
                let marker = footnotesOnLine[i].footnote;
                let indexOfMarkerInLine = footnotesOnLine[i].startIndex;
                if (cursorPosition.ch >= indexOfMarkerInLine &&
                    cursorPosition.ch <= indexOfMarkerInLine + marker.length) {
                    markerTarget = marker;
                    break;
                }
            }
        }
        
        if (markerTarget !== null) {
            let match = markerTarget.match(ExtractNameFromFootnote);
            if (match) {
                let footnoteName = match[2];
                for (let i = 0; i < doc.lineCount(); i++) {
                    let theLine = doc.getLine(i);
                    let lineMatch = theLine.match(DetailInLine);
                    if (lineMatch) {
                        let nameMatch = lineMatch[1];
                        if (nameMatch == footnoteName) {
                            doc.setCursor({ line: i, ch: lineMatch[0].length });
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    // --- Navigation Flow ---

    // Jump 1: From Detail line back to Marker
    if (shouldJumpFromDetailToMarker(lineText, cursorPosition, doc)) return;

    // Jump 2: From Marker down to Detail line
    if (shouldJumpFromMarkerToDetail(lineText, cursorPosition, doc)) return;

    // --- Creation Flow ---
    const fullText = doc.getValue();
    const hasReferences = fullText.includes("## References");

    // Scan for the first existing footnote definition in the note
    let firstDetailLine = -1;
    for (let i = 0; i < doc.lineCount(); i++) {
        if (DetailInLine.test(doc.getLine(i))) {
            firstDetailLine = i;
            break;
        }
    }

    // If the "## References" header doesn't exist, but footnote details already exist,
    // insert the header cleanly right above the first footnote detail with an empty line separating them.
    if (!hasReferences && firstDetailLine !== -1) {
        const prevLine = firstDetailLine > 0 ? doc.getLine(firstDetailLine - 1).trim() : "";
        const headerText = prevLine === "" ? "## References\n\n" : "\n## References\n\n";
        doc.replaceRange(headerText, { line: firstDetailLine, ch: 0 });
        
        // Adjust index for line additions
        const insertedLines = headerText.split('\n').length - 1;
        firstDetailLine += insertedLines;
    }

    // Determine the next incremental numerical index
    let matches = doc.getValue().match(AllNumberedMarkers);
    let currentMax = 1;
    if (matches != null) {
        for (let i = 0; i < matches.length; i++) {
            let match = matches[i];
            match = match.replace("[^", "").replace("]", "");
            let matchNumber = Number(match);
            if (matchNumber + 1 > currentMax) {
                currentMax = matchNumber + 1;
            }
        }
    }

    let footNoteId = currentMax;
    let footnoteMarker = `[^${footNoteId}]`;
    let linePart1 = lineText.substring(0, cursorPosition.ch);
    let linePart2 = lineText.substring(cursorPosition.ch);
    let newLine = linePart1 + footnoteMarker + linePart2;
    doc.replaceRange(newLine, { line: cursorPosition.line, ch: 0 }, { line: cursorPosition.line, ch: lineText.length });

    // Clean up empty trailing lines at the end of the document to keep spacing neat
    let lastLineIndex = doc.lastLine();
    let lastLine = doc.getLine(lastLineIndex);
    while (lastLineIndex > 0) {
        lastLine = doc.getLine(lastLineIndex);
        if (lastLine.trim().length > 0) {
            doc.replaceRange("", { line: lastLineIndex + 1, ch: 0 }, { line: doc.lastLine(), ch: doc.getLine(doc.lastLine()).length });
            break;
        }
        lastLineIndex--;
    }

    let list = listExistingFootnoteDetails(doc);
    let updatedLastLineIndex = doc.lastLine();
    let updatedLastLine = doc.getLine(updatedLastLineIndex);

    let footnoteDetail = `[^${footNoteId}]: `;

    if (list === null) {
        // First footnote in the note: append "## References" + empty line + footnote detail [1]
        let headerPrefix = "";
        if (updatedLastLine.trim() !== "") {
            headerPrefix = "\n\n";
        } else {
            headerPrefix = "\n";
        }
        
        const finalInsertion = `${headerPrefix}## References\n\n${footnoteDetail}`;
        doc.replaceRange(finalInsertion, { line: updatedLastLineIndex, ch: updatedLastLine.length });
        
        // Focus cursor directly inside the new footnote detail
        doc.setCursor({ line: doc.lastLine(), ch: footnoteDetail.length });
    } else {
        // Footnotes exist: append the new detail cleanly [1]
        let detailPrefix = "\n";
        if (updatedLastLine.trim() === "") {
            detailPrefix = "";
        }
        
        const finalInsertion = `${detailPrefix}${footnoteDetail}`;
        doc.replaceRange(finalInsertion, { line: updatedLastLineIndex, ch: updatedLastLine.length });
        
        // Focus cursor directly inside the new footnote detail
        doc.setCursor({ line: doc.lastLine(), ch: footnoteDetail.length });
    }
};