module.exports = async (params) => {
    const { app, obsidian } = params;
    const Notice = obsidian?.Notice || window.Notice;
    const commandId = 'obsidian-another-quick-switcher:search-command_topic-search';

    if (!app.commands.commands[commandId]) {
        new Notice("Error: 'Topic Search' command not found. Is Another Quick Switcher enabled?");
        return;
    }

    // Procedurally wait for the physical key to be released before opening the modal
    await new Promise((resolve) => {
        const onKeyUp = () => {
            window.removeEventListener('keyup', onKeyUp, true);
            resolve();
        };
        window.addEventListener('keyup', onKeyUp, true);

        // Safety fallback in case the keyup event was already consumed
        setTimeout(resolve, 150);
    });

    app.commands.executeCommandById(commandId);
};