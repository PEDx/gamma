import { LayoutViewData } from '@/runtime/LayoutViewData';
import { ViewData } from '@/runtime/ViewData';
import { ViewDataContainer } from '@/runtime/ViewDataContainer';
import { IViewDataSnapshotMap } from '@/runtime/ViewDataCollection';
import { ViewDataSnapshot } from '@/runtime/ViewDataSnapshot';
import { CreationView } from '@/runtime/CreationView';
import { RootViewData } from '@/runtime/RootViewData';
import { getDefualtLayout, createLayoutDiv } from '@/runtime/LayoutViewData';
import { isEmpty } from 'lodash';

interface IRenderParams {
  target?: LayoutViewData;
  root?: RootViewData;
  widgetMap: Map<string, () => CreationView>
}

export class Render {
  target?: LayoutViewData;
  root?: RootViewData;
  widgetMap: Map<string, () => CreationView>;
  constructor({ target, root, widgetMap }: IRenderParams) {
    this.target = target;
    this.root = root;
    this.widgetMap = widgetMap;
  }
  initViewData(data: ViewDataSnapshot) {
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
  addLayoutView(data: ViewDataSnapshot, parent: Element) {
    const layoutViewData = new LayoutViewData({
      element: createLayoutDiv(),
    });
    layoutViewData.restore(data);
    parent.appendChild(layoutViewData.element);
    return layoutViewData;
  }
  renderToRoot(renderData: IViewDataSnapshotMap) {
    const rootRenderData = Object.values(renderData)
      .filter((data) => {
        if (data.isLayout) return data;
      })
      .sort((a, b) => a.index! - b.index!);

    if (isEmpty(rootRenderData)) {
      rootRenderData.push(getDefualtLayout());
    }
    rootRenderData.forEach((data) => {
      const layoutViewData = this.addLayoutView(data, this.root!.element);
      layoutViewData.restore(data)
      if (!renderData) return;
      this.renderToLayout(layoutViewData, data, renderData);
    });
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
  render(rootData: ViewDataSnapshot, renderData: IViewDataSnapshotMap) {
  }
}
