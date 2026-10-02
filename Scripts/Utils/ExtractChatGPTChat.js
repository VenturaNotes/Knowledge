/**
 * Script Name: Extract ChatGPT Chat
 * Version: 2.4 (Date-Stamped Titles, Safe Overwrite Protection & Markdown Citations)
 * Description: Downloads full conversation tree from ChatGPT API, converts web search citations 
 *              into clean Markdown links, deduplicates binary images, and protects existing notes.
 * Compatibility: Script Runner Plugin for Obsidian (Desktop)
 */

module.exports = async function ({ app, obsidian, secrets }) {
    const { Notice, Platform, normalizePath, TFile } = obsidian;

    const CONFIG = {
        folder: 'Private/Clippings/Chats',
        attachmentsFolder: 'Private/Clippings/Chats/- Attachments',
        embedFormat: 'wikilink',                // 'wikilink' (![[img.png]]) or 'markdown' (![img](path))
        filenameFormat: 'date-title',           // 'date-title' ("2026-10-01 Title"), 'title-date' ("Title (2026-10-01)"), or 'title' ("Title")
        includeFrontmatter: true,
        includeMetadataCallout: true,
        includeThinking: true,                  // Collapsible callouts for o1/o3 reasoning
        includeCodeInterpreter: true,           // Python executions
        openAfterSaving: true
    };

    if (!Platform.isDesktopApp) {
        new Notice('❌ Extraction is only supported on Obsidian Desktop.');
        return;
    }

    const webview = findChatGPTWebview();
    if (!webview) {
        new Notice('❌ No active ChatGPT webview found. Make sure ChatGPT is open.');
        return;
    }

    const progressNotice = new Notice('⏳ Extracting conversation, citations, and attachments...', 0);

    try {
        // --- 1. Injected Script Inside Webview ---
        const guestExtractor = async function () {
            try {
                const url = window.location.href;
                const pathname = window.location.pathname;

                if (!window.location.hostname.includes('chatgpt.com') && !window.location.hostname.includes('openai.com')) {
                    return { error: 'The active tab is not chatgpt.com.' };
                }

                const chatMatch = pathname.match(/\/(?:c|share|g\/[^/]+\/c)\/([0-9a-fA-F-]+)/);
                if (!chatMatch) {
                    return { error: 'Please open a specific conversation URL first (e.g. /c/<id>).' };
                }
                const chatId = chatMatch[1];
                const isShare = pathname.includes('/share/');

                function blobToBase64(blob) {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = () => resolve(null);
                        reader.readAsDataURL(blob);
                    });
                }

                async function getAccessToken() {
                    try {
                        const sessionRes = await fetch('/api/auth/session', {
                            credentials: 'include',
                            headers: { 'Accept': 'application/json' }
                        });
                        if (sessionRes.ok) {
                            const data = await sessionRes.json();
                            if (data?.accessToken) return data.accessToken;
                        }
                    } catch (e) {}

                    try {
                        if (window.__NEXT_DATA__?.props?.pageProps?.session?.accessToken) {
                            return window.__NEXT_DATA__.props.pageProps.session.accessToken;
                        }
                    } catch (e) {}
                    return null;
                }

                const accessToken = await getAccessToken();

                async function authFetch(endpoint) {
                    const headers = { 'Accept': 'application/json' };
                    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
                    return await fetch(endpoint, { credentials: 'include', headers });
                }

                // Download Chatlog Tree
                const endpoints = isShare
                    ? [`/backend-api/share/${chatId}`]
                    : [
                        `/backend-api/conversation/${chatId}`,
                        `/backend-api/conversations/${chatId}?include_has_versions=true&num_turns=200`
                      ];

                let chatData = null;
                for (const ep of endpoints) {
                    try {
                        const res = await authFetch(ep);
                        if (res.ok) {
                            chatData = await res.json();
                            break;
                        }
                    } catch (e) {}
                }

                if (!chatData) {
                    return { error: 'Failed to retrieve chatlog from backend API.' };
                }

                const mapping = chatData.mapping || {};
                const currentNode = chatData.current_node;

                // Reconstruct linear branch
                let orderedMessages = [];
                if (currentNode && mapping[currentNode]) {
                    let curr = mapping[currentNode];
                    const seen = new Set();
                    while (curr && !seen.has(curr.id)) {
                        seen.add(curr.id);
                        if (curr.message) orderedMessages.push(curr.message);
                        curr = curr.parent ? mapping[curr.parent] : null;
                    }
                    orderedMessages.reverse();
                } else {
                    orderedMessages = Object.values(mapping)
                        .map(n => n.message)
                        .filter(Boolean)
                        .sort((a, b) => (a.create_time || 0) - (b.create_time || 0));
                }

                // Attachment Resolver (Multi-stage API + DOM Canvas Fallback)
                async function fetchAttachmentBase64(fileObj) {
                    const candidateUrls = [];
                    const fileId = fileObj.id || fileObj.file_id || 
                        (fileObj.asset_pointer ? fileObj.asset_pointer.replace('file-service://', '') : null);

                    if (fileObj.download_url) candidateUrls.push(fileObj.download_url);
                    if (fileObj.url) candidateUrls.push(fileObj.url);

                    if (fileId) {
                        candidateUrls.push(`/backend-api/files/download/${fileId}?inline=false`);
                        candidateUrls.push(`/backend-api/files/download/${fileId}`);
                        candidateUrls.push(`/backend-api/files/${fileId}/download`);
                    }

                    for (let candidate of candidateUrls) {
                        try {
                            if (candidate.startsWith('/')) {
                                candidate = window.location.origin + candidate;
                            }
                            const headers = {};
                            if (accessToken && candidate.includes('chatgpt.com')) {
                                headers['Authorization'] = `Bearer ${accessToken}`;
                            }

                            const res = await fetch(candidate, { credentials: 'include', headers });
                            if (res.ok) {
                                const ct = res.headers.get('content-type') || '';
                                if (ct.includes('json')) {
                                    const json = await res.json();
                                    if (json.download_url) {
                                        try {
                                            const dlRes = await fetch(json.download_url);
                                            if (dlRes.ok) {
                                                const b64 = await blobToBase64(await dlRes.blob());
                                                if (b64) return b64;
                                            }
                                        } catch (e) {}
                                    }
                                } else {
                                    const blob = await res.blob();
                                    if (blob && blob.size > 0) {
                                        const b64 = await blobToBase64(blob);
                                        if (b64) return b64;
                                    }
                                }
                            }
                        } catch (e) {}
                    }

                    // DOM Fallback
                    try {
                        const targetName = fileObj.name || fileObj.file_name || fileId;
                        const allImgs = Array.from(document.querySelectorAll('img')).filter(i => !i.src.includes('avatar'));
                        for (const img of allImgs) {
                            const isMatch = targetName && (
                                img.alt?.includes(targetName) ||
                                img.src?.includes(targetName) ||
                                img.closest('[data-message-author-role="user"]') !== null
                            );
                            if (isMatch && img.src) {
                                try {
                                    const canvas = document.createElement('canvas');
                                    canvas.width = img.naturalWidth || img.width;
                                    canvas.height = img.naturalHeight || img.height;
                                    if (canvas.width > 0 && canvas.height > 0) {
                                        const ctx = canvas.getContext('2d');
                                        ctx.drawImage(img, 0, 0);
                                        const dUrl = canvas.toDataURL('image/png');
                                        if (dUrl && dUrl.startsWith('data:image/')) return dUrl;
                                    }
                                } catch (e) {}

                                try {
                                    const fRes = await fetch(img.src);
                                    if (fRes.ok) {
                                        const b64 = await blobToBase64(await fRes.blob());
                                        if (b64) return b64;
                                    }
                                } catch (e) {}
                            }
                        }
                    } catch (e) {}

                    return null;
                }

                // Collect Base64 Assets (With Deduplication)
                const downloadedAssets = [];
                let assetCounter = 1;

                for (const msg of orderedMessages) {
                    msg.__assets = [];
                    const msgAssetHashes = new Set();

                    // 1. Process Metadata Attachments first (preserves original filename)
                    const attachments = msg.metadata?.attachments || [];
                    for (const att of attachments) {
                        const b64 = await fetchAttachmentBase64(att);
                        if (b64) {
                            const hash = `${b64.length}_${b64.slice(0, 80)}_${b64.slice(-80)}`;
                            if (!msgAssetHashes.has(hash)) {
                                msgAssetHashes.add(hash);
                                const fileName = att.name || `chatgpt_img_${Date.now()}_${assetCounter++}.png`;
                                downloadedAssets.push({ fileName, base64: b64 });
                                msg.__assets.push(fileName);
                            }
                        }
                    }

                    // 2. Process Multimodal Parts
                    const parts = msg.content?.parts || [];
                    for (const part of parts) {
                        if (typeof part === 'object' && part !== null) {
                            const pointer = part.asset_pointer || (part.content_type === 'image_asset_pointer' ? part.asset_pointer : null);
                            if (pointer) {
                                const b64 = await fetchAttachmentBase64({ asset_pointer: pointer });
                                if (b64) {
                                    const hash = `${b64.length}_${b64.slice(0, 80)}_${b64.slice(-80)}`;
                                    if (!msgAssetHashes.has(hash)) {
                                        msgAssetHashes.add(hash);
                                        const ext = b64.includes('image/jpeg') ? 'jpg' : b64.includes('image/webp') ? 'webp' : 'png';
                                        const fileName = `chatgpt_img_${Date.now()}_${assetCounter++}.${ext}`;
                                        downloadedAssets.push({ fileName, base64: b64 });
                                        msg.__assets.push(fileName);
                                    }
                                }
                            }
                        }
                    }
                }

                const model = chatData.default_model_slug || orderedMessages.find(m => m.metadata?.model_slug)?.metadata?.model_slug || '';

                return {
                    success: true,
                    data: {
                        id: chatId,
                        title: chatData.title || '',
                        model: model,
                        createdAt: chatData.create_time ? new Date(chatData.create_time * 1000).toISOString() : new Date().toISOString(),
                        orderedMessages: orderedMessages,
                        url: url
                    },
                    assets: downloadedAssets
                };
            } catch (err) {
                return { error: err.message || String(err) };
            }
        };

        const executionPayload = `(${guestExtractor.toString()})()`;
        const rawResponse = await webview.executeJavaScript(executionPayload);
        const result = typeof rawResponse === 'string' ? JSON.parse(rawResponse) : rawResponse;

        if (!result || result.error) {
            progressNotice.hide();
            new Notice(`❌ Chatlog extraction failed: ${result?.error || 'Unknown error'}`);
            return;
        }

        // --- 2. Ensure Vault Folders Exist ---
        const notesFolder = normalizePath(CONFIG.folder);
        if (notesFolder && !(await app.vault.adapter.exists(notesFolder))) {
            await ensureFolderRecursive(app, notesFolder);
        }

        const attachFolder = normalizePath(CONFIG.attachmentsFolder);
        if (attachFolder && !(await app.vault.adapter.exists(attachFolder))) {
            await ensureFolderRecursive(app, attachFolder);
        }

        // --- 3. Save Binary Attachments Directly to Vault ---
        let savedAssetCount = 0;
        if (Array.isArray(result.assets) && result.assets.length > 0) {
            for (const asset of result.assets) {
                if (!asset.fileName || !asset.base64) continue;

                const cleanName = sanitizeAttachmentName(asset.fileName);
                const arrayBuffer = base64ToArrayBuffer(asset.base64);
                const assetPath = attachFolder ? `${attachFolder}/${cleanName}` : cleanName;

                const existingAsset = app.vault.getAbstractFileByPath(assetPath);
                if (existingAsset instanceof TFile) {
                    if (existingAsset.stat.size !== arrayBuffer.byteLength) {
                        await app.vault.modifyBinary(existingAsset, arrayBuffer);
                    }
                } else {
                    await app.vault.createBinary(assetPath, arrayBuffer);
                }
                savedAssetCount++;
            }
        }

        // --- 4. Build Title, Date, & Determine File Path ---
        const mdContent = buildMarkdown(result.data, CONFIG);
        const chatTitle = result.data.title || `ChatGPT Chat ${result.data.id ? result.data.id.slice(0, 8) : ''}`;
        const safeTitle = sanitizeFileName(chatTitle);
        const dateStr = (result.data.createdAt ? new Date(result.data.createdAt) : new Date()).toISOString().slice(0, 10);

        // Format file name based on configuration
        let baseFileName = safeTitle;
        if (CONFIG.filenameFormat === 'date-title') {
            baseFileName = `${dateStr} ${safeTitle}`;
        } else if (CONFIG.filenameFormat === 'title-date') {
            baseFileName = `${safeTitle} (${dateStr})`;
        }

        const targetFilePath = notesFolder ? `${notesFolder}/${baseFileName}.md` : `${baseFileName}.md`;
        const existingFile = app.vault.getAbstractFileByPath(targetFilePath);
        let finalFile;

        // Safe Overwrite Check: Only overwrite if it's the exact same conversation URL
        if (existingFile instanceof TFile) {
            const existingContent = await app.vault.read(existingFile);
            const chatUrl = result.data.url;

            if (chatUrl && existingContent.includes(chatUrl)) {
                // Same chat: update note with latest messages in-place
                await app.vault.modify(existingFile, mdContent);
                finalFile = existingFile;
            } else {
                // Different note sharing the same title: do NOT overwrite, append unique timestamp
                const uniqueTimestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
                const uniquePath = notesFolder 
                    ? `${notesFolder}/${baseFileName} (${uniqueTimestamp}).md` 
                    : `${baseFileName} (${uniqueTimestamp}).md`;
                finalFile = await app.vault.create(uniquePath, mdContent);
            }
        } else {
            finalFile = await app.vault.create(targetFilePath, mdContent);
        }

        progressNotice.hide();
        const imgMsg = savedAssetCount > 0 ? ` (${savedAssetCount} attachment${savedAssetCount > 1 ? 's' : ''} saved)` : '';
        new Notice(`✓ Exported: "${finalFile.name}"${imgMsg}`);

        if (CONFIG.openAfterSaving && finalFile) {
            const leaf = app.workspace.getLeaf('tab');
            await leaf.openFile(finalFile);
        }

    } catch (err) {
        progressNotice.hide();
        console.error('[ExtractChatGPTChat] Execution error:', err);
        new Notice(`❌ Error executing extraction: ${err.message}`);
    }

    // --- Helper Functions ---

    function findChatGPTWebview() {
        const activeLeaf = document.querySelector('.workspace-leaf.mod-active');
        if (activeLeaf) {
            const wv = activeLeaf.querySelector('webview');
            if (wv && isChatGptUrl(getWebviewUrl(wv))) return wv;
        }
        const all = Array.from(document.querySelectorAll('webview'));
        const chatViews = all.filter(wv => isChatGptUrl(getWebviewUrl(wv)));
        if (chatViews.length === 1) return chatViews[0];
        for (const wv of chatViews) {
            if (wv.offsetParent !== null && wv.offsetWidth > 0) return wv;
        }
        return chatViews[0] || (all.length === 1 ? all[0] : null);
    }

    function isChatGptUrl(url) {
        return url.includes('chatgpt.com') || url.includes('chat.openai.com');
    }

    function getWebviewUrl(wv) {
        try {
            if (typeof wv.getURL === 'function') {
                const u = wv.getURL();
                if (u) return u;
            }
        } catch (e) {}
        return wv.getAttribute('src') || wv.src || '';
    }

    function sanitizeFileName(name) {
        return name
            .replace(/[\\/:*?"<>|#^[\]]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 100) || 'ChatGPT Chat';
    }

    function sanitizeAttachmentName(name) {
        return name
            .replace(/[\\/:*?"<>|#^[\]]/g, '_')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function base64ToArrayBuffer(base64Data) {
        const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
        if (typeof Buffer !== 'undefined') {
            const buf = Buffer.from(cleanBase64, 'base64');
            return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        }
        const binary = atob(cleanBase64);
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
        return bytes.buffer;
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

    function formatImageLink(fileName, cfg) {
        const cleanName = sanitizeAttachmentName(fileName);
        if (cfg.embedFormat === 'markdown') {
            const noteF = normalizePath(cfg.folder);
            const attachF = normalizePath(cfg.attachmentsFolder);
            let rel = cleanName;
            if (attachF.startsWith(noteF + '/')) {
                rel = `${attachF.slice(noteF.length + 1)}/${cleanName}`;
            } else {
                rel = `${attachF}/${cleanName}`;
            }
            return `![${cleanName}](${rel.split('/').map(encodeURIComponent).join('/')})`;
        }
        return `![[${cleanName}]]`;
    }

    // Resolves ChatGPT \uE200cite... markers to clean Markdown links using content_references metadata
    function resolveCitations(text, metadata) {
        if (!text) return '';
        let result = text;

        const refs = metadata?.content_references || [];
        // Sort descending by token length to avoid partial substring replacements
        const sortedRefs = refs.slice().sort((a, b) => (b.matched_text?.length || 0) - (a.matched_text?.length || 0));

        for (const ref of sortedRefs) {
            if (!ref.matched_text) continue;

            const items = [];
            if (Array.isArray(ref.items)) {
                for (const it of ref.items) {
                    if (it.url) items.push(it);
                }
            } else if (ref.url) {
                items.push(ref);
            } else if (Array.isArray(ref.safe_urls)) {
                for (const u of ref.safe_urls) {
                    items.push({ url: u, title: ref.title || 'Source' });
                }
            }

            if (items.length > 0) {
                const linkSnippets = items.map(it => {
                    let label = '';
                    if (it.attribution) {
                        label = it.attribution.replace(/^www\./i, '');
                    } else if (it.title && it.title.length <= 25) {
                        label = it.title;
                    } else {
                        try {
                            const parsed = new URL(it.url);
                            label = parsed.hostname.replace(/^www\./i, '');
                        } catch (e) {
                            label = it.title || 'Source';
                        }
                    }
                    return `[${label}](${it.url})`;
                });

                const replacement = ' ' + linkSnippets.join(' ');
                result = result.replaceAll(ref.matched_text, () => replacement);
            }
        }

        // Clean any leftover unresolved private-use Unicode citation markers
        result = result.replace(/[\uE200-\uE202]cite[\uE200-\uE202][^\uE201]*[\uE201]/g, '');

        // Normalize spacing before punctuation
        result = result.replace(/ +([.,;:!?])/g, '$1');

        return result.trim();
    }

    function buildMarkdown(data, cfg) {
        const { title, model, url, createdAt, orderedMessages } = data;
        const lines = [];

        if (cfg.includeFrontmatter) {
            lines.push('---');
            lines.push(`title: ${JSON.stringify(title || 'ChatGPT Chat')}`);
            lines.push(`chat_date: ${createdAt}`);
            if (model) lines.push(`model: ${model}`);
            if (url) lines.push(`source: "${url}"`);
            lines.push('---');
            lines.push('');
        }

        lines.push(`# ${title || 'ChatGPT Chat'}`);
        lines.push('');

        if (cfg.includeMetadataCallout) {
            lines.push('> [!abstract] Chat Info');
            if (model) lines.push(`> - **Model:** \`${model}\``);
            if (url) lines.push(`> - **Source URL:** [Open in ChatGPT](${url})`);
            lines.push(`> - **Exported:** ${new Date().toLocaleString()}`);
            lines.push('');
        }

        const messageBlocks = [];

        for (const msg of orderedMessages) {
            const role = msg.author?.role;
            if (role !== 'user' && role !== 'assistant') continue;
            if (msg.metadata?.is_visually_hidden_from_conversation) continue;

            const isUser = role === 'user';
            const roleHeader = isUser ? '## 👤 User' : '## 🤖 ChatGPT';
            const parts = [];

            // Image embeds
            const attachedImages = msg.__assets || [];
            for (const imgName of attachedImages) {
                parts.push(formatImageLink(imgName, cfg));
            }

            // Reasoning Process (o1 / o3)
            if (cfg.includeThinking && msg.metadata?.thought) {
                const thought = String(msg.metadata.thought).trim().replace(/\n/g, '\n> ');
                parts.push(`> [!note]- 💭 Thinking Process\n> ${thought}`);
            }

            // Text & Multimodal parts (with resolved citation links)
            const content = msg.content;
            if (content) {
                if (content.content_type === 'text' && Array.isArray(content.parts)) {
                    let text = content.parts.filter(p => typeof p === 'string').join('\n').trim();
                    text = resolveCitations(text, msg.metadata);
                    if (text) parts.push(text);
                } else if (content.content_type === 'multimodal_text' && Array.isArray(content.parts)) {
                    for (const part of content.parts) {
                        if (typeof part === 'string' && part.trim()) {
                            parts.push(resolveCitations(part.trim(), msg.metadata));
                        }
                    }
                } else if (content.content_type === 'code' && cfg.includeCodeInterpreter) {
                    const code = (content.text || '').trim();
                    if (code) {
                        parts.push(`> [!example]- 💻 Python Execution\n> \`\`\`python\n> ${code.replace(/\n/g, '\n> ')}\n> \`\`\``);
                    }
                }
            }

            if (parts.length > 0) {
                messageBlocks.push(`${roleHeader}\n\n${parts.join('\n\n')}`);
            }
        }

        lines.push(messageBlocks.join('\n\n---\n\n'));
        return lines.join('\n');
    }
};