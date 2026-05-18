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

    const getDateAndTime = () => {
        return new Promise((resolve) => {
            class DateTimeModal extends Modal {
                constructor(app) {
                    super(app);
                    this.date = window.moment().format("YYYY-MM-DD");
                    this.time = "";
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
                        resolve({ date: this.date, time: this.time });
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

    // Remove old data — regex covers both HH:MM (legacy) and h:mmAM/PM
    let cleanText = lineText
        .replace(/📅\s*\d{4}-\d{2}-\d{2}/g, "")
        .replace(/⏰\s*\d{1,2}:\d{2}(AM|PM)?/gi, "")
        .trim();

    // Convert 24h "HH:mm" → 12h "h:mmAM/PM" for the written output
    let timeString = "";
    if (result.time) {
        const formatted = window.moment(result.time, "HH:mm").format("h:mmA");
        timeString = ` ⏰ ${formatted}`;
    }
    const newText = `${cleanText} 📅 ${result.date}${timeString}`;

    editor.setLine(cursor.line, newText);
};