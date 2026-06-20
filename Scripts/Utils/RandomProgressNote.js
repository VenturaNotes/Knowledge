module.exports = async (params) => {
    const { app } = params;

    // --- CONFIGURATION ---
    const targetTag = "in-progress"; 
    // ---------------------

    // Clean the target (remove #) to make comparison easier
    const cleanTarget = targetTag.replace(/^#/, '');

    const files = app.vault.getMarkdownFiles();
    const matchedFiles = [];

    files.forEach(file => {
        const cache = app.metadataCache.getFileCache(file);

        // We ONLY check cache.frontmatter (Properties), ignoring inline tags
        if (cache && cache.frontmatter && cache.frontmatter.tags) {
            let fileTags = cache.frontmatter.tags;

            // Obsidian treats a single tag as a string, but multiple as an array. 
            // We force it into an array to be safe.
            if (!Array.isArray(fileTags)) {
                fileTags = [fileTags];
            }

            // Check for match
            const hasTag = fileTags.some(tag => {
                // Ensure the tag is a string and strip any '#' from the file's data
                // before comparing it to our target.
                return tag.toString().replace(/^#/, '') === cleanTarget;
            });

            if (hasTag) {
                matchedFiles.push(file);
            }
        }
    });

    if (matchedFiles.length === 0) {
        new Notice(`No files found with property tag: ${targetTag}`);
        return;
    }

    // Pick a random file
    const randomFile = matchedFiles[Math.floor(Math.random() * matchedFiles.length)];

    // Open the file
    await app.workspace.getLeaf(false).openFile(randomFile);
};