// DevToolsWebview.js
module.exports = async (params) => {
    const { app } = params;
    const { remote } = require('electron');

    const active = document.activeElement;
    if (active?.tagName !== 'WEBVIEW') {
        new Notice(`Active element is <${active?.tagName ?? 'null'}>, not a webview.`);
        return;
    }

    const contents = remote.webContents.fromId(active.getWebContentsId());

    if (contents.isDevToolsOpened()) {
        contents.closeDevTools();
    } else {
        contents.openDevTools({ mode: 'undocked' });
    }
};