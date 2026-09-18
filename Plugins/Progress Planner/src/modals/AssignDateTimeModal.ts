import { App, Editor, Modal, Notice, Setting } from "obsidian";

interface DateTimeResult {
    date: string;
    time: string;
    recurrence: string;
}

export class AssignDateTimeModal extends Modal {
    private date: string;
    private time: string;
    private recurrence: string;
    private submitted = false;
    private onResolve: (result: DateTimeResult | null) => void;

    constructor(
        app: App,
        initialValues: { date: string; time: string; recurrence: string },
        onResolve: (result: DateTimeResult | null) => void
    ) {
        super(app);
        this.date = initialValues.date;
        this.time = initialValues.time;
        this.recurrence = initialValues.recurrence;
        this.onResolve = onResolve;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h2", { text: "Assign Date & Time" });

        // Shortcut: Cmd/Ctrl + Enter to apply
        this.scope.register(["Mod"], "Enter", (e) => {
            e.preventDefault();
            this.submitted = true;
            this.close();
        });

        const form = contentEl.createDiv();
        Object.assign(form.style, {
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "4px 0 12px 0"
        });

        const makeRow = (labelText: string, descText: string) => {
            const row = form.createDiv();
            Object.assign(row.style, {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px"
            });

            const labelWrap = row.createDiv();
            labelWrap.createEl("div", {
                text: labelText,
                cls: "setting-item-name"
            });
            labelWrap.createEl("div", {
                text: descText,
                cls: "setting-item-description"
            });

            return row;
        };

        // Recurrence row
        const recurrenceRow = makeRow("Recurrence (Optional)", "Empty = No 🔁 icon");
        const recurrenceInput = recurrenceRow.createEl("input", {
            type: "text",
            value: this.recurrence,
            placeholder: "e.g., every day"
        });
        Object.assign(recurrenceInput.style, {
            padding: "4px 6px",
            width: "130px",
            flexShrink: "0"
        });
        recurrenceInput.onchange = (e) => (this.recurrence = (e.target as HTMLInputElement).value);

        // Date row
        const dateRow = makeRow("Date", "Pick a date");
        const dateInput = dateRow.createEl("input", {
            type: "date",
            value: this.date
        });
        Object.assign(dateInput.style, {
            padding: "4px 6px 4px 26px",
            width: "130px",
            flexShrink: "0"
        });
        dateInput.onchange = (e) => (this.date = (e.target as HTMLInputElement).value);

        // Time row
        const timeRow = makeRow("Time (Optional)", "Empty = No ⏰ icon");
        const timeInput = timeRow.createEl("input", {
            type: "time",
            value: this.time
        });
        Object.assign(timeInput.style, {
            padding: "4px 6px",
            width: "118px",
            flexShrink: "0"
        });
        timeInput.onchange = (e) => (this.time = (e.target as HTMLInputElement).value);

        // Auto-focus time input
        setTimeout(() => timeInput.focus(), 0);

        // Submit Button
        new Setting(contentEl).addButton((btn) =>
            btn
                .setButtonText("Apply (Cmd+Enter)")
                .setCta()
                .onClick(() => {
                    this.submitted = true;
                    this.close();
                })
        );
    }

    onClose() {
        if (this.submitted) {
            this.onResolve({ date: this.date, time: this.time, recurrence: this.recurrence });
        } else {
            this.onResolve(null);
        }
    }
}

/**
 * Controller function that validates the cursor line, prompts the modal,
 * and writes the formatted result back while keeping block anchors intact.
 */
export async function assignDateAndTimeToTask(app: App, editor: Editor): Promise<void> {
    const cursor = editor.getCursor();
    const lineText = editor.getLine(cursor.line);

    // Ensure cursor is currently on a task line (- [ ], * [ ], etc.)
    if (!/^\s*[-*+]\s*\[.\]/.test(lineText)) {
        new Notice("Not on a checkbox line!");
        return;
    }

    const moment = (window as any).moment;

    // (1) Parse existing date
    let defaultDate = moment().format("YYYY-MM-DD");
    const dateMatch = lineText.match(/📅\s*(\d{4}-\d{2}-\d{2})/);
    if (dateMatch && dateMatch[1]) {
        defaultDate = dateMatch[1];
    }

    // (2) Parse existing time
    let defaultTime = "";
    const timeMatch = lineText.match(/⏰\s*(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i);
    if (timeMatch && timeMatch[1]) {
        const parsedTime = moment(timeMatch[1].trim(), ["h:mmA", "HH:mm", "h:mm A"]);
        if (parsedTime.isValid()) {
            defaultTime = parsedTime.format("HH:mm");
        }
    }

    // (3) Parse existing recurrence
    let defaultRecurrence = "";
    const recurrenceMatch = lineText.match(/🔁\s*([^📅⏰\n^]+)/);
    if (recurrenceMatch && recurrenceMatch[1]) {
        defaultRecurrence = recurrenceMatch[1].trim();
    }

    const result = await new Promise<DateTimeResult | null>((resolve) => {
        new AssignDateTimeModal(
            app,
            { date: defaultDate, time: defaultTime, recurrence: defaultRecurrence },
            resolve
        ).open();
    });

    if (!result || !result.date) return;

    // (4) Detect trailing block anchor (e.g. ^tsk-abc123) so it stays at the end of the line
    const anchorMatch = lineText.match(/(\s*\^[a-zA-Z0-9-]+)\s*$/);
    const anchorSuffix = anchorMatch?.[1]?.trim() ?? "";

    // (5) Strip previous schedule tags and temporary block anchor
    const cleanText = lineText
        .replace(/(\s*\^[a-zA-Z0-9-]+)\s*$/, "")
        .replace(/🔁\s*[^📅⏰\n^]+/g, "")
        .replace(/📅\s*\d{4}-\d{2}-\d{2}/g, "")
        .replace(/⏰\s*\d{1,2}:\d{2}(?:\s*[APMapm]{2})?/gi, "")
        .trimEnd();

    let recurrenceString = "";
    if (result.recurrence) {
        recurrenceString = ` 🔁 ${result.recurrence.trim()}`;
    }

    const dateString = ` 📅 ${result.date}`;

    let timeString = "";
    if (result.time) {
        const formatted = moment(result.time, "HH:mm").format("h:mmA");
        timeString = ` ⏰ ${formatted}`;
    }

    const anchorPart = anchorSuffix ? ` ^${anchorSuffix}` : "";

    // Assemble components: text -> recurrence -> date -> time -> anchor
    const newText = `${cleanText}${recurrenceString}${dateString}${timeString}${anchorPart}`;

    editor.setLine(cursor.line, newText);
}