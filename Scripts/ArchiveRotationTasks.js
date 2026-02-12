module.exports = async (params) => {
    const { app } = params;
    
    const activeView = app.workspace.getActiveViewOfType(app.workspace.activeLeaf.view.constructor);
    
    if (!activeView || activeView.getViewType() !== 'markdown') {
        new Notice("No active Markdown file found.");
        return;
    }

    const file = activeView.file;
    const content = await app.vault.read(file);
    const lines = content.split('\n');
    
    const archiveFolder = "Private/Archive"; 
    const date = new Date();
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const archivePath = `${archiveFolder}/${monthStr}.md`;

    let newActiveLines = [];
    let archivedTasks = { "Maintain": [], "Admin (Odd)": [], "Study (Even)": [] };
    let currentHeader = "";
    let moveCount = 0;
    
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        
        const headerMatch = line.match(/^#+\s+(Maintain|Admin \(Odd\)|Study \(Even\))/i);
        if (headerMatch) {
            const rawHeader = headerMatch[1].toLowerCase();
            if (rawHeader === "maintain") currentHeader = "Maintain";
            else if (rawHeader.includes("admin")) currentHeader = "Admin (Odd)";
            else if (rawHeader.includes("study")) currentHeader = "Study (Even)";
            
            newActiveLines.push(line);
            i++;
            continue;
        }

        const taskMatch = line.match(/^-\s+\[(x| )\]/);
        if (taskMatch && currentHeader) {
            let taskTree = [line];
            let j = i + 1;

            while (j < lines.length && (lines[j].startsWith('    ') || lines[j].startsWith('\t'))) {
                taskTree.push(lines[j]);
                j++;
            }

            const allItemsFinished = taskTree.every(taskLine => {
                const checkboxMatch = taskLine.match(/\[(.)\]/);
                if (checkboxMatch) {
                    return checkboxMatch[1] === 'x';
                }
                return true; 
            });

            if (allItemsFinished) {
                // Removed the empty string append to keep the list compact
                archivedTasks[currentHeader].push(...taskTree); 
                moveCount++;
            } else {
                newActiveLines.push(...taskTree);
            }
            i = j; 
        } else {
            newActiveLines.push(line);
            i++;
        }
    }

    await app.vault.modify(file, newActiveLines.join('\n'));

    let archiveFile = app.vault.getAbstractFileByPath(archivePath);
    if (!archiveFile) {
        if (!app.vault.getAbstractFileByPath(archiveFolder)) {
            await app.vault.createFolder(archiveFolder);
        }
        const initialContent = "## Maintain\n\n## Admin (Odd)\n\n## Study (Even)\n";
        await app.vault.create(archivePath, initialContent);
        archiveFile = app.vault.getAbstractFileByPath(archivePath);
    }

    let archiveContent = await app.vault.read(archiveFile);
    let archiveLines = archiveContent.split('\n');

    const headers = ["Maintain", "Admin (Odd)", "Study (Even)"];
    headers.forEach(h => {
        if (archivedTasks[h].length > 0) {
            const hIndex = archiveLines.findIndex(l => l.includes(`## ${h}`));
            if (hIndex !== -1) {
                archiveLines.splice(hIndex + 1, 0, ...archivedTasks[h]);
            }
        }
    });

    await app.vault.modify(archiveFile, archiveLines.join('\n'));
    
    if (moveCount > 0) {
        new Notice(`Archived ${moveCount} groups to ${monthStr}`);
    } else {
        new Notice("No fully completed task groups found.");
    }
};