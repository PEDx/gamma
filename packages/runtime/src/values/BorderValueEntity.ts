import { NestValueEntity } from './NestValueEntity';
import { TypeValueEntity } from './TypeValueEntity';
import { PXNumberValueEntity } from './UnitNumberValueEntity';
import { ColorValueEntity } from './ColorValueEntity';
import { TupleToUnion } from '../types';

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
  borderWidth: PXNumberValueEntity;
  borderStyle: TypeValueEntity<TborderStyle>;
  borderColor: ColorValueEntity;
  borderRadius: PXNumberValueEntity;
};

export class BorderValueEntity extends NestValueEntity<TBorderValueEntity> {
  constructor(params?: Partial<TBorderValueEntity>) {
    super({
      borderWidth: new PXNumberValueEntity(0),
      borderStyle: new TypeValueEntity('none'),
      borderColor: new ColorValueEntity({ r: 3, g: 3, b: 3, a: 1 }),
      borderRadius: new PXNumberValueEntity(0),
      ...params,
    });
  }
}
