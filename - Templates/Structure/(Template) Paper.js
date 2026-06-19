module.exports = async function({ app, obsidian }) {
    const file = app.workspace.getActiveFile();
    if (!file) return;

    try {
        await app.fileManager.processFrontMatter(file, (fm) => {
            if (fm.Source === undefined && fm.source === undefined) fm.Source = "";
            if (fm.Length === undefined && fm.length === undefined) fm.Length = "";
            if (fm.tags === undefined) fm.tags = [];
            if (fm.Authors === undefined && fm.authors === undefined) fm.Authors = "";
            if (fm.Institution === undefined && fm.institution === undefined) fm.Institution = "";
            if (fm.Year === undefined && fm.year === undefined) fm.Year = "";
        });
    } catch (error) {
        console.error("Error updating Paper frontmatter:", error);
    }
};