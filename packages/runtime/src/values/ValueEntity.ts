// 原始值 {value: 12, unit: 'px'}
// 视图值 '12px'
// 配置值 {value: 12, unit: 'px'}
// 存储值 {value: 12, unit: 'px'}

export abstract class ValueEntity<T> {
  protected _value: T;
  constructor(value: T) {
    this._value = value;
  }
  setValue(value: T) {
    this._value = value;
  }
  getValue() {
    return this._value;
  }
  abstract style(): unknown;
}

export type PickValueEntityInner<T> = T extends ValueEntity<infer p>
  ? p
  : never;

export type PickValueEntity<T> = T extends {
  [key: string]: ValueEntity<infer p>;
}
  ? { [key: string]: p }
  : PickValueEntityInner<T>;
