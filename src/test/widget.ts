import { ConfiguratorValueType, IConfigurator } from './Configurator';

const blackImage =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

export function createBox(): [HTMLElement, IConfigurator[]] {
  const element = document.createElement('DIV');
  element.classList.add('m-box');
  return [
    element,
    [
      {
        type: ConfiguratorValueType.Number,
        name: 'width',
        lable: '宽度',
        value: 100,
      },
      {
        type: ConfiguratorValueType.Number,
        name: 'height',
        lable: '宽度',
        value: 100,
      },
      {
        type: ConfiguratorValueType.Number,
        name: 'x',
        lable: 'X坐标',
        value: 0,
      },
      {
        type: ConfiguratorValueType.Number,
        name: 'y',
        lable: 'Y坐标',
        value: 0,
      },
    ],
  ];
}
export function createText(): [HTMLElement, IConfigurator[]] {
  const [element, configurators] = createBox();
  element.classList.add('m-box-text');
  element.textContent = '请输入文字';
  return [
    element,
    [
      {
        type: ConfiguratorValueType.Text,
        name: 'text',
        lable: '文字',
        value: 'hello world',
      },
      ...configurators,
    ],
  ];
}
export function createImage(): [HTMLElement, IConfigurator[]] {
  const [outElement, configurators] = createBox();
  const element = document.createElement('IMG') as HTMLImageElement;
  element.classList.add('m-box-image');
  element.src = blackImage;
  outElement.appendChild(element);
  return [
    outElement,
    [
      {
        type: ConfiguratorValueType.Text,
        name: 'src',
        lable: '图片路径',
        value: blackImage,
      },
      ...configurators,
    ],
  ];
}
