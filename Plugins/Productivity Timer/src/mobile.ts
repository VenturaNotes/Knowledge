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

		const activeEl = document.activeElement as HTMLElement | null;
		let activeInfo: { timerId: string; isEst: boolean; isName: boolean; start: number | null; end: number | null } | null = null;

		if (activeEl && this.contentWrapper.contains(activeEl)) {
			const row = activeEl.closest(".pt-row");
			const timerId = row?.getAttribute("data-timer-id");
			if (timerId) {
				if (activeEl.classList.contains("pt-estimate-input")) {
					const inp = activeEl as HTMLInputElement;
					activeInfo = { timerId, isEst: true, isName: false, start: inp.selectionStart, end: inp.selectionEnd };
				} else if (activeEl.classList.contains("pt-name")) {
					activeInfo = { timerId, isEst: false, isName: true, start: null, end: null };
				}
			}
		}

		const bodyEl = this.contentWrapper.querySelector(".pt-body") as HTMLElement;
		const savedScrollTop = bodyEl ? bodyEl.scrollTop : 0;

		this.contentWrapper.empty();
		this.contentWrapper.classList.add("pt-mobile-wrapper");

		const body = this.contentWrapper.createDiv({ cls: "pt-body" });
		this.renderer.renderBody(body, true);
		body.scrollTop = savedScrollTop;

		if (activeInfo) {
			const targetRow = this.contentWrapper.querySelector(`.pt-row[data-timer-id="${activeInfo.timerId}"]`);
			if (targetRow) {
				if (activeInfo.isEst) {
					const inp = targetRow.querySelector(".pt-estimate-input") as HTMLInputElement | null;
					if (inp) {
						inp.focus();
						if (activeInfo.start !== null && activeInfo.end !== null) {
							inp.setSelectionRange(activeInfo.start, activeInfo.end);
						}
					}
				} else if (activeInfo.isName) {
					const nameEl = targetRow.querySelector(".pt-name") as HTMLElement | null;
					nameEl?.focus();
				}
			}
		}
	}

	async onClose() {
		if (this.plugin.activeMobileView === this) {
			this.plugin.activeMobileView = null;
		}
		this.contentWrapper.empty();
	}
}