---
status: done
priority: normal
dateCreated: 2025-11-25T02:27:59.195-05:00
dateModified: 2025-11-25T03:29:22.893-05:00
tags:
  - task/personal
completedDate: 2025-11-25
---
## Synthesis

### Solution
- To retrieve source of footnote, press `Command + U` in front of it to go down to the footnote. Then press `Command + U` again to go back to the source
	- Might need to go back to reading mode though if you have multiple references to the same footnote.
### Pending
- I'm waiting to see if they fixed the CSS snippet for this problem. Last time I checked was on (11/25/25 @ 2:37AM) [^1]
	- I posted a response to the alternative solution so it is no longer important.
### Problem
- It would be nice to be able to click on a footnote in Live Preview Mode without needing to switch to Reading Mode to view it 
	- There is a footnotes view to show footnotes but you cannot search it.
## Source [^1]
- People want this feature
- Someone wrote a CSS snippet that makes footnotes behave like Reading Mode in Live Preview Mode but the problem is that the snippet hides unselected square brackets everywhere. Not a problem for links but a problem if you're using them for omissions in quotes or code
```python
div:not(.cm-active) > span.cm-footref.cm-hmd-barelink,
div:not(.cm-active) > span.cm-footref.cm-hmd-barelink-end {
    color: var(--link-color);
    font-size: 0.75rem;
    padding-left: 0.1rem;
}

div:not(.cm-active) > span.cm-formatting-link {
    display: none;
}
```
- #comment They created this snippet last on June 26, 2025, but haven't seemed to update it. 
	- I replied and am waiting for a response to see if they fixed this problem. Might be able to see if ChatGPT has fixed it as well. 
## References

[^1]: https://forum.obsidian.md/t/support-footnotes-in-live-preview/76838
