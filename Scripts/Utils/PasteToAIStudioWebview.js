// Module-level cache so repeated runs in the webview remember the last image link
let cachedMarkdownSnippet = "";

module.exports = async (params) => {
    const { app, obsidian } = params;
    const { Notice, TFile } = obsidian;
    const { clipboard, nativeImage } = require("electron");

    // 1. Strictly locate the ACTIVE Google AI Studio <webview>
    function getActiveWebview() {
        // Strategy A: Check the currently active leaf
        const activeLeaf = app.workspace.activeLeaf;
        if (activeLeaf?.view?.containerEl) {
            const wv = activeLeaf.view.containerEl.querySelector("webview");
            if (wv) return wv;
        }

        // Strategy B: Check if focus is already on or inside a webview
        if (document.activeElement?.tagName === "WEBVIEW") {
            return document.activeElement;
        }
        const focusedWv = document.activeElement?.closest?.("webview");
        if (focusedWv) return focusedWv;

        // Strategy C: Check the active tab container (.mod-active)
        const activeLeafEl = document.querySelector(".workspace-leaf.mod-active");
        if (activeLeafEl) {
            const wv = activeLeafEl.querySelector("webview");
            if (wv) return wv;
        }

        // Strategy D: Pick the visible webview on screen (ignoring inactive/hidden background tabs)
        const visibleWebviews = Array.from(document.querySelectorAll("webview")).filter(w => {
            return w.offsetParent !== null && !w.closest(".is-hidden, [style*='display: none']");
        });

        const aiStudioWv = visibleWebviews.find(w => {
            const src = (w.getAttribute("src") || w.src || "").toLowerCase();
            return src.includes("aistudio") || src.includes("google");
        });

        return aiStudioWv || visibleWebviews[0] || null;
    }

    const targetWebview = getActiveWebview();
    if (!targetWebview) {
        new Notice("No active Google AI Studio webview found.");
        return;
    }

    // 2. Read source text from clipboard (or fallback to editor / cache)
    let sourceText = "";
    const activeLeaf = app.workspace.activeLeaf;
    if (activeLeaf && activeLeaf.view?.getViewType?.() === "markdown") {
        const editor = activeLeaf.view.editor;
        sourceText = editor.getSelection();
        if (!sourceText || sourceText.trim() === "") {
            const cursor = editor.getCursor();
            sourceText = editor.getLine(cursor.line);
        }
    }

    if (!sourceText || sourceText.trim() === "") {
        sourceText = clipboard.readText();
    }

    // Fallback: If clipboard was previously cleaned, use cached snippet
    if ((!sourceText || !sourceText.includes("![[")) && cachedMarkdownSnippet) {
        sourceText = cachedMarkdownSnippet;
    }

    if (!sourceText || sourceText.trim() === "") {
        new Notice("No text selected and clipboard is empty.");
        return;
    }

    const originalTextToRestore = sourceText;

    // 3. Extract image links
    const images = [];

    const wikiRegex = /!\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g;
    let match;
    while ((match = wikiRegex.exec(sourceText)) !== null) {
        images.push({
            raw: match[0],
            link: match[1].trim()
        });
    }

    const mdRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    while ((match = mdRegex.exec(sourceText)) !== null) {
        let rawTarget = match[2].trim();
        if (rawTarget.startsWith("<") && rawTarget.endsWith(">")) {
            rawTarget = rawTarget.slice(1, -1);
        }
        const cleanTarget = rawTarget.split(/\s+["']/)[0].trim();
        images.push({
            raw: match[0],
            link: decodeURIComponent(cleanTarget)
        });
    }

    if (images.length > 0) {
        cachedMarkdownSnippet = sourceText;
    }

    // 4. Resolve image file(s) from the vault
    const resolvedImages = [];
    const activeFile = app.workspace.getActiveFile();
    const sourcePath = activeFile ? activeFile.path : "";

    function resolveImageFile(link) {
        let file = app.metadataCache.getFirstLinkpathDest(link, sourcePath);
        if (file instanceof TFile) return file;

        file = app.vault.getAbstractFileByPath(link);
        if (file instanceof TFile) return file;

        const fileName = link.split("/").pop().toLowerCase();
        file = app.vault.getFiles().find(f => f.name.toLowerCase() === fileName);
        if (file) return file;

        return null;
    }

    for (const item of images) {
        const tfile = resolveImageFile(item.link);
        if (tfile) {
            try {
                const arrayBuffer = await app.vault.readBinary(tfile);
                const buffer = Buffer.from(arrayBuffer);
                const nImg = nativeImage.createFromBuffer(buffer);
                if (!nImg.isEmpty()) {
                    resolvedImages.push({ ...item, nImg });
                }
            } catch (err) {
                console.error("[PasteToAIStudio] Error reading image binary:", err);
            }
        }
    }

    // 5. Clean prompt text (removes the ![[...]] link and empty bullet dashes)
    let cleanText = sourceText;
    for (const item of images) {
        cleanText = cleanText.split(item.raw).join("");
    }
    cleanText = cleanText.replace(/^\s*[-*+]\s*$/gm, "").replace(/\n{3,}/g, "\n\n").trim();

    // 6. Focus the active webview
    targetWebview.focus();

    // 7. Find and focus Google AI Studio's Chat Query Box in this active webview
    await targetWebview.executeJavaScript(`
        (() => {
            function findChatInput(root = document) {
                const specificSelectors = [
                    'ms-prompt-box textarea',
                    'ms-autosize-textarea textarea',
                    'footer textarea',
                    'textarea[aria-label*="Type something" i]',
                    'textarea[aria-label*="Enter a prompt" i]',
                    'textarea[placeholder*="Start typing" i]',
                    'textarea[placeholder*="prompt" i]',
                    'textarea.textarea'
                ];

                for (const sel of specificSelectors) {
                    const el = root.querySelector(sel);
                    if (el && el.offsetParent !== null && !el.disabled) {
                        return el;
                    }
                }

                // Check Shadow DOM if present
                const customContainers = root.querySelectorAll('ms-prompt-box, ms-autosize-textarea, footer');
                for (const container of customContainers) {
                    if (container.shadowRoot) {
                        const el = findChatInput(container.shadowRoot);
                        if (el) return el;
                    }
                }

                // Fallback to the bottom-most visible textarea (ignoring System Instructions)
                const all = Array.from(root.querySelectorAll('textarea')).filter(el => {
                    const label = (el.getAttribute('aria-label') || '').toLowerCase();
                    const placeholder = (el.getAttribute('placeholder') || '').toLowerCase();
                    const isSystem = label.includes('system') || placeholder.includes('system');
                    return !isSystem && el.offsetParent !== null && !el.disabled;
                });

                return all.length > 0 ? all[all.length - 1] : null;
            }

            const input = findChatInput();
            if (input) {
                input.scrollIntoView({ block: 'nearest', behavior: 'instant' });
                const container = input.closest('ms-prompt-box, ms-autosize-textarea, footer');
                if (container) container.click();

                input.focus();
                input.click();
                input.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                input.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                input.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                input.focus();

                if (typeof input.setSelectionRange === 'function') {
                    const len = input.value.length;
                    input.setSelectionRange(len, len);
                }
                return true;
            }
            return false;
        })()
    `).catch(() => {});

    // Micro-delay so layout tree finishes focusing
    await new Promise(resolve => setTimeout(resolve, 40));

    // 8. Fast Paste: Image first, 75ms micro-delay, then Text
    try {
        if (resolvedImages.length > 0) {
            for (const img of resolvedImages) {
                clipboard.writeImage(img.nImg);
                targetWebview.paste();
                await new Promise(resolve => setTimeout(resolve, 75));
            }
        }

        if (cleanText.length > 0) {
            clipboard.writeText(cleanText);
            targetWebview.paste();
            await new Promise(resolve => setTimeout(resolve, 75));
        }
    } finally {
        // 9. Restore original clipboard content for continuous re-pasting
        clipboard.writeText(originalTextToRestore);
    }

    new Notice(resolvedImages.length > 0
        ? `Sent text & ${resolvedImages.length} image(s) to active AI Studio!`
        : "Sent text to active AI Studio!"
    );
};