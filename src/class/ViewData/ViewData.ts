import { getRandomStr } from '@/utils';
import { Configurator, ConfiguratorValueType } from '@/class/Configurator';
import { ConfiguratorMap } from '@/packages';
import { ViewDataCollection } from './ViewDataCollection';
import { ViewDataContainer } from './ViewDataContainer';
import { WidgetMeta } from '@/class/Widget';
import { ViewDataSnapshot } from '@/class/ViewData/ViewDataSnapshot';
import { PickConfiguratorValueTypeMap } from '../ConfiguratorGroup';
import { Originator } from '@/class/Memento/Originator';

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
  static collection = new ViewDataCollection();
  readonly id: string;
  readonly isRoot: boolean = false;
  readonly meta?: WidgetMeta;
  readonly element: HTMLElement; // 可插入到外部容器的元素
  readonly containers: ViewDataContainer[] = []; // 对外的容器元素
  readonly configurators: ConfiguratorMap = {}; // 不保证声明顺序，但在此场景下可用
  readonly editableConfigurators: EditableConfigurators = {};
  private parentContainerId: ViewDataContainerId = '';

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
    _containers.forEach((container) => {
      new ViewDataContainer({ element: container, parentViewData: this });
    });
    ViewData.collection.addItem(this);
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
  initViewByConfigurators() {
    Promise.resolve().then(() => {
      Object.values(this.configurators).forEach((configurator) =>
        configurator.notify(),
      );
    })
  }
  setParentContainerId(containerId: ViewDataContainerId) {
    this.parentContainerId = containerId;
  }
  getParentContainerId(): ViewDataContainerId {
    return this.parentContainerId;
  }
  removeSelfFromParentContainer() {
    const parentContainer = ViewDataContainer.collection.getItemByID(this.parentContainerId)
    parentContainer?.removeViewData(this);
  }
  isHidden() {
    return (this.element.offsetParent === null);
  }
  save() {
    const configuratorValueMap: PickConfiguratorValueTypeMap<ConfiguratorMap> = {};
    Object.keys(this.configurators).forEach((key) => {
      const configurator = this.configurators[key];
      configuratorValueMap[key] = configurator.value;
    });
    return new ViewDataSnapshot({
      meta: this.meta,
      isRoot: this.isRoot,
      configurators: configuratorValueMap,
      containers: this.containers.map((c) => c.children)
    })
  }
  restore(snapshot: ViewDataSnapshot) {
    Object.keys(this.configurators).forEach((key) => {
      this.configurators[key].value = snapshot.configurators[key];
    });
    this.initViewByConfigurators()
  }
}
