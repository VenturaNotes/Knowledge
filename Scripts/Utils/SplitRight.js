module.exports = async () => {
    const { workspace } = app;
    const activeLeaf = workspace.activeLeaf;

    if (!activeLeaf) {
        new Notice("No active tab found.");
        return;
    }

    const viewState = activeLeaf.getViewState();
    if (!viewState || !viewState.type) {
        new Notice("Active tab does not have a valid state.");
        return;
    }

    // Capture the current scroll position and cursor location
    const ephemeralState = activeLeaf.getEphemeralState();

    // Determine the tab to activate in the previous pane (shift one tab left)
    const parent = activeLeaf.parent;
    let tabToActivate = null;
    if (parent && parent.children) {
        const children = parent.children;
        const currentIndex = children.indexOf(activeLeaf);
        if (currentIndex > 0) {
            tabToActivate = children[currentIndex - 1]; // One tab to the left
        } else if (children.length > 1) {
            tabToActivate = children[1]; // Fallback to the right if we are already on the leftmost tab
        }
    }

    // Create a new split leaf directly to the right of the active pane
    const rightLeaf = workspace.getLeaf('split', 'vertical');

    if (rightLeaf) {
        // Clone the view state (the active file, edit/preview mode, etc.)
        await rightLeaf.setViewState({
            type: viewState.type,
            state: viewState.state,
            active: true
        });

        // Restore scroll and cursor position
        if (ephemeralState) {
            rightLeaf.setEphemeralState(ephemeralState);
        }

        // Switch the active tab in the previous pane before detaching
        if (tabToActivate) {
            workspace.setActiveLeaf(tabToActivate, { focus: false });
        }

        // Close the original tab in the previous split
        activeLeaf.detach();

        // Focus the new split pane
        workspace.setActiveLeaf(rightLeaf, { focus: true });
    } else {
        new Notice("Could not create split pane.");
    }
};