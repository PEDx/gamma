export default class StyleItem {
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
