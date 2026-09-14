/**
 * Script Name: Extract GitHub Folder / File to Clipboard
 * Description: Detects the active GitHub <webview> tab, recursively downloads the
 *              target folder or single file, and copies the files directly to the
 *              macOS clipboard as native file objects (matching copyDir.zsh).
 * Compatibility: Script Runner Plugin for Obsidian (macOS Desktop)
 */

module.exports = async function ({ app, obsidian, secrets }) {
    const { Notice, Platform, normalizePath, TFile, requestUrl } = obsidian;

    // --- Configuration ---
    const CONFIG = {
        copyToClipboard: true,      // Copy downloaded files to macOS clipboard as native file objects
        saveToVault: false,         // Set to false: stages in /tmp so your Obsidian vault stays clean
        baseFolder: 'Private/Clippings/GitHub', // Vault root folder (only used if saveToVault is true)
        includeRepoName: true,      // Nest under <RepoName>/...
        openFolderInExplorer: false // Reveal folder in file explorer when done (if saveToVault: true)
    };

    if (!Platform.isDesktopApp) {
        new Notice('❌ Webview extraction is only supported on Obsidian Desktop.');
        return;
    }

    const path = require('path');
    const os = require('os');
    const fs = require('fs');
    const { spawn } = require('child_process');

    // 1. Locate the active GitHub <webview>
    const webview = findGitHubWebview();
    if (!webview) {
        new Notice('❌ No active GitHub webview found. Make sure GitHub is open in an Obsidian tab.');
        return;
    }

    const progressNotice = new Notice('⏳ Detecting GitHub target...', 0);

    try {
        // 2. Get the current URL from the webview context
        let targetUrl = '';
        try {
            targetUrl = await webview.executeJavaScript('window.location.href');
        } catch (e) {
            targetUrl = getWebviewUrl(webview);
        }

        if (!targetUrl || !targetUrl.includes('github.com')) {
            progressNotice.hide();
            new Notice('❌ The active tab is not a valid github.com page.');
            return;
        }

        // 3. Parse GitHub URL
        const parsed = parseGitHubUrl(targetUrl);
        if (!parsed) {
            progressNotice.hide();
            new Notice('❌ Could not parse GitHub repository or path from URL.');
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

        // Detect default branch if viewing repository root
        if (!parsed.branch) {
            progressNotice.setMessage('🔍 Detecting default repository branch...');
            parsed.branch = await fetchDefaultBranch(parsed.owner, parsed.repo, headers);
        }

        progressNotice.setMessage(`🔍 Scanning GitHub: ${parsed.owner}/${parsed.repo} (${parsed.path || 'root'})...`);

        // 5. Fetch file list (handles single files or recursive directory trees)
        let files = [];
        if (parsed.isFile) {
            const singleFile = await fetchSingleFileInfo(parsed.owner, parsed.repo, parsed.branch, parsed.path, headers);
            if (singleFile) files.push(singleFile);
        } else {
            files = await fetchRepoDirectory(parsed.owner, parsed.repo, parsed.branch, parsed.path, headers);
        }

        if (files.length === 0) {
            progressNotice.hide();
            new Notice('⚠️ No files found at this GitHub location.');
            return;
        }

        // 6. Determine folder paths
        let folderPart = '';
        if (parsed.isFile) {
            const lastSlash = parsed.path.lastIndexOf('/');
            folderPart = lastSlash !== -1 ? parsed.path.substring(0, lastSlash) : '';
        } else {
            folderPart = parsed.path;
        }

        const tempBaseDir = path.join(os.tmpdir(), 'obsidian-github-clipboard');

        // Clean previous staging files in /tmp so old files do not accumulate
        if (!CONFIG.saveToVault && fs.existsSync(tempBaseDir)) {
            try {
                fs.rmSync(tempBaseDir, { recursive: true, force: true });
            } catch (e) {}
        }

        let destVaultFolder = normalizePath(CONFIG.baseFolder);
        if (CONFIG.includeRepoName) {
            destVaultFolder = normalizePath(`${destVaultFolder}/${parsed.repo}`);
        }
        if (folderPart) {
            destVaultFolder = normalizePath(`${destVaultFolder}/${folderPart}`);
        }

        let destDiskFolder = tempBaseDir;
        if (CONFIG.includeRepoName) {
            destDiskFolder = path.join(destDiskFolder, parsed.repo);
        }
        if (folderPart) {
            destDiskFolder = path.join(destDiskFolder, folderPart);
        }

        if (CONFIG.saveToVault) {
            await ensureFolderRecursive(app.vault, destVaultFolder);
        }

        const vaultBasePath = (app.vault.adapter).basePath;
        const downloadedAbsolutePaths = [];

        // 7. Download and save files
        for (let i = 0; i < files.length; i++) {
            const item = files[i];
            progressNotice.setMessage(`⏳ Downloading (${i + 1}/${files.length}): ${item.name}...`);

            // Compute relative path
            let relativePath = item.name;
            if (parsed.isFile) {
                relativePath = item.name;
            } else if (parsed.path && item.path.startsWith(parsed.path)) {
                relativePath = item.path.slice(parsed.path.length).replace(/^\/+/, '') || item.name;
            } else if (!parsed.path) {
                relativePath = item.path;
            }

            // Fallback to raw GitHub endpoint if download_url is null
            let downloadUrl = item.downloadUrl;
            if (!downloadUrl) {
                const encodedPath = item.path.split('/').filter(Boolean).map(encodeURIComponent).join('/');
                downloadUrl = `https://raw.githubusercontent.com/${parsed.owner}/${parsed.repo}/${parsed.branch}/${encodedPath}`;
            }

            const downloadHeaders = {};
            if (token) downloadHeaders['Authorization'] = `token ${token}`;

            const response = await requestUrl({ url: downloadUrl, headers: downloadHeaders });

            if (CONFIG.saveToVault) {
                const targetVaultPath = normalizePath(`${destVaultFolder}/${relativePath}`);
                await saveVaultFile(app.vault, targetVaultPath, response.arrayBuffer);
                downloadedAbsolutePaths.push(path.join(vaultBasePath, targetVaultPath));
            } else {
                const absDiskPath = path.join(destDiskFolder, relativePath);
                await fs.promises.mkdir(path.dirname(absDiskPath), { recursive: true });
                await fs.promises.writeFile(absDiskPath, Buffer.from(response.arrayBuffer));
                downloadedAbsolutePaths.push(absDiskPath);
            }
        }

        // 8. Copy native file objects to macOS Clipboard (NSPasteboard via osascript)
        if (CONFIG.copyToClipboard && downloadedAbsolutePaths.length > 0) {
            if (process.platform === 'darwin') {
                progressNotice.setMessage('📋 Copying files to macOS clipboard...');
                await copyFilesToMacClipboard(downloadedAbsolutePaths);
            } else {
                new Notice('⚠️ Clipboard file copying is only supported on macOS.');
            }
        }

        progressNotice.hide();

        const countStr = `${files.length} file${files.length > 1 ? 's' : ''}`;
        if (CONFIG.copyToClipboard && CONFIG.saveToVault) {
            new Notice(`✓ Copied ${countStr} to clipboard & saved to vault!`);
        } else if (CONFIG.copyToClipboard) {
            new Notice(`✓ Copied ${countStr} to macOS clipboard! (Ready to paste)`);
        } else {
            new Notice(`✓ Downloaded ${countStr} into "${destVaultFolder}"!`);
        }

    } catch (err) {
        progressNotice.hide();
        console.error('[ExtractGitHubFolder] Error:', err);
        new Notice(`❌ Extraction failed: ${err.message}`);
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

    function parseGitHubUrl(rawUrl) {
        try {
            let urlStr = rawUrl.trim();
            if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
                urlStr = 'https://' + urlStr;
            }

            const parsed = new URL(urlStr);
            const segments = parsed.pathname.split('/').filter(Boolean);
            if (segments.length < 2) return null;

            const owner = segments[0];
            const repo = segments[1];

            // Root of repo (e.g. https://github.com/owner/repo)
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
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}?ref=${branch}`;

        const res = await requestUrl({ url: apiUrl, headers });

        if (res.status === 403 && res.text && res.text.includes('API rate limit')) {
            throw new Error('GitHub API rate limit exceeded. Add a GITHUB_TOKEN to Script Runner secrets.');
        }

        const data = res.json;
        return {
            name: data.name || filePath.split('/').pop(),
            path: data.path || filePath,
            downloadUrl: data.download_url || `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${encodedPath}`
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

    async function ensureFolderRecursive(vault, folderPath) {
        const clean = folderPath.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
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

    function copyFilesToMacClipboard(filePaths) {
        return new Promise((resolve, reject) => {
            const child = spawn('osascript', ['-', ...filePaths]);

            let stderr = '';
            child.stderr.on('data', (d) => { stderr += d.toString(); });
            child.on('error', reject);
            child.on('close', (code) => {
                if (code === 0) resolve();
                else reject(new Error(stderr || `osascript exited with code ${code}`));
            });

            // Replicating copyDir.zsh AppleScript
            const appleScript = `
use framework "Foundation"
use framework "AppKit"
use scripting additions

on run argv
    set fileURLs to current application's NSMutableArray's array()
    repeat with aPath in argv
        (fileURLs's addObject:(current application's NSURL's fileURLWithPath:aPath))
    end repeat
    set pb to current application's NSPasteboard's generalPasteboard()
    pb's clearContents()
    pb's writeObjects:fileURLs
    delay 0.2
end run
`;
            child.stdin.write(appleScript);
            child.stdin.end();
        });
    }
};