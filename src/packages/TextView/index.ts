import {
  ConfiguratorValueType,
  createConfigurator,
} from '@/class/Configurator';
import { CreationView } from '@/packages';
import { WidgetType } from '@/class/Widget';
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

  const font = createConfigurator({
    type: ConfiguratorValueType.Font,
    name: 'font',
    lable: '文字设置',
    value: '',
  }).attachEffect((value) => {
    // element.textContent = value as string;
    console.log(value);

  });

  return {
    meta,
    element: outElement,
    configurators: { ...configurators, text, font },
  };
}
