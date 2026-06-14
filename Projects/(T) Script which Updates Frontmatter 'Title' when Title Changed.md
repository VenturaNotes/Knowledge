---
status: done
reminders:
  - id: rem_1777520400715_uivs3fkgk
    type: relative
    description: ""
    relatedTo: scheduled
    offset: -PT0H
tags:
  - task
parent:
  - "[[(T) Create Task Priority within Document]]"
completedDate: 2026-04-30
---
## Solution
- For a QuickAdd script to update, you need to run it again. Otherwise, it will run on startup again
	- This script works when creating a file or changing the name of a file in-place
	- It does not interfere with files that do not already have an existing `title` frontmatter
	- Probably something similar could be done with the linter plugin.

## V2
- This one just makes sure to remove old listeners before re-registering in case you accidentally run the script again aside from startup.
```javascript
module.exports = async (params) => {
    // Remove old listeners before re-registering
    app.vault.off('rename', syncTitle);
    app.vault.off('create', syncTitle);

    function syncTitle(file) {
        if (!file || file.extension !== 'md') return;
        setTimeout(() => {
            app.fileManager.processFrontMatter(file, (frontmatter) => {
                if (frontmatter?.hasOwnProperty('title')) {
                    if (frontmatter['title'] !== file.basename) {
                        frontmatter['title'] = file.basename;
                    }
                }
            }).catch(err => console.debug("Sync Error:", err));
        }, 50);
    }

    app.vault.on('rename', syncTitle);
    app.vault.on('create', syncTitle);

    console.log("Frontmatter Title Sync: active.");
};
```
## V1
```javascript
module.exports = async (params) => {
    
    const syncTitle = (file) => {
        // 1. Only markdown files
        if (!file || file.extension !== 'md') return;

        // 2. Wrap in a slight delay (50ms)
        // This ensures TaskNotes has finished writing the initial template
        setTimeout(() => {
            app.fileManager.processFrontMatter(file, (frontmatter) => {
                if (frontmatter && frontmatter.hasOwnProperty('title')) {
                    if (frontmatter['title'] !== file.basename) {
                        frontmatter['title'] = file.basename;
                    }
                }
            }).catch(err => console.debug("Sync Error:", err));
        }, 50); 
    };

    // Listen for renames (for when you manually rename)
    app.vault.on('rename', (file) => syncTitle(file));

    // Listen for creations (for TaskNotes / auto-renamed collisions)
    app.vault.on('create', (file) => syncTitle(file));

    console.log("Frontmatter Title Sync: Listeners active for Create & Rename.");
};
```
## Conversation
- https://gemini.google.com/app/f76ba9cb666b5aaa
## Thoughts
- When creating a new task in Obsidian, the 'title' frontmatter will not always match the title of the Obsidian markdown file
## Ideas
- Metadata Menu
- <mark style="background: #FF5582A6;">File Title Updater</mark>
	- Does it manually
- Create my own <mark style="background: #BBFABBA6;">QuickAdd script</mark> which waits for note creation or note update and changes the frontmatter 'title' property of that to update it to the current existing Title. 
- Linter plugin. 
## Frontmatter Script
- It changes the `title` of the frontmatter to match the title of the document.