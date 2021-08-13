import { ViewData } from './ViewData';
import { WidgetType } from './CreationView';
import { createConfigurator, ConfiguratorValueType } from './Configurator';
import { LayoutMode } from './LayoutMode';

// 页面配置对象

interface IRootViewDataParams {
  element: HTMLElement;
  mode?: LayoutMode;
}

const meta = {
  id: 'gamma-root-container',
  name: '根容器',
  icon: '',
  type: WidgetType.DOM,
};

export class RootViewData extends ViewData {
  override readonly isRoot: boolean = true;
  readonly mode: LayoutMode;
  constructor({ element, mode = LayoutMode.LongPage }: IRootViewDataParams) {
    super({
      meta,
      element,
      configurators: {
        title: createConfigurator({
          type: ConfiguratorValueType.Text,
          lable: '页面标题',
          value: 'gamma page',
        }).attachEffect((value) => {}),
      },
    });
    this.mode = mode;
  }
  /**
   * 根元素有只有唯一的容器，即它自己
   * @returns
   */
  getContainer() {
    const onlyContainer = this.containers[0];
    if (!onlyContainer) throw 'can not found root container';
    return onlyContainer;
  }
}
