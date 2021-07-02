import { Collection } from '@/class/Collection';
import { ViewData } from './ViewData';
import { find, remove } from 'lodash';
import { getRandomStr } from '@/utils';
import { ViewDataContainerCollection } from './ViewDataContainerCollection';
import { globalBus } from '@/class/Event';

export const CONTAINER_DATA_TAG = 'gammaContainer';

interface ViewDataContainerParams {
  element: HTMLElement;
  parentViewData: ViewData;
}

interface SuspendViewDataItem {
  id: string;
  viewData: ViewData;
  index: number;
}

type ViewDataId = string
export class ViewDataContainer {
  static collection = new ViewDataContainerCollection();
  static suspendViewDataCollection = new Collection<SuspendViewDataItem>();
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

    const containerIdx = parentViewData.containers.length;
    const suspendViewData =
      ViewDataContainer.suspendViewDataCollection.getItemByID(
        `${parentViewData.id}${containerIdx}`,
      );

    if (suspendViewData && containerIdx === suspendViewData.index) {
      setTimeout(() => {
        this.addViewData(suspendViewData.viewData);
        suspendViewData.viewData.initViewByConfigurators();
      });
      ViewDataContainer.suspendViewDataCollection.removeItem(suspendViewData);
    }

    this.parentViewData.containers.push(this);

    if (ViewDataContainer.haveSuspendViewData && ViewDataContainer.suspendViewDataCollection.isEmpty()) {
      ViewDataContainer.haveSuspendViewData = false
      setTimeout(() => {
        // FIXME 可能会有永远无法清空 suspendViewDataCollection 的情况，需要设置 viewport-render-end 事件超时
        globalBus.emit('viewport-render-end');
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
    ViewDataContainer.suspendViewDataCollection.addItem({
      id: `${parentViewDataId}${index}`, // FIXME 容器内只有一个 viewdata
      viewData,
      index,
    });
  }
}
