import { storage } from '@/utils';
import { LayoutViewData } from './ViewData/LayoutViewData';
import { ViewData } from '@/class/ViewData/ViewData';
import { IViewDataSnapshotMap } from '@/class/ViewData/ViewDataCollection';

// TODO 部署是以页面为单位
export class Project {
  id: string;
  name: string;
  owner: string;
  private: boolean = false; // 可见性
  pageIdList: Page['id'][] = [];
  constructor() {
    this.id = '';
    this.name = '';
    this.owner = '';
  }
}

const GAMMA_LOCAL_VIEWDATA_COLLECTION = 'loc_viewdata_';

interface IPageParams {
  layoutViewData: LayoutViewData;
}
export class Page {
  id: string;
  name: string; // 默认为页面的 title
  owner: string; // 所属项目
  private: boolean = false; // 私有不能部署到线上
  layoutViewData: LayoutViewData | null = null;
  constructor({ layoutViewData }: IPageParams) {
    this.id = '';
    this.name = '';
    this.owner = '';
    this.layoutViewData = layoutViewData;
  }
  deploy() { }
  preview() { }
  saveDataToRemote() { }
  saveDataToLocal() {
    if (!this.layoutViewData) return
    storage.set(
      `${GAMMA_LOCAL_VIEWDATA_COLLECTION}${this.layoutViewData.id}`,
      ViewData.collection.getSerializeCollection(),
    );
  }
  getDataFromLocal() {
    if (!this.layoutViewData) return
    const _data = storage.get<IViewDataSnapshotMap>(`${GAMMA_LOCAL_VIEWDATA_COLLECTION}${this.layoutViewData.id}`);
    return _data;
  }
  getDataFromRemote() { }
}
