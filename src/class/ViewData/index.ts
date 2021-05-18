import { getRandomStr, UNIT } from '@/utils';
import { IPosition } from '../Movable';

interface IViewDataParams {
  element: HTMLElement;
}
interface ViewDataMap {
  [key: string]: ViewData;
}
interface Data {
  [key: string]: string | number;
}

export class ViewData {
  static map: ViewDataMap = {};
  element: HTMLElement;
  id: string;
  data: Data = {};
  constructor({ element }: IViewDataParams) {
    this.element = element;
    this.id = `view_data_${getRandomStr(10)}`;
    this.element.dataset.id = this.id;
    ViewData.map[this.id] = this;
  }
  static getViewDataById(id: string) {
    const ret = ViewData.map[id];
    if (!ret) return null;
    return ret;
  }
  static getViewDataByElement(node: HTMLElement) {
    const id = node.dataset.id || '';
    return ViewData.getViewDataById(id);
  }
  getElement() {
    return this.element;
  }
  updateElementStyle(key: string, value: string) {
    const element = this.element;
    element.style.setProperty(key, value);
  }
  updateData(key: string, value: string | number, unit?: UNIT) {
    this.data[key] = value;
    if (unit) {
      this.updateElementStyle(key, `${value}${unit}`);
      return;
    }
    this.updateElementStyle(key, `${value}`);
  }
  updatePosition(positon: IPosition) {
    this.data.x = positon.x;
    this.data.y = positon.y;
    this.updateElementStyle(
      'transform',
      `translate3d(${positon.x}px, ${positon.y}px, 0)`,
    );
  }
}
