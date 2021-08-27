import { ViewData, viewDataHelper } from './ViewData';
import { uuid, remove, isEmpty } from './utils';
import { Collection } from './Collection';

export const CONTAINER_DATA_TAG = 'gammaContainer';

interface ViewDataContainerParams {
  element?: HTMLElement;
  parent: ViewDataId;
}

type ViewDataId = string;

export class ViewDataContainer {
  static collection = new Collection<ViewDataContainer>();
  readonly id: string = `${uuid()}`;
  private element: HTMLElement | null = null;
  readonly parent: ViewDataId;
  readonly children: ViewDataId[] = [];
  constructor({ element, parent }: ViewDataContainerParams) {
    this.parent = parent;
    if (element) this.attachElement(element);
    ViewDataContainer.collection.addItem(this);
  }
  /**
   * 容器实例有可能是未与 dom 产生连接的
   * @param element
   */
  attachElement(element: HTMLElement) {
    this.element = element;
    if (!viewDataHelper.isViewDataElement(element)) {
      this.element.style.setProperty('position', 'relative');
    }
    this.element.dataset[CONTAINER_DATA_TAG] = this.id;
    this.children.forEach((id) => {
      const viewData = viewDataHelper.getViewDataByID(id);
      if (!viewData) return;
      this.element?.appendChild(viewData.element);
    });
  }
  getElement() {
    return this.element;
  }
  addViewData(viewData: ViewData) {
    if (this.children.includes(viewData.id)) return;
    this.children.push(viewData.id);
    this.element?.appendChild(viewData.element);
    viewData.setParent(this.id);
  }
  remove(viewData: ViewData) {
    if (!this.children.includes(viewData.id)) return;
    remove(this.children, viewData.id);
    this.element?.removeChild(viewData.element);
  }
  static getViewDataContainerByElement(node: HTMLElement) {
    if (!node || !node.dataset) return null;
    const id = node.dataset[CONTAINER_DATA_TAG] || '';
    if (!id) return null;
    return ViewDataContainer.collection.getItemByID(id);
  }
  static findContainer(node: HTMLElement) {
    let _node: HTMLElement | null = node;
    while (!this.isViewDataContainer(_node) && _node) {
      _node = _node?.parentElement;
    }
    if (!_node) return null;
    return this.getViewDataContainerByElement(_node);
  }
  static isViewDataContainer(node: HTMLElement | null) {
    if (!node || !node.dataset) return false;
    const isContainer = node.dataset[CONTAINER_DATA_TAG] || '';
    return !!isContainer;
  }
}
