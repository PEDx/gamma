import { ViewData, viewDataHelper, ViewDataType } from './ViewData';
import { ConfiguratorValueType, createConfigurator } from './Configurator';
import { IElementMeta, IConfiguratorMap, ElementType } from './GammaElement';
import { LayoutViewDataSnapshot } from './Snapshot';
import { ISelectOption, LayoutMode } from './types';
import { ViewDataContainer } from './ViewDataContainer';
import { RuntimeElement } from './RuntimeElement';

export const meta = {
  id: '@layout-container',
  name: '布局容器',
  icon: '',
  type: ElementType.Element,
};

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
const DEFAULT_PENDANT_PAGE_LAYOUT_HEIGHT = 300;

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
  id?: string;
  element: HTMLElement;
  meta?: IElementMeta;
  mode?: LayoutMode;
}

function getLayoutConfigurators(element: HTMLElement, mode: LayoutMode) {
  let defaultHeight = DEFAULT_LONG_PAGE_LAYOUT_HEIGHT;
  let hMode = 'fixed';
  const configurators: IConfiguratorMap = {};

  const isMultPage = mode === LayoutMode.MultPage;
  const isLongPage = mode === LayoutMode.LongPage;
  const isPendant = mode === LayoutMode.Pendant;
  if (isMultPage) {
    defaultHeight = DEFAULT_MULT_PAGE_HEIGHT;
  }
  if (isPendant) {
    defaultHeight = DEFAULT_PENDANT_PAGE_LAYOUT_HEIGHT;
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

  if (isLongPage) {
    configurators['height'] = height;
    configurators['heightMode'] = heightMode;
  } else {
    setHeight({ element, key: 'fixed', value: defaultHeight });
  }

  if (isPendant) {
    configurators['height'] = height;
  }

  configurators['backgroundColor'] = backgroundColor;

  return configurators;
}

export function getLastLayoutViewDataIndex() {
  const collections = RuntimeElement.collection.getCollection();
  let count = 0;
  Object.values(collections).forEach((node) => {
    if ((<LayoutViewData>node).type === ViewDataType.Layout)
      count = Math.max((<LayoutViewData>node).index, count);
  });
  return count;
}

export class LayoutViewData extends ViewData {
  override readonly type = ViewDataType.Layout;
  public index: number = 0;
  constructor({
    element,
    mode = LayoutMode.LongPage,
    id,
  }: ILayoutViewDataParams) {
    super({
      id,
      element,
      configurators: getLayoutConfigurators(element, mode),
      meta,
    });
    this.index = getLastLayoutViewDataIndex();
  }
  override save() {
    return new LayoutViewDataSnapshot({
      id: this.id,
      index: this.index,
      meta: this.meta,
      configurators: this.getConfiguratorsValue(),
      containers: this.containers.map(
        (id) => ViewDataContainer.collection.getItemByID(id)!.children,
      ),
    });
  }
  override restore(snapshot: LayoutViewDataSnapshot) {
    viewDataHelper.restore(this, snapshot);
    this.index = snapshot.index;
  }
}

export const createLayoutViewData = (mode: LayoutMode, id?: string) =>
  new LayoutViewData({
    id,
    mode,
    element: createLayoutDiv(),
  });
