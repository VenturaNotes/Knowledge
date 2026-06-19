module.exports = async function({ app, obsidian }) {
    const file = app.workspace.getActiveFile();
    if (!file) return;

    try {
        await app.fileManager.processFrontMatter(file, (fm) => {
            // Standard properties
            if (fm.Source === undefined && fm.source === undefined) fm.Source = "";
            if (fm.Company === undefined && fm.company === undefined) fm.Company = "";
            if (fm.Position === undefined && fm.position === undefined) fm.Position = "";
            if (fm.Location === undefined && fm.location === undefined) fm.Location = "";

            // Tag helper for appending "job/apply" safely
            const cleanTag = (t) => {
                if (typeof t !== 'string') return String(t);
                let trimmed = t.trim();
                if (trimmed.startsWith('#')) trimmed = trimmed.substring(1);
                return trimmed;
            };

            const targetTag = 'job/apply';

            if (fm.tags === undefined || fm.tags === null) {
                fm.tags = [targetTag];
            } else if (Array.isArray(fm.tags)) {
                const normalizedTags = fm.tags.map(cleanTag);
                if (!normalizedTags.includes(targetTag)) {
                    fm.tags.push(targetTag);
                }
            } else if (typeof fm.tags === 'string') {
                const currentTags = fm.tags.split(/[\s,]+/).map(cleanTag).filter(Boolean);
                if (!currentTags.includes(targetTag)) {
                    currentTags.push(targetTag);
                }
                fm.tags = currentTags;
            } else {
                fm.tags = [targetTag];
            }
        });
    } catch (error) {
        console.error("Error updating Job frontmatter:", error);
    }
};