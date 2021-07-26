import {
  ConfiguratorValueType,
  createConfigurator,
} from '@/runtime/Configurator';
import { CreationView, WidgetType } from '@/runtime/CreationView';
import { createTextConfigurator } from '@/packages/TextView';
import { createBaseView } from '@/packages/BaseView';

const meta = {
  id: 'gamma-button-view-widget',
  name: '按钮',
  icon: '',
  type: WidgetType.DOM,
};

export function createButtonView(): CreationView {
  const { element: outElement, configurators } = createBaseView();
  const btnElement = document.createElement('DIV') as HTMLDivElement;
  btnElement.style.setProperty('display', 'flex');
  btnElement.style.setProperty('width', '100%');
  btnElement.style.setProperty('height', '100%');
  const { text, color, font } = createTextConfigurator(btnElement);

  outElement.appendChild(btnElement);

  const bgColor = createConfigurator<RGBColor>({
    type: ConfiguratorValueType.Color,
    name: 'color',
    lable: '背景顔色',
    value: {
      r: 241,
      g: 112,
      b: 19,
      a: 1,
    },
  }).attachEffect((color) => {
    if (!color) return;
    btnElement.style.setProperty(
      'background-color',
      `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
    );
  });

  return {
    meta,
    element: outElement,
    configurators: { ...configurators, text, color, font, bgColor },
  };
}
