import { NestValueEntity } from './ValueEntity';
import { TypeValueEntity } from './TypeValueEntity';
import { UnitNumberValueEntity } from './UnitNumberValueEntity';
import { ColorValueEntity } from './ColorValueEntity';

const borderStyle: [
  'dotted',
  'none',
  'dashed',
  'solid',
  'double',
  'inset',
  'outset',
] = ['dotted', 'none', 'dashed', 'solid', 'double', 'inset', 'outset'];

type TborderStyle = TupleToUnion<typeof borderStyle>;

export type TBorderValueEntity = {
  borderWidth: UnitNumberValueEntity;
  borderStyle: TypeValueEntity<TborderStyle>;
  borderColor: ColorValueEntity;
  borderRadius: UnitNumberValueEntity;
};

export class BorderValueEntity extends NestValueEntity<TBorderValueEntity> {
  constructor(params?: Partial<TBorderValueEntity>) {
    super({
      borderWidth: new UnitNumberValueEntity({ value: 0, unit: 'px' }),
      borderStyle: new TypeValueEntity('none'),
      borderColor: new ColorValueEntity({ r: 3, g: 3, b: 3, a: 1 }),
      borderRadius: new UnitNumberValueEntity({ value: 0, unit: 'px' }),
      ...params,
    });
  }
}
