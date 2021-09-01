import { ViewDataSnapshot } from './Snapshot';
import { ViewData, VIEWDATA_DATA_TAG } from './ViewData';
import { ViewDataContainer } from './ViewDataContainer';
export class ViewDataHelper {
  save(viewData: ViewData) {
    return new ViewDataSnapshot({
      id: viewData.id,
      meta: viewData.meta,
      configurators: viewData.getConfiguratorsValue(),
      containers: viewData.containers.map(
        (id) => ViewDataContainer.collection.getItemByID(id)!.children,
      ),
    });
  }
  restore(viewData: ViewData, snapshot: ViewDataSnapshot) {
    if (!snapshot) return;
    viewData.restoreConfiguratorValue(snapshot);
    /**
     * 内部容器初始化
     */
    snapshot.containers.forEach((_, idx) => {
      if (viewData.containers[idx]) return; // 已经创建的容器
      const viewDataContainer = new ViewDataContainer({
        parent: viewData.id,
      });
      viewData.containers.push(viewDataContainer.id);
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
}
