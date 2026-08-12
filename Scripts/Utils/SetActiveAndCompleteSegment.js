module.exports = async function ({ app, obsidian }) {
    /**
     * Helper function to find and trigger an Obsidian command.
     * 1. Checks exact display name match (e.g. "Progress Planner: Set active task...")
     * 2. Checks exact command ID match
     * 3. Fallback: Checks partial name/ID match
     */
    function runCommand(targetNameOrId) {
        const commands = app.commands.commands;
        if (!commands) {
            console.error("[ScriptRunner] Command registry not found.");
            return false;
        }

        // 1. Match by exact display name
        for (const id in commands) {
            if (commands[id].name === targetNameOrId) {
                app.commands.executeCommandById(id);
                return true;
            }
        }

        // 2. Match by exact internal ID
        if (commands[targetNameOrId]) {
            app.commands.executeCommandById(targetNameOrId);
            return true;
        }

        // 3. Fallback: Fuzzy match (case-insensitive substring)
        const targetLower = targetNameOrId.toLowerCase();
        for (const id in commands) {
            const cmd = commands[id];
            if (
                (cmd.name && cmd.name.toLowerCase().includes(targetLower)) ||
                id.toLowerCase().includes(targetLower)
            ) {
                app.commands.executeCommandById(id);
                return true;
            }
        }

        new obsidian.Notice(`⚠️ Command not found: "${targetNameOrId}"`);
        console.error(`[ScriptRunner] Could not find command: ${targetNameOrId}`);
        return false;
    }

    // Step 1: Execute Progress Planner command
    const ranCmd1 = runCommand("Progress Planner: Set active task (from cursor line)");

    // Brief pause (50ms) to allow editor selection / state updates to finish
    await new Promise(resolve => setTimeout(resolve, 50));

    // Step 2: Execute Pacing Timer command
    const ranCmd2 = runCommand("Pacing Timer: Complete Segment / Reset");
};