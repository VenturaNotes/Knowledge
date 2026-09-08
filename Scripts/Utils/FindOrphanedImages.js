/**
 * Orphaned Image Finder for ScriptRunner
 * Scans the vault for unreferenced images and presents an interactive management modal.
 */

module.exports = async function({ app, obsidian }) {
    const { Modal, Notice, Setting } = obsidian;

    const IMAGE_EXTS = new Set(['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'webp', 'avif', 'ico', 'tiff']);

    // Helper: format bytes into human-readable strings
    function formatBytes(bytes) {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    // Step 1: Gather all images in the vault
    const allFiles = app.vault.getFiles();
    const imageFiles = allFiles.filter(f => IMAGE_EXTS.has(f.extension.toLowerCase()));

    if (imageFiles.length === 0) {
        new Notice('No images found in the vault.');
        return;
    }

    const notice = new Notice('Scanning vault for orphaned images...', 0);

    // Step 2: Build a set of all linked/embedded paths using Obsidian's metadata cache
    const referencedPaths = new Set();
    const resolvedLinks = app.metadataCache.resolvedLinks;

    for (const source in resolvedLinks) {
        for (const target in resolvedLinks[source]) {
            referencedPaths.add(target);
        }
    }

    // Step 3: Inspect .canvas files (ensures Canvas image embeds aren't missed)
    const canvasFiles = allFiles.filter(f => f.extension === 'canvas');
    for (const cf of canvasFiles) {
        try {
            const content = await app.vault.cachedRead(cf);
            const data = JSON.parse(content);
            if (Array.isArray(data?.nodes)) {
                for (const node of data.nodes) {
                    if (node.type === 'file' && node.file) {
                        referencedPaths.add(node.file);
                    }
                    if (node.type === 'text' && node.text) {
                        const wikiMatches = node.text.matchAll(/\[\[(.*?)\]\]/g);
                        for (const m of wikiMatches) {
                            const raw = m[1].split('|')[0].split('#')[0].trim();
                            const dest = app.metadataCache.getFirstLinkpathDest(raw, cf.path);
                            if (dest) referencedPaths.add(dest.path);
                        }
                    }
                }
            }
        } catch (e) {
            // Ignore canvas parse errors
        }
    }

    notice.hide();

    // Step 4: Filter down to orphaned images
    let orphanedImages = imageFiles.filter(img => !referencedPaths.has(img.path));

    if (orphanedImages.length === 0) {
        new Notice('🎉 No orphaned images found! Your vault is clean.');
        return;
    }

    // Step 5: Interactive UI Modal
    class OrphanedImagesModal extends Modal {
        constructor(app, initialFiles) {
            super(app);
            this.files = [...initialFiles];
            this.selected = new Set();
            this.searchQuery = '';
        }

        onOpen() {
            this.modalEl.style.width = '850px';
            this.modalEl.style.maxWidth = '95vw';
            this.render();
        }

        getFilteredFiles() {
            if (!this.searchQuery) return this.files;
            const q = this.searchQuery.toLowerCase();
            return this.files.filter(f => f.path.toLowerCase().includes(q));
        }

        render() {
            const { contentEl } = this;
            contentEl.empty();

            const totalBytes = this.files.reduce((acc, f) => acc + (f.stat?.size || 0), 0);

            // --- Header ---
            const header = contentEl.createDiv({ attr: { style: 'margin-bottom: 16px;' } });
            header.createEl('h2', { 
                text: 'Orphaned Images', 
                attr: { style: 'margin: 0 0 6px 0;' } 
            });
            header.createEl('p', {
                text: `Found ${this.files.length} unreferenced image${this.files.length === 1 ? '' : 's'} (${formatBytes(totalBytes)}).`,
                attr: { style: 'color: var(--text-muted); margin: 0;' }
            });

            // --- Controls Row: Search & Actions ---
            const controlsRow = contentEl.createDiv({
                attr: {
                    style: 'display: flex; gap: 10px; align-items: center; justify-content: space-between; flex-wrap: wrap; margin-bottom: 12px;'
                }
            });

            // Search input
            const searchInput = controlsRow.createEl('input', {
                type: 'search',
                placeholder: 'Filter by filename or path...',
                value: this.searchQuery,
                attr: {
                    style: 'flex: 1; min-width: 200px; padding: 6px 10px; border-radius: 4px; border: 1px solid var(--background-modifier-border); background: var(--background-primary); color: var(--text-normal);'
                }
            });
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.trim();
                this.renderList();
            });

            // Action Buttons
            const btnGroup = controlsRow.createDiv({ attr: { style: 'display: flex; gap: 8px;' } });

            // "Export Report" Button
            const exportBtn = btnGroup.createEl('button', { text: '📝 Create Note' });
            exportBtn.title = 'Creates a markdown file with links and previews of these images';
            exportBtn.addEventListener('click', async () => {
                await this.exportToNote();
            });

            // "Select / Deselect All" Button
            const selectAllBtn = btnGroup.createEl('button', { text: 'Toggle All' });
            selectAllBtn.addEventListener('click', () => {
                const currentFiltered = this.getFilteredFiles();
                const allSelected = currentFiltered.every(f => this.selected.has(f.path));
                if (allSelected) {
                    currentFiltered.forEach(f => this.selected.delete(f.path));
                } else {
                    currentFiltered.forEach(f => this.selected.add(f.path));
                }
                this.render();
            });

            // "Delete Selected" Button
            const deleteBtn = btnGroup.createEl('button', {
                text: `🗑️ Delete Selected (${this.selected.size})`,
                attr: {
                    style: this.selected.size > 0 
                        ? 'background-color: var(--text-error); color: var(--text-on-accent);' 
                        : 'opacity: 0.6;'
                }
            });
            deleteBtn.disabled = this.selected.size === 0;
            deleteBtn.addEventListener('click', async () => {
                if (this.selected.size === 0) return;
                await this.deleteSelected();
            });

            // --- Scrollable Image List Container ---
            this.listContainer = contentEl.createDiv({
                attr: {
                    style: 'max-height: 55vh; overflow-y: auto; border: 1px solid var(--background-modifier-border); border-radius: 6px; padding: 4px;'
                }
            });

            this.renderList();
        }

        renderList() {
            this.listContainer.empty();
            const filtered = this.getFilteredFiles();

            if (filtered.length === 0) {
                this.listContainer.createEl('p', {
                    text: 'No images match the current filter.',
                    attr: { style: 'text-align: center; color: var(--text-muted); padding: 20px 0;' }
                });
                return;
            }

            for (const file of filtered) {
                const row = this.listContainer.createDiv({
                    attr: {
                        style: 'display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; border-bottom: 1px solid var(--background-modifier-border); gap: 12px;'
                    }
                });

                // Left side: Checkbox + Thumbnail + Details
                const leftGroup = row.createDiv({
                    attr: { style: 'display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1;' }
                });

                // Checkbox
                const cb = leftGroup.createEl('input', { type: 'checkbox' });
                cb.checked = this.selected.has(file.path);
                cb.addEventListener('change', () => {
                    if (cb.checked) this.selected.add(file.path);
                    else this.selected.delete(file.path);
                    this.render();
                });

                // Thumbnail
                const img = leftGroup.createEl('img', {
                    attr: {
                        src: this.app.vault.getResourcePath(file),
                        loading: 'lazy',
                        style: 'width: 42px; height: 42px; object-fit: cover; border-radius: 4px; border: 1px solid var(--background-modifier-border); flex-shrink: 0;'
                    }
                });

                // File Path & Size
                const textGroup = leftGroup.createDiv({ attr: { style: 'min-width: 0; overflow: hidden;' } });
                const nameEl = textGroup.createEl('div', {
                    text: file.name,
                    attr: { style: 'font-weight: 500; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;' }
                });
                nameEl.title = file.name;

                textGroup.createEl('div', {
                    text: `${file.parent?.path === '/' ? '' : file.parent.path + ' • '}${formatBytes(file.stat?.size)}`,
                    attr: { style: 'font-size: 11px; color: var(--text-muted); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;' }
                });

                // Right side: Single Action Buttons
                const actions = row.createDiv({ attr: { style: 'display: flex; gap: 6px; flex-shrink: 0;' } });

                // Open Preview button
                const openBtn = actions.createEl('button', {
                    text: '↗',
                    attr: { title: 'Open image in new tab', style: 'padding: 4px 8px; font-size: 12px;' }
                });
                openBtn.addEventListener('click', () => {
                    this.app.workspace.getLeaf(true).openFile(file);
                });

                // Single delete button
                const singleDelBtn = actions.createEl('button', {
                    text: '✕',
                    attr: { title: 'Move to System Trash', style: 'padding: 4px 8px; font-size: 12px; color: var(--text-error);' }
                });
                singleDelBtn.addEventListener('click', async () => {
                    await this.deleteSingle(file);
                });
            }
        }

        async deleteSingle(file) {
            const confirmed = confirm(`Move "${file.name}" to system trash?`);
            if (!confirmed) return;

            try {
                await this.app.vault.trash(file, true);
                this.files = this.files.filter(f => f.path !== file.path);
                this.selected.delete(file.path);
                new Notice(`Deleted: ${file.name}`);
                if (this.files.length === 0) {
                    this.close();
                    new Notice('All orphaned images cleaned!');
                } else {
                    this.render();
                }
            } catch (err) {
                new Notice(`Failed to delete ${file.name}`);
                console.error(err);
            }
        }

        async deleteSelected() {
            const count = this.selected.size;
            const confirmed = confirm(`Move ${count} image${count === 1 ? '' : 's'} to the system trash?`);
            if (!confirmed) return;

            let deletedCount = 0;
            const toDelete = this.files.filter(f => this.selected.has(f.path));

            for (const file of toDelete) {
                try {
                    await this.app.vault.trash(file, true);
                    deletedCount++;
                } catch (err) {
                    console.error(`Failed to delete ${file.path}:`, err);
                }
            }

            new Notice(`Moved ${deletedCount} image(s) to system trash.`);
            this.files = this.files.filter(f => !this.selected.has(f.path));
            this.selected.clear();

            if (this.files.length === 0) {
                this.close();
                new Notice('🎉 All orphaned images cleaned!');
            } else {
                this.render();
            }
        }

        async exportToNote() {
            const now = new Date();
            const dateStr = now.toISOString().split('T')[0];
            const fileName = `Orphaned Images Report (${dateStr}).md`;

            let content = `# Orphaned Images Report\n`;
            content += `Generated on **${now.toLocaleString()}**\n\n`;
            content += `Total Orphaned Images: **${this.files.length}**\n\n`;
            content += `| Preview | File | Folder | Size |\n`;
            content += `| :---: | :--- | :--- | :--- |\n`;

            for (const file of this.files) {
                const folder = file.parent?.path === '/' ? '/' : file.parent.path;
                content += `| ![[${file.path}|40]] | [[${file.path}\\|${file.name}]] | \`${folder}\` | ${formatBytes(file.stat?.size)} |\n`;
            }

            try {
                let note = this.app.vault.getAbstractFileByPath(fileName);
                if (!note) {
                    note = await this.app.vault.create(fileName, content);
                } else {
                    await this.app.vault.modify(note, content);
                }
                new Notice(`Report saved to ${fileName}`);
                await this.app.workspace.getLeaf(true).openFile(note);
            } catch (err) {
                new Notice('Failed to create report note.');
                console.error(err);
            }
        }

        onClose() {
            this.contentEl.empty();
        }
    }

    // Open the modal
    new OrphanedImagesModal(app, orphanedImages).open();
};