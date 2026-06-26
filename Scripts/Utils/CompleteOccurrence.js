module.exports = async (params) => {
    const file = app.workspace.getActiveFile();
    if (!file) {
        new Notice("No active file found.");
        return;
    }

    await app.fileManager.processFrontMatter(file, (frontmatter) => {
        let scheduledStr = "";

        // Handle scheduled date formats (string or parsed Date object)
        if (typeof frontmatter.scheduled === "string") {
            scheduledStr = frontmatter.scheduled;
        } else if (frontmatter.scheduled instanceof Date) {
            const y = frontmatter.scheduled.getFullYear();
            const m = String(frontmatter.scheduled.getMonth() + 1).padStart(2, '0');
            const d = String(frontmatter.scheduled.getDate()).padStart(2, '0');
            const hh = frontmatter.scheduled.getHours();
            const mm = frontmatter.scheduled.getMinutes();
            // If hours/minutes are midnight (00:00), treat as a date-only string
            if (hh === 0 && mm === 0) {
                scheduledStr = `${y}-${m}-${d}`;
            } else {
                scheduledStr = `${y}-${m}-${d}T${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
            }
        } else if (frontmatter.scheduled) {
            scheduledStr = String(frontmatter.scheduled);
        }

        if (!scheduledStr) {
            new Notice("No scheduled date found in frontmatter.");
            return;
        }

        // Separate date and time components to maintain formatting
        let datePart = scheduledStr;
        let timePart = "";
        let separator = "T";

        if (scheduledStr.includes('T')) {
            const parts = scheduledStr.split('T');
            datePart = parts[0];
            timePart = parts[1];
        } else if (scheduledStr.includes(' ')) {
            const parts = scheduledStr.split(' ');
            datePart = parts[0];
            timePart = parts[1];
            separator = ' ';
        }

        // Step 1: Add only the clean date (YYYY-MM-DD) to complete_instances
        if (!Array.isArray(frontmatter.complete_instances)) {
            frontmatter.complete_instances = [];
        }
        
        if (!frontmatter.complete_instances.includes(datePart)) {
            frontmatter.complete_instances.push(datePart);
        }

        // Step 2: Calculate the next scheduled date based on recurrence
        const recurrenceStr = frontmatter.recurrence;
        if (recurrenceStr) {
            const rule = {};
            const parts = recurrenceStr.split(';');
            
            for (const part of parts) {
                if (part.includes('=')) {
                    const [key, val] = part.split('=');
                    rule[key.trim().toUpperCase()] = val.trim();
                } else if (part.includes(':')) {
                    const [key, val] = part.split(':');
                    rule[key.trim().toUpperCase()] = val.trim();
                }
            }

            // Parse the current date portion safely
            const [y, m, d] = datePart.split('-').map(Number);
            let current = new Date(y, m - 1, d);

            if (rule.FREQ === 'DAILY') {
                current.setDate(current.getDate() + 1);
            } else if (rule.FREQ === 'WEEKLY') {
                current.setDate(current.getDate() + 7);
            } else if (rule.FREQ === 'MONTHLY') {
                const nextMonth = current.getMonth() + 1;
                const targetDay = rule.BYMONTHDAY ? parseInt(rule.BYMONTHDAY, 10) : d;
                current = new Date(current.getFullYear(), nextMonth, targetDay);
            } else if (rule.FREQ === 'YEARLY') {
                const nextYear = current.getFullYear() + 1;
                const targetMonth = rule.BYMONTH ? parseInt(rule.BYMONTH, 10) - 1 : current.getMonth();
                const targetDay = rule.BYMONTHDAY ? parseInt(rule.BYMONTHDAY, 10) : d;
                current = new Date(nextYear, targetMonth, targetDay);
            } else {
                current.setMonth(current.getMonth() + 1);
            }

            // Format next date back to YYYY-MM-DD
            const yyyy = current.getFullYear();
            const mm = String(current.getMonth() + 1).padStart(2, '0');
            const dd = String(current.getDate()).padStart(2, '0');
            const newDatePart = `${yyyy}-${mm}-${dd}`;
            
            // Re-apply original time formatting if it was present
            frontmatter.scheduled = timePart ? `${newDatePart}${separator}${timePart}` : newDatePart;
            new Notice(`Task rescheduled to: ${frontmatter.scheduled}`);
        } else {
            new Notice("Completed. No recurrence rule found to reschedule.");
        }
    });
};