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

export function attachViewData(
  container: Element,
  element: HTMLElement,
  configurators: ConfiguratorMap,
  containers?: HTMLElement[],
): ViewData {
  const vd = new ViewData({
    element: element as HTMLElement,
    configurators,
    containers,
  });
  vd.insertSelfToParent(container);
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
