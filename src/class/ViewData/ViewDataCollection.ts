import { Collection } from '@/class/Collection';
import { ViewData } from './index';


export class ViewDataCollection extends Collection<ViewData> {
  getViewDataByElement(node: HTMLElement) {
    const id = node.dataset.id || '';
    return this.getItemByID(id);
  }
  isViewDataElement(node: HTMLElement | null) {
    if (!node)
      return false;
    return !!this.getViewDataByElement(node);
  }
  findViewData(node: HTMLElement) {
    let _node: HTMLElement | null = node;
    while (!this.isViewDataElement(_node) && _node) {
      _node = _node?.parentElement;
    }
    if (!_node)
      return null;
    return this.getViewDataByElement(_node);
  }
}
