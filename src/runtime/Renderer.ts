import { LayoutViewData } from '@/runtime/LayoutViewData';
import { ViewData } from '@/runtime/ViewData';
import { ViewDataContainer } from '@/runtime/ViewDataContainer';
import { IViewDataSnapshotMap } from '@/runtime/ViewDataCollection';
import { ViewDataSnapshot } from '@/runtime/ViewDataSnapshot';
import { CreationView } from '@/runtime/CreationView';
import { RootViewData } from '@/runtime/RootViewData';
import {
  getDefualtLayout,
  createLayoutViewData,
} from '@/runtime/LayoutViewData';
import { isEmpty } from 'lodash';

interface IRendererParams {
  root: RootViewData;
  widgetSource: Map<string, () => CreationView>;
}

export class Renderer {
  root: RootViewData;
  widgetSource: Map<string, () => CreationView>;
  constructor({ root, widgetSource }: IRendererParams) {
    this.root = root;
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
  render(renderData: IViewDataSnapshotMap) {
    const renderDataList = Object.values(renderData);

    const rootRenderData = renderDataList.filter((data) => {
      if (data.isRoot) return data;
    })[0];

    const layoutRenderData = renderDataList
      .filter((data) => {
        if (data.isLayout) return data;
      })
      .sort((a, b) => a.index! - b.index!);

    this.root.restore(rootRenderData);

    const rootContainer = this.root.getContainer();

    // 保证所有 layout 一定会加入到 root 中
    if (isEmpty(layoutRenderData)) {
      layoutRenderData.push(getDefualtLayout());
    }
    layoutRenderData.forEach((data, idx) => {
      const layoutViewData = createLayoutViewData();
      layoutViewData.restore(data);
      layoutViewData.setIndex(idx);
      rootContainer.addViewData(layoutViewData);
      layoutViewData.restore(data);
      if (!renderData) return;
      this.renderToLayout(layoutViewData, data, renderData);
    });
  }
}
