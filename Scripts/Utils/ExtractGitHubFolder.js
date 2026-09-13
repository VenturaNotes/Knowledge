/**
 * Script Name: Extract GitHub Folder
 * Description: Detects the active GitHub <webview> tab, recursively downloads all files
 *              in the current folder, and saves them into Private/Clippings/GitHub.
 * Compatibility: Script Runner Plugin for Obsidian (Desktop)
 */

module.exports = async function ({ app, obsidian, secrets }) {
    const { Notice, Platform, normalizePath, TFile, requestUrl } = obsidian;

    // --- User Configuration ---
    const CONFIG = {
        baseFolder: 'Private/Clippings/GitHub', // Vault root folder for GitHub downloads
        includeRepoName: true,                  // If true: Private/Clippings/GitHub/<Repo>/<Path>
                                                // If false: Private/Clippings/GitHub/<Path>
        openFolderInExplorer: true              // Reveal folder in file explorer when done
    };

    if (!Platform.isDesktopApp) {
        new Notice('❌ Webview extraction is only supported on Obsidian Desktop.');
        return;
    }

    // 1. Locate the active GitHub <webview>
    const webview = findGitHubWebview();
    if (!webview) {
        new Notice('❌ No active GitHub webview found. Make sure GitHub is open in an Obsidian tab.');
        return;
    }

    const progressNotice = new Notice('⏳ Detecting GitHub folder...', 0);

    try {
        // 2. Get the current URL from the webview context
        let currentUrl = '';
        try {
            currentUrl = await webview.executeJavaScript('window.location.href');
        } catch (e) {
            currentUrl = getWebviewUrl(webview);
        }

        if (!currentUrl || !currentUrl.includes('github.com')) {
            progressNotice.hide();
            new Notice('❌ The active tab is not a valid github.com page.');
            return;
        }

        // 3. Parse GitHub URL
        const parsed = parseGitHubUrl(currentUrl);
        if (!parsed) {
            progressNotice.hide();
            new Notice('❌ Could not parse GitHub repository or folder path from URL.');
            return;
        }

        // 4. Setup Authentication (Optional: reads GITHUB_TOKEN from Script Runner secrets)
        const token = secrets?.GITHUB_TOKEN || secrets?.GITHUB_PAT || secrets?.GH_TOKEN;
        const headers = {
            'User-Agent': 'Obsidian-ScriptRunner-Downloader',
            'Accept': 'application/vnd.github.v3+json'
        };
        if (token) {
            headers['Authorization'] = `token ${token}`;
        }

        // If on the root of a repo without a specified branch, fetch the default branch
        if (!parsed.branch) {
            progressNotice.setMessage('🔍 Detecting default repository branch...');
            parsed.branch = await fetchDefaultBranch(parsed.owner, parsed.repo, headers);
        }

        // 5. Determine destination folder in vault
        let destFolder = normalizePath(CONFIG.baseFolder);
        if (CONFIG.includeRepoName) {
            destFolder = normalizePath(`${destFolder}/${parsed.repo}`);
        }
        if (parsed.path) {
            destFolder = normalizePath(`${destFolder}/${parsed.path}`);
        }

        progressNotice.setMessage(`🔍 Scanning GitHub: ${parsed.owner}/${parsed.repo} (${parsed.path || 'root'})...`);

        // 6. Fetch file list (handles single files or recursive folder trees)
        let files = [];
        if (parsed.isFile) {
            // Single file URL (/blob/...)
            const singleFile = await fetchSingleFileInfo(parsed.owner, parsed.repo, parsed.branch, parsed.path, headers);
            if (singleFile) files.push(singleFile);
        } else {
            // Folder or root URL (/tree/...)
            files = await fetchRepoDirectory(parsed.owner, parsed.repo, parsed.branch, parsed.path, headers);
        }

        if (files.length === 0) {
            progressNotice.hide();
            new Notice('⚠️ No files found in this GitHub directory.');
            return;
        }

        // 7. Download and save files into the vault
        await ensureFolderRecursive(app.vault, destFolder);

        for (let i = 0; i < files.length; i++) {
            const item = files[i];
            progressNotice.setMessage(`⏳ Downloading (${i + 1}/${files.length}): ${item.name}...`);

            // Preserve directory structure relative to the folder being downloaded
            let relativePath = item.name;
            if (parsed.path && item.path.startsWith(parsed.path)) {
                relativePath = item.path.slice(parsed.path.length).replace(/^\/+/, '');
            } else if (!parsed.path) {
                relativePath = item.path;
            }

            const targetVaultPath = normalizePath(`${destFolder}/${relativePath}`);

            if (item.downloadUrl) {
                const response = await requestUrl({ url: item.downloadUrl });
                await saveVaultFile(app.vault, targetVaultPath, response.arrayBuffer);
            }
        }

        progressNotice.hide();
        new Notice(`✓ Downloaded ${files.length} file(s) into "${destFolder}"!`);

    } catch (err) {
        progressNotice.hide();
        console.error('[ExtractGitHubFolder] Error:', err);
        new Notice(`❌ Download failed: ${err.message}`);
    }

    // --- Helper Functions ---

    function findGitHubWebview() {
        const activeLeaf = document.querySelector('.workspace-leaf.mod-active');
        if (activeLeaf) {
            const wv = activeLeaf.querySelector('webview');
            if (wv && getWebviewUrl(wv).includes('github.com')) return wv;
        }

        const all = Array.from(document.querySelectorAll('webview'));
        const ghViews = all.filter(wv => getWebviewUrl(wv).includes('github.com'));

        if (ghViews.length === 1) return ghViews[0];

        for (const wv of ghViews) {
            if (wv.offsetParent !== null && wv.offsetWidth > 0) return wv;
        }

        return ghViews[0] || null;
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

    function parseGitHubUrl(url) {
        try {
            const parsed = new URL(url);
            const segments = parsed.pathname.split('/').filter(Boolean);
            if (segments.length < 2) return null;

            const owner = segments[0];
            const repo = segments[1];

            // Root of repository (e.g. https://github.com/owner/repo)
            if (segments.length === 2) {
                return { owner, repo, branch: null, path: '', isFile: false };
            }

            const type = segments[2]; // 'tree' or 'blob'
            const branch = segments[3];
            const rawPath = segments.slice(4).join('/');
            const decodedPath = decodeURIComponent(rawPath).replace(/\/+$/, '');

            return {
                owner,
                repo,
                branch,
                path: decodedPath,
                isFile: type === 'blob'
            };
        } catch {
            return null;
        }
    }

    async function fetchDefaultBranch(owner, repo, headers) {
        const res = await requestUrl({
            url: `https://api.github.com/repos/${owner}/${repo}`,
            headers
        });
        return res.json?.default_branch || 'main';
    }

    async function fetchSingleFileInfo(owner, repo, branch, filePath, headers) {
        const encodedPath = filePath.split('/').filter(Boolean).map(encodeURIComponent).join('/');
        const res = await requestUrl({
            url: `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}?ref=${branch}`,
            headers
        });
        const data = res.json;
        return {
            name: data.name,
            path: data.path,
            downloadUrl: data.download_url
        };
    }

    async function fetchRepoDirectory(owner, repo, branch, folderPath, headers) {
        const encodedPath = folderPath
            ? folderPath.split('/').filter(Boolean).map(encodeURIComponent).join('/')
            : '';

        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}?ref=${branch}`;

        const res = await requestUrl({ url: apiUrl, headers });

        if (res.status === 403 && res.text && res.text.includes('API rate limit')) {
            throw new Error('GitHub API rate limit exceeded. Add a GITHUB_TOKEN to Script Runner secrets.');
        }

        if (res.status !== 200) {
            throw new Error(`GitHub API error (${res.status}): ${res.text}`);
        }

        const items = res.json;
        if (!Array.isArray(items)) {
            return [{
                name: items.name,
                path: items.path,
                downloadUrl: items.download_url
            }];
        }

        let fileList = [];
        for (const item of items) {
            if (item.type === 'file') {
                fileList.push({
                    name: item.name,
                    path: item.path,
                    downloadUrl: item.download_url
                });
            } else if (item.type === 'dir') {
                const subFiles = await fetchRepoDirectory(owner, repo, branch, item.path, headers);
                fileList.push(...subFiles);
            }
        }

        return fileList;
    }

    async function ensureFolderRecursive(vault, path) {
        const clean = path.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
        if (!clean) return;

        const parts = clean.split('/');
        let current = '';
        for (const part of parts) {
            current = current ? `${current}/${part}` : part;
            if (!(await vault.adapter.exists(current))) {
                try {
                    await vault.createFolder(current);
                } catch (e) {}
            }
        }
    }

    async function saveVaultFile(vault, targetFilePath, arrayBuffer) {
        const normalized = normalizePath(targetFilePath);
        const lastSlash = normalized.lastIndexOf('/');
        if (lastSlash !== -1) {
            await ensureFolderRecursive(vault, normalized.substring(0, lastSlash));
        }

        const existing = vault.getAbstractFileByPath(normalized);
        if (existing instanceof TFile) {
            await vault.modifyBinary(existing, arrayBuffer);
        } else {
            await vault.createBinary(normalized, arrayBuffer);
        }
    }
};