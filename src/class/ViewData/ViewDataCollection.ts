import { Collection } from '@/class/Collection';
import { RootViewData } from './RootViewData';
import { ViewData, VIEWDATA_DATA_TAG, IViewStaticData } from './ViewData';

export interface IViewStaticDataMap {
  [key: string]: IViewStaticData;
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
    const map: IViewStaticDataMap = {};
    Object.keys(collections).forEach((key) => {
      map[key] = collections[key].serialize();
    });
    return map;
  }
  getRootViewData() {
    const collections = this.getCollection();
    let root: RootViewData | null = null
    Object.values(collections).forEach(val => {
      if (val.getIsRoot()) root = val as RootViewData
    })
    return root
  }
}
