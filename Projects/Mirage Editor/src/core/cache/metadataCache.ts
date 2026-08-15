import { Vault } from '../vault/vault';

export interface HeadingMeta {
  level: number;
  text: string;
  line: number;
}

export interface FileMetadata {
  links: Set<string>;
  tags: Set<string>;
  headings: HeadingMeta[];
  frontmatter: Record<string, string>;
  rawContent: string;
}

export class MetadataCache {
  private vault: Vault;
  public fileIndex: Map<string, FileMetadata> = new Map();
  public resolvedBacklinks: Map<string, Set<string>> = new Map();
  private isIndexing: boolean = false;

  constructor(vault: Vault) {
    this.vault = vault;
  }

  /**
   * Non-blocking background indexer. Processes files in small time-sliced batches.
   */
  public async buildIndexAsync(): Promise<void> {
    if (this.isIndexing) return;
    this.isIndexing = true;
    this.fileIndex.clear();
    this.resolvedBacklinks.clear();

    const files = this.vault.listFiles();
    const batchSize = 30;

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      for (const file of batch) {
        try {
          this.updateFile(file, this.vault.readFile(file));
        } catch {
          // Skip unreadable files
        }
      }
      // Yield to the UI thread so clicks, tabs, and typing are never blocked
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    this.isIndexing = false;
  }

  public updateFile(filePath: string, content: string): void {
    const oldMeta = this.fileIndex.get(filePath);
    if (oldMeta) {
      for (const target of oldMeta.links) {
        this.resolvedBacklinks.get(target)?.delete(filePath);
      }
    }

    const { links, tags, headings, frontmatter } = this._parse(content);

    this.fileIndex.set(filePath, {
      links,
      tags,
      headings,
      frontmatter,
      rawContent: content,
    });

    for (const target of links) {
      const normalized = target.endsWith('.md') ? target : `${target}.md`;
      if (!this.resolvedBacklinks.has(normalized)) {
        this.resolvedBacklinks.set(normalized, new Set());
      }
      this.resolvedBacklinks.get(normalized)!.add(filePath);
    }
  }

  public deleteFile(filePath: string): void {
    const meta = this.fileIndex.get(filePath);
    if (meta) {
      for (const target of meta.links) {
        this.resolvedBacklinks.get(target)?.delete(filePath);
      }
    }
    this.fileIndex.delete(filePath);
    this.resolvedBacklinks.delete(filePath);
  }

  public getBacklinks(filePath: string): string[] {
    const normalized = filePath.endsWith('.md') ? filePath : `${filePath}.md`;
    return Array.from(this.resolvedBacklinks.get(normalized) || []);
  }

  public getUnlinkedMentions(filePath: string): string[] {
    const baseName = filePath.replace(/\.md$/, '').split('/').pop();
    if (!baseName || baseName.length < 2) return [];

    const mentions: string[] = [];
    const mentionRegex = new RegExp(`(?<!\\[\\[)\\b${this._escapeRegExp(baseName)}\\b(?!\\]\\])`, 'gi');

    for (const [otherPath, meta] of this.fileIndex.entries()) {
      if (otherPath === filePath) continue;
      if (meta.links.has(baseName) || meta.links.has(`${baseName}.md`)) continue;

      if (mentionRegex.test(meta.rawContent)) {
        mentions.push(otherPath);
      }
    }
    return mentions;
  }

  private _parse(content: string): Omit<FileMetadata, 'rawContent'> {
    const links = new Set<string>();
    const tags = new Set<string>();
    const headings: HeadingMeta[] = [];
    const frontmatter: Record<string, string> = {};

    let body = content;
    const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
    if (fmMatch) {
      body = content.slice(fmMatch[0].length);
      fmMatch[1].split('\n').forEach((line) => {
        const [k, ...v] = line.split(':');
        if (k && v.length) frontmatter[k.trim()] = v.join(':').trim();
      });
    }

    const wikiRegex = /\[\[(.*?)\]\]/g;
    let match: RegExpExecArray | null;
    while ((match = wikiRegex.exec(body)) !== null) {
      const rawLink = match[1].split('|')[0].split('#')[0].trim();
      if (rawLink) links.add(rawLink);
    }

    const tagRegex = /(?:^|\s)#[a-zA-Z0-9_\-\/]+/g;
    while ((match = tagRegex.exec(body)) !== null) {
      tags.add(match[0].trim());
    }

    const lines = body.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const hMatch = lines[i].match(/^(#{1,6})\s+(.*)$/);
      if (hMatch) {
        headings.push({ level: hMatch[1].length, text: hMatch[2].trim(), line: i });
      }
    }

    return { links, tags, headings, frontmatter };
  }

  private _escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}