import { ValueEntity } from './ValueEntity';

interface IValueEntityMap {
  [key: string]: ValueEntity<unknown>;
}
interface IValueEntityInnerValueMap<T extends IValueEntityMap> {
  [key: string]: ReturnType<T[keyof T]['getValue']>;
}

const getEntityMapValue = <T extends IValueEntityMap>(
  entitys: IValueEntityMap,
) => {
  const ret: { [key: string]: unknown } = {};

  (Object.keys(entitys) as string[]).forEach((key) => {
    ret[key] = entitys[key].getValue();
  });

  return ret as IValueEntityInnerValueMap<T>;
};

const setEntityMapValue = <T extends IValueEntityMap>(
  entitys: IValueEntityMap,
  valueMap: IValueEntityInnerValueMap<T>,
) => {
  (Object.keys(entitys) as string[]).forEach((key) => {
    entitys[key].setValue(valueMap[key]);
  });
};

export class NestValueEntity<T extends IValueEntityMap> extends ValueEntity<
  IValueEntityInnerValueMap<T>
> {
  private _entitys: IValueEntityMap = {};
  constructor(entitys: IValueEntityMap) {
    super(getEntityMapValue<T>(entitys));
    this._entitys = entitys;
  }
  override setValue(value: IValueEntityInnerValueMap<T>): void {
    console.log(value);

    setEntityMapValue(this._entitys, value);
  }
  override getValue(): IValueEntityInnerValueMap<T> {
    return getEntityMapValue(this._entitys);
  }
  style() {
    const ret: { [key: string]: unknown } = {};

    (Object.keys(this._entitys) as string[]).forEach((key) => {
      ret[key] = this._entitys[key].style();
    });

    return ret as { [key in keyof T]: ReturnType<T[key]['style']> };
  }
}
