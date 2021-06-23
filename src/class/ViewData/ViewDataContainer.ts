import { Collection } from '@/class/Collection';
import { ViewData } from './index';
import { remove } from 'lodash';
import { getRandomStr } from '@/utils';

interface ViewDataContainerParams {
  element: HTMLElement;
}

class ViewDataContainerCollection extends Collection<ViewDataContainer> {
  getViewDataContainerByElement(node: HTMLElement) {
    if (!node || !node.dataset) return null;
    const id = node.dataset.containerId || '';
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
    const isContainer = node.dataset.isContainer || '';
    return !!isContainer;
  }
}

export class ViewDataContainer {
  static collection = new ViewDataContainerCollection();
  id: string = `viewdatacontainer_${getRandomStr(10)}`;
  element: HTMLElement;
  child: ViewData[] = [];
  constructor({ element }: ViewDataContainerParams) {
    this.element = element;
    element.dataset.isContainer = 'true';
    element.dataset.containerId = this.id;
    ViewDataContainer.collection.addItem(this);
  }
  addViewData(viewData: ViewData) {
    this.child.push(viewData);
    this.element.appendChild(viewData.element);
    viewData.setParentContainer(this);
  }
  removeViewData(viewData: ViewData) {
    remove(this.child, (val) => {
      return val.id === viewData.id;
    });
    console.log(this.child);

    this.element.removeChild(viewData.element);
    viewData.setParentContainer(null);
  }
}
