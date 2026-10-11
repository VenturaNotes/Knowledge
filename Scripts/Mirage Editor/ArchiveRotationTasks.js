const path = require('path');
const { ipcRenderer } = require('electron');

module.exports = async ({ app, vault, workspace }) => {
    // 1. Resolve active Markdown note (checks Main Workspace and VaporNote)
    let activeFilePath = null;
    let activeEditor = null;
    let activeTabId = null;

    let isVaporFocused = false;
    try {
        isVaporFocused = await ipcRenderer.invoke('vapornote:isFocused');
    } catch (_) {}

    if (isVaporFocused) {
        try {
            const vState = await ipcRenderer.invoke('vapornote:getState');
            const vaporTab = vState.savedTabs?.[vState.activeTabIndex];
            if (vaporTab && vaporTab.type === 'markdown' && vaporTab.pathOrUrl) {
                activeFilePath = vaporTab.pathOrUrl;
            }
        } catch (_) {}
    }

    if (!activeFilePath) {
        const mainTab = workspace.activeLeaf?.activeTab;
        if (mainTab && mainTab.type === 'markdown' && mainTab.filePath) {
            activeFilePath = mainTab.filePath;
            activeEditor = mainTab.editor;
            activeTabId = mainTab.id;
        }
    }

    if (!activeFilePath || !vault.exists(activeFilePath)) {
        app.notify({
            title: "Archive Tasks",
            body: "No active Markdown note found to archive from.",
            type: "warning"
        });
        return;
    }

    // Flush any pending unsaved keystrokes first
    if (activeEditor && typeof activeEditor.flush === 'function') {
        activeEditor.flush();
    }

    const sourceTitle = path.basename(activeFilePath, '.md');
    const content = activeEditor ? activeEditor.getContent() : vault.readFile(activeFilePath);
    const lines = content.split('\n');

    // 2. Configure target archive destination
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

    // 3. Scan and extract completed task trees
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
                    currentHeaderStack = currentHeaderStack.filter((h) => {
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

        const taskMatch = line.match(/^-\s+\[([xX ])\]/);
        if (taskMatch) {
            let taskTree = [line];
            let j = i + 1;
            while (j < lines.length && (lines[j].startsWith('    ') || lines[j].startsWith('\t'))) {
                taskTree.push(lines[j]);
                j++;
            }

            const hasL2Parent = currentHeaderStack.some((h) => h.startsWith('## '));
            const isAtRoot = currentHeaderStack.length === 0;
            const isEligibleLocation = hierarchyValid && (isAtRoot || hasL2Parent);

            const allItemsFinished = taskTree.every((taskLine) => {
                const checkboxMatch = taskLine.match(/^\s*(?:-|\*|\+)\s+\[(.)\]/);
                if (checkboxMatch) return checkboxMatch[1].toLowerCase() === 'x';
                return true;
            });

            if (allItemsFinished && isEligibleLocation) {
                archivedTasks.push({
                    headerPath: [...currentHeaderStack],
                    tree: taskTree,
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
        app.notify({
            title: "Archive Tasks",
            body: "No eligible completed tasks found.",
            type: "info"
        });
        return;
    }

    // 4. Update the active source note
    const newActiveContent = newActiveLines.join('\n');

    if (activeEditor && typeof activeEditor.setContent === 'function') {
        activeEditor.setContent(newActiveContent);
    }
    vault.writeFile(activeFilePath, newActiveContent);
    app.cache.updateFile(activeFilePath, newActiveContent);
    if (activeTabId) {
        workspace.syncTabsForFile(activeFilePath, newActiveContent, activeTabId);
    }
    app.events.emit('file-modified', activeFilePath);
    ipcRenderer.send('vapornote:fileModified', { filePath: activeFilePath });

    // 5. Read or create the destination monthly archive note
    let archiveContent = "";
    if (vault.exists(archivePath)) {
        archiveContent = vault.readFile(archivePath);
    }

    let archiveLines = archiveContent ? archiveContent.split('\n') : [];

    // Preserve existing frontmatter if present
    let insertStartIndex = 0;
    if (archiveLines[0] && archiveLines[0].trim() === '---') {
        const endYamlIndex = archiveLines.indexOf('---', 1);
        if (endYamlIndex !== -1) insertStartIndex = endYamlIndex + 1;
    }

    let yamlHeader = archiveLines.slice(0, insertStartIndex);
    let body = archiveLines.slice(insertStartIndex).filter((l) => l.trim() !== "");

    // Ensure Top-Level H1 for the source note (# Note Title)
    let h1Index = body.findIndex((l) => l.trim() === `# ${sourceTitle}`);
    if (h1Index === -1) {
        body.unshift(`# ${sourceTitle}`);
        h1Index = 0;
    }

    // Process tasks bottom-up (reverse preserves document order when spliced)
    for (const taskObj of archivedTasks.reverse()) {
        let currentParentIndex = h1Index;
        let currentLevel = 1;

        for (const headerTitle of taskObj.headerPath) {
            const headerLevel = headerTitle.match(/^(#+)/)[1].length;

            let boundaryIndex = body.findIndex((l, idx) => {
                if (idx <= currentParentIndex) return false;
                const m = l.match(/^(#+)/);
                return m && m[1].length <= currentLevel;
            });
            if (boundaryIndex === -1) boundaryIndex = body.length;

            let foundIndex = -1;
            for (let k = currentParentIndex + 1; k < boundaryIndex; k++) {
                if (body[k].trim() === headerTitle) {
                    foundIndex = k;
                    break;
                }
            }

            if (foundIndex === -1) {
                body.splice(currentParentIndex + 1, 0, headerTitle);
                foundIndex = currentParentIndex + 1;
            }

            currentParentIndex = foundIndex;
            currentLevel = headerLevel;
        }

        body.splice(currentParentIndex + 1, 0, ...taskObj.tree);
    }

    // 6. Write final content to monthly archive note
    const finalArchiveContent = [...yamlHeader, ...body].join('\n');
    vault.writeFile(archivePath, finalArchiveContent);
    app.cache.updateFile(archivePath, finalArchiveContent);
    app.events.emit('file-modified', archivePath);

    app.notify({
        title: "Tasks Archived",
        body: `Archived ${archivedTasks.length} task(s) to ${archiveFileName}`,
        type: "success"
    });
};