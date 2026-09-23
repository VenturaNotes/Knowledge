// Description: Search all computer images with full-res preview, Enter to reveal, Cmd+Enter to permanently delete

module.exports = async ({ app, obsidian }) => {
    const { Modal, Notice } = obsidian;
    const { exec } = require('child_process');
    const { shell } = require('electron');
    const fs = require('fs');
    const path = require('path');
    const os = require('os');

    class ImageSwitcherModal extends Modal {
        constructor(app) {
            super(app);
            this.images = [];
            this.filteredImages = [];
            this.selectedIndex = 0;
            this.renderedCount = 0;
            this.batchSize = 80;
            this.previewTimeout = null;
            this.isConfirming = false; // Flag to pause key hijacking during confirmation modal
        }

        onOpen() {
            const { contentEl, modalEl } = this;
            contentEl.empty();

            modalEl.style.width = '90vw';
            modalEl.style.maxWidth = '1200px';
            modalEl.style.height = '85vh';
            
            contentEl.style.display = 'flex';
            contentEl.style.flexDirection = 'column';
            contentEl.style.height = '100%';
            contentEl.style.overflow = 'hidden';
            contentEl.style.padding = '16px';

            // 1. Search Bar & Counter Header
            const searchContainer = contentEl.createDiv({
                attr: { style: 'margin-bottom: 12px; display: flex; align-items: center; gap: 12px; flex-shrink: 0;' }
            });

            this.searchInput = searchContainer.createEl('input', {
                type: 'text',
                placeholder: 'Type to filter... (↑/↓ navigate, Enter reveals in Finder, ⌘+Enter permanently deletes)',
                attr: { style: 'flex: 1; padding: 10px 14px; border-radius: 6px; font-size: 14px;' }
            });

            this.countBadge = searchContainer.createDiv({
                text: 'Scanning...',
                attr: { style: 'font-size: 12px; color: var(--text-muted); white-space: nowrap;' }
            });

            // 2. Main Split View Container
            const splitContainer = contentEl.createDiv({
                attr: { style: 'display: flex; flex: 1; gap: 16px; overflow: hidden; min-height: 0;' }
            });

            // Left: Scrollable List Container
            this.listEl = splitContainer.createDiv({
                attr: { 
                    style: 'width: 400px; flex-shrink: 0; overflow-y: auto; border-right: 1px solid var(--background-modifier-border); padding-right: 8px; position: relative;' 
                }
            });

            // Prevent mouse clicks on the list from blurring the search input
            this.listEl.addEventListener('mousedown', (e) => {
                if (e.target !== this.searchInput) {
                    e.preventDefault();
                }
            });

            // Infinite scroll trigger when reaching bottom of list
            this.listEl.addEventListener('scroll', () => {
                if (this.listEl.scrollTop + this.listEl.clientHeight >= this.listEl.scrollHeight - 200) {
                    if (this.renderedCount < this.filteredImages.length) {
                        this.renderBatch();
                    }
                }
            });

            // Right: Image Preview Pane
            this.previewPane = splitContainer.createDiv({
                attr: { style: 'flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--background-secondary); border-radius: 8px; padding: 16px; overflow: hidden; position: relative;' }
            });

            this.previewImg = this.previewPane.createEl('img', {
                attr: { style: 'max-width: 100%; max-height: calc(100% - 36px); object-fit: contain; border-radius: 4px; display: none;' }
            });

            this.previewCaption = this.previewPane.createDiv({
                attr: { style: 'font-size: 12px; color: var(--text-muted); margin-top: 10px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width: 100%; text-align: center;' }
            });

            this.statusEl = this.previewPane.createDiv({
                text: '⚡ Scanning all images on computer...',
                attr: { style: 'color: var(--text-muted); font-size: 13px;' }
            });

            this.searchInput.addEventListener('input', () => this.filterList());

            // Global capture-phase listener: intercepts keys before browser scrollbars can touch them
            this.keyHandler = (e) => this.handleKeydown(e);
            window.addEventListener('keydown', this.keyHandler, { capture: true });

            this.loadImages();
            this.searchInput.focus();
        }

        loadImages() {
            const searchPath = os.homedir();
            const exts = '-e jpg -e jpeg -e png -e gif -e webp -e svg -e avif -e bmp';
            const excludes = [
                '--exclude ".git"',
                '--exclude "node_modules"',
                '--exclude "Library"',
                '--exclude "Caches"',
                '--exclude ".Trash"',
                '--exclude ".cache"',
                '--exclude ".local"',
                '--exclude "site-packages"',
                '--exclude "venv"',
                '--exclude ".venv"'
            ].join(' ');

            const cmd = `fd --type f ${exts} --hidden --no-ignore ${excludes} . "${searchPath}" -X stat -f "%m %N" 2>/dev/null | sort -rn`;

            const env = {
                ...process.env,
                PATH: `/opt/homebrew/bin:/usr/local/bin:${process.env.PATH || ''}`
            };

            exec(cmd, { maxBuffer: 1024 * 1024 * 64, env }, (err, stdout) => {
                if (err || !stdout.trim()) {
                    this.statusEl.textContent = 'No images found or fd not available.';
                    return;
                }

                this.images = stdout.trim().split('\n').map(line => {
                    const spaceIdx = line.indexOf(' ');
                    return spaceIdx !== -1 ? line.slice(spaceIdx + 1).trim() : line.trim();
                }).filter(filePath => filePath && fs.existsSync(filePath));

                this.filteredImages = [...this.images];
                this.statusEl.style.display = 'none';
                this.resetAndRender();
            });
        }

        filterList() {
            const query = this.searchInput.value.toLowerCase().trim();
            this.filteredImages = query 
                ? this.images.filter(img => img.toLowerCase().includes(query))
                : [...this.images];
            this.resetAndRender();
        }

        resetAndRender() {
            this.listEl.empty();
            this.selectedIndex = 0;
            this.renderedCount = 0;
            this.countBadge.textContent = `${this.filteredImages.length.toLocaleString()} images`;

            if (this.filteredImages.length === 0) {
                this.listEl.createEl('div', { text: 'No matching images found', attr: { style: 'color: var(--text-muted); padding: 8px;' } });
                this.previewImg.style.display = 'none';
                this.previewCaption.textContent = '';
                return;
            }

            this.renderBatch();
            this.queuePreview();
        }

        renderBatch() {
            const nextBatch = this.filteredImages.slice(this.renderedCount, this.renderedCount + this.batchSize);

            nextBatch.forEach((filePath, indexOffset) => {
                const idx = this.renderedCount + indexOffset;
                const item = this.listEl.createDiv({
                    attr: {
                        style: `padding: 8px 10px; border-radius: 6px; cursor: pointer; margin-bottom: 4px; ${idx === this.selectedIndex ? 'background: var(--interactive-accent); color: var(--text-on-accent);' : 'background: var(--background-primary);'}`
                    }
                });

                const filename = path.basename(filePath);
                const dir = path.dirname(filePath).replace(os.homedir(), '~');

                item.createDiv({ text: filename, attr: { style: 'font-weight: 600; font-size: 13px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;' } });
                item.createDiv({ text: dir, attr: { style: 'font-size: 11px; opacity: 0.75; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;' } });

                item.addEventListener('click', () => {
                    this.selectedIndex = idx;
                    this.updateHighlight();
                    this.queuePreview();
                    this.searchInput.focus();
                });
            });

            this.renderedCount += nextBatch.length;
        }

        updateHighlight() {
            const items = this.listEl.children;
            for (let i = 0; i < items.length; i++) {
                if (i === this.selectedIndex) {
                    items[i].style.background = 'var(--interactive-accent)';
                    items[i].style.color = 'var(--text-on-accent)';
                } else {
                    items[i].style.background = 'var(--background-primary)';
                    items[i].style.color = 'var(--text-normal)';
                }
            }
        }

        queuePreview() {
            if (this.previewTimeout) clearTimeout(this.previewTimeout);
            this.previewTimeout = setTimeout(() => this.updatePreview(), 30);
        }

        updatePreview() {
            const activePath = this.filteredImages[this.selectedIndex];
            if (!activePath) return;

            try {
                const ext = path.extname(activePath).slice(1).toLowerCase();
                let mime = `image/${ext}`;
                if (ext === 'svg') mime = 'image/svg+xml';
                if (ext === 'jpg') mime = 'image/jpeg';

                const data = fs.readFileSync(activePath).toString('base64');
                this.previewImg.src = `data:${mime};base64,${data}`;
                this.previewImg.style.display = 'block';

                const stats = fs.statSync(activePath);
                const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
                this.previewCaption.textContent = `${path.basename(activePath)} (${sizeMb} MB) — ${activePath}`;
            } catch (err) {
                console.error('[QuickImageModal] Preview error:', err);
                this.previewImg.style.display = 'none';
                this.previewCaption.textContent = `Error: ${err.message}`;
            }
        }

        // Action 1: Reveal in Finder
        revealInFinder() {
            const activePath = this.filteredImages[this.selectedIndex];
            if (!activePath) return;

            try {
                if (shell && shell.showItemInFolder) {
                    shell.showItemInFolder(activePath);
                } else {
                    exec(`open -R "${activePath}"`);
                }
                new Notice(`📂 Revealed in Finder: ${path.basename(activePath)}`);
            } catch (err) {
                console.error('[QuickImageModal] Reveal error:', err);
                exec(`open -R "${activePath}"`);
            }
        }

        // Action 2: Prompt for permanent deletion
        promptPermanentDelete() {
            const activePath = this.filteredImages[this.selectedIndex];
            if (!activePath) return;

            const filename = path.basename(activePath);
            this.isConfirming = true; // Suspend main modal key hijacking

            const confirmModal = new Modal(this.app);
            confirmModal.modalEl.style.maxWidth = '460px';

            const { contentEl } = confirmModal;
            contentEl.empty();

            contentEl.createEl('h3', { text: 'Permanently Delete Image?' });
            
            const p = contentEl.createEl('p', {
                attr: { style: 'color: var(--text-muted); font-size: 13px; line-height: 1.5; margin-bottom: 20px;' }
            });
            p.innerHTML = `Are you sure you want to permanently delete <strong>${filename}</strong>?<br><span style="color: var(--text-error); font-weight: 500;">⚠️ This action cannot be undone and bypasses system Trash.</span>`;

            const btnContainer = contentEl.createDiv({
                attr: { style: 'display: flex; justify-content: flex-end; gap: 10px;' }
            });

            const cancelBtn = btnContainer.createEl('button', {
                text: 'Cancel',
                attr: { style: 'padding: 6px 14px;' }
            });

            const deleteBtn = btnContainer.createEl('button', {
                text: 'Delete permanently',
                attr: {
                    style: 'padding: 6px 14px; background: var(--text-error); color: white; border: none; border-radius: 4px; font-weight: 600;'
                }
            });

            const closeConfirm = () => {
                this.isConfirming = false;
                confirmModal.close();
                this.searchInput.focus();
            };

            cancelBtn.addEventListener('click', closeConfirm);

            deleteBtn.addEventListener('click', () => {
                closeConfirm();
                this.executePermanentDelete(activePath);
            });

            // Allow hitting Enter to confirm deletion inside the dialog
            confirmModal.scope.register([], 'Enter', (evt) => {
                evt.preventDefault();
                closeConfirm();
                this.executePermanentDelete(activePath);
            });

            confirmModal.onClose = () => {
                this.isConfirming = false;
                this.searchInput.focus();
            };

            confirmModal.open();
        }

        // Execute permanent filesystem deletion
        executePermanentDelete(targetPath) {
            const filename = path.basename(targetPath);

            try {
                fs.unlinkSync(targetPath); // Permanently delete (bypasses Trash)
                new Notice(`💥 Permanently deleted: ${filename}`);

                // Remove from in-memory arrays
                this.images = this.images.filter(p => p !== targetPath);
                this.filteredImages = this.filteredImages.filter(p => p !== targetPath);

                if (this.selectedIndex >= this.filteredImages.length) {
                    this.selectedIndex = Math.max(0, this.filteredImages.length - 1);
                }

                this.refreshAfterDelete();
            } catch (err) {
                console.error('[QuickImageModal] Permanent delete error:', err);
                new Notice(`Failed to delete: ${err.message}`);
            }
        }

        refreshAfterDelete() {
            this.listEl.empty();
            this.countBadge.textContent = `${this.filteredImages.length.toLocaleString()} images`;

            if (this.filteredImages.length === 0) {
                this.previewImg.style.display = 'none';
                this.previewCaption.textContent = '';
                return;
            }

            const targetRenderCount = Math.max(this.batchSize, this.selectedIndex + 15);
            this.renderedCount = 0;
            const slice = this.filteredImages.slice(0, targetRenderCount);
            
            slice.forEach((filePath, idx) => {
                const item = this.listEl.createDiv({
                    attr: {
                        style: `padding: 8px 10px; border-radius: 6px; cursor: pointer; margin-bottom: 4px; ${idx === this.selectedIndex ? 'background: var(--interactive-accent); color: var(--text-on-accent);' : 'background: var(--background-primary);'}`
                    }
                });

                const filename = path.basename(filePath);
                const dir = path.dirname(filePath).replace(os.homedir(), '~');

                item.createDiv({ text: filename, attr: { style: 'font-weight: 600; font-size: 13px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;' } });
                item.createDiv({ text: dir, attr: { style: 'font-size: 11px; opacity: 0.75; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;' } });

                item.addEventListener('click', () => {
                    this.selectedIndex = idx;
                    this.updateHighlight();
                    this.queuePreview();
                    this.searchInput.focus();
                });
            });

            this.renderedCount = slice.length;
            this.scrollActiveIntoView();
            this.queuePreview();
        }

        handleKeydown(e) {
            // If the confirmation dialog is open, do not intercept keys
            if (this.isConfirming) return;

            if (e.key === 'ArrowDown' || (e.ctrlKey && e.key === 'n')) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                if (this.selectedIndex < this.filteredImages.length - 1) {
                    this.selectedIndex++;

                    if (this.selectedIndex >= this.renderedCount - 5) {
                        this.renderBatch();
                    }

                    this.updateHighlight();
                    this.scrollActiveIntoView();
                    this.queuePreview();
                }
            } else if (e.key === 'ArrowUp' || (e.ctrlKey && e.key === 'p')) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                if (this.selectedIndex > 0) {
                    this.selectedIndex--;
                    this.updateHighlight();
                    this.scrollActiveIntoView();
                    this.queuePreview();
                }
            } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                // Command + Enter: Permanently delete
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                this.promptPermanentDelete();
            } else if (e.key === 'Enter') {
                // Enter: Reveal in Finder
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                this.revealInFinder();
            }
        }

        // Direct mathematical scroll calculation: completely immune to browser scrollbar hijacking
        scrollActiveIntoView() {
            const activeEl = this.listEl.children[this.selectedIndex];
            if (!activeEl) return;

            const listTop = this.listEl.scrollTop;
            const listBottom = listTop + this.listEl.clientHeight;
            const itemTop = activeEl.offsetTop;
            const itemBottom = itemTop + activeEl.offsetHeight;

            if (itemTop < listTop) {
                this.listEl.scrollTop = itemTop;
            } else if (itemBottom > listBottom) {
                this.listEl.scrollTop = itemBottom - this.listEl.clientHeight;
            }
        }

        onClose() {
            if (this.keyHandler) {
                window.removeEventListener('keydown', this.keyHandler, { capture: true });
            }
            if (this.previewTimeout) clearTimeout(this.previewTimeout);
            this.contentEl.empty();
        }
    }

    new ImageSwitcherModal(app).open();
};