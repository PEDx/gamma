export class StyleItem {
  name: string;
  value: any;
  constructor(name: string, value: any) {
    this.name = name;
    this.value = value;
  }
  getData() {
    return this;
  }
  setValue(value: any): any {
    this.value = value;
    return this.value;
  }
  getValueString(): string {
    return `${this.value}`;
  }
}
