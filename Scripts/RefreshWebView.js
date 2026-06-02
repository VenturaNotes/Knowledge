module.exports = async ({ app, obsidian }) => {
    const activeLeaf = app.workspace.activeLeaf;
    if (!activeLeaf) return;

    const view = activeLeaf.view;
    if (!view) return;

    const viewType = view.getViewType();

    // Exit silently if the active tab is not a Web Viewer
    if (viewType !== 'webviewer') return;

    // 1. Try to find the Electron <webview> element (Desktop)
    const webview = view.containerEl.querySelector('webview');
    if (webview && typeof webview.reload === 'function') {
        webview.reload();
        return;
    }

    // 2. Try to find an <iframe> element (commonly used on Mobile or fallback frameworks)
    const iframe = view.containerEl.querySelector('iframe');
    if (iframe) {
        iframe.src = iframe.src;
        return;
    }

    // 3. Last resort fallback: Rebuild the view if neither element is directly accessible
    if (typeof activeLeaf.rebuildView === 'function') {
        activeLeaf.rebuildView();
        return;
    }
};