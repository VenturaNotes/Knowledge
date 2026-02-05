---
status: done
priority: normal
dateCreated: 2026-02-01T10:30:59.947-05:00
dateModified: 2026-02-03T15:11:02.488-05:00
reminders:
  - id: rem_1769959856533_g3hbcvp5a
    type: relative
    description: ""
    relatedTo: scheduled
    offset: -PT0H
tags:
  - task
completedDate: 2026-02-03
---
## Synthesis
### Solution
- I created a script called `MarkdowntoHTML`. 
	- However, the 5th part of the code removes yaml stuff and you also enter into Pandoc safe mode so that you only have content and no YAML data exported. 
- Below are separate scripts for interacting with an HTML document which allows for copying code and zooming into an image
#### HTML Code Extraction
- Function: Type number which corresponds to the code snippet you want extracted, and then it automatically gets copied into your clipboard
```javascript
// Improved double-trigger prevention with delay
if (typeof _htmlExtractorRunning !== 'undefined' && _htmlExtractorRunning) {
    return;
}
_htmlExtractorRunning = true;

let pane = Zotero.getActiveZoteroPane();
let targetItem = (typeof item !== 'undefined' && item) ? item : pane.getSelectedItems()[0];

if (!targetItem || !targetItem.isAttachment()) {
    setTimeout(() => { _htmlExtractorRunning = false; }, 2000);
    return;
}

let path = targetItem.getFilePath();

if (!path || !path.toLowerCase().endsWith(".html")) {
    setTimeout(() => { _htmlExtractorRunning = false; }, 2000);
    return;
}

try {
    let htmlContent = Zotero.File.getContents(path);
    
    // Extract code blocks
    let codeBlocks = [];
    let preRegex = /<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi;
    let match;
    let blockNum = 1;
    
    while ((match = preRegex.exec(htmlContent)) !== null) {
        let code = match[1];
        
        // Remove any span tags or other HTML elements
        code = code.replace(/<[^>]+>/g, '');
        
        // Decode ALL HTML entities (in correct order)
        code = code.replace(/&amp;/g, '&')
                   .replace(/&lt;/g, '<')
                   .replace(/&gt;/g, '>')
                   .replace(/&quot;/g, '"')
                   .replace(/&#39;/g, "'")
                   .replace(/&#x27;/g, "'")
                   .replace(/&nbsp;/g, ' ')
                   .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
                   .replace(/&#x([0-9a-f]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
        
        let preview = code.trim().substring(0, 60).replace(/\n/g, ' ');
        if (code.trim().length > 60) preview += "...";
        
        codeBlocks.push({
            number: blockNum++,
            code: code,
            preview: preview
        });
    }
    
    if (codeBlocks.length === 0) {
        setTimeout(() => { _htmlExtractorRunning = false; }, 2000);
        return;
    }
    
    // Build menu text
    let menuText = `Found ${codeBlocks.length} code blocks. Enter number to copy:\n\n`;
    codeBlocks.forEach(block => {
        menuText += `${block.number}. ${block.preview}\n`;
    });
    
    // Get user selection
    let win = Zotero.getMainWindow();
    let selection = win.prompt(menuText, "1");
    
    if (selection) {
        let selectedNum = parseInt(selection);
        if (selectedNum >= 1 && selectedNum <= codeBlocks.length) {
            let selectedBlock = codeBlocks[selectedNum - 1];
            
            // Copy to clipboard
            const gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"]
                .getService(Components.interfaces.nsIClipboardHelper);
            gClipboardHelper.copyString(selectedBlock.code);
            
            win.alert(`Code block ${selectedNum} copied to clipboard!`);
        }
    }
    
} catch (e) {
    Zotero.debug("ERROR: " + e.toString());
}

setTimeout(() => { _htmlExtractorRunning = false; }, 2000);
```
#### HTML Image Zoom
- Function
	- Zooms into Image by clicking on it
	- Escape zoom by clicking outside container or Pressing `Command + Click`
```javascript
// Name: Zoom Image in Reader
// Event: Open File

(function() {
    // --- CONFIGURATION ---
    const MAX_ATTEMPTS = 50; 
    const CHECK_INTERVAL = 500;
    const ZOOM_SPEED = 0.1;  
    const MAX_ZOOM = 50;     
    const MIN_ZOOM = 0.1;
    const MIN_IMAGE_SIZE = 50; // Images/Icons smaller than this (px) are ignored

    let attempts = 0;

    // --- LOGIC ---

    function getAllClickableElements(doc) {
        let elements = [];
        try {
            const imgs = Array.from(doc.querySelectorAll('img, svg'));
            elements = elements.concat(imgs);

            const frames = doc.querySelectorAll('iframe, frame');
            for (let f of frames) {
                try {
                    const innerDoc = f.contentDocument || (f.contentWindow && f.contentWindow.document);
                    if (innerDoc) {
                        elements = elements.concat(getAllClickableElements(innerDoc));
                        injectCSS(innerDoc);
                    }
                } catch (err) {}
            }
        } catch (e) {}
        return elements;
    }

    function injectCSS(targetDoc) {
        if (!targetDoc || targetDoc.getElementById('zotero-image-zoom-style')) return;
        
        const css = `
            .zotero-zoom-overlay {
                display: none;
                position: absolute; 
                z-index: 2147483647;
                background-color: rgba(0,0,0,0.95);
                overflow: hidden;
                cursor: default;
                transform-origin: top left;
                top: 0; left: 0;
            }
            .zotero-zoom-overlay.active { display: block; }
            
            .zotero-zoom-container {
                width: 100%; height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .zotero-zoom-content {
                max-width: 90%; 
                max-height: 90%;
                box-shadow: 0 0 30px #000;
                object-fit: contain;
                background: white;
                cursor: grab;
                transform-origin: center center;
                will-change: transform;
            }

            .zotero-zoom-content:active { cursor: grabbing; }
            
            .zotero-zoom-hint {
                position: absolute; bottom: 20px; left: 50%;
                transform: translateX(-50%);
                color: #aaa; font-family: sans-serif; font-size: 12px;
                pointer-events: none;
                text-shadow: 0 1px 2px black;
            }
            
            /* NOTE: removed global 'img { cursor: zoom-in }' rule so filtered icons don't get the cursor */
        `;
        const style = targetDoc.createElement('style');
        style.id = 'zotero-image-zoom-style';
        style.appendChild(targetDoc.createTextNode(css));
        targetDoc.head.appendChild(style);
    }

    function createOverlay(targetDoc) {
        if (targetDoc.getElementById('zotero-zoom-overlay')) return targetDoc.getElementById('zotero-zoom-overlay');

        const overlay = targetDoc.createElement('div');
        overlay.id = 'zotero-zoom-overlay';
        overlay.className = 'zotero-zoom-overlay';

        const container = targetDoc.createElement('div');
        container.className = 'zotero-zoom-container';
        
        const zoomImg = targetDoc.createElement('img');
        zoomImg.className = 'zotero-zoom-content';
        zoomImg.id = 'zotero-zoomed-img';
        zoomImg.ondragstart = (e) => e.preventDefault(); 
        
        const hint = targetDoc.createElement('div');
        hint.className = 'zotero-zoom-hint';
        hint.innerText = "Scroll to Zoom • Drag to Pan • Click Background to Close";

        container.appendChild(zoomImg);
        overlay.appendChild(container);
        overlay.appendChild(hint);
        
        (targetDoc.documentElement || targetDoc.body).appendChild(overlay);

        let scale = 1, pX = 0, pY = 0;
        let isDragging = false, startX = 0, startY = 0;

        const fitOverlayToViewport = () => {
            if (!overlay.classList.contains('active')) return;

            const win = targetDoc.defaultView;
            const vv = win.visualViewport;

            if (vv) {
                overlay.style.left = vv.pageLeft + 'px';
                overlay.style.top = vv.pageTop + 'px';
                overlay.style.width = vv.width + 'px';
                overlay.style.height = vv.height + 'px';
            } else {
                overlay.style.left = win.pageXOffset + 'px';
                overlay.style.top = win.pageYOffset + 'px';
                overlay.style.width = win.innerWidth + 'px';
                overlay.style.height = win.innerHeight + 'px';
            }
        };

        const win = targetDoc.defaultView;
        if (win.visualViewport) {
            win.visualViewport.addEventListener('resize', fitOverlayToViewport);
            win.visualViewport.addEventListener('scroll', fitOverlayToViewport);
        }
        win.addEventListener('scroll', fitOverlayToViewport);
        win.addEventListener('resize', fitOverlayToViewport);

        const updateTransform = () => {
            zoomImg.style.transform = `translate(${pX}px, ${pY}px) scale(${scale})`;
        };

        overlay.addEventListener('wheel', function(e) {
            e.preventDefault(); 
            e.stopPropagation();

            const rect = container.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const mouseX = e.clientX - rect.left - centerX;
            const mouseY = e.clientY - rect.top - centerY;

            const delta = e.deltaY > 0 ? (1 - ZOOM_SPEED) : (1 + ZOOM_SPEED);
            let newScale = scale * delta;

            if (newScale > MAX_ZOOM) newScale = MAX_ZOOM;
            if (newScale < MIN_ZOOM) newScale = MIN_ZOOM;

            const scaleRatio = newScale / scale;
            pX = mouseX - (mouseX - pX) * scaleRatio;
            pY = mouseY - (mouseY - pY) * scaleRatio;

            scale = newScale;
            updateTransform();
        }, { passive: false });

        zoomImg.addEventListener('mousedown', function(e) {
            if (e.button !== 0) return; 
            e.preventDefault();
            e.stopPropagation();
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            this.dataset.initialPx = pX;
            this.dataset.initialPy = pY;
            zoomImg.style.cursor = 'grabbing';
        });

        targetDoc.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            e.preventDefault();
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const sensitivity = 1.0; 
            const initialPx = parseFloat(zoomImg.dataset.initialPx || 0);
            const initialPy = parseFloat(zoomImg.dataset.initialPy || 0);
            pX = initialPx + (dx * sensitivity);
            pY = initialPy + (dy * sensitivity);
            updateTransform();
        });

        const stopDrag = () => {
            if(isDragging) {
                isDragging = false;
                zoomImg.style.cursor = 'grab';
            }
        };
        targetDoc.addEventListener('mouseup', stopDrag);
        targetDoc.addEventListener('mouseleave', stopDrag);

        const closeOverlay = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            overlay.classList.remove('active');
            scale = 1; pX = 0; pY = 0;
            updateTransform();
            if (targetDoc.body) targetDoc.body.focus(); 
            else targetDoc.defaultView.focus();
        };

        container.addEventListener('click', function(e) {
            if (e.target === container || e.metaKey) {
                closeOverlay(e);
            }
        });

        overlay.fitToScreen = fitOverlayToViewport;
        return overlay;
    }

    function tryInitializeZoom() {
        try {
            const win = Zotero.getMainWindow();
            const tabID = win.Zotero_Tabs.selectedID;
            const reader = Zotero.Reader.getByTabID(tabID);
            
            if (!reader) return false;

            let rootDoc = null;
            if (reader._iframeWindow) rootDoc = reader._iframeWindow.document;
            else if (reader._iframe) rootDoc = reader._iframe.contentDocument;
            else {
                const browser = win.document.querySelector(`tabpanel[id="zotero-tab-panel-${tabID}"] browser`);
                if (browser) rootDoc = browser.contentDocument;
            }

            if (!rootDoc || rootDoc.readyState !== 'complete') return false;

            injectCSS(rootDoc);
            
            const allElements = getAllClickableElements(rootDoc);
            if (allElements.length === 0) return false;

            let count = 0;
            for (let el of allElements) {
                if (el.id === 'zotero-zoomed-img') continue;
                if (el.tagName.toLowerCase() === 'svg' && el.classList.contains('zotero-zoom-icon')) continue;

                // --- FILTER ---
                // 1. Size Check
                const rect = el.getBoundingClientRect();
                if (rect.width > 0 && (rect.width < MIN_IMAGE_SIZE && rect.height < MIN_IMAGE_SIZE)) {
                    continue; // Skip small icons
                }
                // 2. Parent Check (toolbar, buttons)
                if (el.closest('button, [role="button"], .toolbar, .buttons, .secondary-toolbar')) {
                    continue; // Skip UI elements
                }

                if (!el.dataset.hasZoomListener) {
                    const ownerDoc = el.ownerDocument;
                    injectCSS(ownerDoc);
                    const localOverlay = createOverlay(ownerDoc);
                    const localZoomImg = localOverlay.querySelector('#zotero-zoomed-img');

                    el.addEventListener('click', function(e) {
                        if (e.button !== 0) return;

                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        
                        if (this.tagName.toLowerCase() === 'img') {
                            localZoomImg.src = this.src;
                        } else {
                            const xml = new XMLSerializer().serializeToString(this);
                            localZoomImg.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(xml)));
                        }
                        
                        localZoomImg.style.transform = `translate(0px, 0px) scale(1)`;
                        localOverlay.classList.add('active');
                        if(localOverlay.fitToScreen) localOverlay.fitToScreen();
                        
                    }, true); 
                    
                    el.dataset.hasZoomListener = "true";
                    
                    // --- APPLY CURSOR HERE ONLY FOR VALID IMAGES ---
                    el.style.cursor = "zoom-in"; 
                    
                    count++;
                }
            }

            if (count > 0) {
                Zotero.debug(`Zoom Script: Ready on ${count} images.`);
                return true; 
            }
            return false;

        } catch (e) {
            Zotero.debug("Zoom Script Error: " + e.message);
            return false;
        }
    }

    const intervalId = setInterval(() => {
        attempts++;
        if (tryInitializeZoom()) {
            clearInterval(intervalId);
        } else if (attempts >= MAX_ATTEMPTS) {
            clearInterval(intervalId);
        }
    }, CHECK_INTERVAL);

})();
```
### Ideas
- Obsidian Plugins
	- <mark style="background: #FF5582A6;">Webpage HTML Export</mark>
		- It seems like it doesn't convert files. It just literally takes an already existing HTML file to put on the web (if you have a server running)
		- The "Set HTML export settings" option freezes the Obsidian vault
	- <mark style="background: #FFB86CA6;">Enhancing Export</mark>
		- Uses Pandoc above
		- This doesn't work for every document though. Had problems with one file where the `---` messed up the export or if you bold a heading, it would just clump the headings together. 
	- <mark style="background: #FFF3A3A6;">Copy Document as HTML</mark>
		- This one seems to work pretty well (but formatting a little weird)
	- <mark style="background: #FFB86CA6;">Export to HTML</mark>
		- Doesn't recognize an image in date format?
- Use a custom script
	- <mark style="background: #FF5582A6;">Epub</mark>
		- Even with my HTML script to copy code, the format just gets messed up
- Chrome Extension
	- <mark style="background: #FF5582A6;">GoFullPage - Full Page Screen Capture</mark>
		- Doesn't work as expected
- Extensions
	- <mark style="background: #FF5582A6;">RTF</mark>
		- Zotero opens document in TextEdit instead of within Zotero
	- <mark style="background: #FF5582A6;">PDF</mark>
		- Code isn't always colored correctly
		- Can't copy code in Zotero
		- Line breaks messed up in Preview on mac
		- Extracting code from PDF looks difficult to do. 
	- <mark style="background: #FFB86CA6;">HTML</mark>
		- Able to copy code from Script I created or just opening it up in a browser
### HTML Solution
#### Image Zoom
##### Ideas
- Create a dialog box that lets me zoom within the image itself (Actions & Tags plugin)
- Maybe there is already a pre-built plugin to let me zoom into an image 
- Maybe there is some config setting that lets me zoom into the document similar to PDFs
- Use Mac's built-in zoom features?
- Maybe I could copy the image in some way that would let me view it automatically in Raycast?
- Whenever I press space on an image on my mac, there is a little preview that comes up of it. Maybe there is a feature like this in Zotero
- A CSS based zoom? Where would I execute this code in Zotero?
- A JS hotkey zoom?
## Source [^1]
- 
## References

[^1]: 