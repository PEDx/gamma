import { RootViewData } from '@/class/ViewData/RootViewData';
import { ViewData, IViewStaticData } from '@/class/ViewData/ViewData';
import { ViewDataContainer } from '@/class/ViewData/ViewDataContainer';
import { IViewStaticDataMap } from '@/class/ViewData/ViewDataCollection';
import { viewTypeMap } from '@/packages';
import { find } from 'lodash';

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
  initViewData(data: IViewStaticData) {
    const id = data.meta!.id;
    const configuratorsValue = data.configurators!;
    const createView = viewTypeMap.get(id);
    if (!createView) return;
    const { element, configurators, containers, meta } = createView();

    Object.keys(configurators).forEach((key) => {
      configurators[key].value = configuratorsValue[key];
    });

    const vd = new ViewData({
      element,
      meta,
      configurators,
      containerElements: containers,
    });

    return vd;
  }
  clearTarget() {
    const collection = ViewData.collection;
    collection.removeAll();
    this.target.element.innerHTML = '';
  }
  render(renderData: IViewStaticDataMap) {
    const root = find(renderData, (val) => !!val.isRoot);
    const walk = (
      root: IViewStaticData | undefined,
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
          // 有些组件的内部容器挂载到 dom 可能是异步的
          if (!container) {
            ViewDataContainer.suspendViewData(vd, parentViewData.id, idx);
            return;
          }
          container?.addViewData(vd);
          vd.initViewByConfigurators();
          walk(child, vd);
        });
      });
    };
    walk(root, this.target);
  }
}
