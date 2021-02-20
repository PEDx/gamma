import { StyleItem } from './StyleItem';

const UNIT = { PX: 'px', PERCENT: '%', REM: 'rem' };
export class StyleUnitItem extends StyleItem {
  unit: string;
  constructor(name: string, value: number) {
    super(name, value);
    this.unit = UNIT.PX;
  }
  getValue(): string {
    return `${this.value}${this.unit}`;
  }
  getValueNumber(): number {
    return this.value as number;
  }
  conversionUnit() {}
}
