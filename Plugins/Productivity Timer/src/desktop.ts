import ProductivityTimerPlugin from "./main";
import { TimerUIRenderer } from "./uiRenderer";

export class ProductivityTimerWindow {
	private plugin: ProductivityTimerPlugin;
	private renderer: TimerUIRenderer;

	private isDragging = false;
	private dragOffsetX = 0;
	private dragOffsetY = 0;

	private isResizing = false;
	private resizeStartX = 0;
	private resizeStartY = 0;
	private resizeStartW = 0;
	private resizeStartH = 0;
	private resizeStartXPos = 0;
	private resizeStartYPos = 0;
	private activeResizeDir: string | null = null;

	private el: HTMLElement;

	constructor(plugin: ProductivityTimerPlugin) {
		this.plugin = plugin;
		this.renderer = new TimerUIRenderer(plugin);
		this.el = document.createElement("div");
		this.el.id = "pt-floating-window";
		document.body.appendChild(this.el);
		this.applyPosition();

		document.addEventListener("mousemove", this.onMouseMove);
		document.addEventListener("mouseup", this.onMouseUp);

		this.render();
		this.setupMultiResize();
	}

	private applyPosition() {
		const s = this.plugin.settings;
		const maxX = window.innerWidth - s.windowWidth;
		const maxY = window.innerHeight - s.windowHeight;
		const x = Math.max(0, Math.min(s.windowX, maxX));
		const y = Math.max(0, Math.min(s.windowY, maxY));
		Object.assign(this.el.style, {
			position: "fixed",
			left: `${x}px`,
			top: `${y}px`,
			width: `${s.windowWidth}px`,
			height: `${s.windowHeight}px`,
			zIndex: "40",
		});
	}

	private onMouseMove = (e: MouseEvent) => {
		if (this.isDragging) {
			const x = Math.max(0, Math.min(e.clientX - this.dragOffsetX, window.innerWidth - this.el.offsetWidth));
			const y = Math.max(0, Math.min(e.clientY - this.dragOffsetY, window.innerHeight - this.el.offsetHeight));
			this.el.style.left = `${x}px`;
			this.el.style.top = `${y}px`;
		} else if (this.isResizing && this.activeResizeDir) {
			const dx = e.clientX - this.resizeStartX;
			const dy = e.clientY - this.resizeStartY;

			let newWidth = this.resizeStartW;
			let newHeight = this.resizeStartH;
			let newLeft = this.resizeStartXPos;
			let newTop = this.resizeStartYPos;

			const minW = 380;
			const minH = 300;
			const dir = this.activeResizeDir;

			if (dir.includes("e")) newWidth = Math.max(minW, this.resizeStartW + dx);
			if (dir.includes("w")) {
				const potential = this.resizeStartW - dx;
				if (potential >= minW) {
					newWidth = potential;
					newLeft = this.resizeStartXPos + dx;
				}
			}

			if (dir.includes("s")) newHeight = Math.max(minH, this.resizeStartH + dy);
			if (dir.includes("n")) {
				const potential = this.resizeStartH - dy;
				if (potential >= minH) {
					newHeight = potential;
					newTop = this.resizeStartYPos + dy;
				}
			}

			this.el.style.width = `${newWidth}px`;
			this.el.style.height = `${newHeight}px`;
			this.el.style.left = `${newLeft}px`;
			this.el.style.top = `${newTop}px`;
		}
	};

	private onMouseUp = () => {
		if (this.isDragging) {
			this.isDragging = false;
			document.body.classList.remove("pt-is-window-dragging");
			this.plugin.settings.windowX = parseInt(this.el.style.left);
			this.plugin.settings.windowY = parseInt(this.el.style.top);
			this.plugin.saveSettings();
		}
		if (this.isResizing) {
			this.isResizing = false;
			this.activeResizeDir = null;
			document.body.classList.remove("pt-is-window-resizing");
			this.plugin.settings.windowWidth = this.el.offsetWidth;
			this.plugin.settings.windowHeight = this.el.offsetHeight;
			this.plugin.settings.windowX = parseInt(this.el.style.left);
			this.plugin.settings.windowY = parseInt(this.el.style.top);
			this.plugin.saveSettings();
		}
	};

	public renderTimerRowsOnly() {
		this.renderer.renderTimerRowsOnly(this.el);
	}

	public render() {
		let bodyEl = this.el.querySelector(".pt-body") as HTMLElement;
		const savedScrollTop = bodyEl ? bodyEl.scrollTop : 0;

		const existingBody = this.el.querySelector(".pt-body");
		if (existingBody) existingBody.remove();
		const existingTitle = this.el.querySelector(".pt-titlebar");
		if (existingTitle) existingTitle.remove();

		const titleBar = this.el.createDiv({ cls: "pt-titlebar" });
		titleBar.createEl("span", { cls: "pt-titlebar-text", text: "Productivity Timer" });

		const titleActions = titleBar.createDiv({ cls: "pt-titlebar-actions" });
		const closeBtn = titleActions.createEl("button", { cls: "pt-titlebar-btn pt-close-btn", text: "✕" });
		closeBtn.addEventListener("click", () => this.destroy());

		this.setupDrag(titleBar);

		bodyEl = this.el.createDiv({ cls: "pt-body" });
		this.renderer.renderBody(bodyEl, false);
		bodyEl.scrollTop = savedScrollTop;
	}

	private setupDrag(handle: HTMLElement) {
		handle.addEventListener("mousedown", (e) => {
			if ((e.target as HTMLElement).closest("button")) return;
			this.isDragging = true;
			document.body.classList.add("pt-is-window-dragging");
			this.dragOffsetX = e.clientX - this.el.getBoundingClientRect().left;
			this.dragOffsetY = e.clientY - this.el.getBoundingClientRect().top;
			e.preventDefault();
		});
	}

	private setupMultiResize() {
		const directions = ["n", "s", "e", "w", "nw", "ne", "sw", "se"];
		for (const dir of directions) {
			const handle = this.el.createDiv({ cls: `pt-resize-handle pt-resize-${dir}` });
			handle.addEventListener("mousedown", (e) => {
				this.isResizing = true;
				document.body.classList.add("pt-is-window-resizing");

				this.resizeStartX = e.clientX;
				this.resizeStartY = e.clientY;

				const rect = this.el.getBoundingClientRect();
				this.resizeStartW = rect.width;
				this.resizeStartH = rect.height;
				this.resizeStartXPos = rect.left;
				this.resizeStartYPos = rect.top;

				this.activeResizeDir = dir;
				e.preventDefault();
				e.stopPropagation();
			});
		}
	}

	destroy() {
		document.removeEventListener("mousemove", this.onMouseMove);
		document.removeEventListener("mouseup", this.onMouseUp);
		document.body.classList.remove("pt-is-window-dragging", "pt-is-window-resizing");
		this.el.remove();
		this.plugin.floatingWindow = null;
	}
}