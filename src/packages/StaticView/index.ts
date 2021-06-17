import { ConcreteObserver } from '@/class/Observer';
import { ConfiguratorValueType, Configurator } from '@/class/Configurator';
import { CreationView } from '@/packages';

export function createStaticView(): CreationView {
  const element = document.createElement('DIV') as HTMLSpanElement;
  element.style.setProperty('width', `100px`);
  element.style.setProperty('height', `100px`);
  element.style.setProperty('position', `absolute`);
  element.style.setProperty('top', `0`);
  element.style.setProperty('left', `0`);

  const text = new Configurator({
    type: ConfiguratorValueType.Text,
    name: 'text',
    lable: '文字',
    value: 'static view',
  });

  text.attach(
    new ConcreteObserver<Configurator>(({ value }) => {
      element.textContent = value as string;
    }),
  );

  const x = new Configurator({
    type: ConfiguratorValueType.X,
    name: 'x',
    lable: 'X坐标',
    value: 0,
    effect: (value) => {
      element.style.setProperty(
        'transform',
        `translate3d(${value}px, 0px, 0px)`,
      );
    },
  });

  const height = new Configurator({
    type: ConfiguratorValueType.Height,
    name: 'height',
    lable: '宽度',
    value: 100,
    effect: (value) => {
      element.style.setProperty('height', `${value}px`);
    },
  });

  return [element, [text, height, x]];
}
