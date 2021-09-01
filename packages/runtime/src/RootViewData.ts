import { ViewData, ViewDataType } from './ViewData';
import { ElementType } from './GammaElement';
import { createConfigurator, ConfiguratorValueType } from './Configurator';
import { LayoutMode } from './types';
import { ViewDataContainer } from './ViewDataContainer';
import { RootViewDataSnapshot } from './Snapshot';
import { RuntimeElement } from './RuntimeElement';

// 页面配置对象

interface IRootViewDataParams {
  id?: string;
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
  override readonly type = ViewDataType.Root;
  readonly mode: LayoutMode;
  constructor({
    id,
    element,
    mode = LayoutMode.LongPage,
  }: IRootViewDataParams) {
    super({
      id,
      meta,
      element,
      configurators: {
        title: createConfigurator({
          type: ConfiguratorValueType.Text,
          lable: '页面标题',
          value: 'gamma page',
        }).attachEffect((value) => {}),
        script: createConfigurator({
          type: ConfiguratorValueType.Script,
          lable: '脚本',
          value: '',
        }).attachEffect((scriptId) => {
          const script = RuntimeElement.collection.getItemByID(scriptId);
          console.log(script);
        }),
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
  override save() {
    return new RootViewDataSnapshot({
      id: this.id,
      mode: this.mode,
      meta: this.meta,
      configurators: this.getConfiguratorsValue(),
      containers: this.containers.map(
        (id) => ViewDataContainer.collection.getItemByID(id)!.children,
      ),
    });
  }
}