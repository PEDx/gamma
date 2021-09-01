import {
  IRuntimeElementSnapshotMap,
  isEmpty,
  RootViewDataSnapshot,
  LayoutViewDataSnapshot,
  ViewDataType,
  ScriptDataSnapshot,
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
  getScriptSnapshotData() {
    const data = Object.values(this.data) as ScriptDataSnapshot[];
    const scriptSnapshotData = data.filter((data) => {
      if (data.script) return data;
    });
    return scriptSnapshotData;
  }
  getRootSnapshotData() {
    const data = Object.values(this.data) as RootViewDataSnapshot[];
    const rootRenderData = data.filter((data) => {
      if (data.type === ViewDataType.Root) return data;
    });
    return rootRenderData[0] || null;
  }
  getLayoutSnapshotData() {
    const data = Object.values(this.data) as LayoutViewDataSnapshot[];
    const layoutRenderData = data
      .filter((data) => {
        if (data.type === ViewDataType.Layout) return data;
      })
      .sort((a, b) => a.index! - b.index!);
    return layoutRenderData;
  }
}
