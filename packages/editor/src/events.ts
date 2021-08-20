import { SafeEventBus } from '@/core/Event';
import type {
  IElementCreateResult,
  IGammaElement,
  LayoutMode,
  ViewData,
} from '@gamma/runtime';

export enum SafeEventType {
  /**
   * 设置布局模式选择弹窗显示
   */
  SET_LAYOUT_MODAL_VISIBLE = 'set_layout_modal_visible',
  /**
   * 设置选中的 viewdata
   */
  SET_ACTIVE_VIEWDATA = 'set_active_viewdata',
  /**
   * 记录一个 viewdata 快照
   */
  PUSH_VIEWDATA_SNAPSHOT_COMMAND = 'push_viewdata_snapshot_command',
  /**
   * 选择布局模式
   */
  CHOOSE_LAYOUT_MODE = 'choose_layout_mode',
  /**
   * 渲染一次组件树
   */
  RENDER_VIEWDATA_TREE = 'render_viewdata_tree',
  /**
   * 所需组件加载完毕
   */
  GAMMA_ELEMENT_LOADED = 'gamma_element_loaded',
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
  [SafeEventType.GAMMA_ELEMENT_LOADED]: Map<
    string,
    IGammaElement<IElementCreateResult>
  >;
}

export const safeEventBus = new SafeEventBus();
