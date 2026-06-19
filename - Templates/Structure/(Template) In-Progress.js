module.exports = async function({ app, obsidian }) {
    const file = app.workspace.getActiveFile();
    if (!file) return;

    try {
        await app.fileManager.processFrontMatter(file, (fm) => {
            // Helper function to sanitize tags (stripping leading '#' if present)
            const cleanTag = (t) => {
                if (typeof t !== 'string') return String(t);
                let trimmed = t.trim();
                if (trimmed.startsWith('#')) {
                    trimmed = trimmed.substring(1);
                }
                return trimmed;
            };

            // Scenario 1: Tags property does not exist at all
            if (fm.tags === undefined || fm.tags === null) {
                fm.tags = ['in-progress'];
            } 
            // Scenario 2: Tags property is already an array
            else if (Array.isArray(fm.tags)) {
                const normalizedTags = fm.tags.map(cleanTag);
                if (!normalizedTags.includes('in-progress')) {
                    fm.tags.push('in-progress');
                }
            } 
            // Scenario 3: Tags property is a string (e.g. comma or space-separated list)
            else if (typeof fm.tags === 'string') {
                const currentTags = fm.tags.split(/[\s,]+/).map(cleanTag).filter(Boolean);
                if (!currentTags.includes('in-progress')) {
                    currentTags.push('in-progress');
                }
                fm.tags = currentTags; // Normalize it into a clean list
            } 
            // Fallback for any other unexpected formats
            else {
                fm.tags = ['in-progress'];
            }
        });
    } catch (error) {
        console.error("Error updating frontmatter for in-progress tag:", error);
    }
};