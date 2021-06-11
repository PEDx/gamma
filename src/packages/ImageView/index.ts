import { ConfiguratorValueType, Configurator } from '@/class/Configurator';
import { createBaseView } from '../BaseView';
import { CreationView } from '@/packages';

const blackImage =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

export function createImageView(): CreationView {
  const [outElement, configurators] = createBaseView();
  const element = document.createElement('IMG') as HTMLImageElement;
  element.style.setProperty('width', `100%`);
  element.style.setProperty('height', `100%`);
  element.style.setProperty('display', `block`);
  element.classList.add('m-box-image');
  outElement.appendChild(element);

  const src = new Configurator({
    type: ConfiguratorValueType.Resource,
    name: 'src',
    lable: '图片资源',
    value: blackImage,
    effect: (value) => {
      element.src = value as string;
    },
  });

  return [outElement, [...configurators, src]];
}
