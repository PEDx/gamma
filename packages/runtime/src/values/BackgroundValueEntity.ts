import { ColorValueEntity } from './ColorValueEntity';
import { NestValueEntity } from './NestValueEntity';
import { TypeValueEntity } from './TypeValueEntity';

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

export class BackgroundValueEntity extends NestValueEntity<TBackgroundValueEntity> {
  constructor(value?: TBackgroundValueEntity) {
    super({
      backgroundColor: new ColorValueEntity({ r: 255, g: 255, b: 255, a: 1 }),
      backgroundSize: new TypeValueEntity('cover'),
      backgroundImage: new TypeValueEntity(''),
      ...value,
    });
  }
}
