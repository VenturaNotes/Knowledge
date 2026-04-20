module.exports = async (params) => {
    const { app } = params;
    const commandId = 'workspace:previous-tab';

    // 1. Check if the command exists (in case the plugin is disabled)
    if (app.commands.commands[commandId]) {
        // 2. Run the command
        app.commands.executeCommandById(commandId);
    } else {
        // 3. Alert if something is wrong
        new Notice("Error: 'Previous Tab' command not found. Is Another Quick Switcher enabled?");
    }
};