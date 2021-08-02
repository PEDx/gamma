import { IViewDataSnapshotMap } from '@/runtime/ViewDataCollection';
import { storage } from '@/utils';
import { ViewDataSnapshot } from '@/runtime/ViewDataSnapshot';
import { isEmpty } from 'lodash';

export class RenderData {
  private data: IViewDataSnapshotMap = {} as IViewDataSnapshotMap;
  constructor() {
    this.data = this.getLocalRenderData();
  }
  getLocalRenderData() {
    return storage.get<IViewDataSnapshotMap>('collection') || {};
  }
  getRemoteRenderData() {
    return {};
  }
  getData() {
    return this.data;
  }
  isEmpty() {
    return isEmpty(this.data);
  }
  getRootRenderData(): ViewDataSnapshot | null {
    const renderDataList = Object.values(this.data);
    const rootRenderData = renderDataList.filter((data) => {
      if (data.isRoot) return data;
    });
    return rootRenderData[0] || null;
  }
  getLayoutRenderData(): ViewDataSnapshot[] {
    const renderDataList = Object.values(this.data);
    const layoutRenderData = renderDataList
      .filter((data) => {
        if (data.isLayout) return data;
      })
      .sort((a, b) => a.index! - b.index!);
    return layoutRenderData;
  }
}
