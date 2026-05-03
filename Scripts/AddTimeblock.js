module.exports = async (params) => {
    const { quickAddApi, app } = params;

    // 1. Get User Input
    const title = await quickAddApi.inputPrompt("Event Title", "e.g. Work on Project");
    if (!title) return;

    const startTimeRaw = await quickAddApi.inputPrompt("Start Time", "e.g. 6:00AM or 1:30PM");
    if (!startTimeRaw) return;

    const endTimeRaw = await quickAddApi.inputPrompt("End Time", "e.g. 7:00AM or 2:30PM");
    if (!endTimeRaw) return;

    // 2. Helper: Convert 12h (6:00AM) to 24h (06:00)
    const convertTo24Hour = (timeStr) => {
        const cleaned = timeStr.replace(/\s/g, "").toUpperCase();
        // Regex to match H:MM AM/PM or HH:MM AM/PM
        const match = cleaned.match(/^(\d{1,2}):(\d{2})(AM|PM)$/);
        
        if (!match) {
            throw new Error(`Invalid format: "${timeStr}". Please use H:MM AM/PM format (e.g., 6:00AM).`);
        }

        let [_, hours, minutes, modifier] = match;
        let h = parseInt(hours);

        if (modifier === "PM" && h < 12) h += 12;
        if (modifier === "AM" && h === 12) h = 0;

        return `${h.toString().padStart(2, '0')}:${minutes}`;
    };

    // 3. Helper: The "TaskNotes/Timeblock" ID Formula
    const generateId = () => {
        const timestamp = Date.now();
        // Generates a 9-character random string (Base36)
        const randomStr = Math.random().toString(36).substring(2, 11);
        return `tb-${timestamp}-${randomStr}`;
    };

    try {
        const startTime = convertTo24Hour(startTimeRaw);
        const endTime = convertTo24Hour(endTimeRaw);
        const activeFile = app.workspace.getActiveFile();

        if (!activeFile) {
            new Notice("No active file open.");
            return;
        }

        // 4. Process Frontmatter
        await app.fileManager.processFrontMatter(activeFile, (frontmatter) => {
            if (!frontmatter.timeblocks) {
                frontmatter.timeblocks = [];
            }

            const newBlock = {
                id: generateId(),
                title: title,
                startTime: startTime,
                endTime: endTime,
                color: "#6366f1"
            };

            frontmatter.timeblocks.push(newBlock);
        });

        new Notice(`Added block: ${title} (${startTime}-${endTime})`);
    } catch (e) {
        new Notice(e.message);
    }
};