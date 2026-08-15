export interface Command {
  id: string;
  name: string;
  callback: () => void | Promise<void>;
  hotkey?: string | null;
}

export class CommandRegistry {
  private _commands: Map<string, Command> = new Map();

  public register(cmd: Command): void {
    if (this._commands.has(cmd.id)) {
      throw new Error(`Command already registered: ${cmd.id}`);
    }
    this._commands.set(cmd.id, {
      ...cmd,
      hotkey: cmd.hotkey ?? null,
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
}