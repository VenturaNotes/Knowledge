- Topics sorted in ascending order based on # of footnotes
```dataviewjs
// DataviewJS script to count footnotes with content across documents in the "- Topics" folder
// Ensure this script is placed in a DataviewJS block
let totalFootnotes = 0;
let results = [];
let folderPath = "- Topics/"; // Adjust if the folder path is different

// Collect promises for processing files
let filePromises = dataview.pages()
    .filter(page => page.file.path.startsWith(folderPath))
    .map(page => {
        let file = app.vault.getAbstractFileByPath(page.file.path);
        if (file && file instanceof obsidian.TFile) {
            return app.vault.read(file).then(content => {
                // Regular expression to match footnotes with their content
                let footnoteRegex = /\[\^(\d+)\]:\s*(.+)(?=\n\n|\n\[|\s*$)/g;
                let footnoteMatches = [...content.matchAll(footnoteRegex)];
                let footnoteCount = footnoteMatches.length;
                totalFootnotes += footnoteCount;
                results.push({
                    File: page.file.name.replace(/\.md$/, ""), // Clean file name without extension
                    Footnotes: footnoteCount,
                    Path: page.file.path // Store full path for linking
                });
            });
        }
    });

// Wait for all file reads to complete
Promise.all(filePromises).then(() => {
    // Sort results by number of footnotes in ascending order
    results.sort((a, b) => a.Footnotes - b.Footnotes);

    // Render the table after all files are processed
    let tableContent = "<table><thead><tr><th>File</th><th>Footnotes with Content</th></tr></thead><tbody>";
    results.forEach(row => {
        tableContent += `<tr>
            <td><a href="${encodeURI('obsidian://open?vault=' + app.vault.getName() + '&file=' + row.Path)}">${row.File}</a></td>
            <td>${row.Footnotes}</td>
        </tr>`;
    });
    tableContent += "</tbody></table>";
    dataview.container.innerHTML = `<h3>Total Footnotes with Content: ${totalFootnotes}</h3>` + tableContent;
});
```