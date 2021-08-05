import {
  createConfigurator,
  ConfiguratorValueType,
} from '@/runtime/Configurator';
import { CreationView, WidgetType } from '@/runtime/CreationView';
import { Descendant } from 'slate';
import { createBaseView } from '../BaseView';

const meta = {
  id: 'gamma-rich-text-view-widget',
  name: '富文本',
  icon: '',
  type: WidgetType.DOM,
};

interface IRichTextEditorData {
  json: Descendant[];
  html: string;
}

export function createRichTextView(): CreationView {
  const { element, configurators } = createBaseView();

  const contentText = createConfigurator<IRichTextEditorData>({
    type: ConfiguratorValueType.RichText,
    lable: '富文本编辑',
    value: {
      json: [],
      html: '',
    },
  }).attachEffect((value) => {
    element.innerHTML = value.html;
    (element.children[0] as HTMLElement).contentEditable = 'false';
  });

  return {
    meta,
    element,
    configurators: { ...configurators, contentText },
  };
}
