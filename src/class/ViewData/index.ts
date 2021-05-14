import { getRandomStr } from '@/utils';

interface IViewDataParams {
  element: HTMLElement;
}
interface ViewDataMap {
  [key: string]: ViewData;
}
interface Data {
  [key: string]: string;
}

export class ViewData {
  static map: ViewDataMap;
  element: HTMLElement;
  id: string;
  data: Data = {};
  constructor({ element }: IViewDataParams) {
    this.element = element;
    this.id = `view_data_${getRandomStr(10)}`;
    ViewData.map[this.id] = this;
  }
  static getViewDataById(id: string) {
    const ret = ViewData.map[id];
    if (!ret) return null;
    return ret;
  }
  getElement() {
    return this.element;
  }
  updateElementStyle(key: string, value: string) {
    const element = this.element;
    this.data[key] = value;
    element.style.setProperty(key, value);
  }
  updateData(key: string, value: string) {
    this.data[key] = value;
  }
}
