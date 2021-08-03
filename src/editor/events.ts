import { LayoutMode } from '@/runtime/LayoutMode';
import { SafeEventBus } from '@/editor/core/Event';
import { ViewData } from '@/runtime/ViewData';

export interface ISafeEventType<K extends SafeEventType, T> {
  type: K;
  data: T;
}

export enum SafeEventType {
  SET_LAYOUT_MODAL_VISIBLE,
  SET_ACTIVE_VIEWDATA,
  PUSH_VIEWDATA_SNAPSHOT_COMMAND,
  CHOOSE_LAYOUT_MODE,
  RENDER_VIEWDATA_TREE,
}

export type RENDER_VIEWDATA_TREE_EVENT = ISafeEventType<
  SafeEventType.RENDER_VIEWDATA_TREE,
  null
>;

export type PUSH_VIEWDATA_SNAPSHOT_COMMAND_EVENT = ISafeEventType<
  SafeEventType.PUSH_VIEWDATA_SNAPSHOT_COMMAND,
  null
>;
export type SET_LAYOUT_MODAL_VISIBLE_EVENT = ISafeEventType<
  SafeEventType.SET_LAYOUT_MODAL_VISIBLE,
  boolean
>;

export type SET_ACTIVE_VIEWDATA_EVENT = ISafeEventType<
  SafeEventType.SET_ACTIVE_VIEWDATA,
  ViewData | null
>;

export type CHOOSE_LAYOUT_MODE_EVENT = ISafeEventType<
  SafeEventType.CHOOSE_LAYOUT_MODE,
  LayoutMode
>;

export type ConcreteEvent =
  | PUSH_VIEWDATA_SNAPSHOT_COMMAND_EVENT
  | RENDER_VIEWDATA_TREE_EVENT
  | SET_LAYOUT_MODAL_VISIBLE_EVENT
  | SET_ACTIVE_VIEWDATA_EVENT
  | CHOOSE_LAYOUT_MODE_EVENT;

export const safeEventBus = new SafeEventBus();
