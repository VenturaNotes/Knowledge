module.exports = async ({ app, obsidian }) => {
    const activeLeaf = app.workspace.activeLeaf;
    if (!activeLeaf) return;

    const view = activeLeaf.view;
    if (!view) return;

    const viewType = view.getViewType();

    // Allowed webview view types (Obsidian core Web Viewer & Custom Isolated Browser)
    const allowedTypes = ['webviewer', 'custom-webview-view'];

    // Exit silently if the active tab is not an approved browser view
    if (!allowedTypes.includes(viewType)) return;

    // Locate the address bar input element inside the active tab's container.
    // This checks your custom isolated browser first, then cascades to native Obsidian selectors.
    const addressBar = view.containerEl.querySelector('.custom-webview-addressbar') ||
                       view.containerEl.querySelector('.view-header input[type="text"]') ||
                       view.containerEl.querySelector('.view-header input') ||
                       view.containerEl.querySelector('input'); // generic fallback

    if (addressBar) {
        addressBar.focus();
        
        // Highlight the URL so typing a new one automatically overwrites it,
        // matching the behavior of standard desktop browsers.
        if (typeof addressBar.select === 'function') {
            addressBar.select();
        }
    }
};