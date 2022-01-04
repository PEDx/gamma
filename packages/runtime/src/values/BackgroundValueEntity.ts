import { ColorValueEntity } from './ColorValueEntity';
import { ValueEntity } from './ValueEntity';
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

export class BackgroundValueEntity extends ValueEntity<TBackgroundValueEntity> {
  constructor(value: TBackgroundValueEntity) {
    super(value);
  }
  style() {}
}
