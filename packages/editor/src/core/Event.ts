import { logger } from '@/core/Logger';
import { IEventTypeDataMap } from '../events';

export class SafeEventBus {
  private map: { [eventName: string]: Function[] } = {};
  private cache: {
    [eventName: string]: IEventTypeDataMap[keyof IEventTypeDataMap] | null;
  } = {};
  on<K extends keyof IEventTypeDataMap>(
    eventName: K,
    fn: (data: IEventTypeDataMap[K]) => void,
  ) {
    if (!this.map[eventName]) {
      this.map[eventName] = [];
    }
    this.map[eventName].push(fn);
    /**
     * 如果有未处理发射事件就直接调用一次
     */
    if (this.cache[eventName]) {
      this.emit(eventName, this.cache[eventName] as IEventTypeDataMap[K]);
      this.cache[eventName] = null;
    }
  }

  emit<K extends keyof IEventTypeDataMap>(eventName: K, data?: IEventTypeDataMap[K]) {
    let fns = this.map[eventName];
    if (!fns || fns.length === 0) {
      /**
       * 此时监听事件可能未注册，将最近发射事件存起来
       */
      logger.warn(`事件 ${eventName} 未注册`);
      if (data !== undefined) this.cache[eventName] = data;
      return false;
    }
    fns.forEach((callback) => {
      callback(data);
    });
  }

  off(eventName: keyof IEventTypeDataMap, fn: Function) {
    let fns = this.map[eventName];
    if (!fns) return false;
    if (!fn) {
      fns && (fns.length = 0);
    } else {
      fns.forEach((callback: Function, i: number) => {
        if (callback === fn) {
          fns.splice(i, 1);
        }
      });
    }
  }
  clear(eventName: keyof IEventTypeDataMap) {
    this.map[eventName] = [];
  }
}

