// InstantOCR.js (Silent Start & Cancel — Gemini 3.5 Flash-Lite -> 3.1 Flash-Lite -> Gemma 4)
module.exports = async ({ app, obsidian, secrets }) => {
    const { Notice } = obsidian;
    const { exec } = require('child_process');
    const fs = require('fs');
    const path = require('path');
    const os = require('os');

    // ── 1. CONFIGURATION & 3-TIER CASCADE ────────────────────────────────────
    const GOOGLE_AI_STUDIO_KEY = secrets?.GOOGLE_AI_STUDIO_KEY;

    if (!GOOGLE_AI_STUDIO_KEY) {
        new Notice("❌ Add GOOGLE_AI_STUDIO_KEY in Script Runner settings → Secrets first!");
        return;
    }

    const MODEL_CASCADE = [
        { id: "gemini-3.5-flash-lite", name: "Gemini 3.5 Flash-Lite", limit: 500 },
        { id: "gemini-3.1-flash-lite", name: "Gemini 3.1 Flash-Lite", limit: 500 },
        { id: "gemma-4-31b-it",        name: "Gemma 4 31B",           limit: 14400 }
    ];

    // ── 2. PERSISTENT VAULT USAGE TRACKER (.obsidian/gemini-daily-usage.json) ──
    const basePath = typeof app.vault.adapter.getBasePath === 'function' 
        ? app.vault.adapter.getBasePath() 
        : app.vault.adapter.basePath;
    const USAGE_FILE = path.join(basePath, app.vault.configDir, 'gemini-daily-usage.json');

    function getAndIncrementDailyUsage(modelId) {
        const today = new Date().toISOString().slice(0, 10);
        let usage = { date: today, counts: {} };

        try {
            if (fs.existsSync(USAGE_FILE)) {
                const data = JSON.parse(fs.readFileSync(USAGE_FILE, 'utf8'));
                if (data.date === today && data.counts) {
                    usage = data;
                }
            }
        } catch (e) {}

        usage.counts[modelId] = (usage.counts[modelId] || 0) + 1;

        try {
            fs.writeFileSync(USAGE_FILE, JSON.stringify(usage, null, 2));
        } catch (e) {}

        return usage.counts[modelId];
    }

    const ENV = {
        ...process.env,
        PATH: ['/opt/homebrew/bin', '/usr/local/bin', process.env.PATH].join(':')
    };

    const run = (cmd) => new Promise((resolve, reject) => {
        exec(cmd, { env: ENV }, (err, stdout, stderr) => {
            if (err) reject(new Error(stderr || err.message));
            else resolve(stdout);
        });
    });

    const ts = Date.now();
    const tmpImg = path.join(os.tmpdir(), `ocr-snip-${ts}.png`);
    const tmpPayloadPath = path.join(os.tmpdir(), `ocr-payload-${ts}.json`);

    const PROMPT = "Transcribe this cropped section of a document or screen into clean Markdown. " +
                   "Translate all mathematical symbols, equations, and inline variables strictly into standard LaTeX/MathJax formatting ($...$ for inline math, $$...$$ for block equations). " +
                   "For mathematical sets and symbols, use standard LaTeX notation (e.g. \\mathbb{R}, \\mathbb{R}^n, \\mathcal{P}(A), \\subseteq, (x_1, x_2, \\dots, x_n)). " +
                   "Preserve tables, lists, bolding, and italics. " +
                   "Do NOT output any preamble, conversational commentary, or outer markdown code blocks. Output ONLY the raw transcribed text.";

    // ── 3. NATIVE SCREEN CROPPING (SILENT TRIGGER) ───────────────────────────
    try {
        await run(`screencapture -i "${tmpImg}"`);

        // Silent exit if user hits Escape or capture cancelled
        if (!fs.existsSync(tmpImg) || fs.statSync(tmpImg).size === 0) {
            return;
        }

        const currentNotice = new Notice(`⚡ Transcribing with ${MODEL_CASCADE[0].name}...`, 0);

        const imageBuffer = fs.readFileSync(tmpImg);
        const base64Image = imageBuffer.toString('base64');

        const payload = {
            contents: [{
                parts: [
                    { text: PROMPT },
                    {
                        inline_data: {
                            mime_type: "image/png",
                            data: base64Image
                        }
                    }
                ]
            }],
            generationConfig: {
                maxOutputTokens: 8192
            }
        };

        fs.writeFileSync(tmpPayloadPath, JSON.stringify(payload));

        let finalMarkdown = "";
        let successfulModel = null;

        // ── 4. CASCADE: 3.5 Flash-Lite -> 3.1 Flash-Lite -> Gemma 4 ─────────
        for (let i = 0; i < MODEL_CASCADE.length; i++) {
            const target = MODEL_CASCADE[i];

            try {
                if (i > 0) {
                    currentNotice.setMessage(`⚠️ Trying fallback: ${target.name}...`);
                }

                const ocrCmd = `curl -s -X POST \
                    -H "Content-Type: application/json" \
                    -d @${tmpPayloadPath} \
                    "https://generativelanguage.googleapis.com/v1beta/models/${target.id}:generateContent?key=${GOOGLE_AI_STUDIO_KEY}"`;

                const ocrResponse = await run(ocrCmd);
                let ocrJson;
                try {
                    ocrJson = JSON.parse(ocrResponse);
                } catch (parseErr) {
                    throw new Error(`Malformed JSON response: ${ocrResponse || parseErr.message}`);
                }

                if (ocrJson.error || !ocrJson.candidates) {
                    const errObj = ocrJson?.error || {};
                    throw new Error(`[${errObj.code || 400}]: ${errObj.message || 'No candidate returned'}`);
                }

                const firstCandidate = ocrJson.candidates[0];
                const responseParts = firstCandidate?.content?.parts || [];
                let extracted = "";
                for (const part of responseParts) {
                    if (part.thought) continue;
                    if (part.text) extracted += part.text;
                }

                if (!extracted.trim()) {
                    throw new Error("Empty candidate output.");
                }

                finalMarkdown = extracted.trim();
                successfulModel = target;
                break; // Succeeded!

            } catch (modelErr) {
                console.warn(`[InstantOCR] ${target.name} failed:`, modelErr.message);
            }
        }

        currentNotice.hide();

        if (!finalMarkdown || !successfulModel) {
            new Notice('❌ All models in fallback cascade failed.');
            return;
        }

        // Clean outer markdown fence wraps if present
        let cleanText = finalMarkdown;
        if (cleanText.startsWith('```markdown')) cleanText = cleanText.slice(11);
        else if (cleanText.startsWith('```md')) cleanText = cleanText.slice(5);
        else if (cleanText.startsWith('```')) cleanText = cleanText.slice(3);
        if (cleanText.endsWith('```')) cleanText = cleanText.slice(0, -3);
        cleanText = cleanText.trim();

        // ── 5. COPY TO CLIPBOARD ONLY & SHOW USAGE PROGRESS ───────────────────
        await navigator.clipboard.writeText(cleanText);
        const count = getAndIncrementDailyUsage(successfulModel.id);

        new Notice(`📋 ${successfulModel.name}: Copied! (${count}/${successfulModel.limit} today)`);

    } catch (err) {
        new Notice(`❌ OCR Failed: ${err.message}`);
        console.error('[InstantOCR Error]', err);
    } finally {
        if (fs.existsSync(tmpImg)) {
            try { fs.unlinkSync(tmpImg); } catch (e) {}
        }
        if (fs.existsSync(tmpPayloadPath)) {
            try { fs.unlinkSync(tmpPayloadPath); } catch (e) {}
        }
    }
};