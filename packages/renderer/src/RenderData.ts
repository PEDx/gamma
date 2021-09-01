import {
  ViewDataSnapshot,
  IRuntimeElementSnapshotMap,
  isEmpty,
  RootViewDataSnapshot,
  LayoutViewDataSnapshot,
} from '@gamma/runtime';

const LOCAL_KEY = 'gamma_viewdata_storage';

export class RenderData {
  private data: IRuntimeElementSnapshotMap = {} as IRuntimeElementSnapshotMap;
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
    return JSON.parse(data) as IRuntimeElementSnapshotMap;
  }
  saveRenderDataToLocal(data: IRuntimeElementSnapshotMap) {
    return localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
  }
  isEmpty() {
    return isEmpty(this.data);
  }
  getRootRenderData(): RootViewDataSnapshot | null {
    const renderDataList = Object.values(this.data) as RootViewDataSnapshot[];
    const rootRenderData = renderDataList.filter((data) => {
      if (data.isRoot) return data;
    });
    return rootRenderData[0] || null;
  }
  getLayoutRenderData(): LayoutViewDataSnapshot[] {
    const renderDataList = Object.values(this.data) as LayoutViewDataSnapshot[];
    const layoutRenderData = renderDataList
      .filter((data) => {
        if (data.isLayout) return data;
      })
      .sort((a, b) => a.index! - b.index!);
    return layoutRenderData;
  }
}
