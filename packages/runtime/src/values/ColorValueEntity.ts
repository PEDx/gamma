import { RGBColor } from '../types';
import { ValueEntity } from './ValueEntity';

export class ColorValueEntity extends ValueEntity<RGBColor> {
  constructor(value: RGBColor) {
    super(value);
  }
  style() {
    const color = this.value;
    return `rgba(${color.r},${color.g},${color.b},${color.a})`;
  }
}
