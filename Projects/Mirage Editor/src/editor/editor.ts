import { EditorView, keymap } from '@codemirror/view';
import { EditorState, Compartment, Extension } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { livePreviewPlugin, vaultPathFacet } from './livePreview';

export interface DebouncedSaver {
  (content: string): void;
  flush: () => void;
}

export function createDebouncedSaver(saveFn: (content: string) => void, delay: number = 300): DebouncedSaver {
  let timer: NodeJS.Timeout | null = null;
  let pendingContent: string | null = null;

  const debounced = ((content: string) => {
    pendingContent = content;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      if (pendingContent !== null) {
        saveFn(pendingContent);
        pendingContent = null;
      }
    }, delay);
  }) as DebouncedSaver;

  debounced.flush = () => {
    if (pendingContent !== null) {
      if (timer) clearTimeout(timer);
      saveFn(pendingContent);
      pendingContent = null;
    }
  };

  return debounced;
}

const editorDarkTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: '#1e1e1e',
      color: '#dcddde',
      height: '100%',
      fontSize: '15px',
    },
    '.cm-content': {
      caretColor: '#ffffff !important',
      fontFamily: 'var(--font-interface, -apple-system, sans-serif)',
      lineHeight: '1.65',
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeft: '2px solid #ffffff !important',
    },
    '&.cm-focused .cm-cursor': {
      borderLeft: '2px solid #ffffff !important',
    },
    '.cm-selectionBackground, ::selection': {
      backgroundColor: 'rgba(58, 90, 153, 0.45) !important',
    },
    '.cm-activeLine': {
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
    },
  },
  { dark: true }
);

export interface MarkdownEditorOptions {
  initialContent?: string;
  vaultPath?: string | null;
  onChange?: (content: string) => void;
  onSave?: (content: string) => void;
}

export class MarkdownEditor {
  public view: EditorView;
  private _pluginCompartment: Compartment;
  private _pluginExtensions: Extension[];
  private _saver: DebouncedSaver;

  constructor(
    containerEl: HTMLElement,
    { initialContent = '', vaultPath = null, onChange = () => {}, onSave = () => {} }: MarkdownEditorOptions = {}
  ) {
    this._pluginCompartment = new Compartment();
    this._pluginExtensions = [];
    this._saver = createDebouncedSaver(onSave, 300);

    const extensions: Extension[] = [
      editorDarkTheme,
      history(),
      keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
      markdown(),
      vaultPathFacet.of(vaultPath),
      livePreviewPlugin,
      EditorView.lineWrapping,
      this._pluginCompartment.of([]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const docStr = update.state.doc.toString();
          onChange(docStr);
          this._saver(docStr);
        }
      }),
    ];

    this.view = new EditorView({
      state: EditorState.create({ doc: initialContent, extensions }),
      parent: containerEl,
    });
  }

  public getContent(): string {
    return this.view.state.doc.toString();
  }

  public setContentIfDifferent(newContent: string): void {
    const current = this.getContent();
    if (current === newContent) return;

    const sel = this.view.state.selection;
    this.view.dispatch({
      changes: { from: 0, to: this.view.state.doc.length, insert: newContent },
      selection: sel.main.to <= newContent.length ? sel : undefined,
    });
  }

  public setContent(content: string): void {
    this.view.dispatch({
      changes: { from: 0, to: this.view.state.doc.length, insert: content },
    });
  }

  public addExtension(ext: Extension): void {
    this._pluginExtensions.push(ext);
    this.view.dispatch({
      effects: this._pluginCompartment.reconfigure(this._pluginExtensions),
    });
  }

  public flush(): void {
    this._saver.flush();
  }

  public destroy(): void {
    this.flush();
    this.view.destroy();
  }
}