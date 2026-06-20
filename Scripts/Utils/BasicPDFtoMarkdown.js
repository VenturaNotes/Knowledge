const { Notice, Platform } = require("obsidian");

// Dynamic imports of Node.js modules for compatibility on Mobile devices
const os = Platform.isDesktop ? require("os") : null;
const path = Platform.isDesktop ? require("path") : null;
const fs = Platform.isDesktop ? require("fs") : null;
const { execFile } = Platform.isDesktop ? require("child_process") : {};

// Native macOS ASObjC script to extract text or perform on-device OCR if scanned
const appleScriptContent = `use framework "Foundation"
use framework "PDFKit"
use framework "Vision"
use framework "AppKit"
use scripting additions

on run argv
    try
        set pdfPath to item 1 of argv
        set theURL to current application's NSURL's fileURLWithPath:pdfPath
        set pdfDoc to current application's PDFDocument's alloc()'s initWithURL:theURL
        if pdfDoc is missing value then
            return "ERROR: Could not open PDF document."
        end if
        
        -- 1. Try to extract standard selectable text (instant)
        set pdfString to (pdfDoc's |string|())
        if pdfString is not missing value then
            set cleanText to (pdfString's stringByTrimmingCharactersInSet:(current application's NSCharacterSet's whitespaceAndNewlineCharacterSet())) as text
            if cleanText is not "" then
                return cleanText
            end if
        end if
        
        -- 2. Fallback: Run Apple's on-device Vision OCR if no selectable text layer exists
        set pageCount to pdfDoc's pageCount()
        set fullExtractedText to ""
        
        repeat with i from 1 to pageCount
            set thePage to (pdfDoc's pageAtIndex:(i - 1))
            
            -- Get original page dimensions (PDFs use 72 points per inch)
            set originalRect to (thePage's boundsForBox:0) -- 0 = kPDFDisplayBoxMediaBox
            set pageWidth to item 1 of item 2 of originalRect
            set pageHeight to item 2 of item 2 of originalRect
            
            -- Render the page to a high-resolution bitmap (150 DPI) for accurate OCR
            set scaleFactor to 150 / 72
            set pixelWidth to (pageWidth * scaleFactor) div 1
            set pixelHeight to (pageHeight * scaleFactor) div 1
            
            set pdfImageRep to (current application's NSPDFImageRep's imageRepWithData:(thePage's dataRepresentation))
            set newRep to (current application's NSBitmapImageRep's alloc()'s initWithBitmapDataPlanes:(missing value) pixelsWide:pixelWidth pixelsHigh:pixelHeight bitsPerSample:8 samplesPerPixel:4 hasAlpha:yes isPlanar:false colorSpaceName:(current application's NSDeviceRGBColorSpace) bytesPerRow:0 bitsPerPixel:32)
            
            current application's NSGraphicsContext's saveGraphicsState()
            current application's NSGraphicsContext's setCurrentContext:(current application's NSGraphicsContext's graphicsContextWithBitmapImageRep:newRep)
            
            -- Draw PDF page in the bitmap graphics context
            pdfImageRep's drawInRect:{{0, 0}, {pixelWidth, pixelHeight}} fromRect:(current application's NSZeroRect) operation:(current application's NSCompositeSourceOver) fraction:1.0 respectFlipped:false hints:(missing value)
            
            current application's NSGraphicsContext's restoreGraphicsState()
            
            -- Convert the rendered bitmap to compressed JPEG data
            set imageData to (newRep's representationUsingType:(current application's NSJPEGFileType) |properties|:{NSImageCompressionFactor:1.0})
            
            -- Perform on-device text recognition on the generated image
            set requestHandler to current application's VNImageRequestHandler's alloc()'s initWithData:imageData options:(missing value)
            set theRequest to current application's VNRecognizeTextRequest's alloc()'s init()
            
            theRequest's setRecognitionLevel:(current application's VNRequestTextRecognitionLevelAccurate)
            theRequest's setUsesLanguageCorrection:true
            
            requestHandler's performRequests:(current application's NSArray's arrayWithObject:(theRequest)) |error|:(missing value)
            set theResults to theRequest's results()
            
            -- Parse the recognized text blocks
            set pageArray to current application's NSMutableArray's new()
            repeat with aResult in theResults
                (pageArray's addObject:(((aResult's topCandidates:1)'s objectAtIndex:0)'s |string|()))
            end repeat
            
            set pageText to (pageArray's componentsJoinedByString:linefeed) as text
            if pageText is not "" then
                set fullExtractedText to fullExtractedText & pageText & linefeed & linefeed
            end if
        end repeat
        
        if fullExtractedText is "" then
            return "ERROR: Scanned PDF contains no recognizable text."
        end if
        
        return fullExtractedText
    on error errMsg
        return "ERROR: " & errMsg
    end try
end run`;

// Helper to clean up the temporary markdown file created during the previous execution
const cleanupPreviousTempFile = (trackingFilePath) => {
    if (fs.existsSync(trackingFilePath)) {
        try {
            const lastTempPath = fs.readFileSync(trackingFilePath, "utf8").trim();
            if (lastTempPath && fs.existsSync(lastTempPath)) {
                fs.unlinkSync(lastTempPath); // Deletes the previous .md file from the cache
            }
        } catch (_) {
            // Non-fatal — let OS or garbage collection clean it up eventually
        }
    }
};

// Copies the physical temporary markdown file to the macOS clipboard
const copyFileToClipboardMac = (tempFilePath) => {
    return new Promise((resolve, reject) => {
        const escapedPath = tempFilePath.replace(/"/g, '\\"');
        const appleScript = `set the clipboard to (POSIX file "${escapedPath}")`;

        execFile("osascript", ["-e", appleScript], { timeout: 5000 }, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(stderr || error.message));
            } else {
                resolve();
            }
        });
    });
};

module.exports = async (params) => {
    const { app } = params;
    
    if (!Platform.isDesktop) {
        new Notice("File copy operations are only supported on Desktop.");
        return;
    }
    
    if (os.platform() !== "darwin") {
        new Notice("This extraction script requires macOS.");
        return;
    }

    const activeFile = app.workspace.getActiveFile();
    if (!activeFile) {
        new Notice("No active file found.");
        return;
    }

    if (activeFile.extension !== "pdf") {
        new Notice(`Active file is not a PDF (found: .${activeFile.extension}).`);
        return;
    }

    const pdfFullPath = app.vault.adapter.getFullPath(activeFile.path);
    const tempDir = os.tmpdir();
    
    // Independent tracking file for PDF-to-Markdown operations
    const trackingFilePath = path.join(tempDir, "obsidian_last_pdf_temp.txt");
    const appleScriptPath = path.join(tempDir, "obsidian_pdf_extract.scpt");
    
    // 1. Immediately delete the temporary file from the previous conversion
    cleanupPreviousTempFile(trackingFilePath);

    new Notice("Running OCR on PDF...");

    try {
        // 2. Write the ASObjC helper to disk temporarily
        fs.writeFileSync(appleScriptPath, appleScriptContent, "utf8");

        // 3. Extract PDF text using the native AppleScript Objective-C bridge (extended timeout for OCR processing)
        const extractedText = await new Promise((resolve, reject) => {
            execFile("osascript", [appleScriptPath, pdfFullPath], { timeout: 60000 }, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(stderr || error.message));
                } else {
                    resolve(stdout.trim());
                }
            });
        });

        // Clean up the temporary AppleScript helper file immediately
        try { fs.unlinkSync(appleScriptPath); } catch (_) {}

        // 4. Handle extraction failures
        if (extractedText.startsWith("ERROR:")) {
            new Notice(`Extraction Failed: ${extractedText.replace("ERROR:", "").trim()}`);
            return;
        }

        if (!extractedText || extractedText.length === 0) {
            new Notice("No selectable text could be extracted from this PDF.");
            return;
        }

        // 5. Construct Markdown structure using the extracted text
        const markdownContent = `# ${activeFile.basename}\n\n${extractedText}`;

        // 6. Sanitize and build the path for the temporary Markdown file
        const sanitizedFilename = activeFile.basename.replace(/[^a-zA-Z0-9_\-\s]/g, "");
        const tempFilePath = path.join(tempDir, `${sanitizedFilename}.md`);

        // 7. Write the markdown file to disk
        fs.writeFileSync(tempFilePath, markdownContent, "utf8");

        // 8. Track this new file so the next script run deletes it immediately
        fs.writeFileSync(trackingFilePath, tempFilePath, "utf8");

        // 9. Copy the physical .md file to the system clipboard
        await copyFileToClipboardMac(tempFilePath);
        
        new Notice(`📋 Clipboard Ready: ${sanitizedFilename}.md`);
    } catch (err) {
        console.error("PDF conversion failed:", err);
        new Notice(`Failed to convert PDF: ${err.message}`);
    }
};