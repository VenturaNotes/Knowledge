export class CommandRegistry {
  constructor() {
    this._commands = new Map();
  }

  register({ id, name, callback, hotkey = null }) {
    if (this._commands.has(id)) {
      throw new Error(`Command already registered: ${id}`);
    }
    this._commands.set(id, { id, name, callback, hotkey });
  }

  unregister(id) {
    this._commands.delete(id);
  }

  execute(id) {
    const cmd = this._commands.get(id);
    if (!cmd) throw new Error(`Unknown command: ${id}`);
    cmd.callback();
  }

  list() {
    return Array.from(this._commands.values());
  }
}
