import { LayoutMode } from '@/runtime/LayoutMode';
import { SafeEventBus } from '@/editor/core/Event';

export interface ISafeEventType<K extends SafeEventType, T> {
  type: K;
  data: T;
}

export enum SafeEventType {
  SET_LAYOUT_MODAL_VISIBLE,
  CHOOSE_LAYOUT_MODE,
}

export type SET_LAYOUT_MODAL_VISIBLE_EVENT = ISafeEventType<
  SafeEventType.SET_LAYOUT_MODAL_VISIBLE,
  boolean
>;

export type CHOOSE_LAYOUT_MODE_EVENT = ISafeEventType<
  SafeEventType.CHOOSE_LAYOUT_MODE,
  LayoutMode
>;

export type ConcreteEvent =
  | SET_LAYOUT_MODAL_VISIBLE_EVENT
  | CHOOSE_LAYOUT_MODE_EVENT;

export const safeEventBus = new SafeEventBus();
