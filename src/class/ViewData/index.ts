import { getRandomStr, UNIT } from '@/utils';
import { IConfigurator } from '@/test/Configurator';
import { IPosition } from '../Movable';

interface IViewDataParams {
  element: HTMLElement;
  configurators: IConfigurator[] | null;
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
  configurators: IConfigurator[] | null;
  constructor({ element, configurators }: IViewDataParams) {
    this.element = element;
    this.configurators = configurators;
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
  static isViewDataElement(node: HTMLElement | null) {
    if (!node) return false;
    return !!ViewData.getViewDataByElement(node);
  }
  static findViewData(node: HTMLElement) {
    let _node: HTMLElement | null = node;
    while (!ViewData.isViewDataElement(_node) && _node) {
      _node = _node?.parentElement;
    }
    if (!_node) return null;
    return ViewData.getViewDataByElement(_node);
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
