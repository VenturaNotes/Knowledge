module.exports = function({ app, obsidian }) {
    const { setIcon } = obsidian;
    const className = "pdf-darkmode-active";

    function injectButton() {
        // Find all active PDF tabs in your workspace
        app.workspace.getLeavesOfType("pdf").forEach(leaf => {
            const view = leaf.view;
            if (!view) return;

            // Target the native PDF toolbar inside the viewer DOM
            const toolbar = view.containerEl.querySelector(".pdf-toolbar");
            
            // Only inject if the toolbar exists and we haven't already added our button
            if (toolbar && !toolbar.querySelector(".pdf-darkmode-toggle-button")) {
                const btn = document.createElement("button");
                btn.className = "clickable-icon pdf-darkmode-toggle-button";
                btn.setAttribute("aria-label", "Toggle PDF Dark Mode");
                
                // Insert the native Obsidian moon SVG icon
                setIcon(btn, "moon");

                // Style alignment to match the visual spacing of the other buttons
                btn.style.marginLeft = "12px";

                // Add the toggle action (silently, without Notices)
                btn.addEventListener("click", () => {
                    document.body.classList.toggle(className);
                });

                // Appending it to the toolbar automatically places it to the right of "of [Total]"
                toolbar.appendChild(btn);
            }
        });
    }

    // Staggered checks to catch the toolbar as soon as PDF.js finishes rendering
    function injectButtonWithDelays() {
        injectButton();
        setTimeout(injectButton, 150);
        setTimeout(injectButton, 400);
        setTimeout(injectButton, 800);
    }

    // Run immediately on startup for any currently opened PDFs
    injectButtonWithDelays();

    // Prevent duplicate event handlers on hot-reloads during setup
    if (window.pdfDarkModeListener) {
        app.workspace.off('layout-change', window.pdfDarkModeListener);
    }
    if (window.pdfDarkModeActiveLeafListener) {
        app.workspace.off('active-leaf-change', window.pdfDarkModeActiveLeafListener);
    }

    // Assign and register the updated workspace listeners
    window.pdfDarkModeListener = injectButtonWithDelays;
    window.pdfDarkModeActiveLeafListener = injectButtonWithDelays;

    app.workspace.on('layout-change', window.pdfDarkModeListener);
    app.workspace.on('active-leaf-change', window.pdfDarkModeActiveLeafListener);
};