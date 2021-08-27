import { ViewData } from './ViewData';
import { ElementType } from './GammaElement';
import { createConfigurator, ConfiguratorValueType } from './Configurator';
import { LayoutMode } from './types';
import { ViewDataContainer } from './ViewDataContainer';

// 页面配置对象

interface IRootViewDataParams {
  element: HTMLElement;
  mode?: LayoutMode;
}

const meta = {
  id: '@root-container',
  name: '根容器',
  icon: '',
  type: ElementType.Element,
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
   * 根元素只有唯一的容器，即它自己
   * @returns
   */
  getContainer() {
    const onlyContainerId = this.containers[0];
    if (!onlyContainerId) throw 'can not found root container';
    return ViewDataContainer.collection.getItemByID(onlyContainerId)!;
  }
}
