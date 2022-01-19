import { SafeEvent } from '@/core/Event';

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
  /**
   * 剪切
   */
  CUT_VIEWDATA = 'cut_viewdata',
  /**
   * 复制
   */
  COPY_VIEWDATA = 'copy_viewdata',
  /**
   * 粘贴
   */
  PASTE_VIEWDATA = 'paste_viewdata',
  /**
   * 刷新右侧控制器面板
   */
  REFRESH_CONFIGURATOR_PANEL = 'refresh_configurator_panel',
}

/**
 * 事件的传输数据的类型约束集合
 */
export interface IEventTypeDataMap {
  [SafeEventType.SET_LAYOUT_MODAL_VISIBLE]: boolean;
  [SafeEventType.PUSH_VIEWDATA_SNAPSHOT_COMMAND]: void;
  [SafeEventType.RENDER_VIEWDATA_TREE]: void;
  [SafeEventType.CUT_VIEWDATA]: void;
  [SafeEventType.COPY_VIEWDATA]: void;
  [SafeEventType.PASTE_VIEWDATA]: void;
  [SafeEventType.REFRESH_CONFIGURATOR_PANEL]: void;
}

export const safeEventBus = new SafeEvent();
