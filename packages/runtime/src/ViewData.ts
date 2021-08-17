import { v4 as uuidv4 } from 'uuid';
import { ConfiguratorMap, IElementMeta } from './GammaElement';
import { ViewDataCollection } from './ViewDataCollection';
import { ViewDataContainer } from './ViewDataContainer';
import { ViewDataSnapshot } from './ViewDataSnapshot';
import { Originator } from './Originator';
import { ViewDataHelper } from './ViewDataHelper';
import { LayoutMode } from './LayoutMode';

export const VIEWDATA_DATA_TAG = 'gammaWidget';

export interface IViewDataParams {
  element: HTMLElement;
  meta: IElementMeta;
  configurators: ConfiguratorMap | null;
  containerElements?: HTMLElement[];
}

type ViewDataContainerId = string;

export const viewDataHelper = new ViewDataHelper();

export class ViewData implements Originator {
  static collection = new ViewDataCollection(); // FIXME 当前运行时中有多个 root 的情况需要考虑多个 collection
  readonly id: string;
  readonly meta: IElementMeta;
  readonly mode: LayoutMode = LayoutMode.LongPage;
  readonly isRoot: boolean = false;
  readonly isLayout: boolean = false;
  readonly element: HTMLElement; // 可插入到外部容器的元素
  readonly containers: ViewDataContainer[] = []; // 对外的容器元素
  readonly configurators: ConfiguratorMap = {}; // 不保证声明顺序，但在此场景下可用
  public index: number = 0;
  private parent: ViewDataContainerId = '';
  constructor({
    meta,
    element,
    configurators,
    containerElements,
  }: IViewDataParams) {
    this.element = element;
    this.meta = meta;

    this.id = `W${uuidv4()}`;
    this.element.dataset[VIEWDATA_DATA_TAG] = this.id;

    this.configurators = configurators || {};

    ViewData.collection.addItem(this);

    const containers = containerElements ? containerElements : [element];
    containers.forEach((container) => {
      new ViewDataContainer({ element: container, parent: this.id });
    });
  }
  callConfiguratorsNotify() {
    Promise.resolve().then(() => {
      Object.values(this.configurators).forEach((configurator) =>
        configurator.notify(),
      );
    });
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
