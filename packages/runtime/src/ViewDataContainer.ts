import { ViewData } from './ViewData';
import { remove } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { ViewDataContainerCollection } from './ViewDataContainerCollection';
import { SuspendViewDataCollection } from './SuspendViewDataCollection';

export const CONTAINER_DATA_TAG = 'gammaContainer';

interface ViewDataContainerParams {
  element: HTMLElement;
  parent: ViewDataId;
}

type ViewDataId = string;

export class ViewDataContainer {
  static collection = new ViewDataContainerCollection();
  static suspendViewDataCollection = new SuspendViewDataCollection();
  static haveSuspendViewData = false;
  readonly id: string = `C${uuidv4()}`;
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
    const parentViewData = ViewData.collection.getItemByID(this.parent);
    if (!parentViewData) return;
    const { containers, id } = parentViewData;
    const containerIdx = containers.length;
    const containerId = `${id}${containerIdx}`;
    const suspendViewDataCollection =
      ViewDataContainer.suspendViewDataCollection.getViewDataCollectionByID(
        containerId,
      );
    if (suspendViewDataCollection.length) {
      suspendViewDataCollection.forEach((ViewData) => {
        setTimeout(() => {
          this.addViewData(ViewData);
        });
      });
      ViewDataContainer.suspendViewDataCollection.removeCollection(containerId);
    }
    parentViewData.containers.push(this);
    if (
      ViewDataContainer.haveSuspendViewData &&
      ViewDataContainer.suspendViewDataCollection.isEmpty()
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
    remove(this.children, (id) => id === viewData.id);
    this.element.removeChild(viewData.element);
  }
  // 挂起未能渲染的 ViewData 等待未来某个时间, 容器被实例化
  static suspendViewData(
    viewData: ViewData,
    parentViewDataId: string,
    index: number,
  ) {
    ViewDataContainer.haveSuspendViewData = true;
    ViewDataContainer.suspendViewDataCollection.addItemToCollection(
      `${parentViewDataId}${index}`,
      viewData,
    );
  }
}
