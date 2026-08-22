import { Plugin } from 'obsidian';

export default class ImageAnchor extends Plugin {
    private pinnedCards: HTMLElement[] = [];
    private styleEl: HTMLStyleElement | null = null;

    async onload() {
        // 1. Inject CSS for styling floating images and hiding native zoom overlays
        this.injectStyles();

        // 2. Intercept click events in CAPTURE phase to block native Obsidian image zoom
        this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
            // Ignore if Command (Mac) or Ctrl (Windows/Linux) is pressed so other plugins (like AirSketch) can handle it
            if (evt.metaKey || evt.ctrlKey) {
                return;
            }

            const target = evt.target;
            if (!(target instanceof HTMLImageElement)) return;

            // Target images in markdown reading view, live preview, or embeds
            if (!target.closest('.markdown-source-view, .markdown-reading-view, .cm-embed-block, .image-embed')) {
                return;
            }

            // Block native Obsidian image zoom
            evt.stopImmediatePropagation();
            evt.preventDefault();

            // Anchor the clicked image directly on screen
            this.anchorImage(target);
        }, { capture: true });

        // 3. Register global Escape key listener to close anchored images
        this.registerDomEvent(document, 'keydown', (evt: KeyboardEvent) => {
            if (evt.key === 'Escape' && this.pinnedCards.length > 0) {
                const lastCard = this.pinnedCards.pop();
                if (lastCard) {
                    lastCard.remove();
                }
            }
        });
    }

    onunload() {
        // Cleanup all anchored image elements and style tags
        this.pinnedCards.forEach(card => card.remove());
        this.pinnedCards = [];
        if (this.styleEl) {
            this.styleEl.remove();
        }
    }

    private injectStyles() {
        this.styleEl = document.createElement('style');
        this.styleEl.id = 'image-anchor-styles';
        this.styleEl.textContent = `
            /* Hide native Obsidian zoom icons & overlays */
            .image-embed .image-zoom-button,
            .image-embed-zoom,
            .markdown-rendered .image-zoom-button,
            .cm-embed-block .image-zoom-button {
                display: none !important;
            }

            /* Floating borderless anchored image matching Image Toolkit */
            .image-anchor-view {
                position: fixed;
                z-index: 9999;
                cursor: grab;
                box-shadow: 0 4px 18px rgba(0, 0, 0, 0.45);
                border-radius: 4px;
                user-select: none;
                -webkit-user-drag: none;
                transition: box-shadow 0.15s ease;
                object-fit: contain;
            }

            .image-anchor-view:active {
                cursor: grabbing;
            }

            .image-anchor-view:hover {
                box-shadow: 0 0 10px #55acc6, 0 6px 20px rgba(0, 0, 0, 0.5);
            }
        `;
        document.head.appendChild(this.styleEl);
    }

    private anchorImage(imgEl: HTMLImageElement) {
        // Determine natural dimensions and aspect ratio
        const naturalW = imgEl.naturalWidth || imgEl.clientWidth || 800;
        const naturalH = imgEl.naturalHeight || imgEl.clientHeight || 600;
        const aspectRatio = naturalW / naturalH;

        // Viewport bounds (80% of window size, matching Image Toolkit's default zoom size)
        const maxW = window.innerWidth * 0.8;
        const maxH = window.innerHeight * 0.8;

        let targetW = naturalW;
        let targetH = naturalH;

        // Fit image inside 80% viewport bounds while preserving aspect ratio
        if (targetW > maxW || targetH > maxH) {
            if (targetW / maxW > targetH / maxH) {
                targetW = maxW;
                targetH = targetW / aspectRatio;
            } else {
                targetH = maxH;
                targetW = targetH * aspectRatio;
            }
        } else {
            // Scale up small images comfortably up to max bounds for clear readability
            const minW = Math.min(maxW, 700);
            if (targetW < minW) {
                targetW = minW;
                targetH = targetW / aspectRatio;
                if (targetH > maxH) {
                    targetH = maxH;
                    targetW = targetH * aspectRatio;
                }
            }
        }

        // Center on screen (stagger slightly if multiple images pinned)
        const offset = (this.pinnedCards.length % 5) * 20;
        const left = (window.innerWidth - targetW) / 2 + offset;
        const top = (window.innerHeight - targetH) / 2 + offset;

        // Create floating image element
        const floatingImg = document.createElement('img');
        floatingImg.className = 'image-anchor-view';
        floatingImg.src = imgEl.src;
        floatingImg.alt = imgEl.alt;

        floatingImg.style.width = `${targetW}px`;
        floatingImg.style.height = `${targetH}px`;
        floatingImg.style.left = `${left}px`;
        floatingImg.style.top = `${top}px`;

        document.body.appendChild(floatingImg);
        this.pinnedCards.push(floatingImg);

        // Bring to front on click
        floatingImg.addEventListener('mousedown', () => {
            this.pinnedCards.forEach(c => c.style.zIndex = '9999');
            floatingImg.style.zIndex = '10000';
        });

        // Enable Dragging
        this.makeDraggable(floatingImg);

        // Enable Cursor-centered Zooming
        this.makeZoomable(floatingImg);

        // Right-click to dismiss image
        floatingImg.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.removeCard(floatingImg);
        });
    }

    private removeCard(card: HTMLElement) {
        card.remove();
        this.pinnedCards = this.pinnedCards.filter(c => c !== card);
    }

    private makeDraggable(img: HTMLElement) {
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let initialLeft = 0;
        let initialTop = 0;

        const onMouseDown = (e: MouseEvent) => {
            if (e.button !== 0) return; // Only left-click drags
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = img.offsetLeft;
            initialTop = img.offsetTop;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            e.preventDefault();
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            img.style.left = `${initialLeft + dx}px`;
            img.style.top = `${initialTop + dy}px`;
        };

        const onMouseUp = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        img.addEventListener('mousedown', onMouseDown);
    }

    private makeZoomable(img: HTMLImageElement) {
        img.addEventListener('wheel', (e: WheelEvent) => {
            e.preventDefault();
            const rect = img.getBoundingClientRect();
            const currentWidth = rect.width;
            const currentHeight = rect.height;
            const aspectRatio = currentWidth / currentHeight;

            // Smooth zoom factor
            const factor = e.deltaY < 0 ? 1.1 : 0.9;
            let newWidth = currentWidth * factor;
            let newHeight = newWidth / aspectRatio;

            // Bounds check
            if (newWidth < 50 || newWidth > 4000) return;

            // Zoom directly toward mouse cursor position
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const deltaW = newWidth - currentWidth;
            const deltaH = newHeight - currentHeight;

            const newLeft = img.offsetLeft - (deltaW * (mouseX / currentWidth));
            const newTop = img.offsetTop - (deltaH * (mouseY / currentHeight));

            img.style.width = `${newWidth}px`;
            img.style.height = `${newHeight}px`;
            img.style.left = `${newLeft}px`;
            img.style.top = `${newTop}px`;
        }, { passive: false });
    }
}