// StableScrollbarGlobal.js
// Script Runner plugin script.
// Set this as a Startup Script in Script Runner settings.
// Running it toggles a persistent, line-based stable scrollbar across all notes.

module.exports = async ({ app }) => {
  const { MarkdownView } = require("obsidian");

  // Ensure our dynamic stylesheet is injected globally once
  const styleId = "stable-scrollbar-css-hide";
  let styleEl = document.getElementById(styleId);
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.textContent = `
      /* Make the native scrollbar invisible but preserve its layout footprint */
      .stable-scrollbar-active .cm-scroller::-webkit-scrollbar {
        background: transparent !important;
      }
      .stable-scrollbar-active .cm-scroller::-webkit-scrollbar-thumb {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
      }
      .stable-scrollbar-active .cm-scroller::-webkit-scrollbar-track {
        background: transparent !important;
      }
      .stable-scrollbar-active .cm-scroller {
        scrollbar-color: transparent transparent !important; /* Firefox */
      }
    `;
    document.head.appendChild(styleEl);
  }

  // Helper: Injects custom scrollbar elements into a single MarkdownView instance
  function injectScrollbar(view) {
    // Guard: Ensure view is markdown AND contentEl is fully initialized
    if (!view || view.getViewType() !== "markdown" || !view.contentEl) return;
    const container = view.contentEl;
    const scroller = container.querySelector(".cm-scroller");
    if (!scroller) return;

    // Prevent duplicate injections, but force a synchronization pass on tab restoration
    if (container.querySelector("#custom-stable-scrollbar")) {
      if (scroller._customScrollbarSync) {
        scroller._customScrollbarSync();
        setTimeout(scroller._customScrollbarSync, 50);
        setTimeout(scroller._customScrollbarSync, 200);
        setTimeout(scroller._customScrollbarSync, 500);
        setTimeout(scroller._customScrollbarSync, 1000);
      }
      return;
    }

    // Hide the native scrollbar's visuals while preserving the layout
    container.classList.add("stable-scrollbar-active");

    // Create the custom scrollbar track (reverted to standard 12px)
    const track = document.createElement("div");
    track.id = "custom-stable-scrollbar";
    Object.assign(track.style, {
      position: "absolute",
      right: "0px",
      top: "0px",
      bottom: "0px", // Flush with the bottom of the editor pane (directly above status bar)
      width: "12px",
      backgroundColor: "var(--background-primary)",
      borderLeft: "1px solid var(--background-modifier-border)",
      zIndex: "9999"
    });

    // Create the custom thumb (reverted to standard 8px)
    const thumb = document.createElement("div");
    Object.assign(thumb.style, {
      position: "absolute",
      left: "2px",
      width: "8px",
      backgroundColor: "var(--interactive-accent)",
      borderRadius: "4px",
      cursor: "pointer"
    });

    track.appendChild(thumb);
    container.appendChild(track);

    let isDragging = false;
    let dragOffset = 0; // The relative coordinate offset within the thumb

    // Direct pixel scroll updates (matches scroll-past-end and trackpad behavior exactly)
    function updateScroll(clientY) {
      const rect = track.getBoundingClientRect();
      const relativeY = clientY - rect.top;

      // Dynamic thumb height calculations
      const scrollHeight = scroller.scrollHeight;
      const clientHeight = scroller.clientHeight;
      const ratio = clientHeight / scrollHeight;
      const thumbHeight = Math.max(30, ratio * rect.height);
      thumb.style.height = `${thumbHeight}px`;

      // Use the active drag offset (either clicked thumb offset or track center offset)
      let percentage = (relativeY - dragOffset) / (rect.height - thumbHeight);
      percentage = Math.max(0, Math.min(percentage, 1));

      const thumbTop = percentage * (rect.height - thumbHeight);
      thumb.style.top = `${thumbTop}px`;

      // Scroll editor directly to the matching scroll position
      scroller.scrollTop = percentage * (scrollHeight - clientHeight);
    }

    function onMouseMove(e) {
      if (!isDragging) return;
      updateScroll(e.clientY);
    }

    function onMouseUp() {
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    // Direct thumb grab: Record exact relative offset on click
    thumb.addEventListener("mousedown", (e) => {
      isDragging = true;
      e.preventDefault();
      
      const thumbRect = thumb.getBoundingClientRect();
      dragOffset = e.clientY - thumbRect.top; // Store cursor offset from thumb's top edge
      
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });

    // Track click: Snap thumb center to cursor position
    track.addEventListener("mousedown", (e) => {
      if (e.target === thumb) return;
      
      isDragging = true;

      // Calculate active thumb height dynamically to center it
      const rect = track.getBoundingClientRect();
      const scrollHeight = scroller.scrollHeight;
      const clientHeight = scroller.clientHeight;
      const ratio = clientHeight / scrollHeight;
      const thumbHeight = Math.max(30, ratio * rect.height);
      
      dragOffset = thumbHeight / 2; // Center the thumb on the click position
      
      updateScroll(e.clientY);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });

    // WHEEL EVENT PASS-THROUGH: Forward scroll offset down to underlying scroller
    track.addEventListener("wheel", (e) => {
      scroller.scrollTop += e.deltaY;
    });

    // Synchronize thumb position and height on standard scrolling
    function onNormalScroll() {
      if (isDragging) return;
      const rect = track.getBoundingClientRect();
      const scrollHeight = scroller.scrollHeight;
      const clientHeight = scroller.clientHeight;

      // Automatically hide the scrollbar track if the file does not need scrolling
      if (scrollHeight <= clientHeight) {
        track.style.display = "none";
        return;
      }

      track.style.display = "block";

      // Dynamically scale thumb height based on document length ratio
      const ratio = clientHeight / scrollHeight;
      const thumbHeight = Math.max(30, ratio * rect.height);
      thumb.style.height = `${thumbHeight}px`;

      const scrollRatio = scroller.scrollTop / (scrollHeight - clientHeight);
      if (!isNaN(scrollRatio)) {
        const thumbTop = scrollRatio * (rect.height - thumbHeight);
        thumb.style.top = `${thumbTop}px`;
      }
    }

    scroller.addEventListener("scroll", onNormalScroll);

    // Watch for size changes of the scroller container
    const observer = new ResizeObserver(() => {
      onNormalScroll();
    });
    observer.observe(scroller);

    // Initial triggers to handle fast transitions
    onNormalScroll();
    setTimeout(onNormalScroll, 50);
    setTimeout(onNormalScroll, 200);

    // Expose synchronization routine globally for workspace tab switching
    scroller._customScrollbarSync = onNormalScroll;

    // Register active instance cleanup
    scroller._customScrollbarCleanup = () => {
      scroller.removeEventListener("scroll", onNormalScroll);
      observer.disconnect();
      track.remove();
      container.classList.remove("stable-scrollbar-active");
      delete scroller._customScrollbarCleanup;
      delete scroller._customScrollbarSync;
    };
  }

  // Iterate over all active workspaces and inject custom scrollbars
  function applyToAllLeaves() {
    app.workspace.iterateAllLeaves((leaf) => {
      if (leaf.view && leaf.view.getViewType() === "markdown") {
        injectScrollbar(leaf.view);
      }
    });
  }

  // ─── Main Execution & Global Toggle Engine ─────────────────────────────────

  if (window.stableScrollbarActive) {
    // TOGGLE OFF: De-register listeners and restore native scrollbars globally
    if (window.stableScrollbarCleanup) {
      window.stableScrollbarCleanup();
    }
    return;
  }

  // TOGGLE ON: Register active layout and view changes globally
  window.stableScrollbarActive = true;
  window.stableScrollbarRefs = {
    activeLeafChange: app.workspace.on("active-leaf-change", () => {
      applyToAllLeaves();
    }),
    layoutChange: app.workspace.on("layout-change", () => {
      applyToAllLeaves();
    })
  };

  // Define clean global tear-down routine
  window.stableScrollbarCleanup = () => {
    if (window.stableScrollbarRefs) {
      app.workspace.offref(window.stableScrollbarRefs.activeLeafChange);
      app.workspace.offref(window.stableScrollbarRefs.layoutChange);
      delete window.stableScrollbarRefs;
    }

    app.workspace.iterateAllLeaves((leaf) => {
      // Guard: Ensure contentEl is fully initialized before cleanup lookup
      if (leaf.view && leaf.view.getViewType() === "markdown" && leaf.view.contentEl) {
        const scroller = leaf.view.contentEl.querySelector(".cm-scroller");
        if (scroller && scroller._customScrollbarCleanup) {
          scroller._customScrollbarCleanup();
        }
      }
    });

    delete window.stableScrollbarCleanup;
    delete window.stableScrollbarActive;
  };

  // Initialize immediately across any open panes
  applyToAllLeaves();
};