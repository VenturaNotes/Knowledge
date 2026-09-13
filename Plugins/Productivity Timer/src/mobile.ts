import { ItemView, WorkspaceLeaf } from "obsidian";
import ProductivityTimerPlugin from "./main";
import { TimerUIRenderer } from "./uiRenderer";

export const VIEW_TYPE_PRODUCTIVITY_TIMER = "productivity-timer-view";

export class ProductivityTimerView extends ItemView {
	private plugin: ProductivityTimerPlugin;
	private renderer: TimerUIRenderer;
	private contentWrapper: HTMLElement;

	constructor(leaf: WorkspaceLeaf, plugin: ProductivityTimerPlugin) {
		super(leaf);
		this.plugin = plugin;
		this.renderer = new TimerUIRenderer(plugin);
	}

	getViewType(): string {
		return VIEW_TYPE_PRODUCTIVITY_TIMER;
	}

	getDisplayText(): string {
		return "Productivity Timer";
	}

	getIcon(): string {
		return "clock";
	}

	async onOpen() {
		this.plugin.activeMobileView = this;
		this.contentWrapper = this.containerEl.children[1] as HTMLElement;

		if (this.contentWrapper) {
			this.contentWrapper.style.padding = "0";
			this.contentWrapper.style.margin = "0";
			this.contentWrapper.style.height = "100%";
			this.contentWrapper.style.maxHeight = "100%";
			this.contentWrapper.style.overflow = "hidden";
			this.contentWrapper.style.background = "var(--background-primary)";
		}

		this.render();
	}

	public renderTimerRowsOnly() {
		if (!this.contentWrapper) return;
		this.renderer.renderTimerRowsOnly(this.contentWrapper);
	}

	public render() {
		if (!this.contentWrapper) return;

		const bodyEl = this.contentWrapper.querySelector(".pt-body") as HTMLElement;
		const savedScrollTop = bodyEl ? bodyEl.scrollTop : 0;

		this.contentWrapper.empty();
		this.contentWrapper.classList.add("pt-mobile-wrapper");

		const body = this.contentWrapper.createDiv({ cls: "pt-body" });
		this.renderer.renderBody(body, true);
		body.scrollTop = savedScrollTop;
	}

	async onClose() {
		if (this.plugin.activeMobileView === this) {
			this.plugin.activeMobileView = null;
		}
		this.contentWrapper.empty();
	}
}