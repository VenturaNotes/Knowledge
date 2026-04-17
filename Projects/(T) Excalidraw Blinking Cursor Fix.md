---
title: (T) Excalidraw Blinking Cursor Fix
status: done
priority: "2"
dateCreated: 2026-04-15T20:42:16.888-04:00
dateModified: 2026-04-15T20:47:12.573-04:00
reminders:
  - id: rem_1776300131159_3lri3aj9y
    type: relative
    description: ""
    relatedTo: scheduled
    offset: -PT0H
tags:
  - task
completedDate: 2026-04-15
---
## Problem
- The blinking cursor is invisible in dark mode when typing with the white color
## Solution
```css
/* Make Excalidraw text cursor blink WHITE when the canvas is in Dark Mode */
.excalidraw.theme--dark textarea,
.excalidraw.theme--dark input,
.excalidraw.theme--dark [contenteditable] {
    caret-color: #ffffff !important;
}

/* Make Excalidraw text cursor blink BLACK whenever the canvas is NOT in Dark Mode (Light Mode) */
.excalidraw:not(.theme--dark) textarea,
.excalidraw:not(.theme--dark) input,
.excalidraw:not(.theme--dark) [contenteditable] {
    caret-color: #000000 !important;
}
```
- Permanently sets the blinking cursor to black in light mode and white in dark mode (instead of being dependent on the color of the text being used)