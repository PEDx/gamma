import StyleItem from './StyleItem';

const UNIT = { PX: 'px', PERCENT: '%', REM: 'rem' };
export default class StyleUnitItem extends StyleItem {
  constructor(name, value) {
    super(name, value);
    this.unit = UNIT.PX;
  }
  getValueString() {
    return `${this.value}${this.unit}`;
  }
  conversionUnit() {}
}
