import { StyleItem } from './StyleItem';

const UNIT = { PX: 'px', PERCENT: '%', REM: 'rem' };
export class StyleUnitItem extends StyleItem {
  unit: string;
  constructor(name: string, value: any) {
    super(name, value);
    this.unit = UNIT.PX;
  }
  getValueString(): string {
    return `${this.value}${this.unit}`;
  }
  conversionUnit() { }
}
