// 原始值 {value: 12, unit: 'px'}
// 视图值 '12px'
// 配置值 {value: 12, unit: 'px'}
// 存储值 {value: 12, unit: 'px'}

export abstract class ValueEntity<T> {
  private _value: T;
  constructor(value: T) {
    this._value = value;
  }
  set value(value: T) {
    this._value = value;
  }
  get value() {
    return this._value;
  }
  abstract style(): unknown;
}

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
}

export type PickValueEntityInner<T> = T extends ValueEntity<infer p>
  ? p
  : never;
