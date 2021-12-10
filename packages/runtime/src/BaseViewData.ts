import {
  ConfiguratorValueType,
  ElementType,
  createConfigurator,
  IElementMeta,
} from '@gamma/runtime';

export const meta: IElementMeta = {
  id: '@gamma-element/base-box',
  name: '基础盒子',
  icon: '',
  type: ElementType.Element,
};

export function createWidgetBaseBox(node: HTMLElement) {
  const element = node || document.createElement('DIV');

  element.style.setProperty('position', `absolute`);
  element.style.setProperty('top', `0`);
  element.style.setProperty('left', `0`);
  element.style.setProperty('overflow', `hidden`);
  element.style.setProperty('box-sizing', `border-box`);

  const width = createConfigurator({
    type: ConfiguratorValueType.Width,
    lable: 'W',
    value: 100,
  }).attachEffect((value) => {
    element.style.setProperty('width', `${value}px`);
  });

  const height = createConfigurator({
    type: ConfiguratorValueType.Height,
    lable: 'H',
    value: 100,
  }).attachEffect((value) => {
    element.style.setProperty('height', `${value}px`);
  });

  const x = createConfigurator({
    type: ConfiguratorValueType.X,
    lable: 'X',
    value: 0,
  }).attachEffect(() => {
    updatePosition();
  });

  const y = createConfigurator({
    type: ConfiguratorValueType.Y,
    lable: 'Y',
    value: 0,
  }).attachEffect(() => {
    updatePosition();
  });

  const zIndex = createConfigurator({
    type: ConfiguratorValueType.Number,
    lable: '层级',
    value: 0,
  }).attachEffect((value) => {
    element.style.setProperty('z-index', `${value}`);
  });

  const borderRadius = createConfigurator({
    type: ConfiguratorValueType.Border,
    lable: '边框',
    value: {
      borderWidth: 0,
      borderRadius: 0,
      borderStyle: 'none',
      borderColor: {
        r: 241,
        g: 112,
        b: 19,
        a: 1,
      },
    },
  }).attachEffect((border) => {
    const borderStr = `${border.borderWidth}px ${border.borderStyle} rgba(${border.borderColor.r}, ${border.borderColor.g}, ${border.borderColor.b}, ${border.borderColor.a})`;
    element.style.setProperty('border', borderStr);
    element.style.setProperty('border-radius', `${border.borderRadius}px`);
  });

  const updatePosition = () => {
    element.style.setProperty(
      'transform',
      `translate3d(${x.value}px, ${y.value}px, 0px)`,
    );
  };

  return {
    element,
    configurators: { width, height, x, y, zIndex, borderRadius },
  };
}
