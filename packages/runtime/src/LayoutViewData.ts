import { ViewData } from './ViewData';
import { ConfiguratorValueType, createConfigurator } from './Configurator';
import { WidgetMeta } from './CreationView';
import { ConfiguratorMap } from './CreationView';
import { ViewDataSnapshot } from './ViewDataSnapshot';
import { WidgetType } from './CreationView';
import { LayoutMode } from './LayoutMode';

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
    isRoot: false,
    mode: LayoutMode.LongPage,
    index: 0,
    configurators: {},
    containers: [[]],
  });

export const createLayoutDiv = () => {
  const element = document.createElement('DIV');
  element.style.setProperty('position', 'relative');
  element.style.setProperty('overflow', 'hidden');
  element.className = 'gamma-layout-view';
  return element;
};

const HeightKeyMap: { [key: string]: string } = {
  min: 'min-height',
  max: 'max-height',
  fixed: 'height',
};

const DEFAULT_MULT_PAGE_HEIGHT = 812;
const DEFAULT_LONG_PAGE_LAYOUT_HEIGHT = 256;

const setHeight = ({
  element,
  key,
  value,
}: {
  element: HTMLElement;
  key: string;
  value: number;
}) => {
  Object.values(HeightKeyMap).forEach((name) => {
    element.style.setProperty(name, ``);
  });
  element.style.setProperty(HeightKeyMap[key], `${value}px`);
};

interface ILayoutViewDataParams {
  element: HTMLElement;
  meta?: WidgetMeta;
  mode?: LayoutMode;
}

function getLayoutConfigurators(element: HTMLElement, mode: LayoutMode) {
  let defaultHeight = DEFAULT_LONG_PAGE_LAYOUT_HEIGHT;
  let hMode = 'fixed';
  const configurators: ConfiguratorMap = {};

  const isMultPage = mode === LayoutMode.MultPage;
  const isLongPage = mode === LayoutMode.LongPage;
  if (isMultPage) {
    defaultHeight = DEFAULT_MULT_PAGE_HEIGHT;
  }
  const height = createConfigurator({
    type: ConfiguratorValueType.Height,
    lable: '高度',
    value: defaultHeight,
  }).attachEffect((value) => {
    if (isMultPage) return;
    setHeight({ element, key: hMode, value });
  });
  const heightMode = createConfigurator({
    type: ConfiguratorValueType.Select,
    lable: '高度模式',
    value: hMode,
  }).attachEffect((value) => {
    hMode = value;
    height.notify();
  });
  heightMode.setConfig<ISelectOption[]>([
    {
      value: 'fixed',
      label: '固定高度',
    },
    {
      value: 'min',
      label: '最小高度',
    },
  ]);
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
    element.style.setProperty(
      'background-color',
      `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
    );
  });

  configurators['backgroundColor'] = backgroundColor;
  if (isLongPage) {
    configurators['height'] = height;
    configurators['heightMode'] = heightMode;
  } else {
    setHeight({ element, key: 'fixed', value: defaultHeight });
  }

  return configurators;
}

export class LayoutViewData extends ViewData {
  override readonly isLayout: boolean = true;
  isLast: boolean = false;
  readonly mode: LayoutMode;
  constructor({ element, mode = LayoutMode.LongPage }: ILayoutViewDataParams) {
    super({
      element,
      configurators: getLayoutConfigurators(element, mode),
      meta,
    });
    this.mode = mode;
  }

  setIndex(idx: number) {
    this.index = idx;
  }
  getIndex() {
    return this.index;
  }
}

export const createLayoutViewData = (mode: LayoutMode) =>
  new LayoutViewData({
    mode,
    element: createLayoutDiv(),
  });
