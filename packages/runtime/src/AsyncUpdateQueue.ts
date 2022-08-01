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
      let updata: (() => void) | undefined;

      while ((updata = this.queue.shift())) {
        /**
         * 在 updata 调用中可能也会 push 进别的 update 函数
         * 进入的 update 可能已经在 queue 中，且在此时已经被执行完毕
         * 因此如果 shift 的话，这个 update 会被执行两次
         * 因此如果 pop 的话，这个 update 会只会被执行一次（从后往前执行，最新压入的 update 先执行）
         */
        updata();
      }
      this.queue = [];
      this._dirty = false;
    });
  }
}
