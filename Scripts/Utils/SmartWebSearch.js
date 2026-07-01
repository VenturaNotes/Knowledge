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
                    
                    text.inputEl.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            e.stopPropagation();
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

            if (inputEl) {
                setTimeout(() => inputEl.focus(), 50);
            }
        }

        onClose() {
            this.contentEl.empty();
        }
    }

    const promptUser = () => {
        return new Promise((resolve) => {
            let submitted = false;
            const modal = new InputModal(app, (val) => {
                submitted = true;
                resolve(val);
            });
            
            const originalOnClose = modal.onClose.bind(modal);
            modal.onClose = () => {
                originalOnClose();
                if (!submitted) resolve(null);
            };
            
            modal.open();
        });
    };

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
        // Converts input into a Google search query
        targetUrl = 'https://www.google.com/search?q=' + encodeURIComponent(targetUrl);
    }

    // Call the custom web viewer plugin directly, or fallback to the native one if it's inactive
    if (window.customWebview) {
        await window.customWebview.openUrl(targetUrl);
    } else {
        const leaf = app.workspace.getLeaf('tab');
        await leaf.setViewState({
            type: 'webviewer',
            state: {
                url: targetUrl,
                navigate: true,
            },
            active: true,
        });
        app.workspace.revealLeaf(leaf);
    }
};