import { createBaseView } from './BaseView';
import { createImageView } from './ImageView';
import { createTextView } from './TextView';
import { createTabContainerView } from './TabView';
import { createButtonView } from './ButtonView';
import { createRichTextView } from './RichTextView';

// TODO 组件在编辑模式和运行时的注册
// TODO 编辑时倾向于做成异步加载，提升编辑器启动速度
// TODO 页面运行时需要一次构建过程将页面所需的所有组件全部打包到文件中
// TODO 各个组件的版本管理问题（采用 monorepo，单个组件做成 npm 包发布）
// TODO Configurator 配置组件也需要传入可配置参数

export const viewTypeMap = new Map([
  ['gamma-base-view-widget', createBaseView],
  ['gamma-button-view-widget', createButtonView],
  ['gamma-text-view-widget', createTextView],
  ['gamma-rich-text-view-widget', createRichTextView],
  ['gamma-image-view-widget', createImageView],
  ['gamma-tab-container-view-widget', createTabContainerView],
]);
