module.exports = async (params) => {
    const { app } = params;
    const commandId = 'obsidian-another-quick-switcher:search-command_topic-search';

    // 1. Check if the command exists (in case the plugin is disabled)
    if (app.commands.commands[commandId]) {
        // 2. Run the command
        app.commands.executeCommandById(commandId);
    } else {
        // 3. Alert if something is wrong
        new Notice("Error: 'Topic Search' command not found. Is Another Quick Switcher enabled?");
    }
};