import { getRandomStr } from '@/utils';
import { StyleItem } from './index';

interface IStyleDataObject {
  [key: string]: any
}


export class StyleView<T> {
  id: string;
  el: HTMLElement;
  styleData: IStyleDataObject;
  constructor(element: HTMLElement, extendStyleData: object = {}) {
    this.id = `sv_${getRandomStr(10)}`;
    this.el = element;
    this.styleData = Object.assign(
      {
        cursor: new StyleItem('cursor', ''),
      },
      extendStyleData,
    );
  }
  setStyleValue(key: string, value: T) {
    const item = this.styleData[key];
    item.setValue(value);
    this.el.style[key as any] = this.getItemValueByKey(key);
  }
  getStyleObject() {
    const map: IStyleDataObject = {};
    Object.keys(this.styleData).forEach((key) => {
      map[key] = this.getItemValueByKey(key);
    });
    return map;
  }
  getItemValueByKey(key: string) {
    const item = this.styleData[key];
    return item.getValueString();
  }
}
