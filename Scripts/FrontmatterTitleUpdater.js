module.exports = async (params) => {
    // Remove old listeners before re-registering
    app.vault.off('rename', syncTitle);
    app.vault.off('create', syncTitle);

    function syncTitle(file) {
        if (!file || file.extension !== 'md') return;
        setTimeout(() => {
            app.fileManager.processFrontMatter(file, (frontmatter) => {
                if (frontmatter?.hasOwnProperty('title')) {
                    if (frontmatter['title'] !== file.basename) {
                        frontmatter['title'] = file.basename;
                    }
                }
            }).catch(err => console.debug("Sync Error:", err));
        }, 50);
    }

    app.vault.on('rename', syncTitle);
    app.vault.on('create', syncTitle);

    console.log("Frontmatter Title Sync: active.");
};