module.exports = async (params) => {
    const { app } = params;
    const { remote } = require('electron');

    // Adjust to however webview-suite actually exposes the active webview —
    // I'm guessing at the property path, you know the real one.
    const webviewSuite = app.plugins.plugins['webview-suite'];
    const activeWebview = webviewSuite?.webviewTracker?.getActiveWebview?.();

    const contents = activeWebview
        ? activeWebview.getWebContents()
        : remote.getCurrentWindow().webContents;

    if (contents.isDevToolsOpened()) {
        contents.closeDevTools();
    } else {
        contents.openDevTools({ mode: 'right' });
    }
};