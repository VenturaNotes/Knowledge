export type EventCallback = (...args: any[]) => void;

export class EventBus {
  private _listeners: Map<string, Set<EventCallback>> = new Map();

  public on(event: string, callback: EventCallback): () => void {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event)!.add(callback);
    return () => this.off(event, callback);
  }

  public off(event: string, callback: EventCallback): void {
    this._listeners.get(event)?.delete(callback);
  }

  public emit(event: string, ...args: any[]): void {
    this._listeners.get(event)?.forEach((cb) => cb(...args));
  }
}