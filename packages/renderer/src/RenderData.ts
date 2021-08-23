import {
  ViewDataSnapshot,
  IViewDataSnapshotMap,
  isEmpty,
} from '@gamma/runtime';

const LOCAL_KEY = 'gamma_viewdata_storage';

export class RenderData {
  private data: IViewDataSnapshotMap = {} as IViewDataSnapshotMap;
  constructor() {
    this.data = this.getLocalRenderData();
  }
  getRemoteRenderData() {
    return {};
  }
  getData() {
    return this.data;
  }
  getLocalRenderData() {
    const data = localStorage.getItem(LOCAL_KEY) || '{}';
    return JSON.parse(data) as IViewDataSnapshotMap;
  }
  saveRenderDataToLocal(data: IViewDataSnapshotMap) {
    return localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
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
