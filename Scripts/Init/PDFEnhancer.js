module.exports = function({ app, obsidian, secrets }) {
    const { setIcon, Notice, requestUrl } = obsidian;
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
        const sel = window.getSelection();
        if (sel && sel.anchorNode) {
            const pageEl = sel.anchorNode.parentElement?.closest('.page');
            if (pageEl && pageEl.getAttribute('data-page-number')) {
                return parseInt(pageEl.getAttribute('data-page-number'));
            }
        }
        const pageInput = pdfView.containerEl.querySelector('input.pdf-page-input');
        if (pageInput && pageInput.value) {
            const num = parseInt(pageInput.value);
            if (!isNaN(num)) return num;
        }
        return pdfView.page || 1;
    }

    // ── 3. ACTION: PLAIN QUOTE WITH FOOTNOTE ─────────────────────────────────
    async function copyPlainQuoteWithFootnote(pdfView) {
        const sel = window.getSelection();
        const selectedText = sel ? sel.toString().trim() : '';
        if (!selectedText) {
            new Notice('⚠️ Please select some text in the PDF first.');
            return;
        }
        const file = pdfView.file;
        if (!file) return;

        const pageNum = getActivePageNum(pdfView);
        const formatted = `> "${selectedText}"[^1]\n\n[^1]: [[${file.name}#page=${pageNum}|${file.basename}, page ${pageNum}]]`;
        await navigator.clipboard.writeText(formatted);
        new Notice(`📋 Copied quote (Page ${pageNum}) with footnote!`);
    }

    // ── 4. ACTION: GENERIC DRAG SNIPPER (DIAGRAM vs AI MATH OCR) ─────────────
    function startDragSnip(pdfView, mode = 'diagram') {
        const viewerContainer = pdfView.containerEl.querySelector('.pdf-viewer-container') || 
                                pdfView.containerEl.querySelector('.pdf-container') || 
                                pdfView.containerEl;
        if (!viewerContainer) return;

        new Notice(mode === 'math' ? '🧮 Drag a box over math text to transcribe...' : '✂️ Drag a box to snip diagram...', 3000);
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
                border: 2px dashed ${mode === 'math' ? '#10b981' : '#7c3aed'};
                background: ${mode === 'math' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(124, 58, 237, 0.2)'};
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

            if (boxRect.width < 15 || boxRect.height < 15) return;

            const scaleX = targetCanvas.width / canvasRect.width;
            const scaleY = targetCanvas.height / canvasRect.height;
            const cropX = (boxRect.left - canvasRect.left) * scaleX;
            const cropY = (boxRect.top - canvasRect.top) * scaleY;
            const cropW = boxRect.width * scaleX;
            const cropH = boxRect.height * scaleY;

            const pageNum = parseInt(targetPageEl.getAttribute('data-page-number')) || getActivePageNum(pdfView);

            if (mode === 'math') {
                await transcribeMathWithGemini(pdfView, targetCanvas, cropX, cropY, cropW, cropH, pageNum);
            } else {
                await cropAndSaveDiagram(pdfView, targetCanvas, cropX, cropY, cropW, cropH, pageNum);
            }
        };

        viewerContainer.addEventListener('mousedown', onMouseDown, { once: true });
    }

    // ── 5. AI MATH TRANSCRIPTION VIA GEMINI 1.5 FLASH ────────────────────────
    async function transcribeMathWithGemini(pdfView, sourceCanvas, x, y, w, h, pageNum) {
        const apiKey = secrets?.GOOGLE_AI_STUDIO_KEY || secrets?.GEMINI_API_KEY;
        if (!apiKey) {
            new Notice('❌ Please add GOOGLE_AI_STUDIO_KEY in Script Runner Settings -> Secrets.');
            return;
        }

        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = w;
        cropCanvas.height = h;
        const ctx = cropCanvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(sourceCanvas, x, y, w, h, 0, 0, w, h);
        const base64Data = cropCanvas.toDataURL('image/png').split(',')[1];

        new Notice('⏳ AI transcribing MathJax / LaTeX...', 4000);

        try {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
            const res = await requestUrl({
                url: endpoint,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: "Transcribe the text in this image into accurate Markdown with MathJax / LaTeX formulas ($...$ for inline math, $$...$$ for block equations). Preserve italics and bolding. Output ONLY the raw transcribed markdown, nothing else." },
                            { inline_data: { mime_type: "image/png", data: base64Data } }
                        ]
                    }]
                })
            });

            if (res.status === 200) {
                const data = res.json;
                const transcribed = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

                if (transcribed) {
                    const file = pdfView.file;
                    const finalMd = `> "${transcribed}"[^1]\n\n[^1]: [[${file.name}#page=${pageNum}|${file.basename}, page ${pageNum}]]`;
                    await navigator.clipboard.writeText(finalMd);
                    new Notice(`✅ Math Quote (Page ${pageNum}) transcribed & copied!`);
                } else {
                    new Notice('⚠️ AI returned an empty transcription.');
                }
            } else {
                new Notice(`❌ Gemini API Error (${res.status})`);
            }
        } catch (err) {
            console.error('[PDFEnhancer - Math OCR Error]', err);
            new Notice('❌ Failed to transcribe math with Gemini.');
        }
    }

    // ── 6. SAVE CROPPED DIAGRAM PNG ──────────────────────────────────────────
    async function cropAndSaveDiagram(pdfView, sourceCanvas, x, y, w, h, pageNum) {
        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = w;
        cropCanvas.height = h;
        const ctx = cropCanvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(sourceCanvas, x, y, w, h, 0, 0, w, h);

        cropCanvas.toBlob(async (blob) => {
            if (!blob) return;
            const arrayBuffer = await blob.arrayBuffer();
            const file = pdfView.file;
            const fileName = file ? file.basename : 'Document';
            const fileFullName = file ? file.name : 'Document.pdf';

            let attachmentFolder = 'attachments';
            try {
                if (typeof app.vault.getConfig === 'function') {
                    attachmentFolder = app.vault.getConfig('attachmentFolderPath') || 'attachments';
                }
            } catch (e) {}

            if (attachmentFolder.startsWith('./')) attachmentFolder = attachmentFolder.replace('./', '');
            if (attachmentFolder && attachmentFolder !== '/' && !await app.vault.adapter.exists(attachmentFolder)) {
                try { await app.vault.createFolder(attachmentFolder); } catch (e) {}
            }

            const timeStamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
            const imageFileName = `Diagram-P${pageNum}-${timeStamp}.png`;
            const fullImagePath = attachmentFolder && attachmentFolder !== '/' ? `${attachmentFolder}/${imageFileName}` : imageFileName;

            await app.vault.createBinary(fullImagePath, arrayBuffer);

            const markdownEmbed = `![[${imageFileName}]][^1]\n\n[^1]: [[${fileFullName}#page=${pageNum}|${fileName}, page ${pageNum}]]`;
            await navigator.clipboard.writeText(markdownEmbed);
            new Notice(`✂️ Diagram saved to ${fullImagePath} & footnote copied!`);
        }, 'image/png');
    }

    // ── 7. INJECT TOOLBAR CONTROLS ───────────────────────────────────────────
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

                // 2. Plain Text Quote Button
                const quoteBtn = document.createElement('button');
                quoteBtn.className = 'clickable-icon pdf-enhancer-btn';
                quoteBtn.setAttribute('aria-label', 'Copy selected plain text as quote with footnote');
                setIcon(quoteBtn, 'quote');
                quoteBtn.addEventListener('click', () => copyPlainQuoteWithFootnote(view));

                // 3. AI Math Quote OCR Button
                const mathBtn = document.createElement('button');
                mathBtn.className = 'clickable-icon pdf-enhancer-btn';
                mathBtn.setAttribute('aria-label', 'AI Math Snip: Drag box over equations to copy LaTeX/MathJax');
                setIcon(mathBtn, 'binary'); // Mathematical binary icon
                mathBtn.addEventListener('click', () => startDragSnip(view, 'math'));

                // 4. Diagram Crop Button
                const snipBtn = document.createElement('button');
                snipBtn.className = 'clickable-icon pdf-enhancer-btn';
                snipBtn.setAttribute('aria-label', 'Snip diagram from page');
                setIcon(snipBtn, 'scissors');
                snipBtn.addEventListener('click', () => startDragSnip(view, 'diagram'));

                group.appendChild(darkBtn);
                group.appendChild(quoteBtn);
                group.appendChild(mathBtn);
                group.appendChild(snipBtn);
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

    console.log('[PDFEnhancer] Dark Mode, Quote, AI Math Snip, and Diagram Tools active.');
};