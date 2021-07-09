import { RootViewData } from '@/class/ViewData/RootViewData';
import { ViewData } from '@/class/ViewData/ViewData';
import { ViewDataContainer } from '@/class/ViewData/ViewDataContainer';
import { IViewDataSnapshotMap } from '@/class/ViewData/ViewDataCollection';
import { asyncViewTypeMap } from '@/packages';
import { ViewDataSnapshot } from '@/class/ViewData/ViewDataSnapshot';

interface RenderParams {
  target: RootViewData;
}

export class AsyncRender {
  target: RootViewData;
  constructor({ target }: RenderParams) {
    this.target = target;
  }
  async initViewData(data: ViewDataSnapshot) {
    const id = data.meta!.id;
    const createView = asyncViewTypeMap.get(id);

    if (!createView) return;

    const viewModule = await createView
    const viewName = Object.keys(viewModule)[0] || ''

    const _createView = viewModule[viewName]

    const { element, configurators, containers, meta } = _createView();
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
          this.initViewData(child).then(vd => {
            if (!vd) return;
            if (!container) {
              ViewDataContainer.suspendViewData(vd, parentViewData.id, idx);
            } else {
              container?.addViewData(vd);
            }
            walk(child, vd);
          });

        });
      });
    };
    walk(rootData, this.target);
  }
}
