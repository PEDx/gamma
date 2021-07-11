import { ViewData } from '@/runtime/ViewData';
import { remove } from 'lodash';
import { getRandomStr } from '@/utils';
import { ViewDataContainerCollection } from '@/runtime/ViewDataContainerCollection';
import { globalBus } from '@/editor/core/Event';
import { SuspendViewDataCollection } from '@/runtime/SuspendViewDataCollection';

export const CONTAINER_DATA_TAG = 'gammaContainer';

interface ViewDataContainerParams {
  element: HTMLElement;
  parentViewData: ViewData;
}


type ViewDataId = string

export class ViewDataContainer {
  static collection = new ViewDataContainerCollection();
  static suspendViewDataCollection = new SuspendViewDataCollection();
  static haveSuspendViewData = false;
  id: string = `C${getRandomStr(10)}`;
  element: HTMLElement;
  parentViewData: ViewData;
  readonly children: ViewDataId[] = [];
  constructor({ element, parentViewData }: ViewDataContainerParams) {
    this.element = element;
    this.parentViewData = parentViewData;
    element.dataset[CONTAINER_DATA_TAG] = this.id;
    ViewDataContainer.collection.addItem(this);
    this.checkSuspendViewData() // 检查挂起的 viewdata, 如果此时其父容器已经创建就插入
  }
  checkSuspendViewData() {
    const { containers, id } = this.parentViewData
    const containerIdx = containers.length;
    const containerId = `${id}${containerIdx}`
    const suspendViewDataCollection =
      ViewDataContainer.suspendViewDataCollection.getViewDataCollectionByID(
        containerId,
      );
    if (suspendViewDataCollection.length) {
      suspendViewDataCollection.forEach(ViewData => {
        setTimeout(() => {
          this.addViewData(ViewData);
          ViewData.initViewByConfigurators();
        });
      })
      ViewDataContainer.suspendViewDataCollection.removeCollection(containerId);
    }
    this.parentViewData.containers.push(this);
    if (ViewDataContainer.haveSuspendViewData && ViewDataContainer.suspendViewDataCollection.isEmpty()) {
      ViewDataContainer.haveSuspendViewData = false
      setTimeout(() => {
        // FIXME 可能会有永远无法清空 suspendViewDataCollection 的情况。
        globalBus.emit('render-viewdata-tree');
      })
    }
  }
  addViewData(viewData: ViewData) {
    if (this.children.includes(viewData.id)) return
    this.children.push(viewData.id);
    this.element.appendChild(viewData.element);
    viewData.setParentContainerId(this.id);
  }
  removeViewData(viewData: ViewData) {
    if (!this.children.includes(viewData.id)) return
    remove(this.children, (id) => id === viewData.id);
    this.element.removeChild(viewData.element);
  }
  // 挂起未能渲染的 ViewData 等待未来某个时间容器被实例化
  static suspendViewData(
    viewData: ViewData,
    parentViewDataId: string,
    index: number,
  ) {
    ViewDataContainer.haveSuspendViewData = true
    ViewDataContainer.suspendViewDataCollection.addItemToCollection(`${parentViewDataId}${index}`, viewData);
  }
}
