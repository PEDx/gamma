import { getRandomStr } from '@/utils';

const UNIT = { PX: 'px', PERCENT: '%', REM: 'rem' };

class StyleItem {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
  getData() {
    return this;
  }
  setValue(value) {
    this.value = value;
    return this.value;
  }
  getValueString() {
    return `${this.value}`;
  }
}
class StyleUnitItem extends StyleItem {
  constructor(name, value) {
    super(name, value);
    this.unit = UNIT.PX;
  }
  getValueString() {
    return `${this.value}${this.unit}`;
  }
  conversionUnit() {}
}

export default class StyleView {
  constructor(element) {
    this.id = `sv_${getRandomStr(10)}`;
    this.el = element;
    this.styleData = {
      cursor: new StyleItem('cursor', ''),
      display: new StyleItem('display', 'block'),
      width: new StyleUnitItem('width', element.offsetWidth),
      height: new StyleUnitItem('height', element.offsetHeight),
      top: new StyleUnitItem('top', element.offsetTop),
      left: new StyleUnitItem('left', element.offsetLeft),
    };
  }
  init() {}
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
