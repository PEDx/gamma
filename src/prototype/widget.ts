import { ViewData } from '@/class/ViewData';
import { ConcreteObserver } from '@/class/Observer';
import { ConfiguratorValueType, Configurator } from '@/class/Configurator';

const blackImage =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

export function createBox(): [HTMLElement, Configurator[]] {
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

export function createText(): [HTMLElement, Configurator[]] {
  const [outElement, configurators] = createBox();
  const element = document.createElement('SPAN') as HTMLSpanElement;
  element.style.setProperty('color', `#f3f`);
  const text = new Configurator({
    type: ConfiguratorValueType.Text,
    name: 'text',
    lable: '文字',
    value: 'hello world',
  });
  outElement.appendChild(element);
  text.attach(
    new ConcreteObserver<Configurator>(({ value }) => {
      element.textContent = value as string;
    }),
  );
  return [outElement, [...configurators, text]];
}

export function createImage(): [HTMLElement, Configurator[]] {
  const [outElement, configurators] = createBox();
  const element = document.createElement('IMG') as HTMLImageElement;
  element.style.setProperty('width', `100%`);
  element.style.setProperty('height', `100%`);
  element.style.setProperty('display', `block`);
  element.classList.add('m-box-image');
  outElement.appendChild(element);
  return [
    outElement,
    [
      ...configurators,
      new Configurator({
        type: ConfiguratorValueType.Text,
        name: 'src',
        lable: '图片路径',
        value: blackImage,
        effect: (value) => {
          element.src = value as string;
        },
      }),
    ],
  ];
}

export function attachViewData(
  container: Element,
  element: HTMLElement,
  configurators: Configurator[],
): ViewData {
  container?.appendChild(element);
  const vd = new ViewData({ element: element as HTMLElement, configurators });
  return vd;
}
