import { getRandomStr } from '@/utils';
import { StyleItem } from './index';

export class StyleView {
  constructor(element, extendStyleData = {}) {
    this.id = `sv_${getRandomStr(10)}`;
    this.el = element;
    this.styleData = Object.assign(
      {
        cursor: new StyleItem('cursor', ''),
      },
      extendStyleData,
    );
  }
  setStyleValue(key, value) {
    const item = this.styleData[key];
    item.setValue(value);
    this.el.style[key] = this.getItemValueByKey(key);
  }
  getStyleObject() {
    const map = {};
    Object.keys(this.styleData).forEach((key) => {
      map[key] = this.getItemValueByKey(key);
    });
    return map;
  }
  getItemValueByKey(key) {
    const item = this.styleData[key];
    return item.getValueString();
  }
}
