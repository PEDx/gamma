import { Collection } from '@/class/Collection';
import { ViewData } from './index';
import { find } from 'lodash';

export class ViewDataCollection extends Collection<ViewData> {
  getViewDataByElement(node: HTMLElement) {
    if (!node || !node.dataset) return null;
    const id = node.dataset.id || '';
    if (!id) return null;
    return this.getItemByID(id);
  }
  isViewDataElement(node: HTMLElement | null) {
    if (!node) return false;
    return !!this.getViewDataByElement(node);
  }
  findViewData(node: HTMLElement) {
    let _node: HTMLElement | null = node;
    while (!this.isViewDataElement(_node) && _node) {
      _node = _node?.parentElement;
    }
    if (!_node) return null;
    return this.getViewDataByElement(_node);
  }
  findContainer(node: HTMLElement) {
    const vd = this.findViewData(node);

    const container = find(vd?.containers, (cts) => cts === node);
    return container;
  }
}
