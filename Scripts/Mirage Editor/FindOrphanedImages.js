const fs = require('fs');
const path = require('path');
const { shell } = require('electron');

module.exports = async ({ app, vault, workspace }) => {
    if (!vault.isOpen() || !vault.path) {
        app.notify({ title: 'Orphaned Images', body: 'No vault currently open.', type: 'warning' });
        return;
    }

    const IMAGE_EXTS = new Set(['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'webp', 'avif', 'ico', 'tiff']);

    function formatBytes(bytes) {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    // Step 1: Discover all image files in vault
    const allVaultFiles = vault.listFiles();
    const imageFiles = [];

    for (const relPath of allVaultFiles) {
        const ext = path.extname(relPath).replace(/^\./, '').toLowerCase();
        if (IMAGE_EXTS.has(ext)) {
            const fullPath = path.join(vault.path, relPath);
            let size = 0;
            try {
                size = fs.statSync(fullPath).size;
            } catch (_) {}

            imageFiles.push({
                relPath: relPath.replace(/\\/g, '/'),
                name: path.basename(relPath),
                fullPath,
                size,
                ext,
            });
        }
    }

    if (imageFiles.length === 0) {
        app.notify({ title: 'Orphaned Images', body: 'No images found in the vault.', type: 'info' });
        return;
    }

    app.notify({ title: 'Orphaned Images', body: `Scanning vault for references across ${imageFiles.length} images...`, type: 'info', duration: 2000 });

    // Step 2: Build a reference lookup set from Markdown and Canvas notes
    const referencedTargets = new Set();

    // Regexes for image references
    const wikiRegex = /(?:!\[\[|\[\[)([^|\]\n]+)(?:\|[^\]\n]+)?\]\]/g;
    const mdImgRegex = /!\[[^\]]*\]\(([^)\n]+)\)/g;
    const htmlImgRegex = /<img[^>]+src=["']([^"']+)["']/gi;

    for (const relPath of allVaultFiles) {
        const ext = path.extname(relPath).toLowerCase();

        // 1. Scan Markdown files
        if (ext === '.md' || ext === '.mdenc') {
            try {
                const content = vault.readFile(relPath);
                
                let match;
                while ((match = wikiRegex.exec(content)) !== null) {
                    const raw = match[1].split('#')[0].trim().toLowerCase();
                    if (raw) referencedTargets.add(decodeURIComponent(raw));
                }
                while ((match = mdImgRegex.exec(content)) !== null) {
                    const clean = match[1].split('?')[0].split('#')[0].trim().toLowerCase();
                    if (clean) referencedTargets.add(decodeURIComponent(clean));
                }
                while ((match = htmlImgRegex.exec(content)) !== null) {
                    const clean = match[1].split('?')[0].split('#')[0].trim().toLowerCase();
                    if (clean) referencedTargets.add(decodeURIComponent(clean));
                }
            } catch (_) {}
        }

        // 2. Scan Canvas files if present
        if (ext === '.canvas') {
            try {
                const content = vault.readFile(relPath);
                const data = JSON.parse(content);
                if (Array.isArray(data?.nodes)) {
                    for (const node of data.nodes) {
                        if (node.type === 'file' && node.file) {
                            referencedTargets.add(node.file.toLowerCase());
                        }
                        if (node.type === 'text' && node.text) {
                            let match;
                            while ((match = wikiRegex.exec(node.text)) !== null) {
                                const raw = match[1].split('#')[0].trim().toLowerCase();
                                if (raw) referencedTargets.add(decodeURIComponent(raw));
                            }
                        }
                    }
                }
            } catch (_) {}
        }
    }

    // Step 3: Determine which images are unreferenced
    const isImageReferenced = (img) => {
        const normRel = img.relPath.toLowerCase();
        const normName = img.name.toLowerCase();

        if (referencedTargets.has(normRel) || referencedTargets.has(normName)) {
            return true;
        }

        // Check if any referenced target ends with this image name or path
        for (const target of referencedTargets) {
            if (target === normRel || target === normName || target.endsWith('/' + normName)) {
                return true;
            }
        }
        return false;
    };

    let orphaned = imageFiles.filter((img) => !isImageReferenced(img));

    if (orphaned.length === 0) {
        app.notify({ title: 'Orphaned Images', body: '🎉 No orphaned images found! Your vault is clean.', type: 'success' });
        return;
    }

    // Step 4: Mount Interactive Modal in Mirage Editor
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed; inset: 0; background: rgba(0, 0, 0, 0.72);
        backdrop-filter: blur(4px); display: flex; justify-content: center;
        align-items: center; z-index: 10000; user-select: none;
    `;

    const box = document.createElement('div');
    box.className = 'modal-box';
    box.style.cssText = `
        width: 840px; max-width: 94vw; max-height: 88vh; background: #1e1e1e;
        border: 1px solid #333333; border-radius: 8px; box-shadow: 0 24px 60px rgba(0,0,0,0.8);
        display: flex; flex-direction: column; overflow: hidden; padding: 20px 24px;
        box-sizing: border-box; gap: 12px; color: #e0e0e0; font-family: var(--font-interface);
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    let selectedPaths = new Set();
    let searchQuery = '';

    const closeModal = () => {
        window.removeEventListener('keydown', onKeyDown);
        overlay.remove();
    };

    const onKeyDown = (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            closeModal();
        }
    };
    window.addEventListener('keydown', onKeyDown);

    overlay.addEventListener('mousedown', (e) => {
        if (e.target === overlay) closeModal();
    });

    function renderModal() {
        box.innerHTML = '';

        const totalBytes = orphaned.reduce((acc, f) => acc + f.size, 0);

        // --- Top Header ---
        const header = document.createElement('div');
        header.style.cssText = 'display: flex; justify-content: space-between; align-items: flex-start;';
        header.innerHTML = `
            <div>
                <div style="font-size: 16px; font-weight: 700; color: #ffffff;">Orphaned Images</div>
                <div style="font-size: 12px; color: #888888; margin-top: 3px;">
                    Found <strong>${orphaned.length}</strong> unreferenced image${orphaned.length === 1 ? '' : 's'} (${formatBytes(totalBytes)} total).
                </div>
            </div>
            <button class="modal-close-btn" style="background: transparent; border: none; color: #888; cursor: pointer; font-size: 16px;">✕</button>
        `;
        header.querySelector('.modal-close-btn').onclick = closeModal;
        box.appendChild(header);

        // --- Search and Action Controls ---
        const controls = document.createElement('div');
        controls.style.cssText = 'display: flex; gap: 8px; align-items: center; justify-content: space-between; flex-wrap: wrap; margin-top: 4px;';
        controls.innerHTML = `
            <input type="search" class="search-input" placeholder="Filter by filename or folder..." value="${searchQuery}" style="
                flex: 1; min-width: 200px; padding: 7px 10px; background: #141414; border: 1px solid #2e2e2e;
                border-radius: 5px; color: #fff; font-size: 12px; outline: none;
            " />
            <div style="display: flex; gap: 6px; align-items: center;">
                <button class="btn-toggle-all" style="background: transparent; border: 1px solid #383838; color: #ccc; border-radius: 4px; padding: 6px 10px; font-size: 11px; cursor: pointer;">Toggle All</button>
                <button class="btn-create-note" style="background: transparent; border: 1px solid #383838; color: #ccc; border-radius: 4px; padding: 6px 10px; font-size: 11px; cursor: pointer;">📝 Create Note</button>
                <button class="btn-delete-selected" style="
                    background: ${selectedPaths.size > 0 ? '#ff4d4f' : 'rgba(255, 77, 79, 0.2)'};
                    color: ${selectedPaths.size > 0 ? '#fff' : '#888'};
                    border: none; border-radius: 4px; padding: 6px 12px; font-size: 11px; font-weight: 600; cursor: ${selectedPaths.size > 0 ? 'pointer' : 'default'};
                " ${selectedPaths.size === 0 ? 'disabled' : ''}>🗑️ Delete Selected (${selectedPaths.size})</button>
            </div>
        `;

        const searchInput = controls.querySelector('.search-input');
        searchInput.oninput = (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            renderList();
        };

        const toggleAllBtn = controls.querySelector('.btn-toggle-all');
        toggleAllBtn.onclick = () => {
            const currentFiltered = getFilteredFiles();
            const allSelected = currentFiltered.every(f => selectedPaths.has(f.relPath));
            if (allSelected) {
                currentFiltered.forEach(f => selectedPaths.delete(f.relPath));
            } else {
                currentFiltered.forEach(f => selectedPaths.add(f.relPath));
            }
            renderModal();
        };

        const createNoteBtn = controls.querySelector('.btn-create-note');
        createNoteBtn.onclick = () => exportToReportNote();

        const deleteSelectedBtn = controls.querySelector('.btn-delete-selected');
        deleteSelectedBtn.onclick = () => deleteSelectedImages();

        box.appendChild(controls);

        // --- Scrollable List Container ---
        const listContainer = document.createElement('div');
        listContainer.className = 'image-list-container';
        listContainer.style.cssText = `
            flex: 1; overflow-y: auto; border: 1px solid #282828; border-radius: 6px;
            background: #161616; padding: 4px; min-height: 240px; max-height: 54vh;
        `;
        box.appendChild(listContainer);

        function getFilteredFiles() {
            if (!searchQuery) return orphaned;
            return orphaned.filter(f => f.relPath.toLowerCase().includes(searchQuery));
        }

        function renderList() {
            listContainer.innerHTML = '';
            const filtered = getFilteredFiles();

            if (filtered.length === 0) {
                listContainer.innerHTML = `<div style="text-align: center; color: #666; padding: 32px 0; font-size: 12px;">No images match your filter.</div>`;
                return;
            }

            filtered.forEach(file => {
                const row = document.createElement('div');
                row.style.cssText = `
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 6px 10px; border-bottom: 1px solid #222; gap: 12px;
                `;

                // Left: Checkbox + Thumbnail + Meta
                const left = document.createElement('div');
                left.style.cssText = 'display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1;';

                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.checked = selectedPaths.has(file.relPath);
                cb.style.cursor = 'pointer';
                cb.onchange = () => {
                    if (cb.checked) selectedPaths.add(file.relPath);
                    else selectedPaths.delete(file.relPath);
                    renderModal();
                };

                const thumb = document.createElement('img');
                thumb.src = `file://${file.fullPath}`;
                thumb.loading = 'lazy';
                thumb.style.cssText = 'width: 42px; height: 42px; object-fit: cover; border-radius: 4px; border: 1px solid #333; flex-shrink: 0;';

                const meta = document.createElement('div');
                meta.style.cssText = 'min-width: 0; overflow: hidden;';
                meta.innerHTML = `
                    <div style="font-size: 12px; font-weight: 600; color: #fff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="${file.name}">${file.name}</div>
                    <div style="font-size: 11px; color: #777; font-family: var(--font-mono); margin-top: 2px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                        ${path.dirname(file.relPath) === '.' ? 'root' : path.dirname(file.relPath)} • ${formatBytes(file.size)}
                    </div>
                `;

                left.appendChild(cb);
                left.appendChild(thumb);
                left.appendChild(meta);

                // Right: Open button & Trash button
                const right = document.createElement('div');
                right.style.cssText = 'display: flex; gap: 6px; align-items: center; flex-shrink: 0;';

                const openBtn = document.createElement('button');
                openBtn.textContent = '↗';
                openBtn.title = 'Open image in tab';
                openBtn.style.cssText = 'background: transparent; border: 1px solid #333; color: #aaa; border-radius: 3px; padding: 4px 8px; font-size: 11px; cursor: pointer;';
                openBtn.onclick = () => {
                    if (typeof workspace.fileOpener === 'function') {
                        workspace.fileOpener(file.relPath);
                    }
                };

                const delBtn = document.createElement('button');
                delBtn.textContent = '✕';
                delBtn.title = 'Move to System Trash';
                delBtn.style.cssText = 'background: transparent; border: 1px solid rgba(255, 77, 79, 0.4); color: #ff6b6b; border-radius: 3px; padding: 4px 8px; font-size: 11px; cursor: pointer;';
                delBtn.onclick = () => deleteSingleImage(file);

                right.appendChild(openBtn);
                right.appendChild(delBtn);

                row.appendChild(left);
                row.appendChild(right);
                listContainer.appendChild(row);
            });
        }

        renderList();
        setTimeout(() => searchInput.focus(), 20);
    }

    async function deleteSingleImage(file) {
        if (!confirm(`Move "${file.name}" to the system trash?`)) return;

        try {
            await shell.trashItem(file.fullPath);
            app.cache.deleteFile(file.relPath);
            app.events.emit('file-deleted', file.relPath);

            orphaned = orphaned.filter(f => f.relPath !== file.relPath);
            selectedPaths.delete(file.relPath);

            app.notify({ title: 'Moved to Trash', body: `"${file.name}" moved to trash.`, type: 'info' });

            if (orphaned.length === 0) {
                closeModal();
                app.notify({ title: 'Cleaned', body: 'All orphaned images removed!', type: 'success' });
            } else {
                renderModal();
            }
        } catch (err) {
            app.notify({ title: 'Error', body: `Could not delete ${file.name}: ${err.message}`, type: 'error' });
        }
    }

    async function deleteSelectedImages() {
        const count = selectedPaths.size;
        if (!confirm(`Move ${count} selected image${count === 1 ? '' : 's'} to the system trash?`)) return;

        const toDelete = orphaned.filter(f => selectedPaths.has(f.relPath));
        let deletedCount = 0;

        for (const file of toDelete) {
            try {
                await shell.trashItem(file.fullPath);
                app.cache.deleteFile(file.relPath);
                app.events.emit('file-deleted', file.relPath);
                deletedCount++;
            } catch (err) {
                console.error(`Failed to trash ${file.relPath}:`, err);
            }
        }

        orphaned = orphaned.filter(f => !selectedPaths.has(f.relPath));
        selectedPaths.clear();

        app.notify({ title: 'Moved to Trash', body: `Moved ${deletedCount} image(s) to system trash.`, type: 'info' });

        if (orphaned.length === 0) {
            closeModal();
            app.notify({ title: 'Cleaned', body: '🎉 All orphaned images cleaned!', type: 'success' });
        } else {
            renderModal();
        }
    }

    async function exportToReportNote() {
        const now = new Date();
        const pad = (n) => String(n).padStart(2, '0');
        const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        const fileName = `Orphaned Images Report (${dateStr}).md`;

        let content = `# Orphaned Images Report\n`;
        content += `Generated on **${now.toLocaleString()}**\n\n`;
        content += `Total Orphaned Images: **${orphaned.length}**\n\n`;
        content += `| Preview | File | Folder | Size |\n`;
        content += `| :---: | :--- | :--- | :--- |\n`;

        for (const file of orphaned) {
            const folder = path.dirname(file.relPath) === '.' ? '/' : path.dirname(file.relPath);
            content += `| ![[${file.relPath}|40]] | [[${file.relPath}\\|${file.name}]] | \`${folder}\` | ${formatBytes(file.size)} |\n`;
        }

        try {
            vault.writeFile(fileName, content);
            app.cache.updateFile(fileName, content);
            app.events.emit('file-modified', fileName);

            app.notify({ title: 'Report Created', body: `Saved report to "${fileName}".`, type: 'success' });

            if (typeof workspace.fileOpener === 'function') {
                workspace.fileOpener(fileName);
            }
            closeModal();
        } catch (err) {
            app.notify({ title: 'Export Failed', body: err?.message || String(err), type: 'error' });
        }
    }

    renderModal();
};