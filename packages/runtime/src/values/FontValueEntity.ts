import {
  TypeValueEntity,
  ValueEntity,
} from './ValueEntity';
import { UnitNumberValueEntity } from './UnitNumberValueEntity';
import { ColorValueEntity } from './ColorValueEntity';

type TFlexAlgn = 'flex-start' | 'flex-end' | 'center';
type TFontWeight = 'Light' | 'normal' | 'bold' | 'lighter' | 'bolder';

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

export class FontValueEntity extends ValueEntity<Partial<TFontValueEntity>> {
  constructor(params: Partial<TFontValueEntity>) {
    super(params);
  }
  style() {
    const {
      fontSize,
      color,
      lineHeight,
      letterSpacing,
      fontFamily,
      fontWeight,
      alignItems,
      justifyContent,
    } = this.value;
    return {
      fontSize: fontSize?.style(),
      color: color?.style(),
      lineHeight: lineHeight?.style(),
      letterSpacing: letterSpacing?.style(),
      fontFamily: fontFamily?.style(),
      fontWeight: fontWeight?.style(),
      alignItems: alignItems?.style(),
      justifyContent: justifyContent?.style(),
    };
  }
}
