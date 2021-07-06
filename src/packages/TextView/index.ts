import {
  ConfiguratorValueType,
  createConfigurator,
} from '@/class/Configurator';
import { CreationView } from '@/packages';
import { WidgetType } from '@/class/Widget';
import { FontConfig } from "@/configurator/FontConfig";
import { createBaseView } from '../BaseView';
import { RGBColor } from 'react-color';


const meta = {
  id: 'gamma-text-view-widget',
  name: '文字',
  icon: '',
  type: WidgetType.DOM,
};



export function createTextView(): CreationView {
  const { element: outElement, configurators } = createBaseView();
  const element = document.createElement('SPAN') as HTMLSpanElement;
  element.style.setProperty('color', `#f3f`);
  outElement.style.setProperty('display', `flex`);

  outElement.appendChild(element);

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
    if (!color) return
    element.style.setProperty('color', `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`)
  });

  const font = createConfigurator<FontConfig>({
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
      vertical: 'start',
    },
  }).attachEffect((font) => {
    const fontStr = `${font.fontWeight} ${font.fontSize}px/${font.lightHeight}px ${font.fontFamily}`
    element.style.setProperty('font', fontStr)
    element.style.setProperty('letter-spacing', `${font.letterSpace}px`)
    outElement.style.setProperty('align-items', font.vertical)
    outElement.style.setProperty('justify-content', font.align)
  });

  return {
    meta,
    element: outElement,
    configurators: { ...configurators, text, color, font, },
  };
}
