import { LayoutViewData } from '@/runtime/LayoutViewData';
import { ViewData } from '@/runtime/ViewData';
import { ViewDataContainer } from '@/runtime/ViewDataContainer';
import { IViewDataSnapshotMap } from '@/runtime/ViewDataCollection';
import { ViewDataSnapshot } from '@/runtime/ViewDataSnapshot';
import { CreationView } from '@/runtime/CreationView';
import { RootViewData } from '@/runtime/RootViewData';
import { getDefualtLayout, createLayoutViewData } from '@/runtime/LayoutViewData';
import { isEmpty } from 'lodash';

interface IRenderParams {
  root: RootViewData;
  widgetMap: Map<string, () => CreationView>
}

export class Renderer {
  root: RootViewData;
  widgetMap: Map<string, () => CreationView>;
  constructor({ root, widgetMap }: IRenderParams) {
    this.root = root;
    this.widgetMap = widgetMap;
  }
  private initViewData(data: ViewDataSnapshot) {
    const id = data.meta!.id;
    const createView = this.widgetMap.get(id);
    if (!createView) return;
    const { element, configurators, containers, meta } = createView();
    const viewData = new ViewData({
      element,
      meta,
      configurators,
      containerElements: containers,
    });
    viewData.restore(data)

    return viewData;
  }
  private addLayoutView(data: ViewDataSnapshot, parent: Element) {
    const layoutViewData = createLayoutViewData()
    layoutViewData.restore(data);
    parent.appendChild(layoutViewData.element);
    return layoutViewData;
  }
  renderToLayout(targetLayoutView: LayoutViewData, snapshot: ViewDataSnapshot, renderData: IViewDataSnapshotMap) {
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
    const renderDataList = Object.values(renderData)

    const rootRenderData = renderDataList
      .filter((data) => {
        if (data.isRoot) return data;
      })[0]

    const layoutRenderData = renderDataList
      .filter((data) => {
        if (data.isLayout) return data;
      })
      .sort((a, b) => a.index! - b.index!);

    this.root.restore(rootRenderData)

    const rootContainer = this.root.containers[0]!

    if (isEmpty(layoutRenderData)) {
      layoutRenderData.push(getDefualtLayout());
    }
    layoutRenderData.forEach((data) => {
      const layoutViewData = this.addLayoutView(data, this.root!.element);
      rootContainer.addViewData(layoutViewData)
      layoutViewData.restore(data)
      if (!renderData) return;
      this.renderToLayout(layoutViewData, data, renderData);
    });
  }
}
