import { ViewData } from '@/runtime/ViewData';
import { ViewDataContainer } from '@/runtime/ViewDataContainer';
import { IViewDataSnapshotMap } from '@/runtime/ViewDataCollection';
import { ViewDataSnapshot } from '@/runtime/ViewDataSnapshot';
import { CreationView } from '@/runtime/CreationView';
import { RootViewData } from '@/runtime/RootViewData';
import {
  getDefualtLayout,
  LayoutViewData,
  createLayoutViewData,
} from '@/runtime/LayoutViewData';
import { isEmpty } from 'lodash';
import { RenderData } from './RenderData';

export class Renderer {
  widgetSource: Map<string, () => CreationView>;
  /**
   * @param widgetSource 渲染组件的来源列表
   */
  constructor(widgetSource: Map<string, () => CreationView>) {
    this.widgetSource = widgetSource;
  }
  private initViewData(data: ViewDataSnapshot) {
    const id = data.meta!.id;
    const createView = this.widgetSource.get(id);
    if (!createView) return;
    const { element, configurators, containers, meta } = createView();
    const viewData = new ViewData({
      element,
      meta,
      configurators,
      containerElements: containers,
    });
    viewData.restore(data);

    return viewData;
  }
  renderToLayout(
    targetLayoutView: LayoutViewData,
    snapshot: ViewDataSnapshot,
    renderData: IViewDataSnapshotMap,
  ) {
    const walk = (
      snapshot: ViewDataSnapshot | undefined,
      parentViewData: ViewData,
    ) => {
      if (!snapshot) return;
      const containers = snapshot.containers;
      containers?.forEach((idList, idx) => {
        const container = parentViewData.containers[idx];
        idList.forEach((id) => {
          const viewDataSnapshot = renderData[id];
          const viewData = this.initViewData(viewDataSnapshot);
          if (!viewData) return;
          if (!container) {
            ViewDataContainer.suspendViewData(viewData, parentViewData.id, idx);
          } else {
            container?.addViewData(viewData);
          }
          walk(viewDataSnapshot, viewData);
        });
      });
    };
    walk(snapshot, targetLayoutView);
  }
  /**
   * 此方法会根据初始化的 dom 元素以及传入的渲染数据
   * 依次创建根组件，布局组件
   * @param renderData
   * @returns
   */
  render(rootViewData: RootViewData, renderData: RenderData) {
    /**
     * 获取根容器配置信息
     */
    const rootRenderData = renderData.getRootRenderData();

    /**
     * 获取布局容器配置信息
     */
    const layoutRenderData = renderData.getLayoutRenderData();

    if (rootRenderData) rootViewData.restore(rootRenderData);

    const rootContainer = rootViewData.getContainer();

    /**
     * 如果没有布局容器默认创建一个
     */
    if (isEmpty(layoutRenderData)) {
      layoutRenderData.push(getDefualtLayout());
    }

    /**
     * 保证所有 layout 一定会加入到 root 中
     */
    layoutRenderData.forEach((data, idx) => {
      const layoutViewData = createLayoutViewData(rootViewData.mode);
      layoutViewData.restore(data);
      layoutViewData.setIndex(idx);
      rootContainer.addViewData(layoutViewData);
      layoutViewData.restore(data);
      if (!renderData) return;
      this.renderToLayout(layoutViewData, data, renderData.getData());
    });
  }
}
