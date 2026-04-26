module.exports = async (params) => {
    const { app } = params;
    
    const activeView = app.workspace.getActiveViewOfType(app.workspace.activeLeaf.view.constructor);
    
    if (!activeView || activeView.getViewType() !== 'markdown') {
        new Notice("No active Markdown file found.");
        return;
    }

    const file = activeView.file;
    const sourceTitle = file.basename; 
    const content = await app.vault.read(file);
    const lines = content.split('\n');
    
    const archiveFolder = "Private/Archive"; 
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const archiveFileName = `(Archive) ${year}-${month}.md`;
    const archivePath = `${archiveFolder}/${archiveFileName}`;

    let newActiveLines = [];
    let archivedTasks = []; 
    
    let currentHeaderStack = []; 
    let lastLevel = 1; 
    let hierarchyValid = true;
    
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        const headerMatch = line.match(/^(#+)\s+(.+)/);

        if (headerMatch) {
            const level = headerMatch[1].length;
            const title = line.trim();

            if (level === 1) {
                newActiveLines.push(line);
                i++;
                continue;
            }

            if (level === 2) {
                currentHeaderStack = [title];
                lastLevel = 2;
                hierarchyValid = true;
            } else {
                if (level > lastLevel + 1) {
                    hierarchyValid = false;
                }
                
                if (hierarchyValid) {
                    currentHeaderStack = currentHeaderStack.filter(h => {
                        const hLevel = h.match(/^(#+)/)[1].length;
                        return hLevel < level;
                    });
                    currentHeaderStack.push(title);
                    lastLevel = level;
                }
            }
            newActiveLines.push(line);
            i++;
            continue;
        }

        const taskMatch = line.match(/^-\s+\[(x| )\]/);
        if (taskMatch) {
            let taskTree = [line];
            let j = i + 1;
            while (j < lines.length && (lines[j].startsWith('    ') || lines[j].startsWith('\t'))) {
                taskTree.push(lines[j]);
                j++;
            }

            const hasL2Parent = currentHeaderStack.some(h => h.startsWith('## '));
            const isAtRoot = currentHeaderStack.length === 0;
            const isEligibleLocation = hierarchyValid && (isAtRoot || hasL2Parent);

            const allItemsFinished = taskTree.every(taskLine => {
                const checkboxMatch = taskLine.match(/^\s*(?:-|\*|\+)\s+\[(.)\]/);
                if (checkboxMatch) return checkboxMatch[1].toLowerCase() === 'x';
                return true; 
            });

            if (allItemsFinished && isEligibleLocation) {
                archivedTasks.push({
                    headerPath: [...currentHeaderStack],
                    tree: taskTree
                });
            } else {
                newActiveLines.push(...taskTree);
            }
            i = j; 
        } else {
            newActiveLines.push(line);
            i++;
        }
    }

    if (archivedTasks.length === 0) {
        new Notice("No eligible completed tasks found.");
        return;
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

    let insertStartIndex = 0;
    if (archiveLines[0] === '---') {
        const endYamlIndex = archiveLines.indexOf('---', 1);
        if (endYamlIndex !== -1) insertStartIndex = endYamlIndex + 1;
    }

    let yamlHeader = archiveLines.slice(0, insertStartIndex);
    let body = archiveLines.slice(insertStartIndex).filter(l => l.trim() !== "");

    // 1. Ensure Root Note Header (# Title) exists
    let h1Index = body.findIndex(l => l.trim() === `# ${sourceTitle}`);
    if (h1Index === -1) {
        body.unshift(`# ${sourceTitle}`);
        h1Index = 0;
    }

    // 2. Process tasks in REVERSE (Bottom-up from original file)
    // This maintains original order when prepending to the archive sections
    for (const taskObj of archivedTasks.reverse()) {
        let currentParentIndex = h1Index;
        let currentLevel = 1;

        for (const headerTitle of taskObj.headerPath) {
            const headerLevel = headerTitle.match(/^(#+)/)[1].length;

            // Find boundary of current parent
            let boundaryIndex = body.findIndex((l, idx) => {
                if (idx <= currentParentIndex) return false;
                const m = l.match(/^(#+)/);
                return m && m[1].length <= currentLevel;
            });
            if (boundaryIndex === -1) boundaryIndex = body.length;

            // Look for header in this section
            let foundIndex = -1;
            for (let k = currentParentIndex + 1; k < boundaryIndex; k++) {
                if (body[k].trim() === headerTitle) {
                    foundIndex = k;
                    break;
                }
            }

            if (foundIndex === -1) {
                // Prepend header to the parent section
                body.splice(currentParentIndex + 1, 0, headerTitle);
                foundIndex = currentParentIndex + 1;
            }
            
            currentParentIndex = foundIndex;
            currentLevel = headerLevel;
        }

        // Insert task at the top of the final header section
        body.splice(currentParentIndex + 1, 0, ...taskObj.tree);
    }

    const finalContent = [...yamlHeader, ...body].join('\n');
    await app.vault.modify(archiveFile, finalContent);
    new Notice(`Archived ${archivedTasks.length} tasks to ${archiveFileName}`);
};