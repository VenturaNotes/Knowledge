---
status: done
priority: normal
dateCreated: 2025-12-02T21:20:17.776-05:00
dateModified: 2025-12-02T22:04:09.598-05:00
tags:
  - task
completedDate: 2025-12-02
---
## Synthesis
- [Gemini Conversation](https://aistudio.google.com/prompts/1F_bouZYoxWXEpRTYCbW27zvnEfhJcIeF)
### Solution
```css
/* --- EXTERNAL LINKS SETUP --- */

/* 1. Reading Mode */
a.external-link {
    color: #D98999;
    text-decoration: underline;
}

a.external-link:hover {
    color: #EFA3A3;
}

/* 2. Live Preview (Editor) Mode */

/* 
   We target external links but MUST exclude:
   1. Internal links (.cm-hmd-internal-link)
   2. Footnote references (.cm-footref)
   3. Footnote definitions (.cm-hmd-footnote)
*/

/* Base Color (Orange) & Force Underline */
.markdown-source-view.mod-cm6 .cm-link:not(.cm-hmd-internal-link):not(.cm-footref):not(.cm-hmd-footnote),
.markdown-source-view.mod-cm6 .cm-url:not(.cm-hmd-internal-link):not(.cm-footref):not(.cm-hmd-footnote),
.markdown-source-view.mod-cm6 .cm-link:not(.cm-hmd-internal-link):not(.cm-footref):not(.cm-hmd-footnote) .cm-underline,
.markdown-source-view.mod-cm6 .cm-url:not(.cm-hmd-internal-link):not(.cm-footref):not(.cm-hmd-footnote) .cm-underline,
.markdown-source-view.mod-cm6 .cm-url:not(.cm-hmd-internal-link):not(.cm-footref):not(.cm-hmd-footnote) .cm-text {
    color: #D98999 !important;
    /* Include below for permanent underline of external links
    text-decoration: underline !important;
    */
}

/* Hover Color (Lighter Orange) */
.markdown-source-view.mod-cm6 .cm-link:not(.cm-hmd-internal-link):not(.cm-footref):not(.cm-hmd-footnote):hover,
.markdown-source-view.mod-cm6 .cm-url:not(.cm-hmd-internal-link):not(.cm-footref):not(.cm-hmd-footnote):hover,
.markdown-source-view.mod-cm6 .cm-link:not(.cm-hmd-internal-link):not(.cm-footref):not(.cm-hmd-footnote):hover .cm-underline,
.markdown-source-view.mod-cm6 .cm-url:not(.cm-hmd-internal-link):not(.cm-footref):not(.cm-hmd-footnote):hover .cm-underline,
.markdown-source-view.mod-cm6 .cm-url:not(.cm-hmd-internal-link):not(.cm-footref):not(.cm-hmd-footnote):hover .cm-text {
    color: #EFA3A3 !important;
}


/* --- YOUR OTHER SETTINGS (Unchanged) --- */

.MathJax {
    font-size: 1.3em;
}

/* Headers - in Live Preview */
.cm-header-2 { color: #0076BE; }
.cm-header-3 { color: #4DB4D7; }
.cm-header-4 { color: #83D8EE; }
.cm-header-5 { color: #4FD68E; }
.cm-header-6 { color: #259F5B; }

/* Headers - in Reading Mode */
.markdown-preview-view h2 { color: #0076BE; }
.markdown-preview-view h3 { color: #4DB4D7; }
.markdown-preview-view h4 { color: #83D8EE; }
.markdown-preview-view h5 { color: #4FD68E; }
.markdown-preview-view h6 { color: #259F5B; }

/* Temporary fix to highlights */
.markdown-source-view.mod-cm6 .cm-foldPlaceholder {
    display: none;
}

/* Stacking comfort */
.workspace .mod-root .workspace-tabs.mod-stacked .workspace-tab-container > * {
	position: static;
}

body {
	--tab-stacked-pane-width: 700px;
}

/* Remove checkbox cross */
.markdown-source-view.mod-cm6 .HyperMD-task-line[data-task]:not([data-task=" "]) {
    text-decoration: none;
}
```
### Old Snippet
```python
.MathJax {
    font-size: 1.3em;
    }
    
/* Headers - in Live Preview */
.cm-header-2 { color: #0076BE; }
.cm-header-3 { color: #4DB4D7; }
.cm-header-4 { color: #83D8EE; }
.cm-header-5 { color: #4FD68E; }
.cm-header-6 { color: #259F5B; }

/* Headers - in Reading Mode */
.markdown-preview-view h2 { color: #0076BE; }
.markdown-preview-view h3 { color: #4DB4D7; }
.markdown-preview-view h4 { color: #83D8EE; }
.markdown-preview-view h5 { color: #4FD68E; }
.markdown-preview-view h6 { color: #259F5B; }


/*
body {
    --link-external-color: #D98999;
    --link-external-color-hover: #EFA3A3;
}
*/

/* Below is a temporary fix to highlights*/
.markdown-source-view.mod-cm6 .cm-foldPlaceholder {
    display: none;
  }

a.external-link, 
.markdown-source-view.mod-cm6 
 :is(.cm-link, .cm-url, .cm-link .cm-underline, .cm-link .cm-underline:hover,
 .cm-url .cm-underline, .cm-url .cm-underline:hover) {
      color: #D98999;
}

a.external-link:hover,
 :is(.cm-link, .cm-url, .cm-link .cm-underline, .cm-link .cm-underline:hover,
 .cm-url .cm-underline, .cm-url .cm-underline:hover) {
      color: #EFA3A3;
}

/* Below ensures that stacking is comfortable*/
.workspace .mod-root .workspace-tabs.mod-stacked .workspace-tab-container > * {
	position: static;
}

body {
	--tab-stacked-pane-width: 700px;
}

/* Removes the cross from a checkbox */
.markdown-source-view.mod-cm6 .HyperMD-task-line[data-task]:not([data-task=" "]) {
    text-decoration:none;
    /* color: var(--text-normal);*/
  }
```
## Source [^1]
- 

## References

[^1]: 