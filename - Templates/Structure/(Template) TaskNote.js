module.exports = async function({ app, obsidian }) {
    const file = app.workspace.getActiveFile();
    if (!file) return;

    try {
        await app.fileManager.processFrontMatter(file, (fm) => {
            // Standard properties
            if (fm.status === undefined) fm.status = "open";

            // Tag helper for appending "task" safely
            const cleanTag = (t) => {
                if (typeof t !== 'string') return String(t);
                let trimmed = t.trim();
                if (trimmed.startsWith('#')) trimmed = trimmed.substring(1);
                return trimmed;
            };

            const targetTag = 'task';

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
        console.error("Error updating TaskNote frontmatter:", error);
    }
};