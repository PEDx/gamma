import { getRandomStr } from '@/utils';
import { Configurator, ConfiguratorValueType } from '@/runtime/Configurator';
import { ConfiguratorMap } from '@/runtime/CreationView';
import { ViewDataCollection } from '@/runtime/ViewDataCollection';
import { ViewDataContainer } from '@/runtime/ViewDataContainer';
import { WidgetMeta } from '@/runtime/CreationView';
import { ViewDataSnapshot } from '@/runtime/ViewDataSnapshot';
import { PickConfiguratorValueTypeMap } from '@/runtime/ConfiguratorGroup';
import { Originator } from '@/common/Memento/Originator';
import { isNil } from 'lodash';

export const VIEWDATA_DATA_TAG = 'gammaWidget';

export interface IViewDataParams {
  id?: string;
  element: HTMLElement;
  meta?: WidgetMeta;
  configurators: ConfiguratorMap | null;
  containerElements?: HTMLElement[];
}
interface EditableConfigurators {
  width?: Configurator<number>;
  height?: Configurator<number>;
  x?: Configurator<number>;
  y?: Configurator<number>;
}


type ViewDataContainerId = string

export class ViewData implements Originator {
  static collection = new ViewDataCollection(); // FIXME 当前运行时中有多个 root 的情况需要考虑多个 collection
  readonly id: string;
  readonly meta?: WidgetMeta;
  readonly element: HTMLElement; // 可插入到外部容器的元素
  readonly containers: ViewDataContainer[] = []; // 对外的容器元素
  readonly configurators: ConfiguratorMap = {}; // 不保证声明顺序，但在此场景下可用
  readonly editableConfigurators: EditableConfigurators = {};
  readonly isLayout: boolean = false;
  readonly isRoot: boolean = false;
  protected index: number = 0;
  private parent: ViewDataContainerId = '';
  constructor({
    id,
    meta,
    element,
    configurators,
    containerElements,
  }: IViewDataParams) {
    this.element = element;
    this.meta = meta;
    const _containers = containerElements ? containerElements : [element];
    this.configurators = configurators || {};
    this.id = id || `W${getRandomStr(10)}`;
    this.element.dataset[VIEWDATA_DATA_TAG] = this.id;
    ViewData.collection.addItem(this);
    _containers.forEach((container) => {
      new ViewDataContainer({ element: container, parent: this.id });
    });
    this._initEditableConfigurators();
  }
  // 初始化可拖拽编辑的配置器;
  private _initEditableConfigurators() {
    Object.values(this.configurators).forEach(configurator => {
      if (configurator.type === ConfiguratorValueType.X) this.editableConfigurators.x = configurator;
      if (configurator.type === ConfiguratorValueType.Y) this.editableConfigurators.y = configurator;
      if (configurator.type === ConfiguratorValueType.Width) this.editableConfigurators.width = configurator;
      if (configurator.type === ConfiguratorValueType.Height) this.editableConfigurators.height = configurator;
    })
  }
  configuratorsNotify() {
    Promise.resolve().then(() => {
      Object.values(this.configurators).forEach((configurator) =>
        configurator.notify(),
      );
    })
  }
  setParent(containerId: ViewDataContainerId) {
    this.parent = containerId;
  }
  getParent(): ViewDataContainerId {
    return this.parent;
  }
  remove() {
    const parentContainer = ViewDataContainer.collection.getItemByID(this.parent)
    parentContainer?.removeViewData(this);
  }
  isHidden() {
    return (this.element.offsetParent === null);
  }
  public save() {
    const configuratorValueMap: PickConfiguratorValueTypeMap<ConfiguratorMap> = {};
    Object.keys(this.configurators).forEach((key) => {
      const configurator = this.configurators[key];
      configuratorValueMap[key] = configurator.value;
    });
    return new ViewDataSnapshot({
      meta: this.meta,
      isRoot: this.isRoot,
      isLayout: this.isLayout,
      index: this.index,
      configurators: configuratorValueMap,
      containers: this.containers.map((c) => c.children)
    })
  }
  restore(snapshot: ViewDataSnapshot) {
    if(!snapshot) return
    Object.keys(this.configurators).forEach((key) => {
      const value = snapshot.configurators[key] // 此处做值检查，不要为 undfined null NaN
      if (isNil(value)) return
      this.configurators[key].value = snapshot.configurators[key];
    });
    this.configuratorsNotify()
  }
}
