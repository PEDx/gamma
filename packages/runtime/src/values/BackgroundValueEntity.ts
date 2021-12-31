import { ColorValueEntity } from './ColorValueEntity';
import { TypeValueEntity, ValueEntity } from './ValueEntity';

type TBackgroundSize = 'auto' | 'cover' | 'contain';

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
