/**
 * 编辑器类单例
 */

import { Selector } from './ActiveNodeManager';
import { SafeEvent } from './Event';
import { History } from './History';

export enum EEventType {
  Emit = 'Emit',
}

/**
 * 事件的传输数据的类型约束集合
 */
export interface IEventTypeDataMap {
  [EEventType.Emit]: void;
}

export class Editor {
  private static instance: Editor;
  readonly selector = new Selector();
  readonly event = new SafeEvent<EEventType, IEventTypeDataMap>();
  readonly history = new History();
  private constructor() {}
  public static getInstance() {
    if (!Editor.instance) {
      Editor.instance = new Editor();
    }
    return Editor.instance;
  }
}

export const editor = Editor.getInstance();

editor.event.on(EEventType.Emit, () => {});
