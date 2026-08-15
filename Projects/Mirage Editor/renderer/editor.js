import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';

export class MarkdownEditor {
  constructor(containerEl, { initialContent = '', onChange = () => {} } = {}) {
    // Plugins extend the editor through this compartment (registerEditorExtension
    // equivalent) rather than by re-instantiating EditorState, so extensions can
    // be added/removed at runtime without tearing down the editor.
    this._pluginCompartment = new Compartment();
    this._pluginExtensions = [];

    const extensions = [
      history(),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      lineNumbers(),
      markdown(),
      EditorView.lineWrapping,
      this._pluginCompartment.of([]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          onChange(update.state.doc.toString());
        }
      }),
    ];

    this.view = new EditorView({
      state: EditorState.create({ doc: initialContent, extensions }),
      parent: containerEl,
    });
  }

  getContent() {
    return this.view.state.doc.toString();
  }

  setContent(content) {
    this.view.dispatch({
      changes: { from: 0, to: this.view.state.doc.length, insert: content },
    });
  }

  /** Plugin-facing hook: add a CodeMirror extension to this editor instance. */
  addExtension(ext) {
    this._pluginExtensions.push(ext);
    this.view.dispatch({
      effects: this._pluginCompartment.reconfigure(this._pluginExtensions),
    });
  }

  destroy() {
    this.view.destroy();
  }
}
