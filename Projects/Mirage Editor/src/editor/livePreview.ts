import { ViewPlugin, Decoration, DecorationSet, EditorView, ViewUpdate, WidgetType } from '@codemirror/view';
import { RangeSetBuilder, Facet } from '@codemirror/state';

export const vaultPathFacet = Facet.define<string | null, string | null>({
  combine: (values) => values[0] || null,
});

const hiddenSyntaxDeco = Decoration.replace({});

class BulletWidget extends WidgetType {
  constructor(readonly indent: string) {
    super();
  }

  toDOM(): HTMLElement {
    const span = document.createElement('span');
    span.className = 'cm-bullet-widget';
    span.textContent = `${this.indent}• `;
    return span;
  }
}

class ImageWidget extends WidgetType {
  constructor(
    readonly src: string,
    readonly alt: string,
    readonly vaultPath: string | null,
    readonly width: string | null = null,
    readonly height: string | null = null
  ) {
    super();
  }

  eq(other: ImageWidget): boolean {
    return (
      other.src === this.src &&
      other.alt === this.alt &&
      other.vaultPath === this.vaultPath &&
      other.width === this.width &&
      other.height === this.height
    );
  }

  toDOM(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'cm-image-widget';

    const img = document.createElement('img');
    img.alt = this.alt;

    if (this.width) {
      img.style.width = this.width.endsWith('%') || this.width.endsWith('px') ? this.width : `${this.width}px`;
    }
    if (this.height) {
      img.style.height = this.height.endsWith('%') || this.height.endsWith('px') ? this.height : `${this.height}px`;
    }

    let fullSrc = this.src.trim();
    if (!fullSrc.startsWith('http://') && !fullSrc.startsWith('https://') && !fullSrc.startsWith('data:')) {
      if (this.vaultPath) {
        const cleanPath = fullSrc.startsWith('/') ? fullSrc.slice(1) : fullSrc;
        fullSrc = `file://${this.vaultPath}/${cleanPath}`;
      }
    }
    img.src = fullSrc;

    img.onerror = () => {
      img.style.display = 'none';
      const errorSpan = document.createElement('span');
      errorSpan.className = 'cm-image-error';
      errorSpan.textContent = `🖼️ [Image not found: ${this.alt || this.src}]`;
      container.appendChild(errorSpan);
    };

    container.appendChild(img);
    return container;
  }
}

export const livePreviewPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = this.buildDecorations(view);
    }

    update(update: ViewUpdate): void {
      if (update.docChanged || update.selectionSet || update.viewportChanged) {
        this.decorations = this.buildDecorations(update.view);
      }
    }

    private buildDecorations(view: EditorView): DecorationSet {
      const builder = new RangeSetBuilder<Decoration>();
      const cursorPositions = view.state.selection.ranges.map((r) => r.head);
      const vaultPath = view.state.facet(vaultPathFacet);

      for (const { from, to } of view.visibleRanges) {
        let pos = from;
        while (pos <= to) {
          const line = view.state.doc.lineAt(pos);
          const hasCursor = cursorPositions.some(
            (cursor) => cursor >= line.from && cursor <= line.to
          );

          this.applyLineDecorations(line.text, line.from, builder, vaultPath, hasCursor, cursorPositions);
          pos = line.to + 1;
        }
      }

      return builder.finish();
    }

    private applyLineDecorations(
      text: string,
      lineStart: number,
      builder: RangeSetBuilder<Decoration>,
      vaultPath: string | null,
      hasCursor: boolean,
      cursorPositions: number[]
    ): void {
      // 1. Bullet Points
      const bulletMatch = text.match(/^(\s*)([-*+])\s+/);
      if (bulletMatch) {
        const indentLen = bulletMatch[1].length;
        const bulletSymbolPos = lineStart + indentLen;
        const bulletEndPos = bulletSymbolPos + bulletMatch[2].length + 1;

        const isCursorNearBullet = cursorPositions.some(
          (c) => c >= lineStart && c <= bulletEndPos + 1
        );

        if (!isCursorNearBullet) {
          builder.add(
            bulletSymbolPos,
            bulletEndPos,
            Decoration.replace({
              widget: new BulletWidget(bulletMatch[1]),
            })
          );
        }
      }

      // 2. Images & Inline Formatting (Hidden when cursor is off the line)
      if (!hasCursor) {
        // (A) HTML <img> Tag Parsing
        const htmlImgRegex = /<img\b([^>]*)\/?>/gi;
        let htmlMatch: RegExpExecArray | null;
        while ((htmlMatch = htmlImgRegex.exec(text)) !== null) {
          const attrs = htmlMatch[1];
          const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
          if (srcMatch) {
            const src = srcMatch[1];
            const altMatch = attrs.match(/alt=["']([^"']*)["']/i);
            const widthMatch = attrs.match(/width=["']([^"']*)["']/i);
            const heightMatch = attrs.match(/height=["']([^"']*)["']/i);

            const from = lineStart + htmlMatch.index;
            const to = from + htmlMatch[0].length;

            // 🟢 Removed block: true to fix RangeError crash
            builder.add(
              from,
              to,
              Decoration.replace({
                widget: new ImageWidget(
                  src,
                  altMatch ? altMatch[1] : '',
                  vaultPath,
                  widthMatch ? widthMatch[1] : null,
                  heightMatch ? heightMatch[1] : null
                ),
              })
            );
          }
        }

        // (B) Markdown Standard Images: ![alt](url)
        const standardImgRegex = /!\[(.*?)\]\((.*?)\)/g;
        let match: RegExpExecArray | null;
        while ((match = standardImgRegex.exec(text)) !== null) {
          const from = lineStart + match.index;
          const to = from + match[0].length;
          builder.add(
            from,
            to,
            Decoration.replace({
              widget: new ImageWidget(match[2], match[1], vaultPath),
            })
          );
        }

        // (C) WikiLink Images: ![[image.png]]
        const wikiImgRegex = /!\[\[(.*?)(?:\|.*?)?\]\]/g;
        while ((match = wikiImgRegex.exec(text)) !== null) {
          const from = lineStart + match.index;
          const to = from + match[0].length;
          builder.add(
            from,
            to,
            Decoration.replace({
              widget: new ImageWidget(match[1], match[1], vaultPath),
            })
          );
        }

        // (D) Inline Markdown Styles
        const rules = [
          { regex: /\*\*(.+?)\*\*/g, startLen: 2, endLen: 2 },
          { regex: /(?<!\*)\*([^*]+?)\*(?!\*)/g, startLen: 1, endLen: 1 },
          { regex: /~~(.+?)~~/g, startLen: 2, endLen: 2 },
          { regex: /^(#{1,6}\s+)/g, startLen: null, endLen: 0 },
          { regex: /(?<!\!)\[\[(.*?)(?:\|.*?)?\]\]/g, startLen: 2, endLen: 2 },
        ];

        for (const rule of rules) {
          let ruleMatch: RegExpExecArray | null;
          while ((ruleMatch = rule.regex.exec(text)) !== null) {
            const matchStart = lineStart + ruleMatch.index;
            if (rule.startLen === null) {
              builder.add(matchStart, matchStart + ruleMatch[0].length, hiddenSyntaxDeco);
            } else {
              const matchEnd = matchStart + ruleMatch[0].length;
              builder.add(matchStart, matchStart + rule.startLen, hiddenSyntaxDeco);
              builder.add(matchEnd - rule.endLen, matchEnd, hiddenSyntaxDeco);
            }
          }
        }
      }
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);