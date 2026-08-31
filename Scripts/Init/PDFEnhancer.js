// PDFEnhancer.js (Minimalist Edition — Dark Mode & Spatial Bounding Box Anchor)
module.exports = function({ app, obsidian }) {
    const { setIcon, Notice } = obsidian;
    const DARK_CLASS = "pdf-darkmode-active";
    const STYLE_ID = "pdf-enhancer-styles";

    // ── 1. INJECT DARK MODE & TOOLBAR STYLES ─────────────────────────────────
    function ensureStylesInjected() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
            .${DARK_CLASS} .pdf-viewer-container, .${DARK_CLASS} .pdf-container, .${DARK_CLASS} .page {
                background-color: #1a1a1a !important;
            }
            .${DARK_CLASS} canvas {
                filter: invert(0.92) hue-rotate(180deg) brightness(0.95) contrast(1.1) !important;
            }
            .pdf-enhancer-group {
                display: inline-flex;
                align-items: center;
                gap: 2px;
                margin-left: 8px;
            }
            .pdf-enhancer-btn {
                padding: 4px;
                border-radius: var(--radius-s);
                cursor: pointer;
            }
            .pdf-enhancer-btn:hover {
                background-color: var(--background-modifier-hover);
            }
        `;
        document.head.appendChild(style);
    }

    // ── 2. HELPER: GET ACTIVE PAGE NUMBER ────────────────────────────────────
    function getActivePageNum(pdfView) {
        const pageInput = pdfView.containerEl.querySelector('input.pdf-page-input');
        if (pageInput && pageInput.value) {
            const num = parseInt(pageInput.value);
            if (!isNaN(num)) return num;
        }
        return pdfView.page || 1;
    }

    // ── 3. SPATIAL BOUNDING BOX ANCHOR ───────────────────────────────────────
    function startSpatialBoxSnip(pdfView) {
        const viewerContainer = pdfView.containerEl.querySelector('.pdf-viewer-container') || 
                                pdfView.containerEl.querySelector('.pdf-container') || 
                                pdfView.containerEl;
        if (!viewerContainer) return;

        new Notice('🎯 Drag a box over any section to copy its spatial link...', 3000);
        viewerContainer.style.cursor = 'crosshair';

        let startX = 0, startY = 0, snipBox = null, targetPageEl = null, targetCanvas = null;

        const onMouseDown = (e) => {
            targetPageEl = e.target.closest('.page');
            targetCanvas = targetPageEl ? targetPageEl.querySelector('canvas') : null;
            if (!targetPageEl || !targetCanvas) return;

            const pageRect = targetPageEl.getBoundingClientRect();
            startX = e.clientX - pageRect.left;
            startY = e.clientY - pageRect.top;

            snipBox = document.createElement('div');
            snipBox.style.cssText = `
                position: absolute;
                border: 2px dashed var(--interactive-accent, #7c3aed);
                background: rgba(124, 58, 237, 0.2);
                left: ${startX}px; top: ${startY}px; pointer-events: none; z-index: 9999;
            `;
            targetPageEl.appendChild(snipBox);

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
            e.preventDefault();
        };

        const onMouseMove = (e) => {
            if (!snipBox || !targetPageEl) return;
            const pageRect = targetPageEl.getBoundingClientRect();
            const curX = e.clientX - pageRect.left;
            const curY = e.clientY - pageRect.top;

            snipBox.style.left = `${Math.min(startX, curX)}px`;
            snipBox.style.top = `${Math.min(startY, curY)}px`;
            snipBox.style.width = `${Math.abs(curX - startX)}px`;
            snipBox.style.height = `${Math.abs(curY - startY)}px`;
        };

        const onMouseUp = async (e) => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            viewerContainer.removeEventListener('mousedown', onMouseDown);
            viewerContainer.style.cursor = '';

            if (!snipBox || !targetCanvas || !targetPageEl) {
                if (snipBox) snipBox.remove();
                return;
            }

            const boxRect = snipBox.getBoundingClientRect();
            const canvasRect = targetCanvas.getBoundingClientRect();
            snipBox.remove();

            if (boxRect.width < 10 || boxRect.height < 10) return;

            const scaleX = targetCanvas.width / canvasRect.width;
            const scaleY = targetCanvas.height / canvasRect.height;
            const cropX = (boxRect.left - canvasRect.left) * scaleX;
            const cropY = (boxRect.top - canvasRect.top) * scaleY;
            const cropW = boxRect.width * scaleX;
            const cropH = boxRect.height * scaleY;

            // Normalized [0, 1000] bounding box calculation
            const ymin = Math.max(0, Math.min(1000, Math.round((cropY / targetCanvas.height) * 1000)));
            const xmin = Math.max(0, Math.min(1000, Math.round((cropX / targetCanvas.width) * 1000)));
            const ymax = Math.max(0, Math.min(1000, Math.round(((cropY + cropH) / targetCanvas.height) * 1000)));
            const xmax = Math.max(0, Math.min(1000, Math.round(((cropX + cropW) / targetCanvas.width) * 1000)));

            const pageNum = parseInt(targetPageEl.getAttribute('data-page-number')) || getActivePageNum(pdfView);
            const file = pdfView.file;
            if (!file) return;

            const spatialLink = `[[${file.name}#page=${pageNum}&rect=${ymin},${xmin},${ymax},${xmax}|${file.basename}, p. ${pageNum}]]`;

            await navigator.clipboard.writeText(spatialLink);
            new Notice(`📋 Copied Spatial Link (Page ${pageNum})!`);
        };

        viewerContainer.addEventListener('mousedown', onMouseDown, { once: true });
    }

    // ── 4. INJECT TOOLBAR CONTROLS ───────────────────────────────────────────
    function injectToolbarGroup() {
        ensureStylesInjected();

        app.workspace.getLeavesOfType('pdf').forEach(leaf => {
            const view = leaf.view;
            if (!view) return;

            const toolbar = view.containerEl.querySelector('.pdf-toolbar');
            if (toolbar && !toolbar.querySelector('.pdf-enhancer-group')) {
                const group = document.createElement('div');
                group.className = 'pdf-enhancer-group';

                // 1. Dark Mode Button
                const darkBtn = document.createElement('button');
                darkBtn.className = 'clickable-icon pdf-enhancer-btn';
                darkBtn.setAttribute('aria-label', 'Toggle PDF Dark Mode');
                setIcon(darkBtn, 'moon');
                darkBtn.addEventListener('click', () => view.containerEl.classList.toggle(DARK_CLASS));

                // 2. Spatial Bounding Box Anchor Button
                const boxBtn = document.createElement('button');
                boxBtn.className = 'clickable-icon pdf-enhancer-btn';
                boxBtn.setAttribute('aria-label', 'Spatial Link: Drag box over any section to copy link');
                setIcon(boxBtn, 'scan');
                boxBtn.addEventListener('click', () => startSpatialBoxSnip(view));

                group.appendChild(darkBtn);
                group.appendChild(boxBtn);
                toolbar.appendChild(group);
            }
        });
    }

    function injectWithDelays() {
        injectToolbarGroup();
        setTimeout(injectToolbarGroup, 150);
        setTimeout(injectToolbarGroup, 400);
        setTimeout(injectToolbarGroup, 800);
    }

    injectWithDelays();

    if (window.pdfEnhancerListener) app.workspace.off('layout-change', window.pdfEnhancerListener);
    if (window.pdfEnhancerActiveLeafListener) app.workspace.off('active-leaf-change', window.pdfEnhancerActiveLeafListener);

    window.pdfEnhancerListener = injectWithDelays;
    window.pdfEnhancerActiveLeafListener = injectWithDelays;

    app.workspace.on('layout-change', window.pdfEnhancerListener);
    app.workspace.on('active-leaf-change', window.pdfEnhancerActiveLeafListener);

    console.log('[PDFEnhancer] Minimalist Spatial Linker active.');
};