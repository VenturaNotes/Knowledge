---
title: (T) Script which Updates Frontmatter 'Title' when Title Changed
status: done
priority: "0"
dateCreated: 2026-04-29T23:40:37.840-04:00
dateModified: 2026-04-30T02:40:12.963-04:00
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