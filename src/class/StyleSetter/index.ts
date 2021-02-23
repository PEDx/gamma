export const UNIT = { PX: 'px', PERCENT: '%', REM: 'rem' };

export type StyleValue = string | number;

export abstract class StyleItem {
  setStyle(el: HTMLElement, property: string, value: string) {
    el.style.setProperty(property, value);
  }
}
export class ValueItem {}

export class StyleSetter extends StyleItem {
  name: string;
  value: StyleValue;
  constructor(name: string, value: StyleValue) {
    super();
    this.name = name;
    this.value = value;
  }
  getData() {
    return this;
  }
  setValue(value: StyleValue): StyleValue {
    this.value = value;
    return this.value;
  }
  getValue(): StyleValue {
    return this.value;
  }
}

export class StyleUnitSetter extends StyleSetter {
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
