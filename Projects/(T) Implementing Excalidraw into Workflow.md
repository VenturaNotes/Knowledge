---
status: done
priority: "0"
dateCreated: 2026-01-25T07:28:51.649-05:00
dateModified: 2026-02-21T16:28:21.015-05:00
reminders:
  - id: rem_1769344117095_x9wl0r8ua
    type: relative
    description: ""
    relatedTo: scheduled
    offset: -PT0H
tags:
  - task
  - in-progress
completedDate: 2026-02-21
---
## Synthesis

### Problem
- [Gemini Conversation](https://gemini.google.com/app/5c7fdf8513977e7d)
- Need to figure out how to draw lines in excalidraw with a constant width
- Unable to change the width of the pen. 
	- [@](https://github.com/excalidraw/excalidraw/issues/9036) Seems like this is an intentional feature? 
- Custom pens?
- Excalidraw Settings $\to$ Custom Pens $\to$ Set number of custom pens to 1
	- Open Excalidraw Canvas $\to$ Double Click pen icon on right-side $\to$ Disable Pressure Sensitive Pen
- So I am able to get it to work by doing: 
#### Solution
  - Steps to get custom Pen
	  1. Apply “Excalidraw Default”
	  2. Set Pressure Sensitive Pen to Off
	  3. Set below
	    - Thinning: 0
	    - Smoothing: 0.25
	    - Streamline: 0.25
	  - Set Stroke Width = 0.5 (but might be by default?)
		  - Make sure to press (apply) when selecting "default" and then make the necessary changes before exiting
	  - This result is not perfect (as sometimes the ending of a line turns into a circle), but works well enough to use. OneNote does seem a bit better but doesn't have good native integration into Obsidian as this Excalidraw plugin does
		  - Maybe there is a OneNote plugin but not interested. 
  - Use extended display on iPad and have canvas as a separate window
  - You can pan on your IPad by using two fingers
	  - You can also zoom in and out by pinching two fingers
### Solution
- To exclude `.excalidraw.md`, you need to be specific with its folder location. Inconvenient but necessary. Need to do this for every folder you encounter unfortunately because you can't change the extension of excalidraw (with it's `.md` file)
	- `- Topics/- Attachments`
		- Actually, just keep all excalidraw files in a single folder.
- Use Excalidraw
	- You can create a mind map using the arrows
	- It has built-in MathJax
	- Files are re-usable (and can fix it on the spot)
	- Potentially consumes less data than a PNG file
	- No need to worry about crowded global results since you don't use it often
- ToDo
	- [x] Remove `excalidraw.md` files from both GitHub and search results ✅ 2026-01-26
- Thoughts
	- If I need to use my iPad, I could probably just use an excalidraw application or web version and import it into my Obsidian
### Removing an Excalidraw File from File Search
- [Gemini Conversation](https://aistudio.google.com/prompts/1Av-Dy_52q8oQfGUTkEMXPBaC9tt8KxoS)
- <mark style="background: #FF5582A6;">Adding Regex to excluded files in "Files and Links"</mark>
	- Did not seem to affect the "Another Quick Switcher" plugin
- Using regex in exclude prefix path patterns `/.*\.excalidraw\.md$/` and `.*\.excalidraw\.md$` and `.excalidraw.md` and `*.excalidraw.md`
	- Both didn't work
- You can't remove the `.md` from the file because then it just corrupts the document
- Probably can solve this problem by excluding a folder with `- Attachments`. This should work.
### Different Plugin?
- Omnisearch
	- Does not compartmentalize into different search groups
## Source [^1]
- Mainly shows how to download Excalidraw and how it has many uses
## Source[^2]
- With the arrow tool, you can click multiple times to bend the shape of the arrow to point a different direction
- In more tools section:
	- Frame Tool (so you can create frames)
	- Has a web embed which lets you embed videos as well
	- There is a laser pointer as well
	- Has some AI features as well (for text to diagram), but you need to add your own API key
		- #comment I don't know if you can use a gemini key for this
## Source[^3]
- 57 features in 17 minutes
- It has OCR (that'd you'd need to activate)
- Can toggle grid
- Element properties lets you change colors and other properties of your objects.
- Snap to objects lets you align and size objects (as well as position elements relative to others).
- Can add new items to library view context menu
    - #comment Seems like I could create a library of drawings that I could reference from in the future. Use them as my template
- Can link any file from vault.
    - Can see backlinks to in sidebar.
- For professional style
    - Change edges to sharp
    - Sloppiness to architect
    - Font family to normal.
- Can transport to specific element in excalidraw view by clicking a link.
- Can link to images on web or files on your drive.
- Can export as svg file outside Obsidian.
- If you only want to reference part of image in markdown note.
    - Simply group selection (grouping the elements) you want to reference and then copy the markdown link for selected elements.
- Can deconstruct images. Can carve out part of drawing to another file. Original element will be replaced by embedded image of deconstructed parts.
    - #comment So I think that means any changes you make will be made across all images of same type across vault?
- Can add “back-of-note card” which lets you write notes in a file but image won’t include this part when exporting.
- Scaling available.
- Possible to save configuration of excalidraw file as template for professional use.
- Can add scripts such as slideshow.
    - Can use the arrow and direction to show presentation better.
- Split ellipse script lets you cut an ellipse easily by splitting it with a line.
- Boolean operations script lets you add and subtract shapes.
- Can use “select elements of type” script to change things like colors of arrows.
- Crop and Mask script does what name suggests.
- He created an “Invert colors” script which keeps the images in light mode but inverts the drawings to dark mode.
- You can create your own custom colors.
- Toggle tray-mode lets you. This makes it so element properties are not in the way.
- Can import pdf pages (or embed as object)
- “Fourth font” available for custom fonts.
- Latex support
- Can annotate images easily (as overlay without directly affecting file)
- There is a “Convert SVG to strokes - with limitations” which can help color things it.
- Collaboration possible by just embedding an excalidraw website.
- Excalidraw publish is available as well (but might need to subscribe to obsidian publish for this?)
- Automations are possible
- Has a discord you can join for this plugin (and he’s been working on it 3 years so far). Video was published in 2024
## Source[^4]
- If you double-click on the custom pen (on the right toolbar), you can view the pen settings 
## References

[^1]: https://www.youtube.com/watch?v=eemtbdcik3I
[^2]: https://www.youtube.com/watch?v=147f6prXuWA
[^3]: https://www.youtube.com/watch?v=P_Q6avJGoWI
[^4]: https://www.reddit.com/r/ObsidianMD/comments/1bairz4/excalidraw_pen_setting_for_note_taking/