const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// 👇 YOUR PANDOC PATH
const PANDOC_PATH = '/opt/homebrew/bin/pandoc'; 

module.exports = async (params) => {
    const activeFile = app.workspace.getActiveFile();
    if (!activeFile) {
        new Notice("No active file found!");
        return;
    }

    const adapter = app.vault.adapter;
    const desktopPath = path.join(require('os').homedir(), 'Desktop');
    const fileName = activeFile.basename;
    const outputPath = path.join(desktopPath, `${fileName}.html`);
    
    // Temp files
    const tempMdPath = path.join(desktopPath, 'temp_export_zotero.md');
    const tempJsPath = path.join(desktopPath, 'copy_button.html');

    // 1. Create the Copy Button Script
    const copyButtonScript = `
    <style>
        pre { position: relative; }
        .copy-btn {
            position: absolute; top: 5px; right: 5px;
            background: #f0f0f0; border: 1px solid #ccc; border-radius: 4px;
            cursor: pointer; padding: 2px 8px; font-size: 12px;
            font-family: sans-serif;
        }
        .copy-btn:hover { background: #e0e0e0; }
    </style>
    <script>
    document.addEventListener("DOMContentLoaded", function() {
        document.querySelectorAll("pre code").forEach((codeBlock) => {
            const pre = codeBlock.parentNode;
            const btn = document.createElement("button");
            btn.className = "copy-btn";
            btn.innerText = "Copy";
            btn.addEventListener("click", () => {
                navigator.clipboard.writeText(codeBlock.innerText).then(() => {
                    btn.innerText = "Copied!";
                    setTimeout(() => btn.innerText = "Copy", 2000);
                });
            });
            pre.appendChild(btn);
        });
    });
    </script>
    `;
    fs.writeFileSync(tempJsPath, copyButtonScript);

    // 2. Read Content
    let content = await app.vault.read(activeFile);

    // 3. FIX IMAGES (Global)
    content = content.replace(/!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, linkText, alt) => {
        const file = app.metadataCache.getFirstLinkpathDest(linkText, activeFile.path);
        if (file) {
            let absolutePath = adapter.getFullPath(file.path);
            absolutePath = absolutePath.replace(/ /g, '%20'); 
            return `![${alt || ''}](${absolutePath})`;
        }
        return match;
    });

    // 4. INTELLIGENT FORMATTING (Split Text vs Code)
    const parts = content.split(/(```[\s\S]*?```)/g);

    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
            let part = parts[i];

            // --- THE SPECIFIC REQUESTED FIX ---
            // If a line starts with a list marker (- or 1.) and the next line is ---, 
            // insert a blank line between them.
            part = part.replace(/^([\s\t]*([-*+]|\d+\.) .*)[\r\n]+---$/gm, '$1\n\n---');

            // Maintain standard spacing for Headers and Lists to avoid "Wall of Text"
            part = part.replace(/^#+\s/gm, '\n\n$&');
            part = part.replace(/^(\d+\.|-|\*)\s/gm, '\n\n$&');

            parts[i] = part;
        }
    }
    
    content = parts.join('');

    // 5. Remove YAML (Frontmatter) - We do this last to ensure we don't trip metadata parser
    if (content.trimStart().startsWith('---')) {
        const secondDash = content.indexOf('---', 3);
        if (secondDash !== -1) content = content.substring(secondDash + 3);
    }

    // 6. EXTRA SAFETY: Forbid YAML Metadata parsing in Pandoc
    // We add a comment at the top so Pandoc knows Line 1 is content, not config.
    const finalContent = `<!-- PANDOC_SAFE_START -->\n\n${content}`;
    fs.writeFileSync(tempMdPath, finalContent);

    // 7. Build Pandoc Command
    const pandocCmd = [
        `"${PANDOC_PATH}"`,
        `"${tempMdPath}"`,
        `--from markdown`,
        `--embed-resources`,
        `--standalone`,
        `--include-after-body="${tempJsPath}"`,
        `--metadata title="${fileName}"`,
        `--variable css="https://cdn.jsdelivr.net/gh/kognise/water.css@latest/dist/light.min.css"`,
        `-o "${outputPath}"`
    ].join(' ');

    // 8. Execute
    new Notice("Generating HTML...");
    
    exec(pandocCmd, (error, stdout, stderr) => {
        if (fs.existsSync(tempMdPath)) fs.unlinkSync(tempMdPath);
        if (fs.existsSync(tempJsPath)) fs.unlinkSync(tempJsPath);

        if (error) {
            console.error(`Pandoc Error: ${stderr}`);
            new Notice("Export Failed! Check Console.");
            return;
        }
        new Notice(`✅ Saved: ${fileName}.html`);
    });
};