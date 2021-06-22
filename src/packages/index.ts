import { ViewData } from '@/class/ViewData';
import { Configurator } from '@/class/Configurator';
import { createBaseView } from './BaseView';
import { createImageView } from './ImageView';
import { createTextView } from './TextView';
import { createReactView } from './ReactView';
import { createStaticView } from './StaticView';
import { createTabContainerView } from './TabView';
import { WidgetMeta } from '@/class/Widget';

export interface CreationView {
  meta: WidgetMeta;
  element: HTMLElement;
  configurators: ConfiguratorMap;
  containers?: HTMLElement[];
}

export interface ConfiguratorMap {
  [key: string]: Configurator;
}

interface AttachViewDataParams {
  meta?: WidgetMeta;
  parent: Element;
  element: HTMLElement;
  configurators: ConfiguratorMap;
  containers?: HTMLElement[];
}

// FIXME 框架组件里的容器元素需要特殊处理

export function attachViewData({
  parent,
  element,
  meta,
  configurators,
  containers,
}: AttachViewDataParams): ViewData {
  const vd = new ViewData({
    element: element as HTMLElement,
    configurators,
    meta,
    containers,
  });
  // vd.insertSelfToParent(parent);
  return vd;
}

export const viewTypeMap = new Map([
  [1, createBaseView],
  [2, createTextView],
  [3, createImageView],
  [4, createReactView],
  [5, createStaticView],
  [6, createTabContainerView],
]);
