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
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const archiveFileName = `(Archive) ${year}-${month}.md`;
    const archivePath = `${archiveFolder}/${archiveFileName}`;

    let newActiveLines = [];
    let archivedTasks = {}; 
    let currentLevel2Header = "";
    let currentSubheading = ""; 
    let moveCount = 0;
    
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        
        const level2Match = line.match(/^##\s+(.+)/);
        if (level2Match) {
            currentLevel2Header = level2Match[1].trim();
            currentSubheading = ""; 
            if (!archivedTasks[currentLevel2Header]) {
                archivedTasks[currentLevel2Header] = [];
            }
            newActiveLines.push(line);
            i++;
            continue;
        }

        const subheaderMatch = line.match(/^###+\s+(.+)/);
        if (subheaderMatch) {
            currentSubheading = line.trim();
            newActiveLines.push(line);
            i++;
            continue;
        }

        const taskMatch = line.match(/^-\s+\[(x| )\]/);
        if (taskMatch && currentLevel2Header) {
            let taskTree = [line];
            let j = i + 1;

            while (j < lines.length && (lines[j].startsWith('    ') || lines[j].startsWith('\t'))) {
                taskTree.push(lines[j]);
                j++;
            }

            const allItemsFinished = taskTree.every(taskLine => {
                const checkboxMatch = taskLine.match(/\[(.)\]/);
                if (checkboxMatch) return checkboxMatch[1] === 'x';
                return true; 
            });

            if (allItemsFinished) {
                archivedTasks[currentLevel2Header].push({
                    subHeader: currentSubheading,
                    tree: taskTree
                });
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
        await app.vault.create(archivePath, ""); 
        archiveFile = app.vault.getAbstractFileByPath(archivePath);
    }

    let archiveContent = await app.vault.read(archiveFile);
    let archiveLines = archiveContent.split('\n');

    // Determine where to start inserting (after YAML)
    let insertStartIndex = 0;
    if (archiveLines[0] === '---') {
        const endYamlIndex = archiveLines.indexOf('---', 1);
        if (endYamlIndex !== -1) {
            insertStartIndex = endYamlIndex + 1;
        }
    }

    // Filter out blank lines only AFTER the YAML block to maintain structure
    let yamlHeader = archiveLines.slice(0, insertStartIndex);
    let bodyContent = archiveLines.slice(insertStartIndex).filter(l => l.trim() !== "");

    for (const headerName in archivedTasks) {
        if (archivedTasks[headerName].length === 0) continue;

        let hIndex = bodyContent.findIndex(l => l.trim() === `## ${headerName}`);
        if (hIndex === -1) {
            // New L2 header: Prepend to the top of the body (below YAML)
            bodyContent.unshift(`## ${headerName}`);
            hIndex = 0;
        }

        for (const taskObj of archivedTasks[headerName]) {
            if (taskObj.subHeader) {
                let sIndex = -1;
                for (let k = hIndex + 1; k < bodyContent.length; k++) {
                    if (bodyContent[k].startsWith('## ')) break; 
                    if (bodyContent[k].trim() === taskObj.subHeader) {
                        sIndex = k;
                        break;
                    }
                }

                if (sIndex === -1) {
                    bodyContent.splice(hIndex + 1, 0, taskObj.subHeader, ...taskObj.tree);
                } else {
                    bodyContent.splice(sIndex + 1, 0, ...taskObj.tree);
                }
            } else {
                bodyContent.splice(hIndex + 1, 0, ...taskObj.tree);
            }
        }
    }

    const finalContent = [...yamlHeader, ...bodyContent].join('\n');
    await app.vault.modify(archiveFile, finalContent);
    
    if (moveCount > 0) {
        new Notice(`Archived ${moveCount} groups to ${archiveFileName}`);
    } else {
        new Notice("No fully completed task groups found.");
    }
};