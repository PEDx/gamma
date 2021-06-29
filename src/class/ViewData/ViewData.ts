import { getRandomStr } from '@/utils';
import { Configurator } from '@/class/Configurator';
import { ConfiguratorMap } from '@/packages';
import { ViewDataCollection } from './ViewDataCollection';
import { ViewDataContainer } from './ViewDataContainer';
import { WidgetMeta } from '@/class/Widget';
import { PickConfiguratorValueTypeMap } from '../ConfiguratorGroup';

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

export interface IViewStaticData {
  meta?: WidgetMeta;
  isRoot: boolean;
  configurators: PickConfiguratorValueTypeMap<any>;
  containers: string[][];
}

export class ViewData {
  static collection = new ViewDataCollection();
  readonly id: string;
  protected isRoot: boolean = false;
  readonly meta?: WidgetMeta;
  readonly element: HTMLElement; // 可插入到外部容器的元素
  readonly containers: ViewDataContainer[] = []; // 对外的容器元素
  private parentContainer: ViewDataContainer | null = null;

  // V8 里的对象其实维护两个属性，会把数字放入线性的 elements 属性中，并按照顺序存放。
  // 会把非数字的属性放入 properties 中，不会排序。
  // 遍历属性时先 elements 而后在 properties。
  readonly configurators: ConfiguratorMap = {}; // 不保证声明顺序，但在此场景下可用
  readonly editableConfigurators: EditableConfigurators = {};

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
  initViewByConfigurators() {
    Object.values(this.configurators).forEach((configurator) =>
      configurator.initValue(),
    );
  }
  setParentContainer(container: ViewDataContainer | null) {
    this.parentContainer = container;
  }
  removeSelfFromParentContainer() {
    this.parentContainer?.removeViewData(this);
    ViewData.collection.removeItem(this);
  }
  // 初始化可拖拽编辑的配置器;
  private _initEditableConfigurators() {
    this.editableConfigurators.x = this.configurators?.x;
    this.editableConfigurators.y = this.configurators?.y;
    this.editableConfigurators.width = this.configurators?.width;
    this.editableConfigurators.height = this.configurators?.height;
  }
  serialize(): IViewStaticData {
    const configuratorValueMap: PickConfiguratorValueTypeMap<any> = {};
    Object.keys(this.configurators).forEach((key) => {
      const configurator = this.configurators[key];
      configuratorValueMap[key] = configurator.value;
    });
    return {
      meta: this.meta,
      isRoot: this.isRoot,
      configurators: configuratorValueMap,
      containers: this.containers.map((c) => c.serialize()),
    };
  }
  getIsRoot() {
    return this.isRoot;
  }
}
