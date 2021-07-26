export class AsyncUpdateQueue {
  private queue: (() => void)[] = [];
  private _dirty: boolean = false;
  push(update: () => void) {
    if (!this._dirty) {
      this.startWaitBatchUpdate();
      this._dirty = true;
    }
    if (this.queue.includes(update)) return;
    this.queue.push(update);
  }
  private startWaitBatchUpdate() {
    requestAnimationFrame(() => {
      let i = 0;
      let updata: () => void;
      while ((updata = this.queue[i++])) {
        /**
         * 在 updata 调用中可能也会 push 进别的 update 函数
         */
        updata();
      }
      this.queue = [];
      this._dirty = false;
    });
  }
}
