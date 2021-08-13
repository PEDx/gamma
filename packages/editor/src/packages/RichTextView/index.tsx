import {
  createConfigurator,
  ConfiguratorValueType,
} from '@gamma/runtime';
import { CreationView, WidgetType } from '@gamma/runtime';
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
  element.style.setProperty('overflow', 'auto');

  const contentText = createConfigurator<IRichTextEditorData>({
    type: ConfiguratorValueType.RichText,
    lable: '富文本编辑',
    value: {
      json: [],
      html: '',
    },
  }).attachEffect((value) => {
    element.innerHTML = value.html;
    if (!element.children[0]) return;
    (element.children[0] as HTMLElement).contentEditable = 'false';
  });

  return {
    meta,
    element,
    configurators: { ...configurators, contentText },
  };
}
