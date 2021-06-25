import {
  ConfiguratorValueType,
  createConfigurator,
} from '@/class/Configurator';
import { CreationView } from '@/packages';
import { WidgetType } from '@/class/Widget';
import { createBaseView } from '../BaseView';

var getRandomColor = function () {
  return (
    '#' + ('00000' + ((Math.random() * 0x1000000) << 0).toString(16)).substr(-6)
  );
};

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

  setInterval(() => {
    element.style.setProperty('color', getRandomColor());
  }, 2000);

  outElement.appendChild(element);

  const text = createConfigurator({
    type: ConfiguratorValueType.Text,
    name: 'text',
    lable: '文字',
    value: 'hello world',
  }).attachEffect((value) => {
    element.textContent = value as string;
  });

  return {
    meta,
    element: outElement,
    configurators: { ...configurators, text },
  };
}
