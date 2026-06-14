---
status: done
reminders:
  - id: rem_1779605731195_9h4jt4461
    type: relative
    description: ""
    relatedTo: scheduled
    offset: -PT0H
tags:
  - task
parent:
  - "[[(T) Task Date Visualizer]]"
completedDate: 2026-05-24
---
## Setup
```
npm install -g playwright && npx playwright install chromium
npm install -g defuddle
```
- Chrome can be open and still work
- Might not need above for V6 and above?
## V7
- Prepending the frontmatter "Source" + URL
```javascript
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
```
## V6
- Can use within Obsidian web viewer
	- Works even in split-view!
	- On this website in theory section, the markdown was identical to what obsidian web clipper produced
		- https://www.tensortonic.com/problems/sigmoid-numpy
```javascript
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
```
## V5
- Works, but if you want the python version of a script, you won't be able to get it
	- https://thita.ai/dsa-patterns/two-pointers/converging-sorted-array-target-sum
```javascript
// Clipping.js
module.exports = async ({ app, obsidian }) => {
    const { Modal, Notice } = obsidian;
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

    const basePath = app.vault.adapter.basePath;
    const sessionsDir = path.join(basePath, 'Private', 'Clippings', 'sessions');
    if (!fs.existsSync(sessionsDir)) fs.mkdirSync(sessionsDir, { recursive: true });

    // Normalize domain by stripping "www." so subdomains share the same session file
    const sessionPath = (url) => {
        let domain = new URL(url).hostname;
        if (domain.startsWith('www.')) {
            domain = domain.substring(4);
        }
        return path.join(sessionsDir, `${domain}.json`);
    };

    const hasLoginWall = (html) => {
        // Strip out script, style, and svg tags to avoid false positives from code bundles
        const cleanHtml = html
            .replace(/<script\b[\s\S]*?<\/script>/gi, '')
            .replace(/<style\b[\s\S]*?<\/style>/gi, '')
            .replace(/<svg\b[\s\S]*?<\/svg>/gi, '');

        const lower = cleanHtml.toLowerCase();
        const indicators = [
            'sign in to access',
            'log in to access',
            'please sign in',
            'please log in',
            'login required',
            'signin required',
            'create an account to',
            'you must be logged in',
        ];
        return indicators.some(i => lower.includes(i));
    };

    const renderPage = async (url, statePath) => {
        const ts = Date.now();
        const tmpScript = path.join(os.tmpdir(), `clip-pw-${ts}.js`);
        const tmpHtml   = path.join(os.tmpdir(), `clip-html-${ts}.html`);

        const stateArg = statePath && fs.existsSync(statePath)
            ? `storageState: ${JSON.stringify(statePath)},`
            : '';

        fs.writeFileSync(tmpScript, `
const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch({ 
        headless: true,
        args: ['--disable-blink-features=AutomationControlled']
    });
    const context = await browser.newContext({
        ${stateArg}
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();
    await page.goto(${JSON.stringify(url)}, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    // Inject <base href> tag to allow defuddle to resolve relative links and images natively
    let content = await page.content();
    const baseUrl = new URL(${JSON.stringify(url)}).origin;
    if (content.toLowerCase().includes('<head>')) {
        content = content.replace(/<head>/i, '<head><base href="' + baseUrl + '/">');
    } else {
        content = '<base href="' + baseUrl + '/">' + content;
    }

    require('fs').writeFileSync(${JSON.stringify(tmpHtml)}, content);
    await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
        `);

        await run(`node "${tmpScript}"`);
        fs.unlinkSync(tmpScript);
        return tmpHtml;
    };

    const loginAndSaveSession = async (url, statePath) => {
    const ts = Date.now();
    const tmpScript = path.join(os.tmpdir(), `clip-login-${ts}.js`);
    const origin = new URL(url).origin;

    fs.writeFileSync(tmpScript, `
const { chromium } = require('playwright');
const path = require('path');
const os = require('os');
(async () => {
    const userDataDir = path.join(os.tmpdir(), 'playwright-google-login-profile');
    const context = await chromium.launchPersistentContext(userDataDir, {
        headless: false,
        ignoreDefaultArgs: ['--enable-automation'],
        args: ['--disable-blink-features=AutomationControlled']
    });
    const page = context.pages()[0] || await context.newPage();
    await page.goto(${JSON.stringify(origin)});
    console.log('Log in, then close the browser window.');

    // Save session using Playwright's native storageState call.
    const saveState = async () => {
        try {
            const state = await context.storageState();
            require('fs').writeFileSync(${JSON.stringify(statePath)}, JSON.stringify(state, null, 2));
        } catch (e) {
            // Ignore errors if context is closing
        }
    };

    // Capture state immediately on navigation and when closing the window
    page.on('framenavigated', saveState);
    page.on('close', saveState);

    await new Promise(resolve => context.on('close', resolve));
    console.log('Session saved.');
})().catch(e => { console.error(e); process.exit(1); });
    `);

    await run(`node "${tmpScript}"`);
    fs.unlinkSync(tmpScript);
    };

    const url = await new Promise((resolve, reject) => {
        class UrlModal extends Modal {
            constructor(app) {
                super(app);
                this.submitted = false;
            }
            onOpen() {
                this.contentEl.createEl('h2', { text: 'Clip URL' });
                const input = this.contentEl.createEl('input', { type: 'text' });
                input.placeholder = 'https://...';
                input.style.cssText = 'width:100%; margin-bottom:8px;';
                input.focus();
                const btn = this.contentEl.createEl('button', { text: 'Clip' });
                const submit = () => {
                    const val = input.value.trim();
                    if (!val) return;
                    this.submitted = true;
                    this.close();
                    resolve(val);
                };
                btn.addEventListener('click', submit);
                input.addEventListener('keydown', e => {
                    if (e.key === 'Enter') submit();
                    if (e.key === 'Escape') this.close();
                });
            }
            onClose() {
                this.contentEl.empty();
                if (!this.submitted) reject(new Error('Cancelled'));
            }
        }
        new UrlModal(app).open();
    }).catch(() => null);

    if (!url) return;

    let currentNotice = new Notice('Clipping...', 0);

    try {
        const clippingsDir = path.join(basePath, 'Private', 'Clippings');
        if (!fs.existsSync(clippingsDir)) fs.mkdirSync(clippingsDir, { recursive: true });

        const statePath = sessionPath(url);
        const debugPath = path.join(clippingsDir, 'debug-login-wall.html');

        let tmpHtml = await renderPage(url, statePath);
        let html = fs.readFileSync(tmpHtml, 'utf8');

        if (hasLoginWall(html)) {
            // Save the problematic HTML so you can open it and inspect what went wrong
            fs.writeFileSync(debugPath, html);

            fs.unlinkSync(tmpHtml);
            currentNotice.hide();

            currentNotice = new Notice('Login required — log in then close the browser...', 0);
            await loginAndSaveSession(url, statePath);
            currentNotice.hide();

            currentNotice = new Notice('Clipping...', 0);
            tmpHtml = await renderPage(url, statePath);
            html = fs.readFileSync(tmpHtml, 'utf8');
        }

        const date = new Date().toISOString().slice(0, 10);
        const slug = url.replace(/https?:\/\//, '').replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').slice(0, 60);
        const filename = `${date}-${slug}.md`;
        const outPath  = path.join(clippingsDir, filename);

        await run(`npx defuddle parse "${tmpHtml}" --markdown --output "${outPath}"`);
        fs.unlinkSync(tmpHtml);

        // Delete the debug file if the capture succeeded
        if (fs.existsSync(debugPath)) fs.unlinkSync(debugPath);

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
```
## V4
- Works but truncates URL domains from images within document
```javascript
// Clipping.js
module.exports = async ({ app, obsidian }) => {
    const { Modal, Notice } = obsidian;
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

    const basePath = app.vault.adapter.basePath;
    const sessionsDir = path.join(basePath, 'Private', 'Clippings', 'sessions');
    if (!fs.existsSync(sessionsDir)) fs.mkdirSync(sessionsDir, { recursive: true });

    // Normalize domain by stripping "www." so subdomains share the same session file
    const sessionPath = (url) => {
        let domain = new URL(url).hostname;
        if (domain.startsWith('www.')) {
            domain = domain.substring(4);
        }
        return path.join(sessionsDir, `${domain}.json`);
    };

    const hasLoginWall = (html) => {
        // Strip out script, style, and svg tags to avoid false positives from code bundles
        const cleanHtml = html
            .replace(/<script\b[\s\S]*?<\/script>/gi, '')
            .replace(/<style\b[\s\S]*?<\/style>/gi, '')
            .replace(/<svg\b[\s\S]*?<\/svg>/gi, '');

        const lower = cleanHtml.toLowerCase();
        const indicators = [
            'sign in to access',
            'log in to access',
            'please sign in',
            'please log in',
            'login required',
            'signin required',
            'create an account to',
            'you must be logged in',
        ];
        return indicators.some(i => lower.includes(i));
    };

    const renderPage = async (url, statePath) => {
        const ts = Date.now();
        const tmpScript = path.join(os.tmpdir(), `clip-pw-${ts}.js`);
        const tmpHtml   = path.join(os.tmpdir(), `clip-html-${ts}.html`);

        const stateArg = statePath && fs.existsSync(statePath)
            ? `storageState: ${JSON.stringify(statePath)},`
            : '';

        fs.writeFileSync(tmpScript, `
const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch({ 
        headless: true,
        args: ['--disable-blink-features=AutomationControlled']
    });
    const context = await browser.newContext({
        ${stateArg}
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();
    await page.goto(${JSON.stringify(url)}, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    require('fs').writeFileSync(${JSON.stringify(tmpHtml)}, await page.content());
    await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
        `);

        await run(`node "${tmpScript}"`);
        fs.unlinkSync(tmpScript);
        return tmpHtml;
    };

    const loginAndSaveSession = async (url, statePath) => {
    const ts = Date.now();
    const tmpScript = path.join(os.tmpdir(), `clip-login-${ts}.js`);
    const origin = new URL(url).origin;

    fs.writeFileSync(tmpScript, `
const { chromium } = require('playwright');
const path = require('path');
const os = require('os');
(async () => {
    const userDataDir = path.join(os.tmpdir(), 'playwright-google-login-profile');
    const context = await chromium.launchPersistentContext(userDataDir, {
        headless: false,
        ignoreDefaultArgs: ['--enable-automation'],
        args: ['--disable-blink-features=AutomationControlled']
    });
    const page = context.pages()[0] || await context.newPage();
    await page.goto(${JSON.stringify(origin)});
    console.log('Log in, then close the browser window.');

    // Save session using Playwright's native storageState call.
    const saveState = async () => {
        try {
            const state = await context.storageState();
            require('fs').writeFileSync(${JSON.stringify(statePath)}, JSON.stringify(state, null, 2));
        } catch (e) {
            // Ignore errors if context is closing
        }
    };

    // Capture state immediately on navigation and when closing the window
    page.on('framenavigated', saveState);
    page.on('close', saveState);

    await new Promise(resolve => context.on('close', resolve));
    console.log('Session saved.');
})().catch(e => { console.error(e); process.exit(1); });
    `);

    await run(`node "${tmpScript}"`);
    fs.unlinkSync(tmpScript);
    };

    const url = await new Promise((resolve, reject) => {
        class UrlModal extends Modal {
            constructor(app) {
                super(app);
                this.submitted = false;
            }
            onOpen() {
                this.contentEl.createEl('h2', { text: 'Clip URL' });
                const input = this.contentEl.createEl('input', { type: 'text' });
                input.placeholder = 'https://...';
                input.style.cssText = 'width:100%; margin-bottom:8px;';
                input.focus();
                const btn = this.contentEl.createEl('button', { text: 'Clip' });
                const submit = () => {
                    const val = input.value.trim();
                    if (!val) return;
                    this.submitted = true;
                    this.close();
                    resolve(val);
                };
                btn.addEventListener('click', submit);
                input.addEventListener('keydown', e => {
                    if (e.key === 'Enter') submit();
                    if (e.key === 'Escape') this.close();
                });
            }
            onClose() {
                this.contentEl.empty();
                if (!this.submitted) reject(new Error('Cancelled'));
            }
        }
        new UrlModal(app).open();
    }).catch(() => null);

    if (!url) return;

    let currentNotice = new Notice('Clipping...', 0);

    try {
        const clippingsDir = path.join(basePath, 'Private', 'Clippings');
        if (!fs.existsSync(clippingsDir)) fs.mkdirSync(clippingsDir, { recursive: true });

        const statePath = sessionPath(url);
        const debugPath = path.join(clippingsDir, 'debug-login-wall.html');

        let tmpHtml = await renderPage(url, statePath);
        let html = fs.readFileSync(tmpHtml, 'utf8');

        if (hasLoginWall(html)) {
            // Save the problematic HTML so you can open it and inspect what went wrong
            fs.writeFileSync(debugPath, html);

            fs.unlinkSync(tmpHtml);
            currentNotice.hide();

            currentNotice = new Notice('Login required — log in then close the browser...', 0);
            await loginAndSaveSession(url, statePath);
            currentNotice.hide();

            currentNotice = new Notice('Clipping...', 0);
            tmpHtml = await renderPage(url, statePath);
            html = fs.readFileSync(tmpHtml, 'utf8');
        }

        const date = new Date().toISOString().slice(0, 10);
        const slug = url.replace(/https?:\/\//, '').replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').slice(0, 60);
        const filename = `${date}-${slug}.md`;
        const outPath  = path.join(clippingsDir, filename);

        await run(`npx defuddle parse "${tmpHtml}" --markdown --output "${outPath}"`);
        fs.unlinkSync(tmpHtml);

        // Delete the debug file if the capture succeeded
        if (fs.existsSync(debugPath)) fs.unlinkSync(debugPath);

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
```
## V3
- Works but doesn't seem to use the saved json file
```javascript
// Clipping.js
module.exports = async ({ app, obsidian }) => {
    const { Modal, Notice } = obsidian;
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

    const basePath = app.vault.adapter.basePath;
    const sessionsDir = path.join(basePath, 'Private', 'Clippings', 'sessions');
    if (!fs.existsSync(sessionsDir)) fs.mkdirSync(sessionsDir, { recursive: true });

    const sessionPath = (url) => {
        const domain = new URL(url).hostname;
        return path.join(sessionsDir, `${domain}.json`);
    };

    const hasLoginWall = (html) => {
        const lower = html.toLowerCase();
        const indicators = [
            'sign in to access',
            'log in to access',
            'please sign in',
            'please log in',
            'login required',
            'signin required',
            'create an account to',
            'you must be logged in',
            'unauthorized',
        ];
        return indicators.some(i => lower.includes(i));
    };

    const renderPage = async (url, statePath) => {
        const ts = Date.now();
        const tmpScript = path.join(os.tmpdir(), `clip-pw-${ts}.js`);
        const tmpHtml   = path.join(os.tmpdir(), `clip-html-${ts}.html`);

        const stateArg = statePath && fs.existsSync(statePath)
            ? `{ storageState: ${JSON.stringify(statePath)} }`
            : '{}';

        fs.writeFileSync(tmpScript, `
const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch({ 
        headless: true,
        args: ['--disable-blink-features=AutomationControlled']
    });
    const context = await browser.newContext(${stateArg});
    const page = await context.newPage();
    await page.goto(${JSON.stringify(url)}, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    require('fs').writeFileSync(${JSON.stringify(tmpHtml)}, await page.content());
    await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
        `);

        await run(`node "${tmpScript}"`);
        fs.unlinkSync(tmpScript);
        return tmpHtml;
    };

    const loginAndSaveSession = async (url, statePath) => {
    const ts = Date.now();
    const tmpScript = path.join(os.tmpdir(), `clip-login-${ts}.js`);
    const origin = new URL(url).origin;

    fs.writeFileSync(tmpScript, `
const { chromium } = require('playwright');
const path = require('path');
const os = require('os');
(async () => {
    const userDataDir = path.join(os.tmpdir(), 'playwright-google-login-profile');
    const context = await chromium.launchPersistentContext(userDataDir, {
        headless: false,
        ignoreDefaultArgs: ['--enable-automation'],
        args: ['--disable-blink-features=AutomationControlled']
    });
    const page = context.pages()[0] || await context.newPage();
    await page.goto(${JSON.stringify(origin)});
    console.log('Log in, then close the browser window.');

    // Extract cookies and localStorage manually on an interval.
    // This avoids calling context.storageState() directly, which causes Playwright
    // to spawn distracting background helper tabs to inspect localStorage.
    const interval = setInterval(async () => {
        try {
            const cookies = await context.cookies().catch(() => []);
            let localStorageData = [];
            
            try {
                localStorageData = await page.evaluate(() => {
                    const items = [];
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        items.push({ name: key, value: localStorage.getItem(key) });
                    }
                    return items;
                });
            } catch (e) {
                // Page might be navigating or temporarily closed; ignore and retry next interval
            }

            const state = {
                cookies: cookies,
                origins: [
                    {
                        origin: ${JSON.stringify(origin)},
                        localStorage: localStorageData
                    }
                ]
            };

            require('fs').writeFileSync(${JSON.stringify(statePath)}, JSON.stringify(state, null, 2));
        } catch (e) {
            // Ignore errors if context/browser is currently closing
        }
    }, 1000);

    await new Promise(resolve => context.on('close', resolve));
    clearInterval(interval);
    console.log('Session saved.');
})().catch(e => { console.error(e); process.exit(1); });
    `);

    await run(`node "${tmpScript}"`);
    fs.unlinkSync(tmpScript);
    };

    const url = await new Promise((resolve, reject) => {
        class UrlModal extends Modal {
            constructor(app) {
                super(app);
                this.submitted = false;
            }
            onOpen() {
                this.contentEl.createEl('h2', { text: 'Clip URL' });
                const input = this.contentEl.createEl('input', { type: 'text' });
                input.placeholder = 'https://...';
                input.style.cssText = 'width:100%; margin-bottom:8px;';
                input.focus();
                const btn = this.contentEl.createEl('button', { text: 'Clip' });
                const submit = () => {
                    const val = input.value.trim();
                    if (!val) return;
                    this.submitted = true;
                    this.close();
                    resolve(val);
                };
                btn.addEventListener('click', submit);
                input.addEventListener('keydown', e => {
                    if (e.key === 'Enter') submit();
                    if (e.key === 'Escape') this.close();
                });
            }
            onClose() {
                this.contentEl.empty();
                if (!this.submitted) reject(new Error('Cancelled'));
            }
        }
        new UrlModal(app).open();
    }).catch(() => null);

    if (!url) return;

    let currentNotice = new Notice('Clipping...', 0);

    try {
        const clippingsDir = path.join(basePath, 'Private', 'Clippings');
        if (!fs.existsSync(clippingsDir)) fs.mkdirSync(clippingsDir, { recursive: true });

        const statePath = sessionPath(url);

        let tmpHtml = await renderPage(url, statePath);
        let html = fs.readFileSync(tmpHtml, 'utf8');

        if (hasLoginWall(html)) {
            fs.unlinkSync(tmpHtml);
            currentNotice.hide();

            currentNotice = new Notice('Login required — log in then close the browser...', 0);
            await loginAndSaveSession(url, statePath);
            currentNotice.hide();

            currentNotice = new Notice('Clipping...', 0);
            tmpHtml = await renderPage(url, statePath);
            html = fs.readFileSync(tmpHtml, 'utf8');
        }

        const date = new Date().toISOString().slice(0, 10);
        const slug = url.replace(/https?:\/\//, '').replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').slice(0, 60);
        const filename = `${date}-${slug}.md`;
        const outPath  = path.join(clippingsDir, filename);

        await run(`npx defuddle parse "${tmpHtml}" --markdown --output "${outPath}"`);
        fs.unlinkSync(tmpHtml);

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
```
## V2
- Able to use google Sign-in to login, but seems to get stuck on "Login required - log in then close the browser"
```javascript
// Clipping.js
module.exports = async ({ app, obsidian }) => {
    const { Modal, Notice } = obsidian;
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

    const basePath = app.vault.adapter.basePath;
    const sessionsDir = path.join(basePath, 'Private', 'Clippings', 'sessions');
    if (!fs.existsSync(sessionsDir)) fs.mkdirSync(sessionsDir, { recursive: true });

    const sessionPath = (url) => {
        const domain = new URL(url).hostname;
        return path.join(sessionsDir, `${domain}.json`);
    };

    const hasLoginWall = (html) => {
        const lower = html.toLowerCase();
        const indicators = [
            'sign in to access',
            'log in to access',
            'please sign in',
            'please log in',
            'login required',
            'signin required',
            'create an account to',
            'you must be logged in',
            'unauthorized',
        ];
        return indicators.some(i => lower.includes(i));
    };

    const renderPage = async (url, statePath) => {
        const ts = Date.now();
        const tmpScript = path.join(os.tmpdir(), `clip-pw-${ts}.js`);
        const tmpHtml   = path.join(os.tmpdir(), `clip-html-${ts}.html`);

        const stateArg = statePath && fs.existsSync(statePath)
            ? `{ storageState: ${JSON.stringify(statePath)} }`
            : '{}';

        fs.writeFileSync(tmpScript, `
const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch({ 
        headless: true,
        args: ['--disable-blink-features=AutomationControlled']
    });
    const context = await browser.newContext(${stateArg});
    const page = await context.newPage();
    await page.goto(${JSON.stringify(url)}, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    require('fs').writeFileSync(${JSON.stringify(tmpHtml)}, await page.content());
    await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
        `);

        await run(`node "${tmpScript}"`);
        fs.unlinkSync(tmpScript);
        return tmpHtml;
    };

    const loginAndSaveSession = async (url, statePath) => {
    const ts = Date.now();
    const tmpScript = path.join(os.tmpdir(), `clip-login-${ts}.js`);
    const origin = new URL(url).origin;

    fs.writeFileSync(tmpScript, `
const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch({ 
        headless: false,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        args: ['--disable-blink-features=AutomationControlled']
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(${JSON.stringify(origin)});
    console.log('Log in, then close the browser window.');
    await new Promise(resolve => browser.on('disconnected', resolve));
    await context.storageState({ path: ${JSON.stringify(statePath)} });
    console.log('Session saved.');
})().catch(e => { console.error(e); process.exit(1); });
    `);

    await run(`node "${tmpScript}"`);
    fs.unlinkSync(tmpScript);
    };

    const url = await new Promise((resolve, reject) => {
        class UrlModal extends Modal {
            constructor(app) {
                super(app);
                this.submitted = false;
            }
            onOpen() {
                this.contentEl.createEl('h2', { text: 'Clip URL' });
                const input = this.contentEl.createEl('input', { type: 'text' });
                input.placeholder = 'https://...';
                input.style.cssText = 'width:100%; margin-bottom:8px;';
                input.focus();
                const btn = this.contentEl.createEl('button', { text: 'Clip' });
                const submit = () => {
                    const val = input.value.trim();
                    if (!val) return;
                    this.submitted = true;
                    this.close();
                    resolve(val);
                };
                btn.addEventListener('click', submit);
                input.addEventListener('keydown', e => {
                    if (e.key === 'Enter') submit();
                    if (e.key === 'Escape') this.close();
                });
            }
            onClose() {
                this.contentEl.empty();
                if (!this.submitted) reject(new Error('Cancelled'));
            }
        }
        new UrlModal(app).open();
    }).catch(() => null);

    if (!url) return;

    const notice = new Notice('Clipping...', 0);

    try {
        const clippingsDir = path.join(basePath, 'Private', 'Clippings');
        if (!fs.existsSync(clippingsDir)) fs.mkdirSync(clippingsDir, { recursive: true });

        const statePath = sessionPath(url);

        let tmpHtml = await renderPage(url, statePath);
        let html = fs.readFileSync(tmpHtml, 'utf8');

        if (hasLoginWall(html)) {
            fs.unlinkSync(tmpHtml);
            notice.hide();
            new Notice('Login required — log in then close the browser...', 0);

            await loginAndSaveSession(url, statePath);

            notice.hide();
            new Notice('Clipping...', 0);

            tmpHtml = await renderPage(url, statePath);
            html = fs.readFileSync(tmpHtml, 'utf8');
        }

        const date = new Date().toISOString().slice(0, 10);
        const slug = url.replace(/https?:\/\//, '').replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').slice(0, 60);
        const filename = `${date}-${slug}.md`;
        const outPath  = path.join(clippingsDir, filename);

        await run(`npx defuddle parse "${tmpHtml}" --markdown --output "${outPath}"`);
        fs.unlinkSync(tmpHtml);

        await new Promise(r => setTimeout(r, 600));

        const vaultPath = `Private/Clippings/${filename}`;
        const file = app.vault.getAbstractFileByPath(vaultPath);
        if (file) await app.workspace.getLeaf().openFile(file);

        notice.hide();
        new Notice(`Clipped → ${filename}`);

    } catch (err) {
        notice.hide();
        new Notice(`Clip failed: ${err.message}`);
        console.error('Clip.js error:', err);
    }
};
```
## V1
```javascript
// Clip.js
// Prerequisites (run once in terminal):
//   npm install -g playwright && npx playwright install chromium
//   npm install -g defuddle

module.exports = async ({ app, obsidian }) => {
    const { Modal, Notice } = obsidian;
    const { exec } = require('child_process');
    const fs = require('fs');
    const path = require('path');
    const os = require('os');

    // Promisified exec — avoids blocking Obsidian's UI thread
    const run = (cmd) => new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) reject(new Error(stderr || err.message));
            else resolve(stdout);
        });
    });

    // URL input modal
    const url = await new Promise((resolve, reject) => {
        class UrlModal extends Modal {
            onOpen() {
                this.contentEl.createEl('h2', { text: 'Clip URL' });

                const input = this.contentEl.createEl('input', { type: 'text' });
                input.placeholder = 'https://...';
                input.style.cssText = 'width:100%; margin-bottom:8px;';
                input.focus();

                const btn = this.contentEl.createEl('button', { text: 'Clip' });

                const submit = () => {
                    const val = input.value.trim();
                    if (!val) return;
                    this.close();
                    resolve(val);
                };

                btn.addEventListener('click', submit);
                input.addEventListener('keydown', e => {
                    if (e.key === 'Enter') submit();
                    if (e.key === 'Escape') { this.close(); reject(new Error('Cancelled')); }
                });
            }
            onClose() { this.contentEl.empty(); }
        }
        new UrlModal(app).open();
    }).catch(() => null);

    if (!url) return;

    const notice = new Notice('Clipping...', 0); // 0 = persist until dismissed

    try {
        const basePath = app.vault.adapter.basePath;
        const clippingsDir = path.join(basePath, 'Private', 'Clippings');

        if (!fs.existsSync(clippingsDir)) {
            fs.mkdirSync(clippingsDir, { recursive: true });
        }

        // Temp files
        const ts = Date.now();
        const tmpScript = path.join(os.tmpdir(), `clip-pw-${ts}.js`);
        const tmpHtml   = path.join(os.tmpdir(), `clip-html-${ts}.html`);

        // Write playwright script to disk — avoids shell escaping nightmares
        fs.writeFileSync(tmpScript, `
const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(${JSON.stringify(url)}, { waitUntil: 'networkidle', timeout: 30000 });
    require('fs').writeFileSync(${JSON.stringify(tmpHtml)}, await page.content());
    await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
        `);

        await run(`node "${tmpScript}"`);
        fs.unlinkSync(tmpScript);

        // Filename: date + slugified URL
        const date = new Date().toISOString().slice(0, 10);
        const slug = url.replace(/https?:\/\//, '').replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').slice(0, 60);
        const filename = `${date}-${slug}.md`;
        const outPath  = path.join(clippingsDir, filename);

        // Run defuddle — same engine as the Web Clipper
        await run(`npx defuddle parse "${tmpHtml}" --markdown --output "${outPath}"`);
        fs.unlinkSync(tmpHtml);

        // Wait for Obsidian's vault watcher to pick up the new file
        await new Promise(r => setTimeout(r, 600));

        const vaultPath = `Private/Clippings/${filename}`;
        const file = app.vault.getAbstractFileByPath(vaultPath);
        if (file) await app.workspace.getLeaf().openFile(file);

        notice.hide();
        new Notice(`Clipped → ${filename}`);

    } catch (err) {
        notice.hide();
        new Notice(`Clip failed: ${err.message}`);
        console.error('Clip.js error:', err);
    }
};
```