import { Collection } from '@/class/Collection';
import { ViewData } from './index';
import { remove, snakeCase } from 'lodash';
import { getRandomStr } from '@/utils';

export const CONTAINER_DATA_TAG = 'gammaContainer';

interface ViewDataContainerParams {
  element: HTMLElement;
  parentViewData: ViewData;
}

class ViewDataContainerCollection extends Collection<ViewDataContainer> {
  getViewDataContainerByElement(node: HTMLElement) {
    if (!node || !node.dataset) return null;
    const id = node.dataset[CONTAINER_DATA_TAG] || '';
    if (!id) return null;
    return this.getItemByID(id);
  }
  findContainer(node: HTMLElement) {
    let _node: HTMLElement | null = node;
    while (!this.isViewDataContainer(_node) && _node) {
      _node = _node?.parentElement;
    }
    if (!_node) return null;
    return _node;
  }
  isViewDataContainer(node: HTMLElement | null) {
    if (!node || !node.dataset) return false;
    const isContainer = node.dataset[CONTAINER_DATA_TAG] || '';
    return !!isContainer;
  }
}

interface SuspendViewDataItem {
  id: string;
  viewData: ViewData;
  index: number;
}

export class ViewDataContainer {
  static collection = new ViewDataContainerCollection();
  static suspendViewDataCollection = new Collection<SuspendViewDataItem>();
  id: string = `C${getRandomStr(10)}`;
  element: HTMLElement;
  parentViewData: ViewData;
  private children: ViewData[] = [];
  constructor({ element, parentViewData }: ViewDataContainerParams) {
    this.element = element;
    this.parentViewData = parentViewData;
    element.dataset[CONTAINER_DATA_TAG] = this.id;
    ViewDataContainer.collection.addItem(this);

    const suspendViewData =
      ViewDataContainer.suspendViewDataCollection.getItemByID(
        parentViewData.id,
      );
    const len = parentViewData.containers.length;
    if (suspendViewData && len === suspendViewData.index) {
      setTimeout(() => {
        this.addViewData(suspendViewData.viewData);
        suspendViewData.viewData.initViewByConfigurators();
        ViewDataContainer.suspendViewDataCollection.removeItem(suspendViewData);
      });
    }

    this.parentViewData.containers.push(this);
  }
  addViewData(viewData: ViewData) {
    this.children.push(viewData);
    this.element.appendChild(viewData.element);
    viewData.setParentContainer(this);
  }
  removeViewData(viewData: ViewData) {
    remove(this.children, (val) => {
      return val.id === viewData.id;
    });
    console.log(this.children);

    this.element.removeChild(viewData.element);
    viewData.setParentContainer(null);
  }
  serialize() {
    return this.children.map((child) => child.id);
  }
  // 挂起未能渲染的 ViewData 等待未来某个时间容器被实例化
  static suspendViewData(
    viewData: ViewData,
    parentViewDataId: string,
    index: number,
  ) {
    ViewDataContainer.suspendViewDataCollection.addItem({
      id: parentViewDataId,
      viewData,
      index,
    });
  }
}
