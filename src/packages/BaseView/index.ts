import {
  ConfiguratorValueType,
  createConfigurator,
} from '@/runtime/Configurator';
import { CreationView, WidgetType } from '@/runtime/CreationView';

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
  }).attachEffect(() => {
    updatePosition();
  });

  const y = createConfigurator({
    type: ConfiguratorValueType.Y,
    name: 'y',
    lable: 'Y',
    value: 0,
  }).attachEffect(() => {
    updatePosition();
  });

  const updatePosition = () => {
    element.style.setProperty(
      'transform',
      `translate3d(${x.value}px, ${y.value}px, 0px)`,
    );
  };

  const configurators = { width, height, x, y };

  return {
    meta,
    element,
    configurators,
  };
}
