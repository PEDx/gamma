import { StyleItem, StyleValue, UNIT } from '@/class/StyleSetter';

export class DraggerSetter extends StyleItem {
  name: string;
  value: StyleValue;
  haveUnit?: boolean;
  unit?: string;
  constructor(name: string, value: StyleValue, haveUnit: boolean) {
    super();
    this.name = name;
    this.value = value;
    this.haveUnit = haveUnit;
    if (haveUnit) this.unit = UNIT.PX;
  }
  setValue(value: StyleValue): StyleValue {
    this.value = value;
    return this.value;
  }
  getValue(): StyleValue {
    if (this.haveUnit) return `${this.value}${this.unit}`;
    return this.value;
  }
  conversionUnit() {}
}
