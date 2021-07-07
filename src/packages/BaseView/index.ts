import {
  ConfiguratorValueType,
  createConfigurator,
} from '@/class/Configurator';
import { createConfiguratorGroup } from '@/class/ConfiguratorGroup';
import { CreationView } from '@/packages';
import { WidgetType } from '@/class/Widget';

// TODO 构建到文件，各个编辑组件以怎样的形式存在
// TODO 各个组件的版本管理问题

const meta = {
  id: 'gamma-base-view-widget',
  name: '空盒子',
  icon: '',
  type: WidgetType.DOM,
};

export function createBaseView(): CreationView {
  const element = document.createElement('DIV');

  element.style.setProperty('position', `absolute`);
  element.style.setProperty('top', `0`);
  element.style.setProperty('left', `0`);

  const width = createConfigurator({
    type: ConfiguratorValueType.Width,
    name: 'width',
    lable: 'W',
    value: 100,
  }).attachEffect((value) => {
    element.style.setProperty('width', `${value}px`);
  });

  // TODO 此处需要处理单位
  // TODO 1.多分辨率适配

  const height = createConfigurator({
    type: ConfiguratorValueType.Height,
    name: 'height',
    lable: 'H',
    value: 100,
  }).attachEffect((value) => {
    element.style.setProperty('height', `${value}px`);
  });

  const x = createConfigurator({
    type: ConfiguratorValueType.X,
    name: 'x',
    lable: 'X',
    value: 0,
  }).attachEffect();

  const y = createConfigurator({
    type: ConfiguratorValueType.Y,
    name: 'y',
    lable: 'Y',
    value: 0,
  }).attachEffect();

  createConfiguratorGroup({ x, y }).attachEffect(({ x, y }) => {
    element.style.setProperty('transform', `translate3d(${x}px, ${y}px, 0px)`);
  });

  const configurators = { width, height, x, y };

  return {
    meta,
    element,
    configurators,
  };
}
