import {
  ConfiguratorValueType,
  createConfigurator,
} from '@/class/Configurator';
import { CreationView } from '@/packages';
import { WidgetType } from '@/class/Widget';
import { FontConfig } from "@/configurator/FontConfig";
import { createBaseView } from '../BaseView';


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

  outElement.appendChild(element);

  const text = createConfigurator({
    type: ConfiguratorValueType.Text,
    name: 'text',
    lable: '文字内容',
    value: 'hello world',
  }).attachEffect((value) => {
    element.textContent = value as string;
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
      vertical: 'top',
    },
  }).attachEffect((value) => {
    // element.textContent = value as string;

  });

  return {
    meta,
    element: outElement,
    configurators: { ...configurators, text, font },
  };
}
