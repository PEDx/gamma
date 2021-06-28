import { storage } from '@/utils';
import { RootViewData } from './ViewData/RootViewData';
import { ViewData } from '@/class/ViewData/ViewData';
import { IViewStaticDataMap } from '@/class/ViewData/ViewDataCollection';

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

const LOCAL_VIEWDATA_KEY = 'gamma_viewdata';

interface IPageParams {
  rootViewData: RootViewData;
}
export class Page {
  id: string;
  name: string; // 默认为页面的 title
  projectId: string; // 所属项目
  private: boolean = false; // 私有不能部署到线上
  rootViewData: RootViewData | null = null;
  constructor({ rootViewData }: IPageParams) {
    this.id = '';
    this.name = '';
    this.projectId = '';
    this.rootViewData = rootViewData;
  }
  deploy() {}
  preview() {}
  saveDataToRemote() {}
  saveDataToLocal() {
    storage.set(
      LOCAL_VIEWDATA_KEY,
      ViewData.collection.getSerializeCollection(),
    );
  }
  getDataFromLocal() {
    const _data = storage.get<IViewStaticDataMap>(LOCAL_VIEWDATA_KEY);
    return _data;
  }
  getDataFromRemote() {}
}
