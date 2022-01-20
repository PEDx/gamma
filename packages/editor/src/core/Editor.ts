import { Selector } from './Selector';
import { Event } from './Event';
import { History } from './History';
import { Keyboard } from './Keyboard';
import { PerformanceLog } from './PerformanceLog';
import { Runtime } from '@gamma/runtime';

export enum EEventType {
  Emit = 'Emit',
}

/**
 * 事件的传输数据的类型约束集合
 */
export interface IEventTypeDataMap {
  [EEventType.Emit]: void;
}

/**
 * 编辑器类
 */
export namespace Editor {
  export type CPVE = Runtime.CPVE;

  export const runtime = Runtime;
  export const selector = new Selector();
  export const event = new Event<EEventType, IEventTypeDataMap>();
  export const history = new History();

  new Keyboard();
  new PerformanceLog();
}
