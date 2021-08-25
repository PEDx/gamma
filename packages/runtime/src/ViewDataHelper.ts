import { IConfiguratorMap } from './GammaElement';
import { ViewDataSnapshot } from './ViewDataSnapshot';
import { isNil } from './utils';
import { PickConfiguratorValueTypeMap } from './Configurator';
import { ViewData, VIEWDATA_DATA_TAG } from './ViewData';
import { ViewDataContainer } from './ViewDataContainer';

export interface IViewDataSnapshotMap {
  [key: string]: ViewDataSnapshot;
}
export class ViewDataHelper {
  save(viewData: ViewData) {
    const configuratorValueMap: PickConfiguratorValueTypeMap<IConfiguratorMap> =
      {};
    Object.keys(viewData.configurators).forEach((key) => {
      const configurator = viewData.configurators[key];
      configuratorValueMap[key] = configurator.save();
    });
    return new ViewDataSnapshot({
      meta: viewData.meta,
      isRoot: viewData.isRoot,
      isLayout: viewData.isLayout,
      mode: viewData.mode,
      index: viewData.index,
      configurators: configuratorValueMap,
      containers: viewData.containers.map((c) => c.children),
    });
  }
  restore(viewData: ViewData, snapshot: ViewDataSnapshot) {
    if (!snapshot) return;
    Object.keys(viewData.configurators).forEach((key) => {
      let value = snapshot.configurators[key]; // 此处做值检查，不要为 undfined null NaN
      const defualtValue = viewData.configurators[key].value;
      if (isNil(value)) {
        if (isNil(defualtValue)) return;
        value = defualtValue;
      }
      const configurator = viewData.configurators[key];

      configurator.restore(value);
    });
  }
  add(viewData: ViewData | null, containerId: string) {
    if (!viewData) return;
    viewData.suspend = false;
    const container = ViewDataContainer.collection.getItemByID(containerId);
    container?.addViewData(viewData);
  }
  remove(viewData: ViewData | null) {
    if (!viewData) return;
    viewData.suspend = true;
    const parentContainer = ViewDataContainer.collection.getItemByID(
      viewData.getParent(),
    );
    parentContainer?.remove(viewData);
  }
  getViewDataByID(viewDataId: string) {
    return ViewData.collection.getItemByID(viewDataId);
  }
  getViewDataByElement(node: HTMLElement) {
    if (!node || !node.dataset) return null;
    const id = node.dataset[VIEWDATA_DATA_TAG] || '';
    if (!id) return null;
    return this.getViewDataByID(id);
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
    const collections = ViewData.collection.getCollection();
    const map: IViewDataSnapshotMap = {};
    Object.keys(collections).forEach((key) => {
      const viewData = collections[key];
      if (viewData.suspend) return;
      map[key] = viewData.save();
    });
    return map;
  }
}
