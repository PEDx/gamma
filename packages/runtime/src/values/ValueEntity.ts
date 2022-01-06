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
  abstract update(data: unknown): void;
}


export type PickValueEntityInner<T> = T extends ValueEntity<infer p>
  ? p
  : never;
