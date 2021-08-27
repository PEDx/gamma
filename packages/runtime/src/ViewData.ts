import { uuid } from './utils';
import { LayoutMode } from './types';
import { IConfiguratorMap, IElementMeta } from './GammaElement';
import { ViewDataContainer } from './ViewDataContainer';
import { ViewDataSnapshot } from './ViewDataSnapshot';
import { Originator } from './Originator';
import { ViewDataHelper } from './ViewDataHelper';
import { ConfiguratorValueType, createConfigurator } from './Configurator';
import { Collection } from './Collection';
import { remove } from 'lodash';

export const VIEWDATA_DATA_TAG = 'gammaElement';

export interface IViewDataParams {
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
  public containers: ViewDataContainerId[] = []; // 对外的容器元素
  public name: string = '';
  public index: number = 0;
  public suspend: boolean = false; // 知否是游离的 viewdata
  private parent: ViewDataContainerId = '';
  constructor({
    meta,
    element,
    configurators,
    containerElements,
  }: IViewDataParams) {
    this.element = element;
    this.meta = meta;

    this.id = `${uuid()}`;

    this.element.dataset[VIEWDATA_DATA_TAG] = this.id;

    const defaultName = `${meta.id}-${ViewData.collection.getLength()}`;

    this.configurators = {
      ...configurators,
      '$built-in-name': createConfigurator({
        type: ConfiguratorValueType.Text,
        lable: '$name',
        value: defaultName,
        config: {
          readOnly: true,
        },
      }).attachEffect((value) => {
        this.name = value;
      }),
    };

    ViewData.collection.addItem(this);

    const elements = containerElements ? containerElements : [element];

    elements.forEach((element, idx) => {
      const container = this.addContainer(idx);
      if (container) container.attachElement(element);
    });
  }
  callConfiguratorsNotify() {
    Promise.resolve().then(() => {
      Object.values(this.configurators).forEach((configurator) =>
        configurator.notify(),
      );
    });
  }
  addContainer(index: number) {
    const id = this.containers[index];
    if (id) {
      const container = ViewDataContainer.collection.getItemByID(id);
      return container;
    }
    const viewDataContainer = new ViewDataContainer({
      parent: this.id,
    });
    this.containers.push(viewDataContainer.id);
    return viewDataContainer;
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
