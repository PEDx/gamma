

export class AsyncUpdateQueue {
  private queue: (() => void)[] = [];
  private _dirty: boolean = false;
  push(update: () => void) {
    if (!this._dirty) {
      this.startWaitNextFrame();
      this._dirty = true;
    }
    if (this.queue.includes(update))
      return;
    this.queue.push(update);
  }
  startWaitNextFrame() {
    requestAnimationFrame(() => {
      this.queue.forEach(update => update());
      this.queue = [];
      this._dirty = false;
    });
  }
}
