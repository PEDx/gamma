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
 * 编辑器空间
 */
export namespace Editor {
  export type CPVE = Runtime.CPVE;

  /**
   * 运行时模块
   */
  export const runtime = Runtime;
  /**
   * 元素选中模块
   */
  export const selector = new Selector();
  /**
   * 事件模块
   */
  export const event = new Event<EEventType, IEventTypeDataMap>();
  /**
   * 历史记录模块
   */
  export const history = new History();

  /**
   * 绑定处理键盘事件
   */
  new Keyboard();
  /**
   * 添加性能日志
   */
  new PerformanceLog();
}
