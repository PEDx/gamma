import { Collection } from './Collection';
import { CONTAINER_DATA_TAG } from './ViewDataContainer';
import type { ViewDataContainer } from './ViewDataContainer';

export class ViewDataContainerCollection extends Collection<ViewDataContainer> {
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
    return this.getViewDataContainerByElement(_node);
  }
  isViewDataContainer(node: HTMLElement | null) {
    if (!node || !node.dataset) return false;
    const isContainer = node.dataset[CONTAINER_DATA_TAG] || '';
    return !!isContainer;
  }
}
