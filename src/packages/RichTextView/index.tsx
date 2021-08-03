import {
  createConfigurator,
  ConfiguratorValueType,
} from '@/runtime/Configurator';
import { CreationView, WidgetType } from '@/runtime/CreationView';
import { createBaseView } from '../BaseView';

const meta = {
  id: 'gamma-rich-text-view-widget',
  name: '富文本',
  icon: '',
  type: WidgetType.DOM,
};

export function createRichTextView(): CreationView {
  const { element, configurators } = createBaseView();

  const contentText = createConfigurator({
    type: ConfiguratorValueType.RichText,
    lable: '富文本编辑',
    value: '',
  }).attachEffect((value) => {
    console.log(value);
  });

  return {
    meta,
    element,
    configurators: { ...configurators, contentText },
  };
}
