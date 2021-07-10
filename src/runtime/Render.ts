import { LayoutViewData } from '@/runtime/LayoutViewData';
import { ViewData } from '@/runtime/ViewData';
import { ViewDataContainer } from '@/runtime/ViewDataContainer';
import { IViewDataSnapshotMap } from '@/runtime/ViewDataCollection';
import { ViewDataSnapshot } from '@/runtime/ViewDataSnapshot';
import { CreationView } from '@/runtime/CreationView';

interface RenderParams {
  target: LayoutViewData;
  widgetMap: Map<string, () => CreationView>
}

export class Render {
  target: LayoutViewData;
  widgetMap: Map<string, () => CreationView>;
  constructor({ target, widgetMap }: RenderParams) {
    this.target = target;
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
  render(rootData: ViewDataSnapshot, renderData: IViewDataSnapshotMap) {
    this.target.restore(rootData)
    const walk = (
      root: ViewDataSnapshot | undefined,
      parentViewData: ViewData,
    ) => {
      if (!root) return;
      const containers = root.containers;
      containers?.forEach((children, idx) => {
        const container = parentViewData.containers[idx];
        children.forEach((id) => {
          const child = renderData[id];
          const vd = this.initViewData(child);
          if (!vd) return;
          if (!container) {
            ViewDataContainer.suspendViewData(vd, parentViewData.id, idx);
          } else {
            container?.addViewData(vd);
          }
          walk(child, vd);
        });
      });
    };
    walk(rootData, this.target);
  }
}
