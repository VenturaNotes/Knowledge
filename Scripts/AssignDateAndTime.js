module.exports = async (params) => {
    const { app, obsidian } = params;
    const { Modal, Setting, Notice } = obsidian;

    const editor = app.workspace.activeLeaf.view.editor;
    if (!editor) return;

    const cursor = editor.getCursor();
    const lineText = editor.getLine(cursor.line);

    if (!lineText.includes("- [")) {
        new Notice("Not on a checkbox line!");
        return;
    }

    // --- (1) Parse existing date, time, and recurrence values ---
    let defaultDate = window.moment().format("YYYY-MM-DD");
    const dateMatch = lineText.match(/📅\s*(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
        defaultDate = dateMatch[1];
    }

    let defaultTime = "";
    const timeMatch = lineText.match(/⏰\s*(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i);
    if (timeMatch) {
        // Parse format safely (handles 12h or 24h formats)
        const parsedTime = window.moment(timeMatch[1].trim(), ["h:mmA", "HH:mm", "h:mm A"]);
        if (parsedTime.isValid()) {
            defaultTime = parsedTime.format("HH:mm");
        }
    }

    let defaultRecurrence = "";
    const recurrenceMatch = lineText.match(/🔁\s*([^📅⏰\n]+)/);
    if (recurrenceMatch) {
        defaultRecurrence = recurrenceMatch[1].trim();
    }

    const getDateAndTime = () => {
        return new Promise((resolve) => {
            class DateTimeModal extends Modal {
                constructor(app) {
                    super(app);
                    this.date = defaultDate;
                    this.time = defaultTime;
                    this.recurrence = defaultRecurrence;
                    this.submitted = false;
                }

                onOpen() {
                    const { contentEl } = this;
                    contentEl.empty();
                    contentEl.createEl("h2", { text: "Assign Date & Time" });

                    // Shortcut: Command/Ctrl + Enter
                    this.scope.register(['Mod'], 'Enter', (e) => {
                        e.preventDefault();
                        this.submitted = true;
                        this.close();
                    });

                    // --- Compact form: bypass Setting's space-between layout ---
                    const form = contentEl.createDiv();
                    Object.assign(form.style, {
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        padding: "4px 0 12px 0",
                    });

                    const makeRow = (labelText, descText) => {
                        const row = form.createDiv();
                        Object.assign(row.style, {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "12px",
                        });

                        const labelWrap = row.createDiv();
                        labelWrap.createEl("div", {
                            text: labelText,
                            cls: "setting-item-name",
                        });
                        labelWrap.createEl("div", {
                            text: descText,
                            cls: "setting-item-description",
                        });

                        return row;
                    };

                    // --- (2) Recurrence row ---
                    const recurrenceRow = makeRow("Recurrence (Optional)", "Empty = No 🔁 icon");
                    const recurrenceInput = recurrenceRow.createEl("input", {
                        type: "text",
                        value: this.recurrence,
                        placeholder: "e.g., every day",
                    });
                    Object.assign(recurrenceInput.style, {
                        padding: "4px 6px",
                        width: "130px", // space for recurrence text input
                        flexShrink: "0",
                    });
                    recurrenceInput.onchange = (e) => (this.recurrence = e.target.value);

                    // Date row
                    const dateRow = makeRow("Date", "Pick a date");
                    const dateInput = dateRow.createEl("input", {
                        type: "date",
                        value: this.date,
                    });
                    Object.assign(dateInput.style, {
                        padding: "4px 6px 4px 26px",
                        width: "130px", // tight fit for MM/DD/YYYY + icon
                        flexShrink: "0",
                    });
                    dateInput.onchange = (e) => (this.date = e.target.value);

                    // Time row
                    const timeRow = makeRow("Time (Optional)", "Empty = No ⏰ icon");
                    const timeInput = timeRow.createEl("input", {
                        type: "time",
                        value: this.time,
                    });
                    Object.assign(timeInput.style, {
                        padding: "4px 6px",
                        width: "118px", // tight fit for HH:MM AM/PM + icon
                        flexShrink: "0",
                    });
                    timeInput.onchange = (e) => (this.time = e.target.value);
                    // Focus time input so the user can type immediately
                    setTimeout(() => timeInput.focus(), 0);

                    // Submit button — Setting is fine here, it's full-width anyway
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
                        resolve({ date: this.date, time: this.time, recurrence: this.recurrence });
                    } else {
                        resolve(null);
                    }
                }
            }

            new DateTimeModal(app).open();
        });
    };

    const result = await getDateAndTime();
    if (!result || !result.date) return;

    // Clean out existing tags from the line (removing recurrence first, then date & time)
    let cleanText = lineText
        .replace(/🔁\s*[^📅⏰\n]+/g, "")
        .replace(/📅\s*\d{4}-\d{2}-\d{2}/g, "")
        .replace(/⏰\s*\d{1,2}:\d{2}\s*(?:AM|PM)?/gi, "")
        .trim();

    // Convert 24h "HH:mm" → 12h "h:mmAM/PM" for the written output
    let timeString = "";
    if (result.time) {
        const formatted = window.moment(result.time, "HH:mm").format("h:mmA");
        timeString = ` ⏰ ${formatted}`;
    }

    // Build the recurrence output string
    let recurrenceString = "";
    if (result.recurrence) {
        recurrenceString = ` 🔁 ${result.recurrence.trim()}`;
    }

    // Combine components back into the task line
    const newText = `${cleanText}${recurrenceString} 📅 ${result.date}${timeString}`;

    editor.setLine(cursor.line, newText);
};