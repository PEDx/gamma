import { StyleItem } from './StyleItem';

const UNIT = { PX: 'px', PERCENT: '%', REM: 'rem' };
export class StyleUnitItem<T> extends StyleItem<T> {
  unit: string;
  constructor(name: string, value: T) {
    super(name, value);
    this.unit = UNIT.PX;
  }
  getValueString(): string {
    return `${this.value}${this.unit}`;
  }
  conversionUnit() { }
}
