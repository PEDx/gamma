import {
  ConfiguratorValueType,
  createConfigurator,
} from '@/runtime/Configurator';
import { createBaseView } from '@/packages/BaseView';
import { CreationView, WidgetType } from '@/runtime/CreationView';
import { Resource } from '@/runtime/Resource';

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
    ratio: 0,
  };

  element.addEventListener('load', () => {
    imageNatural.width = element.naturalWidth;
    imageNatural.height = element.naturalHeight;
    imageNatural.ratio = element.naturalWidth / element.naturalHeight;
    aspectRatio.setValue(imageNatural.ratio);
  });

  const src = createConfigurator({
    type: ConfiguratorValueType.Resource,
    lable: '图片资源',
    // 需要注意： 本地数据反序列化后 value 就不是 Resource 类型，而是普通对象
    value: new Resource({
      type: 'image',
      url: blackImage,
      name: 'blackImage.png',
    }),
  }).attachEffect((value) => {
    element.src = value.url;
  });

  const fitMode = createConfigurator({
    type: ConfiguratorValueType.Select,
    lable: '填充模式',
    value: 'none',
  }).attachEffect((value) => {
    element.style.setProperty('object-fit', value);
  });
  fitMode.setConfig<ISelectOption[]>([
    {
      value: 'none',
      label: '原始',
    },
    {
      value: 'fill',
      label: '铺满',
    },
    {
      value: 'contain',
      label: '填充',
    },
    {
      value: 'cover',
      label: '覆盖',
    },
    {
      value: 'scale-down',
      label: '自动',
    },
  ]);

  const { width, height } = configurators;

  const aspectRatio = createConfigurator({
    type: ConfiguratorValueType.Number,
    value: 0,
    hidden: true,
  });

  const lockAspect = createConfigurator({
    type: ConfiguratorValueType.Boolean,
    lable: '原始比例锁定',
    value: false,
  }).attachEffect((value) => {
    console.log('原始比例锁定');

    width.setConfig({
      aspectRatio: value ? aspectRatio.value : 0,
    });
    aspectRatio.setValue(imageNatural.ratio);

    if (value) {
      console.log(Math.round(width.value / imageNatural.ratio));

      height.setValue(Math.round(width.value / imageNatural.ratio));
    }
  });

  return {
    meta,
    element: outElement,
    configurators: {
      ...configurators,
      src,
      fitMode,
      lockAspect,
      aspectRatio,
    },
  };
}
