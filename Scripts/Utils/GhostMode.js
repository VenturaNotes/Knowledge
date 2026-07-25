// Uses FloatingCompanion's DOM technique to hide webviews behind the workspace at opacity 1.0.

module.exports = async ({ app }) => {
  const { Notice } = require("obsidian");

  // Find all webviews loading AI Studio
  const webviews = Array.from(document.querySelectorAll("webview"))
    .filter(w => (w.getAttribute("src") || "").includes("aistudio.google.com"));

  if (webviews.length === 0) {
    new Notice("No Google AI Studio webviews found.");
    return;
  }

  if (window.webviewBackgroundActive) {
    // RESTORE VISIBLE DOM STATE
    for (const webview of webviews) {
      const container = webview.closest(".workspace-leaf") || webview.parentElement;
      if (container) {
        container.style.position = "";
        container.style.zIndex = "";
        container.style.pointerEvents = "";
      }
    }
    window.webviewBackgroundActive = false;
    new Notice("AI Studio webview restored to workspace.");
  } else {
    // HIDE BEHIND WORKSPACE AT OPACITY 1.0 (No OS window changes, no throttling)
    for (const webview of webviews) {
      const container = webview.closest(".workspace-leaf") || webview.parentElement;
      if (container) {
        container.style.position = "fixed";
        container.style.left = "0px";
        container.style.top = "0px";
        container.style.zIndex = "-9999";
        container.style.pointerEvents = "none";
        container.style.opacity = "1.0"; // Full opacity prevents Chromium background throttling
      }
    }
    window.webviewBackgroundActive = true;
    new Notice("AI Studio webview hidden in background. Generating at full speed.");
  }
};