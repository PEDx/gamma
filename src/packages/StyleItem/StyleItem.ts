export class StyleItem<T> {
  name: string;
  value: any;
  constructor(name: string, value: T) {
    this.name = name;
    this.value = value;
  }
  getData() {
    return this;
  }
  setValue(value: T): T {
    this.value = value;
    return this.value;
  }
  getValueString(): string {
    return `${this.value}`;
  }
}
