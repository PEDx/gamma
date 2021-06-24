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

// FIXME 框架组件里的容器元素需要特殊处理

export const viewTypeMap = new Map([
  ['gamma-base-view-widget', createBaseView],
  ['gamma-text-view-widget', createTextView],
  ['gamma-image-view-widget', createImageView],
  ['gamma-react-widget', createReactView],
  ['gamma-static-view-widget', createStaticView],
  ['gamma-tab-container-view-widget', createTabContainerView],
]);
