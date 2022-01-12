import { ColorValueEntity } from './ColorValueEntity';
import { NestValueEntity } from './NestValueEntity';
import { IOptionItem, OptionsValueEntity } from './OptionsValueEntity';
import { TypeValueEntity } from './TypeValueEntity';
import { PickNestValueEntity } from './ValueEntity';

const backgroundSizeOptions: IOptionItem[] = [
  {
    name: '自动',
    value: 'auto',
  },
  {
    name: '覆盖',
    value: 'cover',
  },
  {
    name: '居中',
    value: 'contain',
  },
];

export type TBackgroundValueEntity = {
  backgroundColor: ColorValueEntity;
  backgroundImage: TypeValueEntity<string>;
  backgroundSize: OptionsValueEntity;
};

export type TBackgroundValue = PickNestValueEntity<
  TBackgroundValueEntity,
  keyof TBackgroundValueEntity
>;

export class BackgroundValueEntity extends NestValueEntity<TBackgroundValueEntity> {
  constructor(value?: Partial<TBackgroundValueEntity>) {
    super({
      backgroundColor: new ColorValueEntity({ r: 200, g: 200, b: 200, a: 0.7 }),
      backgroundSize: new OptionsValueEntity(backgroundSizeOptions),
      backgroundImage: new TypeValueEntity(''),
      ...value,
    });
  }
}
