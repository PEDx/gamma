import { Originator, Memento } from '../Originator';
import { RGBColor } from '../types';

export enum UNIT {
  NONE = '',
  PX = 'px',
  PERCENT = '%',
  REM = 'rem',
}

export abstract class ValueEntity<T extends Memento> implements Originator {
  value: T;
  constructor(value: T) {
    this.value = value;
  }
  set(value: T) {
    this.value = value;
  }
  get() {
    return this.value;
  }
  abstract save(): string;
  abstract restore(memo: string): void;
}

export class TypeValueEntity<T extends string | number> extends ValueEntity<T> {
  constructor(value: T) {
    super(value);
  }
  save() {
    return `${this.value}`;
  }
  restore(value: string) {
    this.value = value as T;
  }
}

export class UnitNumberValueEntity extends ValueEntity<number> {
  unit: UNIT;
  constructor(value: number, unit: UNIT) {
    super(value);
    this.unit = unit;
  }
  save() {
    return `${this.value}${this.unit}`;
  }
  restore() {
    this.value = 12;
  }
}

export class ColorValueEntity extends ValueEntity<RGBColor> {
  constructor(value: RGBColor) {
    super(value);
  }
  restore() {
    this.value;
  }
  save() {
    const color = this.value;
    return `rgba(${color.r},${color.g},${color.b},${color.a})`;
  }
}

type TFlexAlgn = 'flex-start' | 'flex-end' | 'center';
type TFontWeight = 'Light' | 'normal' | 'bold' | 'lighter' | 'bolder';
type TBackgroundSize = 'auto' | 'cover' | 'contain';

export type TFontValueEntity = {
  fontSize: UnitNumberValueEntity;
  color: ColorValueEntity;
  lineHeight: UnitNumberValueEntity;
  letterSpacing: UnitNumberValueEntity;
  fontFamily: TypeValueEntity<string>;
  fontWeight: TypeValueEntity<TFontWeight>;
  alignItems: TypeValueEntity<TFlexAlgn>;
  justifyContent: TypeValueEntity<TFlexAlgn>;
};

export type TBackgroundValueEntity = {
  backgroundColor: ColorValueEntity;
  backgroundImage: TypeValueEntity<string>;
  backgroundSize: TypeValueEntity<TBackgroundSize>;
};
