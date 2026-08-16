export interface Command {
  id: string;
  name: string;
  callback: () => void | Promise<void>;
  defaultHotkey?: string | null;
  hotkey?: string | null;
}

export class CommandRegistry {
  private _commands: Map<string, Command> = new Map();

  public register(cmd: Command): void {
    if (this._commands.has(cmd.id)) {
      throw new Error(`Command already registered: ${cmd.id}`);
    }
    const defaultHotkey = cmd.defaultHotkey || cmd.hotkey || null;
    this._commands.set(cmd.id, {
      ...cmd,
      defaultHotkey,
      hotkey: defaultHotkey ? this.normalizeChord(defaultHotkey) : null,
    });
  }

  public unregister(id: string): void {
    this._commands.delete(id);
  }

  public execute(id: string): void {
    const cmd = this._commands.get(id);
    if (!cmd) throw new Error(`Unknown command: ${id}`);
    cmd.callback();
  }

  public list(): Command[] {
    return Array.from(this._commands.values());
  }

  public get(id: string): Command | undefined {
    return this._commands.get(id);
  }

  public setHotkey(id: string, newChord: string | null): void {
    const cmd = this._commands.get(id);
    if (!cmd) return;
    cmd.hotkey = newChord ? this.normalizeChord(newChord) : null;
  }

  // 🟢 Collision Detector: Prevents any 2 commands from sharing the same hotkey
  public checkConflict(chord: string, excludeCommandId?: string): Command | null {
    const normalized = this.normalizeChord(chord);
    if (!normalized) return null;

    for (const cmd of this._commands.values()) {
      if (cmd.id !== excludeCommandId && cmd.hotkey && this.normalizeChord(cmd.hotkey) === normalized) {
        return cmd;
      }
    }
    return null;
  }

  public getCommandByChord(chord: string): Command | null {
    const normalized = this.normalizeChord(chord);
    if (!normalized) return null;

    for (const cmd of this._commands.values()) {
      if (cmd.hotkey && this.normalizeChord(cmd.hotkey) === normalized) {
        return cmd;
      }
    }
    return null;
  }

  public getAllActiveChords(): string[] {
    return Array.from(this._commands.values())
      .map((c) => c.hotkey)
      .filter((h): h is string => Boolean(h));
  }

  public normalizeChord(raw: string): string {
    const lower = raw.toLowerCase().trim();
    if (!lower) return '';
    const parts = lower.split(/[+\s]+/);
    const modifiers: string[] = [];
    let key = '';

    const modMap: Record<string, string> = {
      cmd: 'meta',
      command: 'meta',
      ctrl: 'ctrl',
      control: 'ctrl',
      shift: 'shift',
      alt: 'alt',
      opt: 'alt',
      option: 'alt',
      meta: 'meta',
    };

    for (const part of parts) {
      if (modMap[part]) {
        if (!modifiers.includes(modMap[part])) modifiers.push(modMap[part]);
      } else {
        key = part;
      }
    }

    if (!key) return '';
    return modifiers.sort().join('+') + '+' + key;
  }
}