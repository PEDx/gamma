import { ValueEntity } from './ValueEntity';

export type TUNIT = 'px' | '%' | 'rem';

export interface IUnitNumber {
  value: number;
  unit: TUNIT;
}

export class UnitNumberValueEntity extends ValueEntity<IUnitNumber> {
  constructor(value: IUnitNumber) {
    super(value);
  }
  style() {
    const { value, unit } = this.getValue();
    return `${value}${unit}`;
  }
  update() {}
}

export class PXNumberValueEntity extends ValueEntity<number> {
  constructor(value: number) {
    super(value);
  }
  style() {
    const value = this.getValue();
    return `${value}px`;
  }
  update() {}
}
