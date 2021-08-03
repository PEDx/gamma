import { SafeEventBus } from '@/editor/core/Event';
import type { LayoutMode } from '@/runtime/LayoutMode';
import type { ViewData } from '@/runtime/ViewData';

export enum SafeEventType {
  /**
   * 设置布局模式选择弹窗显示
   */
  SET_LAYOUT_MODAL_VISIBLE,
  /**
   * 设置选中的 viewdata
   */
  SET_ACTIVE_VIEWDATA,
  /**
   * 记录一个 viewdata 快照
   */
  PUSH_VIEWDATA_SNAPSHOT_COMMAND,
  /**
   * 选择布局模式
   */
  CHOOSE_LAYOUT_MODE,
  /**
   * 渲染一次组件树
   */
  RENDER_VIEWDATA_TREE,
}

/**
 * 事件的传输数据的类型约束集合
 */
export interface IEventTypeDataMap {
  [SafeEventType.SET_LAYOUT_MODAL_VISIBLE]: boolean;
  [SafeEventType.SET_ACTIVE_VIEWDATA]: ViewData | null;
  [SafeEventType.PUSH_VIEWDATA_SNAPSHOT_COMMAND]: null;
  [SafeEventType.CHOOSE_LAYOUT_MODE]: LayoutMode;
  [SafeEventType.RENDER_VIEWDATA_TREE]: null;
}

export const safeEventBus = new SafeEventBus();
