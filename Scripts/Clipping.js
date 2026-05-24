// Clipping.js
module.exports = async ({ app, obsidian }) => {
    const { Notice } = obsidian;
    const { exec } = require('child_process');
    const fs = require('fs');
    const path = require('path');
    const os = require('os');

    const ENV = {
        ...process.env,
        PATH: '/opt/homebrew/bin:/usr/local/bin:' + process.env.PATH,
        NODE_PATH: '/opt/homebrew/lib/node_modules'
    };

    const run = (cmd) => new Promise((resolve, reject) => {
        exec(cmd, { env: ENV }, (err, stdout, stderr) => {
            if (err) reject(new Error(stderr || err.message));
            else resolve(stdout);
        });
    });

    // --- PHASE 1: Attempt direct extraction from Obsidian's active Web Viewer tab ---
    const activeLeaf = app.workspace.getLeaf();
    const activeView = activeLeaf ? activeLeaf.view : null;
    let url = "";
    let html = "";
    let extractedDirectly = false;

    if (activeView) {
        const viewType = activeView.getViewType();
        // Support native Web Viewer as well as common community browser plugins
        if (viewType === 'webviewer' || viewType === 'web-browser' || viewType === 'surfing') {
            const webview = activeView.containerEl.querySelector('webview');
            if (webview) {
                try {
                    url = webview.src || (typeof webview.getURL === 'function' ? webview.getURL() : await webview.executeJavaScript('window.location.href'));
                    html = await webview.executeJavaScript('document.documentElement.outerHTML');
                    if (url && html) {
                        extractedDirectly = true;
                    }
                } catch (e) {
                    console.error('Clip.js: WebViewer direct extraction failed:', e);
                }
            }
        }
    }

    if (!extractedDirectly) {
        new Notice('Please select an active Web Viewer tab to clip.');
        return;
    }

    const currentNotice = new Notice('Extracting directly from Web Viewer...', 0);

    try {
        const basePath = app.vault.adapter.basePath;
        const clippingsDir = path.join(basePath, 'Private', 'Clippings');
        if (!fs.existsSync(clippingsDir)) fs.mkdirSync(clippingsDir, { recursive: true });

        const ts = Date.now();
        const tmpHtml = path.join(os.tmpdir(), `clip-html-${ts}.html`);

        // Apply <base href> tag to guarantee relative URLs (like SVG diagrams) are resolved correctly
        const baseUrl = new URL(url).origin;
        let content = html;
        if (content.toLowerCase().includes('<head>')) {
            content = content.replace(/<head>/i, '<head><base href="' + baseUrl + '/">');
        } else {
            content = '<base href="' + baseUrl + '/">' + content;
        }
        fs.writeFileSync(tmpHtml, content);

        const date = new Date().toISOString().slice(0, 10);
        const slug = url.replace(/https?:\/\//, '').replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').slice(0, 60);
        const filename = `${date}-${slug}.md`;
        const outPath  = path.join(clippingsDir, filename);

        await run(`npx defuddle parse "${tmpHtml}" --markdown --output "${outPath}"`);
        fs.unlinkSync(tmpHtml);

        // Prepend custom YAML frontmatter
        if (fs.existsSync(outPath)) {
            const markdownContent = fs.readFileSync(outPath, 'utf8');
            const frontmatter = `---\nSource:\n  - ${url}\n---\n\n`;
            fs.writeFileSync(outPath, frontmatter + markdownContent);
        }

        await new Promise(r => setTimeout(r, 600));

        const vaultPath = `Private/Clippings/${filename}`;
        const file = app.vault.getAbstractFileByPath(vaultPath);
        if (file) await app.workspace.getLeaf().openFile(file);

        currentNotice.hide();
        new Notice(`Clipped → ${filename}`);

    } catch (err) {
        if (currentNotice) currentNotice.hide();
        new Notice(`Clip failed: ${err.message}`);
        console.error('Clip.js error:', err);
    }
};