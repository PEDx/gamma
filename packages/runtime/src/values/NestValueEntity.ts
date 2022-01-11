import { ValueEntity } from './ValueEntity';

interface IValueEntityMap {
  [key: string]: ValueEntity<unknown>;
}

type TEntityInnerValueMap<T extends IValueEntityMap> = {
  [key in keyof T]: ReturnType<T[key]['getValue']>;
};

const getEntityMapValue = (entitys: IValueEntityMap) => {
  const ret: { [key: string]: unknown } = {};

  (Object.keys(entitys) as string[]).forEach((key) => {
    ret[key] = entitys[key].getValue();
  });
  type TE = typeof entitys;
  return ret as TEntityInnerValueMap<TE>;
};

const setEntityMapValue = <T extends IValueEntityMap>(
  entitys: IValueEntityMap,
  valueMap: Partial<TEntityInnerValueMap<T>>,
) => {
  (Object.keys(valueMap) as string[]).forEach((key) => {
    entitys[key].setValue(valueMap[key]);
  });
};

export class NestValueEntity<T extends IValueEntityMap> extends ValueEntity<
  TEntityInnerValueMap<T>
> {
  private _entitys: IValueEntityMap = {};
  constructor(entitys: T) {
    const valueMap = getEntityMapValue(entitys) as TEntityInnerValueMap<T>;
    super(valueMap);
    this._entitys = entitys;
  }
  override setValue(value: Partial<TEntityInnerValueMap<T>>): void {
    setEntityMapValue(this._entitys, value);
  }
  override getValue() {
    return getEntityMapValue(this._entitys) as {
      [key in keyof T]: ReturnType<T[key]['getValue']>;
    };
  }
  style() {
    const ret: { [key: string]: unknown } = {};

    (Object.keys(this._entitys) as string[]).forEach((key) => {
      ret[key] = this._entitys[key].style();
    });

    return ret as { [key in keyof T]: ReturnType<T[key]['style']> };
  }
}
