import { ValueEntity } from './ValueEntity';

export type TUNIT = 'px' | '%';

export interface IUnitNumber {
  value: number;
  unit: TUNIT;
}

export class UnitNumberValueEntity extends ValueEntity<IUnitNumber> {
  constructor(value: IUnitNumber) {
    super(value);
  }
  style() {
    const { value, unit } = this.value;
    return `${value}${unit}`;
  }
}
