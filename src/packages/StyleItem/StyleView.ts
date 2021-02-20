import { getRandomStr } from '@/utils';
import { StyleItem, StyleUnitItem, StyleValue } from './index';

interface IStyleDataObject {
  [key: string]: StyleItem | StyleUnitItem;
}

export class StyleView {
  id: string;
  el: HTMLElement;
  styleData: IStyleDataObject;
  constructor(element: HTMLElement, extendStyleData: IStyleDataObject) {
    this.id = `sv_${getRandomStr(10)}`;
    this.el = element;
    this.styleData = Object.assign(
      {
        cursor: new StyleItem('cursor', ''),
      },
      extendStyleData,
    );
  }
  setStyleValue(key: string, value: StyleValue) {
    const item = this.styleData[key];
    item.setValue(value);
    this.el.style.setProperty(key, this.getItemValueByKey(key));
  }
  getItemValueByKey(key: string) {
    const item = this.styleData[key];
    return item.getValue().toString();
  }
}
