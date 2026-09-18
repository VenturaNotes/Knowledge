![Screenshot|700](<- Attachments/Pasted image 20260914061154.png>)
## Projects
### AirSketch: Real-Time Multi-Device Infinite Vector Canvas for Obsidian
- ![[Pasted image 20260918115554.png]][^1]
	- A private, local-first sketching system connecting multiple iPad and desktop clients to Obsidian over local Wi-Fi.
- **Zero-Latency Inking & Deep Obsidian Integration:** Built a companion sketching system combining an Obsidian desktop plugin with a native iPadOS client for frictionless, Apple Pencil-driven visual note-taking.
- **Embedded Local Server & SSE Sync:** Developed an in-vault Node.js HTTP server supporting Server-Sent Events (SSE) and sub-millisecond memory-streamed stroke synchronization, secured via token-based authentication and cookie pairing over local Wi-Fi.
	- Will eventually switch to WebSockets
- **Hardware-Level Digitizer Bridge:** Authored a native Swift iOS container (`WKWebView` + `TouchOverlayView`) that intercepts raw 240Hz Apple Pencil touch events directly at the hardware layer, bypassing Safari/WebKit input lag while enforcing robust hardware-level palm rejection and multi-touch gestures.
- **Direct Vault Workflow & Live Hot-Reload:** Enabled instantaneous cursor-level creation (`![[drawing.svg]]`) and `Cmd + Click` bidirectional document loading between desktop and iPad, auto-refreshing embedded vector SVGs inside Obsidian with zero manual exports.
- **Self-Contained Vector Engine:** Engineered a standalone HTML5 Canvas vector toolset (freehand strokes, geometric shapes, directional arrows, box/lasso selections, text labels, and image attachments) that serializes full canvas state directly inside native SVG `<metadata>` tags.
- **In-Vault Wireless Deployment:** Integrated an automated `xcodebuild` + `xcrun devicectl` deployment pipeline runnable straight from Obsidian to compile, sign, and push app updates to the physical iPad over Wi-Fi.
###  VaporNote: Floating, Multi-Tab Scratchpad & Web Browser for Obsidian
- ![[Pasted image 20260918122026.png]]
	- An optionally translucent, non-intrusive floating viewport enabling simultaneous Markdown editing and web browsing without disrupting the underlying workspace layout.
- **Floating Overlay & Multi-Tabbed Architecture:** Created a free-floating, resizable window overlay featuring dynamic opacity adjustment (`0.2–1.0`) and an internal multi-tab manager that supports both native Markdown notes and embedded web pages.
- **Deep Workspace Isolation & Virtual Leaf Tree:** Neutralized Obsidian's core workspace tree (`setActiveLeaf`, `getLeaf`, `openLinkText`, `openFile`) using mock leaf parents and synthetic containers, allowing notes and web links to open and close inside the floating overlay without disrupting background split layouts.
- **Electron Webview Input Interception:** Integrated `@electron/remote` hooks (`before-input-event`) and injected scripts into sandboxed `<webview>` tags, establishing native browser-grade hotkeys (`Cmd + W` to close tab, `Cmd + Shift + T` to restore, `Cmd + Alt + Arrows` to cycle tabs) directly inside web pages.
- **"Invisible Minimize" & Focus Return:** Created a minimize mode that transitions the window to 0% opacity and disables pointer events, smoothly releasing focus back to the active editor below while preserving scroll positions and ephemeral editor states.
- **Multi-Window Migration & State Persistence:** Automated real-time migration of the floating container across multi-monitor Electron popout windows, paired with a debounced state engine that persists window coordinates, tab history, and active leaves across vault restarts.
### Progress Planner: Interactive Physics-Driven Goal Hierarchy for Obsidian
- ![[Pasted image 20260918150623.png]]
	- A visual project and task management system replacing static task lists with an interactive, force-directed graph that maps relationships between high-level vision notes and micro-level checklist actions.
- **Custom Force-Directed Physics Dashboard:** Engineered a real-time 2D physics simulation from scratch—combining Coulomb-like repulsion, Hooke spring tension, angular edge-routing, and edge-edge repulsive forces to minimize line crossings—delivering an organic, interactive canvas for complex goal and task topologies.
- **Hybrid DAG Indexing (Files + Checkboxes):** Developed a unified graph caching engine (`TaskCache`) that parses both high-level Markdown project files (frontmatter links) and granular inline `- [ ]` checkboxes (block anchors `^blockId`) into a single Directed Acyclic Graph (DAG) with topological level ordering and impact weighting (`#impact/high|med|low`).
- **Scale Optimization & Hub Node Collapsing:** Solved visual clutter on large vaults by building an automated "Hub Node" collapsing algorithm that folds low-priority children exceeding a threshold into interactive `+N` expand badges, coupled with progressive render-distance frontiers (`⋯N`) and recursive completed-subtask pruning.
- **Bidirectional Canvas-to-Vault Mutability:** Implemented canvas-level drag-and-drop reparenting—dropping nodes onto one another dynamically rewrites file frontmatter (`parent: [[...]]`) or injects block-level link references into raw Markdown files without manual text editing.
- **Live CodeMirror 6 Active Task Tracking:** Built an `EditorView.updateListener` extension that tracks active task line shifts in memory as you type (using coordinate character offsets and right-biased mapping), auto-clears the moment a box is checked, and powers a peripheral status-bar chip with instant hotkey jumps into **VaporNote**.
## Stats
- 40,000+ Cited Topics
- 188 Playlists/Textbooks Completed
## References

[^1]: https://www.exodustravels.com/us/insights/9-most-beautiful-forests-for-hiking