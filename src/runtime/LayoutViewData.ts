import { ViewData } from '@/runtime/ViewData';
import {
  ConfiguratorValueType,
  createConfigurator,
} from '@/runtime/Configurator';
import { WidgetMeta } from '@/runtime/CreationView';
import { ConfiguratorMap } from '@/runtime/CreationView';
import { PickConfiguratorValueTypeMap } from '@/runtime/ConfiguratorGroup';
import { ViewDataSnapshot } from '@/runtime/ViewDataSnapshot';
import { ISelectOption } from '@/editor/configurator/Select';


const HeightKeyMap: { [key: string]: string } = {
  min: 'min-height',
  max: 'max-height',
  fixed: 'height'
}

const setHeight = ({
  element,
  key,
  value
}: {
  element: HTMLElement,
  key: string,
  value: number
}) => {
  Object.values(HeightKeyMap).forEach(name => {
    element.style.setProperty(name, ``);
  })
  element.style.setProperty(HeightKeyMap[key], `${value}px`);
}


// TODO 在根组件里实现多容器，用以实现布局，以及流
export class LayoutViewData extends ViewData {
  override readonly isLayout: boolean = true;
  private index: number = 0
  isLast: boolean = false
  constructor({ element, meta }: { element: HTMLElement, meta?: WidgetMeta }) {


    let mode = 'fixed'
    const height = createConfigurator({
      type: ConfiguratorValueType.Height,
      lable: '高度',
      value: 500,
    }).attachEffect((value) => {
      setHeight({ element: this.element, key: mode, value })
    })

    const heightMode = createConfigurator({
      type: ConfiguratorValueType.Select,
      lable: '高度模式',
      value: mode,
    }).attachEffect((value) => {
      mode = value
      height.notify()
    })

    heightMode.setConfig<ISelectOption[]>([
      {
        value: 'fixed',
        label: '固定高度'
      },
      {
        value: 'min',
        label: '最小高度'
      },
    ])

    super({
      element, configurators: {
        height,
        heightMode,
        backgroundColor: createConfigurator({
          type: ConfiguratorValueType.Color,
          lable: '背景颜色',
          value: {
            r: 255,
            g: 255,
            b: 255,
            a: 1,
          },
        }).attachEffect((color) => {
          element.style.setProperty('background-color', `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`)
        }),
      },
      meta
    });
  }
  override save() {
    const configuratorValueMap: PickConfiguratorValueTypeMap<ConfiguratorMap> = {};
    Object.keys(this.configurators).forEach((key) => {
      const configurator = this.configurators[key];
      configuratorValueMap[key] = configurator.value;
    });
    return new ViewDataSnapshot({
      meta: this.meta,
      isLayout: this.isLayout,
      index: this.index,
      configurators: configuratorValueMap,
      containers: this.containers.map((c) => c.children)
    })
  }
  override removeSelfFromParentContainer() {
    this.element.parentElement?.removeChild(this.element)
  }
  setIndex(idx: number) {
    this.index = idx
  }
  getIndex() {
    return this.index
  }
}
