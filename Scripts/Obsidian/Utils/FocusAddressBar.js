module.exports = async ({ app, obsidian }) => {
    const activeLeaf = app.workspace.activeLeaf;
    if (!activeLeaf) return;

    const view = activeLeaf.view;
    if (!view) return;

    const viewType = typeof view.getViewType === 'function' ? view.getViewType() : '';

    // Allowed webview view types (Obsidian core Web Viewer & Custom Isolated Browser)
    const allowedTypes = ['webviewer', 'custom-webview-view'];

    if (!allowedTypes.includes(viewType)) return;

    const container = view.containerEl || activeLeaf.containerEl;
    if (!container) return;

    // Locate address bar input
    const addressBar = container.querySelector('.custom-webview-addressbar') ||
                       container.querySelector('.view-header input[type="text"]') ||
                       container.querySelector('.view-header input') ||
                       container.querySelector('input');

    if (addressBar) {
        // Release focus lock from webview guest view so DOM input receives focus
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur();
        }

        addressBar.focus();
        if (typeof addressBar.select === 'function') {
            addressBar.select();
        }
    }
};