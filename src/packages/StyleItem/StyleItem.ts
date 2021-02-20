export type StyleValue = string | number;
export class StyleItem {
  name: string;
  value: StyleValue;
  constructor(name: string, value: StyleValue) {
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
