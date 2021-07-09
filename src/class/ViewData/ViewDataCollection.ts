import { Collection } from '@/class/Collection';
import { RootViewData } from './RootViewData';
import { ViewData, VIEWDATA_DATA_TAG } from './ViewData';
import { ViewDataSnapshot } from './ViewDataSnapshot';

export interface IViewDataSnapshotMap {
  [key: string]: ViewDataSnapshot;
}

export class ViewDataCollection extends Collection<ViewData> {
  getViewDataByElement(node: HTMLElement) {
    if (!node || !node.dataset) return null;
    const id = node.dataset[VIEWDATA_DATA_TAG] || '';
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
  getSerializeCollection() {
    const collections = this.getCollection();
    const map: IViewDataSnapshotMap = {};
    Object.keys(collections).forEach((key) => {
      map[key] = collections[key].save();
    });
    return map;
  }
  getRootViewData() {
    const collections = this.getCollection();
    let rootArr: RootViewData[] = []
    Object.values(collections).forEach(val => {
      if (val.isRoot) rootArr.push(val as RootViewData)
    })
    return rootArr.sort((a, b) => a.getIndex() - b.getIndex())
  }
}
