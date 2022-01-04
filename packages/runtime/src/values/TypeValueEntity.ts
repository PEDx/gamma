import { ValueEntity } from "./ValueEntity";



export class TypeValueEntity<T> extends ValueEntity<T> {
  constructor(value: T) {
    super(value);
  }
  style() {
    return this.value;
  }
}
