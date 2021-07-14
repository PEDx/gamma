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
import { WidgetType } from '@/runtime/CreationView';

export const meta = {
  id: 'gamma-layout-container',
  name: '布局容器',
  icon: '',
  type: WidgetType.DOM,
};

export const getDefualtLayout = () =>
  new ViewDataSnapshot({
    meta: meta,
    isLayout: true,
    index: 1,
    configurators: {},
    containers: [[]],
  });

export const createLayoutDiv = () => {
  const element = document.createElement('DIV');
  element.style.setProperty('position', 'relative');
  element.style.setProperty('overflow', 'hidden');
  return element;
};


const HeightKeyMap: { [key: string]: string } = {
  min: 'min-height',
  max: 'max-height',
  fixed: 'height'
}

const DEFAULT_MULT_PAGE_HEIGHT = 812
const DEFAULT_LONG_PAGE_LAYOUT_HEIGHT = 500

enum LayoutMode {
  LongPage, // 长页面模式
  MultPage // 多页面模式
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


interface ILayoutViewDataParams {
  element: HTMLElement;
  meta?: WidgetMeta;
  mode?: LayoutMode
}

// TODO 布局组件里实现多容器，用以实现布局，以及流
export class LayoutViewData extends ViewData {
  override readonly isLayout: boolean = true;
  private index: number = 0
  isLast: boolean = false
  readonly mode: LayoutMode
  constructor({ element, meta, mode = LayoutMode.LongPage }: ILayoutViewDataParams) {

    let defaultHeight = DEFAULT_LONG_PAGE_LAYOUT_HEIGHT
    let hMode = 'fixed'
    const configurators: ConfiguratorMap = {}

    const isMultPage = mode === LayoutMode.MultPage
    const isLongPage = mode === LayoutMode.LongPage
    if (isMultPage) {
      defaultHeight = DEFAULT_MULT_PAGE_HEIGHT
    }
    const height = createConfigurator({
      type: ConfiguratorValueType.Height,
      lable: '高度',
      value: defaultHeight,
    }).attachEffect((value) => {
      if (isMultPage) return
      setHeight({ element, key: hMode, value })
    })
    const heightMode = createConfigurator({
      type: ConfiguratorValueType.Select,
      lable: '高度模式',
      value: hMode,
    }).attachEffect((value) => {
      hMode = value
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
    const backgroundColor = createConfigurator({
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
    })

    configurators['backgroundColor'] = backgroundColor
    if (isLongPage) {
      configurators['height'] = height
      configurators['heightMode'] = heightMode
    } else {
      setHeight({ element, key: 'fixed', value: defaultHeight })
    }

    super({
      element,
      configurators,
      meta
    });

    this.mode = mode
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
