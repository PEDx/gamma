import {
  ColorValueEntity,
  TypeValueEntity,
  UnitNumberValueEntity,
  ValueEntity,
} from './ValueEntity';

type TFlexAlgn = 'flex-start' | 'flex-end' | 'center';
type TFontWeight = 'Light' | 'normal' | 'bold' | 'lighter' | 'bolder';

export type TFontKey =
  | 'fontSize'
  | 'color'
  | 'lineHeight'
  | 'letterSpacing'
  | 'fontFamily'
  | 'fontWeight'
  | 'alignItems'
  | 'justifyContent';

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
  view() {
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
      fontSize: fontSize?.view(),
      color: color?.view(),
      lineHeight: lineHeight?.view(),
      letterSpacing: letterSpacing?.view(),
      fontFamily: fontFamily?.view(),
      fontWeight: fontWeight?.view(),
      alignItems: alignItems?.view(),
      justifyContent: justifyContent?.view(),
    };
  }
}
