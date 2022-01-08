// 原始值 {value: 12, unit: 'px'}
// 视图值 '12px'
// 配置值 {value: 12, unit: 'px'}
// 存储值 {value: 12, unit: 'px'}

export abstract class ValueEntity<T> {
  private _value: T;
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

export type PickNestValueEntity<T, U extends string> = T extends {
  [key in U]: ValueEntity<unknown>;
}
  ? { [key in U]: PickValueEntityInner<T[key]> }
  : never;
