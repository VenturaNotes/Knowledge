module.exports = async ({ app, obsidian }) => {
    const { Modal, Setting } = obsidian;

    // Define a modal using Obsidian's native API
    class InputModal extends Modal {
        constructor(app, onSubmit) {
            super(app);
            this.onSubmit = onSubmit;
            this.value = '';
        }

        onOpen() {
            const { contentEl } = this;
            contentEl.createEl('h3', { text: 'Web Search & Navigation', attr: { style: 'margin-top: 0;' } });

            let inputEl;

            new Setting(contentEl)
                .setName('Search Google or enter a URL')
                .addText(text => {
                    inputEl = text.inputEl;
                    inputEl.style.width = '100%';
                    
                    text.onChange(value => {
                        this.value = value;
                    });
                    
                    // Allow submitting by pressing Enter
                    text.inputEl.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            this.onSubmit(this.value);
                            this.close();
                        }
                    });
                });

            new Setting(contentEl)
                .addButton(btn => btn
                    .setButtonText('Go')
                    .setCta()
                    .onClick(() => {
                        this.onSubmit(this.value);
                        this.close();
                    })
                );

            // Automatically focus the text field after opening
            if (inputEl) {
                setTimeout(() => inputEl.focus(), 50);
            }
        }

        onClose() {
            this.contentEl.empty();
        }
    }

    // Wrap the modal interaction in a Promise so we can await it
    const promptUser = () => {
        return new Promise((resolve) => {
            let submitted = false;
            const modal = new InputModal(app, (val) => {
                submitted = true;
                resolve(val);
            });
            
            // Handle cases where the user closes the modal without submitting
            const originalOnClose = modal.onClose.bind(modal);
            modal.onClose = () => {
                originalOnClose();
                if (!submitted) resolve(null);
            };
            
            modal.open();
        });
    };

    // Prompt user and wait for their input
    const userInput = await promptUser();
    if (!userInput) return;

    let targetUrl = userInput.trim();
    const hasProtocol = /^(https?:\/\/)/i.test(targetUrl);
    const isDomain = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(targetUrl);

    if (hasProtocol) {
        // Keeps the URL as is if it has http:// or https://
    } else if (isDomain) {
        // Prepends https:// for standard domains
        targetUrl = 'https://' + targetUrl;
    } else {
        // Otherwise, converts the input into a Google search query
        targetUrl = 'https://www.google.com/search?q=' + encodeURIComponent(targetUrl);
    }

    // Open Obsidian's native Web Viewer in a new tab
    const leaf = app.workspace.getLeaf('tab');
    await leaf.setViewState({
        type: 'webviewer',
        state: {
            url: targetUrl,
            navigate: true,
        },
        active: true,
    });
};