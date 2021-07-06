import { RootViewData } from '@/class/ViewData/RootViewData';
import { ViewData } from '@/class/ViewData/ViewData';
import { ViewDataContainer } from '@/class/ViewData/ViewDataContainer';
import { IViewDataSnapshotMap } from '@/class/ViewData/ViewDataCollection';
import { viewTypeMap } from '@/packages';
import { find } from 'lodash';
import { ViewDataSnapshot } from '@/class/ViewData/ViewDataSnapshot';

interface RenderParams {
  target: RootViewData;
}

export class Render {
  target: RootViewData;
  template: string;
  constructor({ target }: RenderParams) {
    this.template = target.element.innerHTML;
    this.target = target;
  }
  initViewData(data: ViewDataSnapshot) {
    const id = data.meta!.id;
    const createView = viewTypeMap.get(id);
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
  clearTarget() {
    const collection = ViewData.collection;
    collection.removeAll();
    this.target.element.innerHTML = '';
  }
  render(renderData: IViewDataSnapshotMap) {
    const root = find(renderData, (val) => !!val.isRoot);
    Object.keys(this.target.configurators).forEach((key) => {
      this.target.configurators[key].value = root?.configurators[key];
    });
    this.target.initViewByConfigurators();
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
    walk(root, this.target);
  }
}
