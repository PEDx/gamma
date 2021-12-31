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
  view() {
    const { value, unit } = this.value;
    return `${value}${unit}`;
  }
}
