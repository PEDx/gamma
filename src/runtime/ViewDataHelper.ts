import { ConfiguratorMap } from '@/runtime/CreationView';
import { ViewDataSnapshot } from '@/runtime/ViewDataSnapshot';
import { isNil } from 'lodash';
import { PickConfiguratorValueTypeMap } from '@/runtime/Configurator';
import { ViewData } from '@/runtime/ViewData';
import { ViewDataContainer } from '@/runtime/ViewDataContainer';

export class ViewDataHelper {
  save(viewData: ViewData) {
    const configuratorValueMap: PickConfiguratorValueTypeMap<ConfiguratorMap> =
      {};
    Object.keys(viewData.configurators).forEach((key) => {
      const configurator = viewData.configurators[key];
      configuratorValueMap[key] = configurator.save();
    });
    return new ViewDataSnapshot({
      meta: viewData.meta,
      isRoot: viewData.isRoot,
      isLayout: viewData.isLayout,
      index: viewData.index,
      configurators: configuratorValueMap,
      containers: viewData.containers.map((c) => c.children),
    });
  }
  restore(viewData: ViewData, snapshot: ViewDataSnapshot) {
    if (!snapshot) return;
    Object.keys(viewData.configurators).forEach((key) => {
      const value = snapshot.configurators[key]; // 此处做值检查，不要为 undfined null NaN
      if (isNil(value)) return;
      const configurator = viewData.configurators[key];
      configurator.restore(value);
    });
  }
  add(viewData: ViewData | null, containerId: string) {
    if (!viewData) return;
    const container = ViewDataContainer.collection.getItemByID(containerId);
    container?.addViewData(viewData);
  }
  remove(viewData: ViewData | null) {
    if (!viewData) return;
    const parentContainer = ViewDataContainer.collection.getItemByID(
      viewData.getParent(),
    );
    parentContainer?.remove(viewData);
  }
  getViewDataByID(viewDataId: string) {
    return ViewData.collection.getItemByID(viewDataId);
  }
}
