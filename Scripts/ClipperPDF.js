// PdfClipper.js (Streaming Batch Free Gemma 4 31B OCR Edition - Dynamic Inline Cropper)
module.exports = async ({ app, obsidian }) => {
    const { Notice } = obsidian;
    const { exec } = require('child_process');
    const fs = require('fs');
    const path = require('path');
    const os = require('os');

    // ── CONFIGURATION ─────────────────────────────────────────────
    // Get your free API key from https://aistudio.google.com/
    const GOOGLE_AI_STUDIO_KEY = "";
    
    // Using Gemma 4 31B (Thinking set to MINIMAL for fast speed)
    const MODEL_ID = "gemma-4-31b-it";
    
    const CONCONCURRENCY = 100;    // Effectively unlimited concurrency
    const STAGGER_DELAY = 8000;   // 8-second stagger between launches (Produces exactly 7.5 RPM, always under 15 RPM)
    const MAX_PAGES_PER_BATCH = 15; // Max pages per batch — split-on-error handles anything still too large
    // ──────────────────────────────────────────────────────────────

    const ENV = {
        ...process.env,
        PATH: [
            '/opt/homebrew/bin',
            '/usr/local/bin',
            process.env.PATH
        ].join(':')
    };

    const run = (cmd) => new Promise((resolve, reject) => {
        exec(cmd, { env: ENV }, (err, stdout, stderr) => {
            if (err) reject(new Error(stderr || err.message));
            else resolve(stdout);
        });
    });

    // Locate the active PDF file in your workspace
    const activeLeaf = app.workspace.getLeaf();
    const activeView = activeLeaf ? activeLeaf.view : null;
    
    if (!activeView || activeView.getViewType() !== 'pdf') {
        new Notice('Please select an active PDF tab to clip.');
        return;
    }

    const activeFile = app.workspace.getActiveFile();
    if (!activeFile) {
        new Notice('No active file resolved.');
        return;
    }

    // Auto-Detect Current PDF Page
    let currentPageVal = "1";
    try {
        const child = activeView.viewer?.child;
        const pdfViewer = child?.pdfViewer?.pdfViewer;
        if (pdfViewer && pdfViewer.currentPageNumber) {
            currentPageVal = String(pdfViewer.currentPageNumber);
        }
    } catch (e) {
        console.warn("Could not auto-detect current PDF page index:", e);
    }

    // Prompt the user for the page range to extract (pre-filled with current page)
    const pageRange = await new Promise((resolve) => {
        const modal = new (class extends obsidian.Modal {
            constructor(app) {
                super(app);
                this.value = currentPageVal;
            }
            onOpen() {
                this.titleEl.setText("Clip PDF Pages via Gemma 4 (Free)");
                this.contentEl.createEl("p", { text: "Specify page range (e.g. 1, 3-5, 12-30, or 'all'):" });
                
                const input = this.contentEl.createEl("input", { type: "text" });
                input.value = this.value;
                input.style.width = "100%";
                input.focus();
                input.select();

                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        this.value = input.value;
                        this.close();
                    }
                });

                const btn = this.contentEl.createEl("button", { text: "Convert", cls: "mod-cta" });
                btn.style.marginTop = "12px";
                btn.addEventListener("click", () => {
                    this.value = input.value;
                    this.close();
                });
            }
            onClose() {
                resolve(this.value);
            }
        })(app);
        modal.open();
    });

    if (!pageRange) return;

    if (GOOGLE_AI_STUDIO_KEY === "YOUR_GOOGLE_AI_STUDIO_KEY_HERE") {
        new Notice("Please configure your GOOGLE_AI_STUDIO_KEY inside the script first!");
        return;
    }

    const currentNotice = new Notice(`Analyzing document layout...`, 0);

    try {
        const basePath = app.vault.adapter.basePath;
        const clippingsDir = path.join(basePath, 'Private', 'Clippings');
        if (!fs.existsSync(clippingsDir)) fs.mkdirSync(clippingsDir, { recursive: true });

        // Ensure custom attachments folder exists inside clippings directory
        const attachmentsDir = path.join(clippingsDir, '- Attachments');
        if (!fs.existsSync(attachmentsDir)) fs.mkdirSync(attachmentsDir, { recursive: true });

        const fullPdfPath = path.join(basePath, activeFile.path);
        const ts = Date.now();

        // 1. Parse and build page queue
        let pageNumbers = [];
        if (pageRange.toLowerCase() === 'all') {
            currentNotice.setMessage("Counting PDF pages locally via qpdf...");
            const pageCountStr = await run(`qpdf --show-npages "${fullPdfPath}"`);
            const pageCount = parseInt(pageCountStr.trim());
            for (let p = 1; p <= pageCount; p++) pageNumbers.push(p);
        } else if (pageRange.includes('-')) {
            const [start, end] = pageRange.split('-').map(Number);
            for (let p = start; p <= end; p++) pageNumbers.push(p);
        } else {
            pageNumbers = pageRange.split(',').map(Number);
        }

        if (pageNumbers.length === 0) {
            throw new Error("Invalid page range specified.");
        }

        // 2. Fixed-size batch chunking (split-on-error handles batches still too large)
        const batches = [];
        for (let i = 0; i < pageNumbers.length; i += MAX_PAGES_PER_BATCH) {
            batches.push(pageNumbers.slice(i, i + MAX_PAGES_PER_BATCH));
        }

        // 3. Set up parallel throttled processing workers
        // Keys use sortable decimal strings (e.g. "0001.0", "0001.1") so split halves
        // from a truncated batch slot in correctly between their neighbours when concatenated.
        let completedCount = 0;
        const totalBatchesRef = { value: batches.length }; // mutable so requeued halves update the display

        const promptText = "Analyze these pages of a document. Convert all of its contents into clean, structured Markdown. " +
                            "Translate all mathematical symbols, equations, and inline variables strictly into standard LaTeX/MathJax formatting (using $$ for block equations and $ for inline math). " +
                            "IMPORTANT: For equation numbers (like (1.1)), do NOT use '\\eqno'. Use standard '\\tag{1.1}' inside the LaTeX block instead. " +
                            "IMPORTANT: For standard bracket citations/references like [11] or [31], escape the brackets as \\[11\\] and \\[31\\] to prevent Markdown parsing conflicts. " +
                            "IMPORTANT: You are being fed multiple page images in the input payload sequentially (Image 1, Image 2, Image 3, etc.). " +
                            "IMPORTANT: Ignore running page headers — these are the repeated chapter title, section title, or page number that appear at the very top of a page (e.g. \"0.2. MATHEMATICAL STATEMENTS 5\" or \"8 0. INTRODUCTION AND PRELIMINARIES\"). Do NOT include these in the output. Do preserve footer content such as footnotes, as these contain real content. " +
                            "IMPORTANT: For tables, convert to standard Markdown table format. For multi-column layouts, preserve reading order (left column first, then right column). " +
                            "IMPORTANT: For figures, only identify a bounding box for self-contained visual elements such as graphs, diagrams, charts, geometric drawings, or illustrations. Do NOT create bounding boxes for inline math, small symbols, decorative elements, or anything that is part of the text flow. When identifying a bounding box, make it tight around the visual element only — do not include surrounding caption text or whitespace. Include a small margin of roughly 10 units on each side so the crop is not clipped at the edges. " +
                            "If you see a qualifying figure, identify its bounding box coordinates on that page. Output these coordinates in normalized [ymin, xmin, ymax, xmax] format where 0 is top/left and 1000 is bottom/right of that page. Also identify the 1-based sequential index of the Image it belongs to (e.g., 1 for the first image, 2 for the second, etc.). Insert an HTML comment placeholder EXACTLY where the figure belongs in the text flow, formatted exactly as: <!-- FIGURE_START [imageIndex,ymin,xmin,ymax,xmax] -->. " +
                            "Preserve headings, tables, columns, and lists exactly as structured.";

        // Task executor for a single batch (with built-in retry, truncation detection, halving requeue,
        // coordinates translation, and pdftoppm inline cropping).
        // sortKey is a sortable decimal string like "0001.0" or "0001.1" (for a split half).
        const processBatch = async (batchPages, sortKey) => {
            const batchRangeStr = batchPages.join(',');
            const safeKey = sortKey.replace('.', '_');
            const tmpPdf = path.join(os.tmpdir(), `split-pdf-${ts}-${safeKey}.pdf`);
            const tmpImgPrefix = path.join(os.tmpdir(), `split-img-${ts}-${safeKey}`);
            const tmpPayloadPath = path.join(os.tmpdir(), `gemini-payload-${ts}-${safeKey}.json`);
            const tmpResultPath = path.join(os.tmpdir(), `result-${ts}-${sortKey}.md`);

            try {
                // Split the PDF locally
                await run(`qpdf "${fullPdfPath}" --pages . ${batchRangeStr} -- "${tmpPdf}"`);

                // Convert PDF chunk to PNG assets locally using pdftoppm
                await run(`pdftoppm -png -r 150 "${tmpPdf}" "${tmpImgPrefix}"`);

                // Locate generated images
                const tempFiles = fs.readdirSync(os.tmpdir());
                const imageFiles = tempFiles
                    .filter(f => f.startsWith(`split-img-${ts}-${safeKey}-`) && f.endsWith('.png'))
                    .sort((a, b) => {
                        const numA = parseInt(a.match(/-(\d+)\.png$/)?.[1] || "0");
                        const numB = parseInt(b.match(/-(\d+)\.png$/)?.[1] || "0");
                        return numA - numB;
                    });

                if (imageFiles.length === 0) {
                    throw new Error(`Failed to generate images for batch pages: ${batchRangeStr}`);
                }

                // Build Gemma 4 API payload for this batch
                const parts = [{ text: promptText }];
                for (const imgFile of imageFiles) {
                    const imgPath = path.join(os.tmpdir(), imgFile);
                    const imageBuffer = fs.readFileSync(imgPath);
                    const base64Image = imageBuffer.toString('base64');
                    parts.push({
                        inline_data: {
                            mime_type: "image/png",
                            data: base64Image
                        }
                    });
                }

                const payload = {
                    contents: [{ parts: parts }],
                    generationConfig: {
                        maxOutputTokens: 32768  // Explicitly request Gemma's full output limit
                    }
                };

                // Write payload to temporary JSON file to avoid macOS E2BIG
                fs.writeFileSync(tmpPayloadPath, JSON.stringify(payload));

                // Execute curl reading directly from the payload file
                const ocrCmd = `curl -s -X POST \
                    -H "Content-Type: application/json" \
                    -d @${tmpPayloadPath} \
                    "https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${GOOGLE_AI_STUDIO_KEY}"`;

                let attempts = 0;
                const maxAttempts = 5;
                let ocrJson = null;

                // Healing retry loop for robust execution
                while (attempts < maxAttempts) {
                    currentNotice.setMessage(`Running layout & math extraction... [${sortKey}]`);
                    const ocrResponse = await run(ocrCmd);
                    ocrJson = JSON.parse(ocrResponse);

                    if (ocrJson.error) {
                        const isRetryable = ocrJson.error.code === 429 || ocrJson.error.status === "RESOURCE_EXHAUSTED" ||
                                            ocrJson.error.code === 500 || ocrJson.error.status === "INTERNAL";
                        const isTooLarge = ocrJson.error.code === 400 &&
                                           ocrJson.error.message?.toLowerCase().includes("invalid argument");

                        if (isTooLarge && batchPages.length > 1) {
                            // Payload too large — split in half and requeue, same as MAX_TOKENS
                            const mid = Math.floor(batchPages.length / 2);
                            const firstHalf = batchPages.slice(0, mid);
                            const secondHalf = batchPages.slice(mid);
                            const keyA = `${sortKey}.0`;
                            const keyB = `${sortKey}.1`;
                            totalBatchesRef.value += 1;
                            currentNotice.setMessage(`Payload too large [${sortKey}] — splitting into ${keyA} and ${keyB}...`);
                            await Promise.all([
                                processBatch(firstHalf, keyA),
                                processBatch(secondHalf, keyB)
                            ]);
                            return;
                        } else if (isRetryable && attempts < maxAttempts - 1) {
                            attempts++;
                            const backoffTime = 5000 * attempts; // Linear backoff: 5s, 10s, 15s...
                            const reason = (ocrJson.error.code === 500 || ocrJson.error.status === "INTERNAL") ? "Server error (500)" : "Rate limit";
                            currentNotice.setMessage(`${reason} hit [${sortKey}]. Pausing for ${backoffTime / 1000}s before retry...`);
                            await new Promise(r => setTimeout(r, backoffTime));
                            continue; // Loop back and re-attempt
                        } else {
                            throw new Error(`Google API Error: ${ocrJson.error.message}`);
                        }
                    }
                    
                    break; // Request was successful
                }

                // Check if the model truncated the output due to hitting the token limit.
                // If so, split the batch in half and requeue both halves as new tasks.
                const finishReason = ocrJson?.candidates?.[0]?.finishReason;
                if (finishReason === "MAX_TOKENS" || finishReason === "LENGTH") {
                    if (batchPages.length === 1) {
                        // Single page is still truncating — can't split further, write what we have
                        console.warn(`Single page ${batchPages[0]} hit output token limit. Writing partial output.`);
                    } else {
                        // Split in half and requeue both halves with sortable sub-keys
                        const mid = Math.floor(batchPages.length / 2);
                        const firstHalf = batchPages.slice(0, mid);
                        const secondHalf = batchPages.slice(mid);
                        const keyA = `${sortKey}.0`;
                        const keyB = `${sortKey}.1`;
                        totalBatchesRef.value += 1; // one batch became two
                        currentNotice.setMessage(`Output truncated [${sortKey}] — splitting into halves ${keyA} and ${keyB}...`);
                        // Run both halves and await them before this batch's slot resolves
                        await Promise.all([
                            processBatch(firstHalf, keyA),
                            processBatch(secondHalf, keyB)
                        ]);
                        // No temp file written for this slot — halves cover it
                        return;
                    }
                }

                // Extract text parts
                const responseParts = ocrJson?.candidates?.[0]?.content?.parts || [];
                let extractedMarkdown = "";
                for (const part of responseParts) {
                    if (part.thought) {
                        // Skip internal thinking thoughts cleanly
                        continue;
                    }
                    if (part.text) extractedMarkdown += part.text;
                }

                if (!extractedMarkdown) {
                    throw new Error(`Google API returned an empty output`);
                }

                // ── NATIVE VECTOR INLINE CROPPING ─────────────────────────────────
                let processedMarkdown = extractedMarkdown;
                const figureRegex = /<!-- FIGURE_START \[(\d+),(\d+),(\d+),(\d+),(\d+)\] -->/g;
                let match;
                let figCount = 0;

                // Parse each visual grounding coordinate from Gemma's response
                while ((match = figureRegex.exec(extractedMarkdown)) !== null) {
                    const [fullTag, rawImageIndex, ymin, xmin, ymax, xmax] = match;
                    const imageIndex = parseInt(rawImageIndex); // 1-based index

                    // Map the imageIndex back to the actual PDF page number
                    if (imageIndex >= 1 && imageIndex <= batchPages.length) {
                        const pageNum = batchPages[imageIndex - 1]; // Translate to actual PDF page

                        // Get page size in points using pdfinfo
                        const info = await run(`pdfinfo -f ${pageNum} -l ${pageNum} "${fullPdfPath}"`);
                        const sizeMatch = info.match(/Page\s+\d+\s+size:\s+([\d.]+)\s+x\s+([\d.]+)/) || info.match(/Page size:\s+([\d.]+)\s+x\s+([\d.]+)/);

                        if (sizeMatch) {
                            const pageWidth = parseFloat(sizeMatch[1]);
                            const pageHeight = parseFloat(sizeMatch[2]);
                            const slug = activeFile.basename.replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').slice(0, 30);

                            // Translate normalized coordinates [0, 1000] to PDF points [72 DPI]
                            const x = (parseInt(xmin) / 1000) * pageWidth;
                            const y = (parseInt(ymin) / 1000) * pageHeight;
                            const w = ((parseInt(xmax) - parseInt(xmin)) / 1000) * pageWidth;
                            const h = ((parseInt(ymax) - parseInt(ymin)) / 1000) * pageHeight;

                            // Calculate pixel bounds at pdftoppm's 150 DPI resolution
                            const scale = 150 / 72;
                            const pxX = Math.round(x * scale);
                            const pxY = Math.round(y * scale);
                            const pxW = Math.round(w * scale);
                            const pxH = Math.round(h * scale);

                            const figImgName = `fig-${slug}-p${pageNum}-${figCount}`;
                            const figImgPath = path.join(attachmentsDir, figImgName); // Save directly to the custom attachments folder

                            // Crop the vector bounding box directly from the original PDF
                            await run(`pdftoppm -png -r 150 -x ${pxX} -y ${pxY} -W ${pxW} -H ${pxH} -f ${pageNum} -l ${pageNum} "${fullPdfPath}" "${figImgPath}"`);
                            
                            // Dynamically scan the attachments directory to find the actual filename generated on disk
                            // (Safely resolves pdftoppm page suffix variations like -06.png or -006.png)
                            const attachmentFiles = fs.readdirSync(attachmentsDir);
                            const actualFigFile = attachmentFiles.find(f => f.startsWith(figImgName) && f.endsWith('.png'));

                            if (actualFigFile) {
                                // Swap out the placeholder HTML comment with a clean, path-free Obsidian link
                                processedMarkdown = processedMarkdown.replace(fullTag, `\n\n![[${actualFigFile}]]\n\n`);
                            } else {
                                console.warn(`Could not locate generated figure file on disk for prefix: ${figImgName}`);
                            }
                            figCount++;
                        }
                    }
                }
                // ───────────────────────────────────────────────────────────────

                // Write this batch result to a temp file immediately (avoids accumulating in memory).
                // File is named by sortKey so the final concatenation can order them correctly.
                fs.writeFileSync(tmpResultPath, `\n\n<!-- Page(s) ${batchRangeStr} -->\n\n` + processedMarkdown);
                completedCount++;
                currentNotice.setMessage(`Extracted ${completedCount} of ${totalBatchesRef.value} batches...`);

            } catch (err) {
                console.error(`Batch ${sortKey} (pages ${batchRangeStr}) failed:`, err);
                // Write failure marker to temp file so ordering is preserved
                fs.writeFileSync(tmpResultPath, `\n\n<!-- Page(s) ${batchRangeStr} - Extraction Failed: ${err.message} -->\n\n`);
                new Notice(`Batch ${sortKey} failed, but continuing remaining pages...`);
            } finally {
                // Clean up temporary files
                if (fs.existsSync(tmpPdf)) fs.unlinkSync(tmpPdf);
                if (fs.existsSync(tmpPayloadPath)) fs.unlinkSync(tmpPayloadPath);
                
                const tempFiles = fs.readdirSync(os.tmpdir());
                const imageFiles = tempFiles.filter(f => f.startsWith(`split-img-${ts}-${safeKey}-`) && f.endsWith('.png'));
                for (const imgFile of imageFiles) {
                    fs.unlinkSync(path.join(os.tmpdir(), imgFile));
                }
            }
        };

        // Concurrency Controller / Worker Pool (Staggered Queue)
        // Initial batches get zero-padded integer sort keys: "0001.0" style keys from splits
        // will naturally sort between their parent neighbours.
        currentNotice.setMessage(`Initiating staggered parallel workers...`);
        const pool = [];
        const activeTasks = new Set();

        for (let i = 0; i < batches.length; i++) {
            // If we are at our concurrency ceiling, wait for at least one worker to finish
            if (activeTasks.size >= CONCONCURRENCY) {
                await Promise.race(activeTasks);
            }

            // Zero-pad to 4 digits so lexicographic sort equals numeric sort up to 9999 batches
            const sortKey = String(i).padStart(4, '0');
            const task = processBatch(batches[i], sortKey);
            pool.push(task);
            activeTasks.add(task);
            
            task.then(() => activeTasks.delete(task), () => activeTasks.delete(task));

            // Stagger the launch of the next concurrent batch by 8 seconds
            if (i < batches.length - 1 && activeTasks.size < CONCONCURRENCY) {
                const secondsLeft = STAGGER_DELAY / 1000;
                currentNotice.setMessage(`Staggering queue... Next worker in ${secondsLeft}s`);
                await new Promise(r => setTimeout(r, STAGGER_DELAY));
            }
        }

        // Wait for all remaining parallel tasks to resolve
        await Promise.all(pool);

        // 4. Collect all result temp files, sort by key, and concatenate in order
        const date = new Date().toISOString().slice(0, 10);
        const slug = activeFile.basename.replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').slice(0, 50);
        const filename = `${date}-${slug}-p${pageRange.replace(/[^0-9-]/g, '')}.md`;
        const outPath = path.join(clippingsDir, filename);

        const relativePdfLink = `[[${activeFile.path}|Source PDF]]`;
        const frontmatter = `---\nSource: "${relativePdfLink}"\nPageRange: "${pageRange}"\n---\n\n`;

        // Gather all result temp files for this run and sort them by their key
        const allTmpFiles = fs.readdirSync(os.tmpdir())
            .filter(f => f.startsWith(`result-${ts}-`) && f.endsWith('.md'))
            .sort((a, b) => {
                // Extract the sort key from filenames like "result-<ts>-0001.md" or "result-<ts>-0001.0.md"
                const keyA = a.replace(`result-${ts}-`, '').replace('.md', '');
                const keyB = b.replace(`result-${ts}-`, '').replace('.md', '');
                return keyA.localeCompare(keyB);
            });

        const writeStream = fs.createWriteStream(outPath);
        writeStream.write(frontmatter);
        for (const tmpFile of allTmpFiles) {
            const tmpFilePath = path.join(os.tmpdir(), tmpFile);
            writeStream.write(fs.readFileSync(tmpFilePath, 'utf8'));
            fs.unlinkSync(tmpFilePath); // clean up temp file
        }
        await new Promise((resolve, reject) => {
            writeStream.end();
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });

        // Open the Markdown file side-by-side with your PDF
        const vaultPath = `Private/Clippings/${filename}`;
        const file = app.vault.getAbstractFileByPath(vaultPath);
        if (file) {
            const rightLeaf = app.workspace.getLeaf('split', 'vertical');
            await rightLeaf.openFile(file);
        }

        currentNotice.hide();
        new Notice(`Clipped ${pageNumbers.length} page(s) successfully!`);

    } catch (err) {
        if (currentNotice) currentNotice.hide();
        new Notice(`Clip failed: ${err.message}`);
        console.error('PdfClipper.js error:', err);
    }
};