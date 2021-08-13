import {
  ConfiguratorValueType,
  createConfigurator,
} from '@gamma/runtime';
import { CreationView, WidgetType } from '@gamma/runtime';
import { createBaseView } from '@/packages/BaseView';

const meta = {
  id: 'gamma-text-view-widget',
  name: '文字',
  icon: '',
  type: WidgetType.DOM,
};

export function createTextConfigurator(element: HTMLElement) {
  const text = createConfigurator({
    type: ConfiguratorValueType.Text,
    name: 'text',
    lable: '文字内容',
    value: 'hello world',
  }).attachEffect((value) => {
    element.textContent = value;
  });

  const color = createConfigurator<RGBColor>({
    type: ConfiguratorValueType.Color,
    name: 'color',
    lable: '文字顔色',
    value: {
      r: 241,
      g: 112,
      b: 19,
      a: 1,
    },
  }).attachEffect((color) => {
    if (!color) return;
    element.style.setProperty(
      'color',
      `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
    );
  });

  const font = createConfigurator({
    type: ConfiguratorValueType.Font,
    name: 'font',
    lable: '文字设置',
    value: {
      fontSize: 12,
      fontFamily: 'system-ui',
      lightHeight: 20,
      fontWeight: 'normal',
      letterSpace: 0,
      align: 'center',
      vertical: 'center',
    } as IFontConfig,
  }).attachEffect((font) => {
    if (!font) return;
    const fontStr = `${font.fontWeight} ${font.fontSize}px/${font.lightHeight}px ${font.fontFamily}`;
    element.style.setProperty('font', fontStr);
    element.style.setProperty('text-indent', `${font.letterSpace}px`);
    element.style.setProperty('letter-spacing', `${font.letterSpace}px`);
    element.style.setProperty('align-items', font.vertical);
    element.style.setProperty('justify-content', font.align);
  });
  return {
    element,
    text,
    color,
    font,
  };
}

export function createTextView(): CreationView {
  const { element: outElement, configurators } = createBaseView();

  const element = document.createElement('DIV') as HTMLDivElement;
  element.style.setProperty('color', `#f3f`);
  element.style.setProperty('width', '100%');
  element.style.setProperty('height', '100%');
  element.style.setProperty('display', `flex`);

  const { text, color, font } = createTextConfigurator(element);
  outElement.appendChild(element);
  return {
    meta,
    element: outElement,
    configurators: { ...configurators, text, color, font },
  };
}
