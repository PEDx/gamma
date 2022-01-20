import { Selector } from './Selector';
import { Event } from './Event';
import { History } from './History';
import { Keyboard } from './Keyboard';
import { PerformanceLog } from './PerformanceLog';
import React from 'react';
import ReactDOM from 'react-dom';

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
  export const selector = new Selector();
  export const event = new Event<EEventType, IEventTypeDataMap>();
  export const history = new History();

  new Keyboard();
  new PerformanceLog();

  //@ts-ignore
  window['ReactDOM'] = ReactDOM;
  window['React'] = React;
}
