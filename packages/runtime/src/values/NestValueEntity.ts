import { ValueEntity } from "./ValueEntity";

export class NestValueEntity<
  T extends { [key: string]: ValueEntity<unknown> },
> extends ValueEntity<T> {
  constructor(value: T) {
    super(value);
  }
  style() {
    const ret: { [key: string]: unknown } = {};

    (Object.keys(this.value) as string[]).forEach((key) => {
      ret[key] = this.value[key].style();
    });

    type ValueType = typeof this.value;
    type ValueKeys = keyof ValueType;

    return ret as { [key in ValueKeys]: ReturnType<ValueType[key]['style']> };
  }
  update() {}
}
