import { RGBColor } from './types';

export interface ValueEntity<T> {
  value: T;
  deserialize(): T;
  serialize(): string;
}

export class TypeValueEntity<T> implements ValueEntity<T> {
  value: T;
  constructor(value: T) {
    this.value = value;
  }
  deserialize() {
    return this.value;
  }
  serialize() {
    return `${this.value}`;
  }
}

export class UnitNumberValueEntity implements ValueEntity<number> {
  value: number;
  unit: string;
  constructor(value: number, unit: string) {
    this.value = value;
    this.unit = unit;
  }
  deserialize() {
    return this.value;
  }
  serialize() {
    return `${this.value}${this.unit}`;
  }
}

export class ColorValueEntity implements ValueEntity<RGBColor> {
  value: RGBColor;
  constructor(value: RGBColor) {
    this.value = value;
  }
  deserialize() {
    return this.value;
  }
  serialize() {
    const color = this.value;
    return `rgba(${color.r},${color.g},${color.b},${color.a})`;
  }
}

type FlexAlgn = 'flex-start' | 'flex-end' | 'center';

export type TFontValueEntity = {
  fontSize: UnitNumberValueEntity;
  lineHeight: UnitNumberValueEntity;
  letterSpacing: UnitNumberValueEntity;
  fontFamily: TypeValueEntity<string>;
  fontWeight: TypeValueEntity<number>;
  alignItems: TypeValueEntity<FlexAlgn>;
  justifyContent: TypeValueEntity<FlexAlgn>;
};

export type TBackgroundValueEntity = {
  backgroundColor: ColorValueEntity;
  backgroundImage: TypeValueEntity<string>;
  backgroundSize: TypeValueEntity<string>;
};
