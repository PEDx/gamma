import { ColorValueEntity } from './ColorValueEntity';
import { NestValueEntity } from './NestValueEntity';
import { TypeValueEntity } from './TypeValueEntity';
import { PickNestValueEntity } from './ValueEntity';

const backgroundSize: ['auto', 'cover', 'contain'] = [
  'auto',
  'cover',
  'contain',
];

type TBackgroundSize = TupleToUnion<typeof backgroundSize>;

export type TBackgroundValueEntity = {
  backgroundColor: ColorValueEntity;
  backgroundImage: TypeValueEntity<string>;
  backgroundSize: TypeValueEntity<TBackgroundSize>;
};

export type TBackgroundValue = PickNestValueEntity<
  TBackgroundValueEntity,
  keyof TBackgroundValueEntity
>;

export class BackgroundValueEntity extends NestValueEntity<TBackgroundValueEntity> {
  constructor(value?: Partial<TBackgroundValueEntity>) {
    super({
      backgroundColor: new ColorValueEntity({ r: 200, g: 200, b: 200, a: 0.7 }),
      backgroundSize: new TypeValueEntity('cover'),
      backgroundImage: new TypeValueEntity(''),
      ...value,
    });
  }
}
