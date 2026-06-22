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

        // Focus the new split pane
        workspace.setActiveLeaf(rightLeaf, { focus: true });

        // Close the original tab in the previous split
        activeLeaf.detach();
    } else {
        new Notice("Could not create split pane.");
    }
};