import { ViewPlugin, Decoration, DecorationSet, EditorView, ViewUpdate, WidgetType } from '@codemirror/view';
import { RangeSetBuilder, Facet } from '@codemirror/state';

export const vaultPathFacet = Facet.define<string | null, string | null>({
  combine: (values) => values[0] || null,
});

const hiddenSyntaxDeco = Decoration.replace({});

interface DecoEntry {
  from: number;
  to: number;
  deco: Decoration;
}

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

// 🟢 High-Performance Instant Math Widget (KaTeX + MathJax fallback)
class MathWidget extends WidgetType {
  constructor(readonly latex: string, readonly display: boolean) {
    super();
  }

  eq(other: MathWidget): boolean {
    return other.latex === this.latex && other.display === this.display;
  }

  toDOM(): HTMLElement {
    const span = document.createElement('span');
    span.className = this.display ? 'cm-math-block' : 'cm-math-inline';

    const cleanLatex = this.latex.trim();

    // 1. Render synchronously with KaTeX (Obsidian standard: 0ms latency, never disappears)
    if ((window as any).katex) {
      try {
        (window as any).katex.render(cleanLatex, span, {
          displayMode: this.display,
          throwOnError: false,
        });
        return span;
      } catch (err) {
        // Continue to fallback
      }
    }

    // 2. Fallback to MathJax if KaTeX is not present
    if ((window as any).MathJax?.tex2chtml) {
      try {
        const mathNode = (window as any).MathJax.tex2chtml(cleanLatex, { display: this.display });
        span.appendChild(mathNode);
        return span;
      } catch {
        span.textContent = `$${cleanLatex}$`;
      }
    } else {
      span.textContent = `$${cleanLatex}$`;
    }

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
      const entries: DecoEntry[] = [];
      const cursorPositions = view.state.selection.ranges.map((r) => r.head);
      const vaultPath = view.state.facet(vaultPathFacet);

      for (const { from, to } of view.visibleRanges) {
        let pos = from;
        while (pos <= to) {
          const line = view.state.doc.lineAt(pos);
          const hasCursor = cursorPositions.some(
            (cursor) => cursor >= line.from && cursor <= line.to
          );

          this.collectLineDecorations(line.text, line.from, entries, vaultPath, hasCursor, cursorPositions);
          pos = line.to + 1;
        }
      }

      // Sort all decorations by character position ascending
      entries.sort((a, b) => a.from - b.from || a.to - b.to);

      // Eliminate overlapping collisions
      const nonOverlapping: DecoEntry[] = [];
      let lastTo = -1;
      for (const entry of entries) {
        if (entry.from >= lastTo && entry.from < entry.to) {
          nonOverlapping.push(entry);
          lastTo = entry.to;
        }
      }

      const builder = new RangeSetBuilder<Decoration>();
      for (const { from, to, deco } of nonOverlapping) {
        builder.add(from, to, deco);
      }

      return builder.finish();
    }

    private collectLineDecorations(
      text: string,
      lineStart: number,
      entries: DecoEntry[],
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

        const isDirectlyOnDash = cursorPositions.some(
          (c) => c >= bulletSymbolPos && c <= bulletSymbolPos + 1
        );

        if (!isDirectlyOnDash) {
          entries.push({
            from: bulletSymbolPos,
            to: bulletEndPos,
            deco: Decoration.replace({
              widget: new BulletWidget(bulletMatch[1]),
            }),
          });
        }
      }

      // 2. Math ($$...$$ and $...$)
      const blockMathRegex = /\$\$([\s\S]+?)\$\$/g;
      let mathMatch: RegExpExecArray | null;
      while ((mathMatch = blockMathRegex.exec(text)) !== null) {
        const from = lineStart + mathMatch.index;
        const to = from + mathMatch[0].length;
        const isCursorInside = cursorPositions.some((c) => c >= from && c <= to);
        if (!isCursorInside) {
          entries.push({
            from,
            to,
            deco: Decoration.replace({
              widget: new MathWidget(mathMatch[1], true),
            }),
          });
        }
      }

      const inlineMathRegex = /(?<!\$)\$(?!\$)([^\$\n]+?)(?<!\$)\$(?!\$)/g;
      while ((mathMatch = inlineMathRegex.exec(text)) !== null) {
        const from = lineStart + mathMatch.index;
        const to = from + mathMatch[0].length;
        const isCursorInside = cursorPositions.some((c) => c >= from && c <= to);
        if (!isCursorInside) {
          entries.push({
            from,
            to,
            deco: Decoration.replace({
              widget: new MathWidget(mathMatch[1], false),
            }),
          });
        }
      }

      // 3. Images & Markdown Format Hiding (when cursor is off the line)
      if (!hasCursor) {
        // HTML <img>
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

            entries.push({
              from: lineStart + htmlMatch.index,
              to: lineStart + htmlMatch.index + htmlMatch[0].length,
              deco: Decoration.replace({
                widget: new ImageWidget(
                  src,
                  altMatch ? altMatch[1] : '',
                  vaultPath,
                  widthMatch ? widthMatch[1] : null,
                  heightMatch ? heightMatch[1] : null
                ),
              }),
            });
          }
        }

        // Markdown Images
        const standardImgRegex = /!\[(.*?)\]\((.*?)\)/g;
        let match: RegExpExecArray | null;
        while ((match = standardImgRegex.exec(text)) !== null) {
          entries.push({
            from: lineStart + match.index,
            to: lineStart + match.index + match[0].length,
            deco: Decoration.replace({
              widget: new ImageWidget(match[2], match[1], vaultPath),
            }),
          });
        }

        // Wiki Images
        const wikiImgRegex = /!\[\[(.*?)(?:\|.*?)?\]\]/g;
        while ((match = wikiImgRegex.exec(text)) !== null) {
          entries.push({
            from: lineStart + match.index,
            to: lineStart + match.index + match[0].length,
            deco: Decoration.replace({
              widget: new ImageWidget(match[1], match[1], vaultPath),
            }),
          });
        }

        // Inline Markdown Formatting
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
              entries.push({
                from: matchStart,
                to: matchStart + ruleMatch[0].length,
                deco: hiddenSyntaxDeco,
              });
            } else {
              const matchEnd = matchStart + ruleMatch[0].length;
              entries.push({
                from: matchStart,
                to: matchStart + rule.startLen,
                deco: hiddenSyntaxDeco,
              });
              entries.push({
                from: matchEnd - rule.endLen,
                to: matchEnd,
                deco: hiddenSyntaxDeco,
              });
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