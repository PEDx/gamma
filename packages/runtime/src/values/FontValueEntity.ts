import { NestValueEntity } from './NestValueEntity';
import { TypeValueEntity } from './TypeValueEntity';
import { PXNumberValueEntity } from './UnitNumberValueEntity';
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
  fontSize: PXNumberValueEntity;
  color: ColorValueEntity;
  lineHeight: PXNumberValueEntity;
  letterSpacing: PXNumberValueEntity;
  fontFamily: TypeValueEntity<string>;
  fontWeight: TypeValueEntity<TFontWeight>;
  alignItems: TypeValueEntity<TFlexAlgn>;
  justifyContent: TypeValueEntity<TFlexAlgn>;
};

export class FontValueEntity extends NestValueEntity<TFontValueEntity> {
  constructor(params?: Partial<TFontValueEntity>) {
    super({
      fontSize: new PXNumberValueEntity(12),
      color: new ColorValueEntity({ r: 3, g: 3, b: 3, a: 1 }),
      lineHeight: new PXNumberValueEntity(12),
      letterSpacing: new PXNumberValueEntity(0),
      fontFamily: new TypeValueEntity('system-font'),
      fontWeight: new TypeValueEntity('normal'),
      alignItems: new TypeValueEntity('center'),
      justifyContent: new TypeValueEntity('center'),
      ...params,
    });
  }
}
