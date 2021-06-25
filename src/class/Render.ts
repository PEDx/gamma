import { RootViewData } from '@/class/ViewData/RootViewData';
import { ViewData, IViewStaticData } from '@/class/ViewData';
import { ViewDataContainer } from '@/class/ViewData/ViewDataContainer';
import { IViewStaticDataMap } from '@/class/ViewData/ViewDataCollection';
import { viewTypeMap } from '@/packages';
import { find } from 'lodash';

interface RenderParams {
  rootViewData: RootViewData;
}

export class Render {
  rootViewData: RootViewData;
  template: string;
  constructor({ rootViewData }: RenderParams) {
    this.template = rootViewData.element.innerHTML;
    this.rootViewData = rootViewData;
  }
  initViewData(data: IViewStaticData) {
    const id = data.meta.id;
    const configuratorsValue = data.configurators;
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
  getRenderData() {
    return ViewData.collection.getSerializeCollection();
  }
  render(renderData: IViewStaticDataMap) {
    const root = find(renderData, (val) => !val.meta);

    const walk = (
      root: IViewStaticData | undefined,
      parentViewData: ViewData,
    ) => {
      if (!root) return;
      const containers = root.containers;
      containers.forEach((children, idx) => {
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
    walk(root, this.rootViewData);
  }
}
