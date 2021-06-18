import { ConfiguratorValueType, Configurator } from '@/class/Configurator';
import { createBaseView } from '../BaseView';
import { CreationView } from '@/packages';
import { WidgetType } from '@/class/Widget';

const blackImage =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

const meta = {
  id: 'gamma-image-view-widget',
  name: '文字',
  icon: '',
  type: WidgetType.DOM,
};

export function createImageView(): CreationView {
  const { element: outElement, configurators } = createBaseView();
  const element = document.createElement('IMG') as HTMLImageElement;
  element.style.setProperty('width', `100%`);
  element.style.setProperty('height', `100%`);
  element.style.setProperty('display', `block`);
  outElement.appendChild(element);

  const imageNatural = {
    width: 50,
    height: 50,
  };

  element.addEventListener('load', () => {
    imageNatural.width = element.naturalWidth;
    imageNatural.width = element.naturalHeight;
  });

  const src = new Configurator({
    type: ConfiguratorValueType.Resource,
    name: 'src',
    lable: '图片资源',
    value: blackImage,
    effect: (value) => {
      element.src = value as string;
    },
  });

  return {
    meta,
    element: outElement,
    configurators: { ...configurators, src },
  };
}
