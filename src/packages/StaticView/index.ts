import {
  ConfiguratorValueType,
  createConfigurator,
} from '@/runtime/Configurator';
import { CreationView, WidgetType } from '@/runtime/CreationView';
const meta = {
  id: 'gamma-static-view-widget',
  name: '文字',
  icon: '',
  type: WidgetType.DOM,
};

export function createStaticView(): CreationView {
  const element = document.createElement('DIV') as HTMLSpanElement;
  element.style.setProperty('width', `100px`);
  element.style.setProperty('height', `100px`);
  element.style.setProperty('position', `absolute`);
  element.style.setProperty('top', `0`);
  element.style.setProperty('left', `0`);

  const text = createConfigurator({
    type: ConfiguratorValueType.Text,
    name: 'text',
    lable: '文字',
    value: 'hello world',
  }).attachEffect((value) => {
    element.textContent = value as string;
  });

  const x = createConfigurator({
    type: ConfiguratorValueType.X,
    name: 'x',
    lable: 'X坐标',
    value: 0,
  }).attachEffect((value) => {
    element.style.setProperty(
      'transform',
      `translate3d(${value}px, 0px, 0px)`,
    );
  });

  const height = createConfigurator({
    type: ConfiguratorValueType.Height,
    name: 'height',
    lable: '高度',
    value: 100,
  }).attachEffect((value) => {
    element.style.setProperty('height', `${value}px`);
  });

  return {
    meta,
    element,
    configurators: { text, height, x },
  };
}
