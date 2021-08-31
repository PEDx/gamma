import { uuid } from './utils';
import { LayoutMode } from './types';
import { IConfiguratorMap, IElementMeta } from './GammaElement';
import { ViewDataContainer } from './ViewDataContainer';
import { ViewDataSnapshot } from './ViewDataSnapshot';
import { Originator } from './Originator';
import { ViewDataHelper } from './ViewDataHelper';
import { Collection } from './Collection';
import { remove } from './utils';

export const VIEWDATA_DATA_TAG = 'gammaElement';

export interface IViewDataParams {
  id?: string;
  element: HTMLElement;
  meta: IElementMeta;
  configurators: IConfiguratorMap | null;
  containerElements?: HTMLElement[];
}

type ViewDataContainerId = string;

export const viewDataHelper = new ViewDataHelper();

export class ViewData implements Originator {
  static collection = new Collection<ViewData>(); // FIXME 当前运行时中有多个 root 的情况需要考虑多个 collection
  readonly id: string;
  readonly meta: IElementMeta;
  readonly mode: LayoutMode = LayoutMode.LongPage;
  readonly isRoot: boolean = false;
  readonly isLayout: boolean = false;
  readonly element: HTMLElement; // 可插入到外部容器的元素
  readonly configurators: IConfiguratorMap = {}; // 不保证声明顺序，但在此场景下可用
  readonly containers: ViewDataContainerId[] = []; // 对外的容器元素
  public index: number = 0;
  public suspend: boolean = false; // 知否是游离的 viewdata
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

    this.id = id || `${uuid()}`;

    this.element.dataset[VIEWDATA_DATA_TAG] = this.id;

    this.configurators = {
      ...configurators,
    };

    ViewData.collection.addItem(this);

    const elements = containerElements ? containerElements : [element];
    /**
     * 组件有初始化的内部容器
     */
    elements.forEach((element, idx) => {
      this.addContainer(idx, element);
    });
  }
  callConfiguratorsNotify() {
    Promise.resolve().then(() => {
      Object.values(this.configurators).forEach((configurator) =>
        configurator.notify(),
      );
    });
  }
  /**
   * 动态添加容器
   * @param index 容器排序
   * @param element 容器对应的 dom 元素
   * @returns
   */
  addContainer(index: number, element: HTMLElement) {
    const id = this.containers[index];
    if (id) {
      const container = ViewDataContainer.collection.getItemByID(id);
      if (container) container.attachElement(element);
      return container;
    }
    const viewDataContainer = new ViewDataContainer({
      element,
      parent: this.id,
    });
    this.containers.push(viewDataContainer.id);
    return viewDataContainer;
  }
  removeContainer(index: number) {
    const id = this.containers[index];
    if (!id) return;
    remove(this.containers, id);
    const container = ViewDataContainer.collection.getItemByID(id);
    if (!container) return;
    console.log(container);

    ViewDataContainer.collection.removeItem(container);
  }
  setParent(containerId: ViewDataContainerId) {
    this.parent = containerId;
  }
  getParent(): ViewDataContainerId {
    return this.parent;
  }
  isHidden() {
    return this.element.offsetParent === null;
  }
  save() {
    return viewDataHelper.save(this);
  }
  restore(snapshot: ViewDataSnapshot) {
    return viewDataHelper.restore(this, snapshot);
  }
}
