import { ConcreteObserver } from '@/class/Observer';
import { ConfiguratorUnion } from '@/class/ConfiguratorUnion';
import { ConfiguratorValueType, Configurator } from '@/class/Configurator';
import { CreationView } from '@/packages';
import { WidgetType } from '@/class/Widget';

// TODO 构建到文件，各个编辑组件以怎样的形式存在

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

  const width = new Configurator({
    type: ConfiguratorValueType.Width,
    name: 'width',
    lable: '宽度',
    value: 100,
  });

  // TODO 此处需要处理单位
  // TODO 1.多分辨率适配

  width.attach(
    new ConcreteObserver<Configurator>(({ value }) => {
      element.style.setProperty('width', `${value}px`);
    }),
  );

  const height = new Configurator({
    type: ConfiguratorValueType.Height,
    name: 'height',
    lable: '高度',
    value: 100,
    effect: (value) => {
      element.style.setProperty('height', `${value}px`);
    },
  });

  const x = new Configurator({
    type: ConfiguratorValueType.X,
    name: 'x',
    lable: 'X坐标',
    value: 0,
    effect: (value, { y }) => {
      element.style.setProperty(
        'transform',
        `translate3d(${value}px, ${y.value}px, 0px)`,
      );
    },
  });

  const y = new Configurator({
    type: ConfiguratorValueType.Y,
    name: 'y',
    lable: 'Y坐标',
    value: 0,
    effect: (value, { x }) => {
      element.style.setProperty(
        'transform',
        `translate3d(${x.value}px, ${value}px, 0px)`,
      );
    },
  });

  x.link({ y });
  y.link({ x });

  const configurators = { width, height, x, y };

  return {
    meta,
    element,
    configurators,
  };
}
