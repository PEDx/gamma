import { ValueEntity } from './ValueEntity';
import { TypeValueEntity } from './TypeValueEntity';
import { UnitNumberValueEntity } from './UnitNumberValueEntity';
import { ColorValueEntity } from './ColorValueEntity';

const fontWeight: ['light', 'normal', 'bold', 'lighter', 'bolder'] = [
  'light',
  'normal',
  'bold',
  'lighter',
  'bolder',
];

const flexAlgn: ['flex-start', 'flex-end', 'center'] = [
  'flex-start',
  'flex-end',
  'center',
];


type TFlexAlgn = TupleToUnion<typeof flexAlgn>;
type TFontWeight = TupleToUnion<typeof fontWeight>;

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
