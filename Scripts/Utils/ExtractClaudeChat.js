/**
 * Script Name: Extract Claude Chat
 * Description: Extracts Claude.ai conversation + downloads all image attachments into your Obsidian vault.
 * Compatibility: Script Runner Plugin for Obsidian (Desktop)
 */

module.exports = async function ({ app, obsidian, secrets }) {
    const { Notice, Platform, normalizePath, TFile } = obsidian;

    // --- User Configuration ---
    const CONFIG = {
        folder: 'Private/Clippings/Chats',                    // Vault folder for Markdown notes
        attachmentsFolder: 'Private/Clippings/Chats/- Attachments', // Vault folder for downloaded images
        embedFormat: 'wikilink',                               // 'wikilink' (![[img.png]]) or 'markdown' (![img](path))
        includeFrontmatter: true,                              // Include YAML frontmatter (title, date, model, source)
        includeMetadataCallout: true,                          // Include summary callout at the top
        includeThinking: true,                                 // Include Claude 3.7+ thinking as collapsible callouts
        includeArtifacts: true,                                // Include artifacts & code widgets
        openAfterSaving: true                                  // Open note in a new tab after saving
    };

    if (!Platform.isDesktopApp) {
        new Notice('❌ Webview extraction is only supported on Obsidian Desktop.');
        return;
    }

    // 1. Locate the active Claude <webview>
    const webview = findClaudeWebview();
    if (!webview) {
        new Notice('❌ No active Claude webview found. Make sure Claude is open in an Obsidian tab.');
        return;
    }

    const progressNotice = new Notice('⏳ Extracting Claude conversation and attachments...', 0);

    try {
        // 2. Injected script running inside the Claude.ai webview context
        const extractionPayload = `
        (async () => {
            try {
                const url = window.location.href;
                const pathname = window.location.pathname;

                if (!window.location.hostname.includes('claude.ai')) {
                    return { error: 'The active tab is not claude.ai.' };
                }

                const chatMatch = pathname.match(/chat\\/([0-9a-fA-F-]+)/);
                if (!chatMatch) {
                    return { error: 'Please open a specific Claude conversation first (e.g. /chat/<id>).' };
                }
                const chatId = chatMatch[1];

                function getCookie(name) {
                    const match = document.cookie.match(new RegExp('(^|;\\\\s*)(' + name + ')=([^;]*)'));
                    return match ? match[3] : null;
                }

                let orgId = getCookie('lastActiveOrg');

                if (!orgId) {
                    try {
                        const orgRes = await fetch('/api/organizations', { credentials: 'include' });
                        if (orgRes.ok) {
                            const orgs = await orgRes.json();
                            const list = Array.isArray(orgs) ? orgs : [orgs];
                            const chatOrg = list.find(o => o.capabilities && o.capabilities.includes('chat')) || list[0];
                            if (chatOrg && chatOrg.uuid) orgId = chatOrg.uuid;
                        }
                    } catch (e) {}
                }

                function blobToBase64(blob) {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = () => resolve(null);
                        reader.readAsDataURL(blob);
                    });
                }

                async function fetchAttachmentBase64(fileObj) {
                    const candidateUrls = [];

                    if (fileObj.document_asset?.url) candidateUrls.push(fileObj.document_asset.url);
                    if (fileObj.preview_asset?.url) candidateUrls.push(fileObj.preview_asset.url);
                    if (fileObj.thumbnail_asset?.url) candidateUrls.push(fileObj.thumbnail_asset.url);

                    if (fileObj.preview_url) candidateUrls.push(fileObj.preview_url);
                    if (fileObj.thumbnail_url) candidateUrls.push(fileObj.thumbnail_url);
                    if (fileObj.url) candidateUrls.push(fileObj.url);
                    if (fileObj.download_url) candidateUrls.push(fileObj.download_url);

                    const fileUuid = fileObj.file_uuid || fileObj.uuid || fileObj.id;
                    if (orgId && fileUuid) {
                        candidateUrls.push(\`/api/organizations/\${orgId}/files/\${fileUuid}/contents\`);
                        candidateUrls.push(\`/api/organizations/\${orgId}/files/\${fileUuid}\`);
                    }

                    for (let candidate of candidateUrls) {
                        try {
                            if (candidate.startsWith('/')) {
                                candidate = window.location.origin + candidate;
                            }
                            const res = await fetch(candidate, { credentials: 'include' });
                            if (res.ok) {
                                const blob = await res.blob();
                                if (blob && blob.size > 0) {
                                    const b64 = await blobToBase64(blob);
                                    if (b64) return b64;
                                }
                            }
                        } catch (e) {}
                    }

                    try {
                        const targetName = fileObj.file_name || fileObj.name;
                        const imgs = Array.from(document.querySelectorAll('img'));
                        for (const img of imgs) {
                            const isMatch = targetName && (
                                img.alt?.includes(targetName) ||
                                img.src?.includes(targetName) ||
                                img.closest('[data-testid*="attachment"]')?.textContent?.includes(targetName) ||
                                img.closest('div')?.textContent?.includes(targetName)
                            );
                            if (isMatch && img.src) {
                                try {
                                    const res = await fetch(img.src);
                                    if (res.ok) {
                                        const b64 = await blobToBase64(await res.blob());
                                        if (b64) return b64;
                                    }
                                } catch (err) {}
                            }
                        }
                    } catch (domErr) {}

                    return null;
                }

                // --- Primary: API Fetch ---
                if (orgId && chatId) {
                    try {
                        const apiUrl = \`/api/organizations/\${orgId}/chat_conversations/\${chatId}?tree=true&rendering_mode=messages&render_all_tools=true&include_inline_comparison=true&consistency=strong\`;
                        let res = await fetch(apiUrl, { credentials: 'include' });
                        if (!res.ok) {
                            res = await fetch(\`/api/organizations/\${orgId}/chat_conversations/\${chatId}\`, { credentials: 'include' });
                        }

                        if (res.ok) {
                            const data = await res.json();
                            const chatMessages = data.chat_messages || [];

                            const byUuid = new Map(chatMessages.map(m => [m.uuid, m]));
                            let ordered = [];
                            if (data.current_leaf_message_uuid && byUuid.has(data.current_leaf_message_uuid)) {
                                let cur = byUuid.get(data.current_leaf_message_uuid);
                                while (cur) {
                                    ordered.push(cur);
                                    cur = cur.parent_message_uuid ? byUuid.get(cur.parent_message_uuid) : null;
                                }
                                ordered.reverse();
                            } else {
                                ordered = chatMessages.slice().sort((a, b) => {
                                    if (a.index !== undefined && b.index !== undefined) return a.index - b.index;
                                    return new Date(a.created_at || 0) - new Date(b.created_at || 0);
                                });
                            }

                            const downloadedAssets = [];
                            for (const msg of ordered) {
                                const rawFiles = [
                                    ...(msg.files_v2 || []),
                                    ...(msg.files || []),
                                    ...(msg.attachments || [])
                                ];

                                const seenKeys = new Set();
                                const uniqueFiles = [];
                                for (const f of rawFiles) {
                                    const key = f.file_uuid || f.file_name || f.name;
                                    if (!key || seenKeys.has(key)) continue;
                                    seenKeys.add(key);
                                    uniqueFiles.push(f);
                                }

                                msg.__extracted_files = [];
                                for (const fileObj of uniqueFiles) {
                                    const fName = fileObj.file_name || fileObj.name || ('attachment_' + Date.now());
                                    const base64 = await fetchAttachmentBase64(fileObj);
                                    if (base64) {
                                        downloadedAssets.push({ fileName: fName, base64 });
                                        msg.__extracted_files.push({ fileName: fName, downloaded: true });
                                    } else {
                                        msg.__extracted_files.push({ fileName: fName, downloaded: false });
                                    }
                                }
                            }

                            return {
                                success: true,
                                sourceType: 'api',
                                data: {
                                    id: chatId,
                                    title: data.name || '',
                                    model: data.model || '',
                                    createdAt: data.created_at || '',
                                    orderedMessages: ordered,
                                    url: url
                                },
                                assets: downloadedAssets
                            };
                        }
                    } catch (apiErr) {
                        console.warn('[ClaudeExtract] API fetch failed, falling back to DOM:', apiErr);
                    }
                }

                // --- Fallback: DOM Extraction ---
                let title = '';
                const titleEl = document.querySelector('[data-testid="chat-title-button"]') ||
                                document.querySelector('[data-testid="page-header"]') ||
                                document.querySelector('header h1, header h2');
                if (titleEl) title = titleEl.textContent?.trim() || '';
                if (!title) title = document.title.replace(/ - Claude$/, '').replace(/^Claude - /, '').trim();
                if (!title || title === 'Claude') title = 'Claude Chat ' + chatId.slice(0, 8);

                const turns = [];
                const domAssets = [];
                const candidateNodes = document.querySelectorAll(
                    '[data-testid="user-message"], div.font-user-message, div.font-claude-message, div.font-claude-response, [data-is-streaming="false"] .prose'
                );

                const seen = new Set();
                let imgCounter = 1;
                for (const el of candidateNodes) {
                    if (seen.has(el)) continue;
                    for (const s of seen) {
                        if (s.contains(el)) return;
                    }
                    seen.add(el);

                    const isUser = el.matches('[data-testid="user-message"]') || el.classList.contains('font-user-message');
                    const role = isUser ? 'human' : 'assistant';

                    const embeddedImgs = [];
                    const imgElements = Array.from(el.querySelectorAll('img'));
                    for (const img of imgElements) {
                        if (img.width > 0 && img.width < 32 && img.height < 32) continue;
                        let b64 = null;
                        if (img.src.startsWith('data:image/')) {
                            b64 = img.src;
                        } else if (img.src) {
                            try {
                                const res = await fetch(img.src);
                                if (res.ok) b64 = await blobToBase64(await res.blob());
                            } catch (e) {}
                        }
                        if (b64) {
                            const ext = b64.includes('image/jpeg') ? 'jpg' : b64.includes('image/webp') ? 'webp' : 'png';
                            const generatedName = \`claude_image_\${Date.now()}_\${imgCounter++}.\${ext}\`;
                            domAssets.push({ fileName: generatedName, base64: b64 });
                            embeddedImgs.push(generatedName);
                        }
                    }

                    const clone = el.cloneNode(true);
                    clone.querySelectorAll('button, svg, [role="group"], .sr-only').forEach(n => n.remove());

                    clone.querySelectorAll('pre').forEach(pre => {
                        const codeEl = pre.querySelector('code');
                        const lang = codeEl ? (codeEl.className.match(/language-([\\w-]+)/)?.[1] || '') : '';
                        const codeText = (codeEl || pre).textContent || '';
                        pre.textContent = \`\\n\\\`\\\`\\\`\${lang}\\n\${codeText.trim()}\\n\\\`\\\`\\\`\\n\`;
                    });

                    const text = (clone.innerText || clone.textContent || '').trim();
                    if (text || embeddedImgs.length > 0) {
                        turns.push({ role, text, images: embeddedImgs });
                    }
                }

                return {
                    success: true,
                    sourceType: 'dom',
                    data: {
                        id: chatId,
                        title: title,
                        model: '',
                        createdAt: new Date().toISOString(),
                        turns: turns,
                        url: url
                    },
                    assets: domAssets
                };

            } catch (err) {
                return { error: err.message || String(err) };
            }
        })();
        `;

        // 3. Execute inside Webview
        const rawResponse = await webview.executeJavaScript(extractionPayload);
        const result = typeof rawResponse === 'string' ? JSON.parse(rawResponse) : rawResponse;

        if (!result || result.error) {
            progressNotice.hide();
            new Notice(`❌ Extraction failed: ${result?.error || 'Unknown error'}`);
            return;
        }

        // 4. Ensure folders exist recursively in Obsidian
        const notesFolder = normalizePath(CONFIG.folder);
        if (notesFolder && !(await app.vault.adapter.exists(notesFolder))) {
            await ensureFolderRecursive(app, notesFolder);
        }

        const attachFolder = normalizePath(CONFIG.attachmentsFolder);
        if (attachFolder && !(await app.vault.adapter.exists(attachFolder))) {
            await ensureFolderRecursive(app, attachFolder);
        }

        // 5. Save all binary attachments to Obsidian Vault
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

        // 6. Build Markdown content (without tags)
        const mdContent = buildMarkdown(result, CONFIG);
        const chatTitle = result.data.title || `Claude Chat ${result.data.id ? result.data.id.slice(0, 8) : ''}`;
        const chatUrl = result.data.url;

        // 7. Save or update Markdown note
        const safeTitle = sanitizeFileName(chatTitle);
        const filePath = notesFolder ? `${notesFolder}/${safeTitle}.md` : `${safeTitle}.md`;
        const existingAbstract = app.vault.getAbstractFileByPath(filePath);

        let finalFile;
        if (existingAbstract instanceof TFile) {
            const existingContent = await app.vault.read(existingAbstract);
            if (chatUrl && existingContent.includes(chatUrl)) {
                await app.vault.modify(existingAbstract, mdContent);
                finalFile = existingAbstract;
            } else {
                const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
                const altPath = notesFolder ? `${notesFolder}/${safeTitle} (${timestamp}).md` : `${safeTitle} (${timestamp}).md`;
                finalFile = await app.vault.create(altPath, mdContent);
            }
        } else {
            finalFile = await app.vault.create(filePath, mdContent);
        }

        progressNotice.hide();

        const assetMsg = savedAssetCount > 0 ? ` (${savedAssetCount} attachment${savedAssetCount > 1 ? 's' : ''} saved)` : '';
        new Notice(`✓ Exported: "${finalFile.name}"${assetMsg}`);

        // 8. Open note in new tab
        if (CONFIG.openAfterSaving && finalFile) {
            const leaf = app.workspace.getLeaf('tab');
            await leaf.openFile(finalFile);
        }

    } catch (err) {
        progressNotice.hide();
        console.error('[ExtractClaudeChat] Error:', err);
        new Notice(`❌ Error executing extraction: ${err.message}`);
    }

    // --- Helper Functions ---

    function findClaudeWebview() {
        const activeLeaf = document.querySelector('.workspace-leaf.mod-active');
        if (activeLeaf) {
            const wv = activeLeaf.querySelector('webview');
            if (wv && getWebviewUrl(wv).includes('claude.ai')) return wv;
        }

        const all = Array.from(document.querySelectorAll('webview'));
        const claudeViews = all.filter(wv => getWebviewUrl(wv).includes('claude.ai'));

        if (claudeViews.length === 1) return claudeViews[0];

        for (const wv of claudeViews) {
            if (wv.offsetParent !== null && wv.offsetWidth > 0) return wv;
        }

        return claudeViews[0] || (all.length === 1 ? all[0] : null);
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
            .slice(0, 100) || 'Claude Chat';
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

    function buildMarkdown(result, cfg) {
        const { data, sourceType } = result;
        const title = data.title || 'Claude Chat';
        const model = data.model || '';
        const url = data.url || '';
        const dateStr = data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString();

        const lines = [];

        // Frontmatter without tags
        if (cfg.includeFrontmatter) {
            lines.push('---');
            lines.push(`title: ${JSON.stringify(title)}`);
            lines.push(`date: ${dateStr}`);
            if (model) lines.push(`model: ${model}`);
            if (url) lines.push(`source: "${url}"`);
            lines.push('---');
            lines.push('');
        }

        lines.push(`# ${title}`);
        lines.push('');

        if (cfg.includeMetadataCallout) {
            lines.push('> [!abstract] Chat Info');
            if (model) lines.push(`> - **Model:** \`${model}\``);
            if (url) lines.push(`> - **Source URL:** [Open in Claude](${url})`);
            lines.push(`> - **Exported:** ${new Date().toLocaleString()}`);
            lines.push('');
        }

        const messageBlocks = [];

        if (sourceType === 'api') {
            for (const msg of data.orderedMessages) {
                const isUser = msg.sender === 'human';
                const roleHeader = isUser ? '## 👤 User' : '## 🤖 Claude';
                const parts = [];

                const extractedFiles = msg.__extracted_files || [];
                const imgEmbeds = [];
                const otherFilePills = [];

                for (const f of extractedFiles) {
                    const isImg = /\.(png|jpe?g|webp|gif|svg|bmp|ico)$/i.test(f.fileName);
                    if (isImg && f.downloaded) {
                        imgEmbeds.push(formatImageLink(f.fileName, cfg));
                    } else if (f.downloaded) {
                        otherFilePills.push(`📎 **Attachment:** [[${sanitizeAttachmentName(f.fileName)}]]`);
                    } else {
                        otherFilePills.push(`> 📎 **Attached:** \`${f.fileName}\``);
                    }
                }

                if (imgEmbeds.length > 0) parts.push(imgEmbeds.join('\n\n'));
                if (otherFilePills.length > 0) parts.push(otherFilePills.join('\n'));

                if (Array.isArray(msg.content)) {
                    for (const block of msg.content) {
                        if (!block) continue;

                        if (block.type === 'text' && block.text) {
                            parts.push(block.text.trim());
                        } else if (block.type === 'thinking' && block.thinking && cfg.includeThinking) {
                            const thought = block.thinking.trim().replace(/\n/g, '\n> ');
                            parts.push(`> [!note]- 💭 Thinking Process\n> ${thought}`);
                        } else if (block.type === 'tool_use' && cfg.includeArtifacts) {
                            const toolName = block.name;
                            const input = block.input || {};

                            if (toolName === 'artifacts') {
                                const artTitle = input.title || input.id || 'Artifact';
                                const lang = input.language || (input.type ? input.type.split('/').pop().replace('vnd.ant.', '') : '') || '';
                                const code = (input.content || '').trim();
                                parts.push(`### 📦 Artifact: ${artTitle}\n\`\`\`${lang}\n${code}\n\`\`\``);
                            } else if (toolName === 'repl') {
                                const code = (input.code || '').trim();
                                parts.push(`> [!example]- 💻 Python / REPL Execution\n> \`\`\`python\n> ${code.replace(/\n/g, '\n> ')}\n> \`\`\``);
                            } else if (toolName === 'web_search') {
                                const q = input.query || JSON.stringify(input);
                                parts.push(`> 🔍 *Searched web for:* \`${q}\``);
                            }
                        }
                    }
                }

                if (parts.length === 0 && msg.text) {
                    parts.push(msg.text.trim());
                }

                messageBlocks.push(`${roleHeader}\n\n${parts.join('\n\n')}`);
            }
        } else {
            for (const turn of data.turns) {
                const isUser = turn.role === 'human';
                const roleHeader = isUser ? '## 👤 User' : '## 🤖 Claude';
                const parts = [];

                if (turn.images && turn.images.length > 0) {
                    parts.push(turn.images.map(imgName => formatImageLink(imgName, cfg)).join('\n\n'));
                }
                if (turn.text) {
                    parts.push(turn.text);
                }

                messageBlocks.push(`${roleHeader}\n\n${parts.join('\n\n')}`);
            }
        }

        lines.push(messageBlocks.join('\n\n---\n\n'));
        return lines.join('\n');
    }
};