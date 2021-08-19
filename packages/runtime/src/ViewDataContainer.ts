import { ViewData } from './ViewData';
import { uuid, remove, isEmpty } from './utils';
import { ViewDataContainerCollection } from './ViewDataContainerCollection';
import { viewDataHelper } from './ViewData';

export const CONTAINER_DATA_TAG = 'gammaContainer';

interface ViewDataContainerParams {
  element: HTMLElement;
  parent: ViewDataId;
}

type ViewDataId = string;

export class ViewDataContainer {
  static collection = new ViewDataContainerCollection();
  static suspendViewDataIdsMap: { [key: string]: string[] | undefined } = {};
  static haveSuspendViewData = false;
  readonly id: string = `${uuid()}`;
  readonly element: HTMLElement;
  readonly parent: ViewDataId;
  readonly children: ViewDataId[] = [];
  constructor({ element, parent }: ViewDataContainerParams) {
    this.element = element;
    this.parent = parent;
    if (!ViewData.collection.isViewDataElement(element)) {
      this.element.style.setProperty('position', 'relative');
    }
    element.dataset[CONTAINER_DATA_TAG] = this.id;
    ViewDataContainer.collection.addItem(this);
    this.initViewDataContainer(); // 检查挂起的 viewdata, 如果此时其父容器已经创建就插入
  }
  initViewDataContainer() {
    const parentViewData = viewDataHelper.getViewDataByID(this.parent);
    if (!parentViewData) return;
    const { containers, id } = parentViewData;
    const containerIdx = containers.length;
    const containerId = `${id}${containerIdx}`;
    const suspendViewDataIds =
      ViewDataContainer.suspendViewDataIdsMap[containerId];

    if (suspendViewDataIds && suspendViewDataIds.length) {
      suspendViewDataIds.forEach((viewDataId) => {
        const viewData = viewDataHelper.getViewDataByID(viewDataId);
        if (!viewData) return;
        setTimeout(() => {
          this.addViewData(viewData);
        });
      });
      delete ViewDataContainer.suspendViewDataIdsMap[containerId];
    }
    parentViewData.containers.push(this);
    if (
      ViewDataContainer.haveSuspendViewData &&
      isEmpty(ViewDataContainer.suspendViewDataIdsMap)
    ) {
      ViewDataContainer.haveSuspendViewData = false;
    }
  }
  addViewData(viewData: ViewData) {
    if (this.children.includes(viewData.id)) return;
    this.children.push(viewData.id);
    this.element.appendChild(viewData.element);
    viewData.setParent(this.id);
  }
  remove(viewData: ViewData) {
    if (!this.children.includes(viewData.id)) return;
    remove(this.children, viewData.id);
    this.element.removeChild(viewData.element);
  }
  // 挂起未能渲染的 ViewData 等待未来某个时间, 容器被实例化
  static suspendViewData(
    viewData: ViewData,
    parentViewDataId: string,
    index: number,
  ) {
    ViewDataContainer.haveSuspendViewData = true;
    const id = `${parentViewDataId}${index}`;
    const list = ViewDataContainer.suspendViewDataIdsMap[id];
    if (!list) {
      ViewDataContainer.suspendViewDataIdsMap[id] = [];
    }
    ViewDataContainer.suspendViewDataIdsMap[id]!.push(viewData.id);
  }
}
