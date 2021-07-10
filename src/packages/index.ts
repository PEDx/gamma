import { createBaseView } from './BaseView';
import { createImageView } from './ImageView';
import { createTextView } from './TextView';
import { createReactView } from './ReactView';
import { createStaticView } from './StaticView';
import { createTabContainerView } from './TabView';

// TODO 框架组件里的容器元素需要特殊处理

export const viewTypeMap = new Map([
  ['gamma-base-view-widget', createBaseView],
  ['gamma-text-view-widget', createTextView],
  ['gamma-image-view-widget', createImageView],
  ['gamma-react-widget', createReactView],
  ['gamma-static-view-widget', createStaticView],
  ['gamma-tab-container-view-widget', createTabContainerView],
]);

export const asyncViewTypeMap = new Map<string, Promise<any>>([
  ['gamma-base-view-widget', import('./BaseView')],
  ['gamma-text-view-widget', import('./TextView')],
  ['gamma-image-view-widget', import('./ImageView')],
  ['gamma-static-view-widget', import('./StaticView')],
]);

