import { ConcreteObserver } from '@/class/Observer';
import { ConfiguratorValueType, Configurator } from '@/class/Configurator';
import { ICreateView } from '@/packages';

export function createBaseView(): ICreateView {
  const element = document.createElement('DIV');
  element.classList.add('m-box');

  element.style.setProperty('position', `absolute`);
  element.style.setProperty('top', `0`);
  element.style.setProperty('left', `0`);

  const width = new Configurator({
    type: ConfiguratorValueType.Width,
    name: 'width',
    lable: '宽度',
    value: 100,
  });

  width.attach(
    new ConcreteObserver<Configurator>(({ value }) => {
      element.style.setProperty('width', `${value}px`);
    }),
  );

  const height = new Configurator({
    type: ConfiguratorValueType.Height,
    name: 'height',
    lable: '宽度',
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

  return [element, [width, height, x, y]];
}
