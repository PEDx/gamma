
export interface Events {
  on<T>(eventName: string, fn: (data: T) => void): void;
  emit(eventName: string, data?: unknown): void;
  off(eventName: string, fn: Function): void;
}

export class EventEmit implements Events {
  private map: { [eventName: string]: Function[] } = {};

  on<T>(eventName: string, fn: (data: T) => void) {
    if (!this.map[eventName]) {
      this.map[eventName] = [];
    }
    this.map[eventName].push(fn);
  }

  emit<T>(eventName: string, data?: T) {
    let fns = this.map[eventName];
    if (!fns || fns.length === 0) return false;
    fns.forEach((cd) => {
      cd(data);
    });
  }

  off(eventName: string, fn: Function) {
    let fns = this.map[eventName];
    if (!fns) return false;
    if (!fn) {
      fns && (fns.length = 0);
    } else {
      fns.forEach((cd: Function, i: number) => {
        if (cd === fn) {
          fns.splice(i, 1);
        }
      });
    }
  }
  clear(eventName: string) {
    this.map[eventName] = []
  }
}

export const globalBus = new EventEmit();
