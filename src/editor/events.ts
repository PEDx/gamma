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
  CHOOSE_LAYOUT_MODE,
}

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
  | SET_LAYOUT_MODAL_VISIBLE_EVENT
  | SET_ACTIVE_VIEWDATA_EVENT
  | CHOOSE_LAYOUT_MODE_EVENT;

export const safeEventBus = new SafeEventBus();
