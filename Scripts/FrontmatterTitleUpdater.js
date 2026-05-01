module.exports = async (params) => {
    
    const syncTitle = (file) => {
        // 1. Only markdown files
        if (!file || file.extension !== 'md') return;

        // 2. Wrap in a slight delay (50ms)
        // This ensures TaskNotes has finished writing the initial template
        setTimeout(() => {
            app.fileManager.processFrontMatter(file, (frontmatter) => {
                if (frontmatter && frontmatter.hasOwnProperty('title')) {
                    if (frontmatter['title'] !== file.basename) {
                        frontmatter['title'] = file.basename;
                    }
                }
            }).catch(err => console.debug("Sync Error:", err));
        }, 50); 
    };

    // Listen for renames (for when you manually rename)
    app.vault.on('rename', (file) => syncTitle(file));

    // Listen for creations (for TaskNotes / auto-renamed collisions)
    app.vault.on('create', (file) => syncTitle(file));

    console.log("Frontmatter Title Sync: Listeners active for Create & Rename.");
};