/**
 * Script Name: Extract Google AI Studio Chat
 * Version: 6.5 (Code-Block Spacing & 4-Space Tab Indentation)
 * Description: Uses Google AI Studio's Raw Mode with natural unbounded sweeping.
 *              Separates consecutive code blocks with blank lines for Live Preview,
 *              enforces 4-space tab indentation, '-' bullets, and clean [1](url) links.
 * Compatibility: Script Runner Plugin for Obsidian (Desktop)
 */

module.exports = async function ({ app, obsidian, secrets }) {
    const { Notice, Platform, normalizePath, TFile } = obsidian;

    console.log("[ExtractGoogleAIStudio] Running Version 6.5 (Code Block Spacing)");

    const CONFIG = {
        folder: 'Private/Clippings/Chats',
        attachmentsFolder: 'Private/Clippings/Chats/- Attachments',
        embedFormat: 'wikilink',                // 'wikilink' (![[img.png]]) or 'markdown' (![img](path))
        bulletMarker: '-',                      // Standard bullet marker ('-')
        listIndentSpaces: 4,                    // 4 spaces per sub-bullet level (Obsidian standard)
        includeFrontmatter: true,
        includeMetadataCallout: true,
        includeSystemInstructions: true,
        openAfterSaving: true
    };

    if (!Platform.isDesktopApp) {
        new Notice('❌ Webview extraction is only supported on Obsidian Desktop.');
        return;
    }

    const webview = findAIStudioWebview();
    if (!webview) {
        new Notice('❌ No active Google AI Studio webview found. Make sure AI Studio is open.');
        return;
    }

    const progressNotice = new Notice('⏳ Extracting conversation via Raw Mode...', 0);

    try {
        const guestRawModeExtractor = async function (bulletMarker = '-', indentSize = 4) {
            try {
                const url = window.location.href;
                if (!window.location.hostname.includes('aistudio.google.com')) {
                    return { error: 'The active tab is not Google AI Studio (aistudio.google.com).' };
                }

                // 1. Locate the Active Scrollable Viewport
                function getScroller() {
                    const selectors = [
                        '.virtual-scroll-container',
                        'cdk-virtual-scroll-viewport',
                        'ms-autoscroll-container',
                        'ms-chunk-editor',
                        '.conversation-container',
                        'main'
                    ];
                    for (const sel of selectors) {
                        const el = document.querySelector(sel);
                        if (el && el.scrollHeight > el.clientHeight + 40) return el;
                    }
                    const all = document.querySelectorAll('*');
                    for (const el of all) {
                        if (el.scrollHeight > el.clientHeight + 80) {
                            const overflow = window.getComputedStyle(el).overflowY;
                            if (overflow === 'auto' || overflow === 'scroll') return el;
                        }
                    }
                    return document.scrollingElement || document.documentElement;
                }

                // 2. Mode Detection & Toggling Helpers
                function detectCurrentMode() {
                    const firstTurn = document.querySelector('ms-chat-turn');
                    if (firstTurn) {
                        const hasRaw = firstTurn.querySelector('.very-large-text-container');
                        const hasCmark = firstTurn.querySelector('ms-cmark-node');
                        if (hasRaw && !hasCmark) return 'raw';
                        if (hasCmark && !hasRaw) return 'rendered';
                    }
                    return 'rendered';
                }

                async function toggleRawMode() {
                    const directBtn = document.querySelector('button[data-test-raw-mode]');
                    if (directBtn) {
                        directBtn.click();
                        await new Promise(r => setTimeout(r, 200));
                        return true;
                    }

                    const moreBtn = document.querySelector([
                        '.toolbar-right button[aria-label="View more actions"]',
                        'button[aria-label="View more actions"]',
                        'button[aria-label="More options"]',
                        'button[iconname="more_vert"]',
                        'header button:has(mat-icon)',
                        '.main-header button:has(mat-icon)'
                    ].join(', '));

                    let targetBtn = moreBtn;
                    if (!targetBtn) {
                        const allBtns = Array.from(document.querySelectorAll('header button, .toolbar button, .top-bar button'));
                        targetBtn = allBtns.find(b => (b.textContent || '').includes('more_vert'));
                    }

                    if (!targetBtn) return false;

                    targetBtn.click();
                    await new Promise(r => setTimeout(r, 120));

                    const menuItems = Array.from(document.querySelectorAll(
                        '.cdk-overlay-container [role="menuitem"], .mat-mdc-menu-item, .mat-menu-item'
                    ));

                    const rawItem = menuItems.find(it => (it.textContent || '').toLowerCase().includes('raw mode'));
                    if (rawItem) {
                        rawItem.click();
                        await new Promise(r => setTimeout(r, 350));
                        return true;
                    }

                    const backdrop = document.querySelector('.cdk-overlay-backdrop');
                    if (backdrop) backdrop.click();

                    return false;
                }

                // 3. Extract Metadata
                let title = '';
                const titleInput = document.querySelector('input.prompt-title-input, input[aria-label*="Prompt name"], input[aria-label*="title" i]');
                if (titleInput && titleInput.value) title = titleInput.value.trim();
                if (!title) {
                    const titleHeader = document.querySelector('.prompt-name, h1, [data-testid="prompt-title"]');
                    if (titleHeader) title = titleHeader.textContent.trim();
                }
                if (!title) {
                    title = document.title.replace(/ – Google AI Studio$/, '').replace(/ - Google AI Studio$/, '').trim();
                }
                if (!title || title === 'Google AI Studio') {
                    title = 'AI Studio Prompt ' + new Date().toISOString().slice(0, 10);
                }

                let modelName = '';
                const modelPicker = document.querySelector('ms-model-switcher, [aria-label*="model" i], .model-select-button, mat-select[aria-label*="Model" i]');
                if (modelPicker) {
                    modelName = modelPicker.textContent.trim().split('\n')[0].trim();
                }

                let systemInstruction = '';
                const sysInput = document.querySelector('textarea[aria-label*="System instruction" i], ms-system-instructions textarea');
                if (sysInput) {
                    systemInstruction = sysInput.value || sysInput.textContent || '';
                }

                // 4. Ensure We Are in Raw Mode
                const initialMode = detectCurrentMode();
                let switchedMode = false;

                if (initialMode === 'rendered') {
                    switchedMode = await toggleRawMode();
                }

                // 5. Stack-Based List Normalizer (4-space tabs & strict '-')
                function normalizeListStructure(text, targetMarker = '-', spacesPerLevel = 4) {
                    if (!text) return '';

                    const parts = text.split(/(```[\s\S]*?```)/g);

                    for (let i = 0; i < parts.length; i += 2) {
                        let segment = parts[i];

                        // Prevent blank lines from detaching parent items from indented sub-items
                        segment = segment.replace(/(^|\n)([ \t]*[-*+]\s+[^\n]+)\n\n+([ \t]+[-*+]\s+)/g, '$1$2\n$3');

                        const lines = segment.split('\n');
                        let indentStack = [];

                        for (let j = 0; j < lines.length; j++) {
                            const line = lines[j];

                            if (/^[ \t]*[*-_]{3,}[ \t]*$/.test(line)) {
                                indentStack = [];
                                continue;
                            }

                            const bulletMatch = line.match(/^([ \t]*)([*+-])\s+(.*)$/);
                            if (bulletMatch) {
                                const rawSpaces = bulletMatch[1].replace(/\t/g, '    ').length;

                                let level = 0;
                                if (rawSpaces === 0) {
                                    indentStack = [0];
                                    level = 0;
                                } else {
                                    if (indentStack.length === 0 || rawSpaces > indentStack[indentStack.length - 1]) {
                                        indentStack.push(rawSpaces);
                                        level = indentStack.length - 1;
                                    } else {
                                        while (indentStack.length > 1 && rawSpaces < indentStack[indentStack.length - 1]) {
                                            indentStack.pop();
                                        }
                                        level = indentStack.length - 1;
                                    }
                                }

                                const newIndent = ' '.repeat(level * spacesPerLevel);
                                lines[j] = `${newIndent}${targetMarker} ${bulletMatch[3]}`;
                                continue;
                            }

                            const numMatch = line.match(/^([ \t]*)(\d+[.)])\s+(.*)$/);
                            if (numMatch) {
                                const rawSpaces = numMatch[1].replace(/\t/g, '    ').length;

                                let level = 0;
                                if (rawSpaces === 0) {
                                    indentStack = [0];
                                    level = 0;
                                } else {
                                    if (indentStack.length === 0 || rawSpaces > indentStack[indentStack.length - 1]) {
                                        indentStack.push(rawSpaces);
                                        level = indentStack.length - 1;
                                    } else {
                                        while (indentStack.length > 1 && rawSpaces < indentStack[indentStack.length - 1]) {
                                            indentStack.pop();
                                        }
                                        level = indentStack.length - 1;
                                    }
                                }

                                const newIndent = ' '.repeat(level * spacesPerLevel);
                                lines[j] = `${newIndent}${numMatch[2]} ${numMatch[3]}`;
                                continue;
                            }

                            if (!line.trim()) continue;

                            if (indentStack.length > 0) {
                                const contMatch = line.match(/^([ \t]+)(.*)$/);
                                if (contMatch) {
                                    const currentLevel = indentStack.length - 1;
                                    const newIndent = ' '.repeat(currentLevel * spacesPerLevel + 2);
                                    lines[j] = `${newIndent}${contMatch[2]}`;
                                } else {
                                    indentStack = [];
                                }
                            }
                        }

                        parts[i] = lines.join('\n');
                    }

                    return parts.join('');
                }

                // 6. Raw Text Extraction Functions
                function getRawTextFromContainer(container) {
                    if (!container) return '';
                    const ta = container.querySelector('textarea');
                    if (ta && ta.value && ta.value.trim()) return ta.value.trim();

                    const rawBox = container.querySelector('.very-large-text-container');
                    if (rawBox) {
                        return (rawBox.innerText || rawBox.textContent || '').trim();
                    }

                    return (container.innerText || container.textContent || '').trim();
                }

                function cleanRawMarkdown(text) {
                    if (!text) return '';
                    let t = text.replace(/\r\n/g, '\n');

                    // Remove UI icon remnants
                    t = t.replace(/\b(?:more_vert|edit|branch|delete|copy)\b/g, '');

                    // Normalize citations into clean [1](url) format
                    t = t.replace(/\[\[([^\]\n]+)\]\((https?:\/\/[^\s\)]+)\)\]/g, '[$1]($2)');
                    t = t.replace(/\[\[([^\]\n]+)\]\]\((https?:\/\/[^\s\)]+)\)/g, '[$1]($2)');
                    t = t.replace(/\[\\\[([^\]\n]+)\\\]\]\((https?:\/\/[^\s\)]+)\)/g, '[$1]($2)');

                    // Normalize bullets to '-' and enforce 4-space tab indentation
                    t = normalizeListStructure(t, bulletMarker, indentSize);

                    // Ensure an empty line between consecutive fenced code blocks
                    t = t.replace(/(`{3,}[^\n]*)\n([ \t]*`{3,})/g, '$1\n\n$2');

                    // Ensure Markdown headers have a clean blank line before them
                    t = t.replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2');

                    t = t.replace(/\n{3,}/g, '\n\n');
                    return t.trim();
                }

                function extractUserContent(el) {
                    if (!el) return null;

                    const fileChips = Array.from(el.querySelectorAll('.file-chunk, ms-file-chunk, .attachment-chip, [data-testid*="file"]'));
                    const files = [];
                    for (const chip of fileChips) {
                        const txt = (chip.innerText || '').replace(/\s+/g, ' ').trim();
                        if (txt && !txt.includes('more_vert') && !txt.includes('edit')) files.push(txt);
                    }
                    let filePrefix = '';
                    if (files.length > 0) {
                        filePrefix = '📎 **Attached Files:**\n' + files.map(f => '- `' + f + '`').join('\n') + '\n\n';
                    }

                    let userText = getRawTextFromContainer(el);
                    userText = cleanRawMarkdown(userText);
                    userText = userText.replace(/^(?:User)\s*[•\s]*\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?\s*\n*/gim, '').trim();

                    const full = (filePrefix + userText).trim();
                    return (full && full.length > 2) ? full : null;
                }

                function extractModelContent(el) {
                    if (!el) return null;

                    const textChunks = Array.from(el.querySelectorAll('ms-text-chunk')).filter(
                        tc => !tc.closest('ms-thought-chunk, .thought-container, mat-expansion-panel')
                    );

                    let modelText = '';
                    if (textChunks.length > 0) {
                        modelText = textChunks.map(tc => getRawTextFromContainer(tc)).join('\n\n');
                    } else {
                        const clone = el.cloneNode(true);
                        clone.querySelectorAll(
                            'ms-thought-chunk, .thought-container, mat-expansion-panel, .turn-header, ms-chat-turn-header, header, button, mat-icon, ms-user-avatar, svg, .actions-container, .toolbar'
                        ).forEach(e => e.remove());
                        modelText = getRawTextFromContainer(clone);
                    }

                    modelText = cleanRawMarkdown(modelText);
                    modelText = modelText.replace(/^(?:Model)\s*[•\s]*\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?\s*\n*/gim, '').trim();

                    return (modelText && modelText.length > 2) ? modelText : null;
                }

                // 7. Sequential Harvesting Loop
                const scroller = getScroller();
                const originalScrollTop = scroller.scrollTop;

                const turns = [];
                const seenFingerprints = new Set();

                function addTurn(role, text) {
                    if (!text || text.length < 3) return;
                    const fingerprint = role + '::' + text.slice(0, 140).replace(/\s+/g, ' ');
                    if (seenFingerprints.has(fingerprint)) return;

                    seenFingerprints.add(fingerprint);
                    turns.push({ role, text });
                }

                function harvestVisibleTurns() {
                    const chatTurns = Array.from(document.querySelectorAll('ms-chat-turn'));

                    for (const turnEl of chatTurns) {
                        const userContainer = turnEl.querySelector('.chat-turn-container.user, ms-chat-turn-user-content, [data-turn-role="User"]');
                        const modelContainer = turnEl.querySelector('.chat-turn-container.model, ms-chat-turn-model-content, [data-turn-role="Model"]');

                        if (userContainer) {
                            const uText = extractUserContent(userContainer);
                            if (uText) addTurn('User', uText);
                        }

                        if (modelContainer) {
                            const mText = extractModelContent(modelContainer);
                            if (mText) addTurn('Model', mText);
                        }

                        if (!userContainer && !modelContainer) {
                            const isUser = turnEl.querySelector('button[aria-label*="edit" i]') !== null ||
                                           turnEl.classList.contains('user') ||
                                           turnEl.getAttribute('data-turn-role') === 'User';

                            if (isUser) {
                                const uText = extractUserContent(turnEl);
                                if (uText) addTurn('User', uText);
                            } else {
                                const mText = extractModelContent(turnEl);
                                if (mText) addTurn('Model', mText);
                            }
                        }
                    }
                }

                // 8. Unbounded Monotonic Sweep
                if (scroller && scroller.scrollHeight > scroller.clientHeight) {
                    scroller.scrollTop = 0;
                    await new Promise(r => setTimeout(r, 300));
                    harvestVisibleTurns();

                    const step = Math.max(scroller.clientHeight * 0.7, 400);
                    let current = 0;
                    let lastScroll = -1;
                    let stallCount = 0;

                    while (true) {
                        if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 10) {
                            break;
                        }

                        current += step;
                        scroller.scrollTop = current;
                        await new Promise(r => setTimeout(r, 150));
                        harvestVisibleTurns();

                        if (scroller.scrollTop === lastScroll) {
                            stallCount++;
                            if (stallCount >= 2) break;
                        } else {
                            stallCount = 0;
                            lastScroll = scroller.scrollTop;
                        }
                    }

                    scroller.scrollTop = scroller.scrollHeight;
                    await new Promise(r => setTimeout(r, 200));
                    harvestVisibleTurns();

                    scroller.scrollTop = originalScrollTop;
                } else {
                    harvestVisibleTurns();
                }

                // 9. Restore Previous Mode if Switched
                if (switchedMode) {
                    await toggleRawMode();
                }

                return {
                    success: true,
                    data: {
                        title: title.trim(),
                        model: modelName,
                        url: url,
                        createdAt: new Date().toISOString(),
                        systemInstruction: systemInstruction.trim(),
                        turns: turns
                    },
                    assets: []
                };
            } catch (err) {
                return { error: err.message || String(err) };
            }
        };

        const executionPayload = '(' + guestRawModeExtractor.toString() + ')(' + JSON.stringify(CONFIG.bulletMarker) + ', ' + CONFIG.listIndentSpaces + ')';
        const rawResponse = await webview.executeJavaScript(executionPayload);
        const result = typeof rawResponse === 'string' ? JSON.parse(rawResponse) : rawResponse;

        if (!result || result.error) {
            progressNotice.hide();
            console.error('[ExtractGoogleAIStudio] Raw Mode Extraction Error:', result);
            new Notice(`❌ Extraction Failed: ${result?.error || 'Unknown error'}`);
            return;
        }

        // 10. Ensure Folders Exist
        const notesFolder = normalizePath(CONFIG.folder);
        if (notesFolder && !(await app.vault.adapter.exists(notesFolder))) {
            await ensureFolderRecursive(app, notesFolder);
        }

        // 11. Build & Save Markdown Note
        const mdContent = buildMarkdown(result.data, CONFIG);
        const chatTitle = result.data.title || 'AI Studio Chat';
        const safeTitle = sanitizeFileName(chatTitle);
        const filePath = notesFolder ? `${notesFolder}/${safeTitle}.md` : `${safeTitle}.md`;

        const existingAbstract = app.vault.getAbstractFileByPath(filePath);
        let finalFile;

        if (existingAbstract instanceof TFile) {
            await app.vault.modify(existingAbstract, mdContent);
            finalFile = existingAbstract;
        } else {
            finalFile = await app.vault.create(filePath, mdContent);
        }

        progressNotice.hide();
        new Notice(`✓ Exported: "${finalFile.name}" (${result.data.turns.length} turns)`);

        if (CONFIG.openAfterSaving && finalFile) {
            const leaf = app.workspace.getLeaf('tab');
            await leaf.openFile(finalFile);
        }

    } catch (err) {
        progressNotice.hide();
        console.error('[ExtractGoogleAIStudioChat] Execution Error:', err);
        new Notice(`❌ Error executing extraction: ${err.message}`);
    }

    // --- Helpers ---

    function findAIStudioWebview() {
        const activeLeaf = document.querySelector('.workspace-leaf.mod-active');
        if (activeLeaf) {
            const wv = activeLeaf.querySelector('webview');
            if (wv && getWebviewUrl(wv).includes('aistudio.google.com')) return wv;
        }

        const companionWv = document.querySelector('.kc-floating-container webview');
        if (companionWv && getWebviewUrl(companionWv).includes('aistudio.google.com')) {
            return companionWv;
        }

        const all = Array.from(document.querySelectorAll('webview'));
        const aiStudioViews = all.filter(wv => getWebviewUrl(wv).includes('aistudio.google.com'));

        if (aiStudioViews.length === 1) return aiStudioViews[0];

        for (const wv of aiStudioViews) {
            if (wv.offsetParent !== null && wv.offsetWidth > 0) return wv;
        }

        return aiStudioViews[0] || (all.length === 1 ? all[0] : null);
    }

    function getWebviewUrl(wv) {
        try {
            if (typeof wv.getURL === 'function') {
                const u = wv.getURL();
                if (u) return u;
            }
        } catch (_) {}
        return wv.getAttribute('src') || wv.src || '';
    }

    function sanitizeFileName(name) {
        return name
            .replace(/[\\/:*?"<>|#^[\]]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 100) || 'AI Studio Chat';
    }

    async function ensureFolderRecursive(app, path) {
        const parts = path.split('/');
        let current = '';
        for (const part of parts) {
            current = current ? `${current}/${part}` : part;
            if (!(await app.vault.adapter.exists(current))) {
                await app.vault.createFolder(current);
            }
        }
    }

    function normalizeLists(text, marker = '-', spacesPerLevel = 4) {
        if (!text) return '';
        const parts = text.split(/(```[\s\S]*?```)/g);

        for (let i = 0; i < parts.length; i += 2) {
            let segment = parts[i];
            segment = segment.replace(/(^|\n)([ \t]*[-*+]\s+[^\n]+)\n\n+([ \t]+[-*+]\s+)/g, '$1$2\n$3');

            const lines = segment.split('\n');
            let indentStack = [];

            for (let j = 0; j < lines.length; j++) {
                const line = lines[j];

                if (/^[ \t]*[*-_]{3,}[ \t]*$/.test(line)) {
                    indentStack = [];
                    continue;
                }

                const bulletMatch = line.match(/^([ \t]*)([*+-])\s+(.*)$/);
                if (bulletMatch) {
                    const rawSpaces = bulletMatch[1].replace(/\t/g, '    ').length;
                    let level = 0;

                    if (rawSpaces === 0) {
                        indentStack = [0];
                        level = 0;
                    } else {
                        if (indentStack.length === 0 || rawSpaces > indentStack[indentStack.length - 1]) {
                            indentStack.push(rawSpaces);
                            level = indentStack.length - 1;
                        } else {
                            while (indentStack.length > 1 && rawSpaces < indentStack[indentStack.length - 1]) {
                                indentStack.pop();
                            }
                            level = indentStack.length - 1;
                        }
                    }

                    const newIndent = ' '.repeat(level * spacesPerLevel);
                    lines[j] = `${newIndent}${marker} ${bulletMatch[3]}`;
                    continue;
                }

                const numMatch = line.match(/^([ \t]*)(\d+[.)])\s+(.*)$/);
                if (numMatch) {
                    const rawSpaces = numMatch[1].replace(/\t/g, '    ').length;
                    let level = 0;

                    if (rawSpaces === 0) {
                        indentStack = [0];
                        level = 0;
                    } else {
                        if (indentStack.length === 0 || rawSpaces > indentStack[indentStack.length - 1]) {
                            indentStack.push(rawSpaces);
                            level = indentStack.length - 1;
                        } else {
                            while (indentStack.length > 1 && rawSpaces < indentStack[indentStack.length - 1]) {
                                indentStack.pop();
                            }
                            level = indentStack.length - 1;
                        }
                    }

                    const newIndent = ' '.repeat(level * spacesPerLevel);
                    lines[j] = `${newIndent}${numMatch[2]} ${numMatch[3]}`;
                    continue;
                }

                if (!line.trim()) continue;

                if (indentStack.length > 0) {
                    const contMatch = line.match(/^([ \t]+)(.*)$/);
                    if (contMatch) {
                        const currentLevel = indentStack.length - 1;
                        const newIndent = ' '.repeat(currentLevel * spacesPerLevel + 2);
                        lines[j] = `${newIndent}${contMatch[2]}`;
                    } else {
                        indentStack = [];
                    }
                }
            }

            parts[i] = lines.join('\n');
        }

        return parts.join('');
    }

    function buildMarkdown(data, cfg) {
        const { title, model, url, createdAt, systemInstruction, turns } = data;
        const lines = [];

        if (cfg.includeFrontmatter) {
            lines.push('---');
            lines.push(`title: ${JSON.stringify(title)}`);
            lines.push(`date: ${createdAt}`);
            if (model) lines.push(`model: ${JSON.stringify(model)}`);
            if (url) lines.push(`source: "${url}"`);
            lines.push('---');
            lines.push('');
        }

        lines.push(`# ${title}`);
        lines.push('');

        if (cfg.includeMetadataCallout) {
            lines.push('> [!abstract] Prompt Metadata');
            if (model) lines.push(`> - **Model:** \`${model}\``);
            if (url) lines.push(`> - **Source URL:** [Open in Google AI Studio](${url})`);
            lines.push(`> - **Exported:** ${new Date().toLocaleString()}`);
            lines.push(`> - **Turns Exported:** ${turns.length}`);
            lines.push('');
        }

        if (cfg.includeSystemInstructions && systemInstruction) {
            const formattedSys = systemInstruction.replace(/\n/g, '\n> ');
            lines.push(`> [!info]- ⚙️ System Instructions\n> ${formattedSys}`);
            lines.push('');
        }

        const messageBlocks = [];

        for (const turn of turns) {
            const isUser = turn.role === 'User';
            const roleHeader = isUser ? '## 👤 User' : '## 🤖 Gemini';

            if (turn.text) {
                let cleanText = turn.text;

                // Ensure single-bracket links: [1](url)
                cleanText = cleanText.replace(/\[\[([^\]\n]+)\]\((https?:\/\/[^\s\)]+)\)\]/g, '[$1]($2)');
                cleanText = cleanText.replace(/\[\[([^\]\n]+)\]\]\((https?:\/\/[^\s\)]+)\)/g, '[$1]($2)');
                cleanText = cleanText.replace(/\[\\\[([^\]\n]+)\\\]\]\((https?:\/\/[^\s\)]+)\)/g, '[$1]($2)');

                // Ensure an empty line between consecutive code blocks
                cleanText = cleanText.replace(/(`{3,}[^\n]*)\n([ \t]*`{3,})/g, '$1\n\n$2');

                // Enforce 4-space tab indentation and '-' markers
                cleanText = normalizeLists(cleanText, cfg.bulletMarker, cfg.listIndentSpaces);

                messageBlocks.push(`${roleHeader}\n\n${cleanText}`);
            }
        }

        lines.push(messageBlocks.join('\n\n---\n\n'));
        return lines.join('\n');
    }
};