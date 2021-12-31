import { ColorValueEntity } from './ColorValueEntity';

// 原始值 {value: 12, unit: 'px'}
// 视图值 '12px'
// 配置值 12
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
  abstract view(): unknown;
}

export class TypeValueEntity<T extends string | number> extends ValueEntity<T> {
  constructor(value: T) {
    super(value);
  }
  view() {
    return `${this.value}`;
  }
}


type TBackgroundSize = 'auto' | 'cover' | 'contain';

export type TBackgroundValueEntity = {
  backgroundColor: ColorValueEntity;
  backgroundImage: TypeValueEntity<string>;
  backgroundSize: TypeValueEntity<TBackgroundSize>;
};
