import { shallowClone } from './utils';
import { ConcreteObserver } from './Observer';
import { Configurator, IConfigurator } from './Configurator';

type IKey = string | number | symbol;

type PolysemyValueMap<T, K extends IKey> = {
  [P in K]: T;
};

/**
 * 一个 Configurator 包含多个配置值
 * 可通过 switch 方法进行切换
 */
export class PolysemyConfigurator<
  T,
  U extends string[],
> extends Configurator<T> {
  valueMap: PolysemyValueMap<T, TupleToUnion<U>> = {} as PolysemyValueMap<
    T,
    TupleToUnion<U>
  >;
  currentKey: TupleToUnion<U> = '';
  constructor(params: IConfigurator<T> | Configurator<T>, keys: U) {
    super(params);
    this.currentKey = keys[0];
    keys.forEach((key: TupleToUnion<U>) => {
      this.valueMap[key] = shallowClone(this.value);
    });
  }
  switch(key: TupleToUnion<U>) {
    const value = this.valueMap[key];
    this.currentKey = key;
    this.setValue(value);
  }
  attachPolysemyValueEffect(
    effect?: (valueMap: PolysemyValueMap<T, TupleToUnion<U>>) => void,
  ) {
    if (!effect) return this;
    this.attach(
      new ConcreteObserver<Configurator<T>>(({ value }) => {
        this.valueMap[this.currentKey] = shallowClone(value);
        effect(this.valueMap);
      }),
    );
    return this;
  }
  override save() {
    return this.valueMap;
  }
  override restore(valueMap: unknown) {
    this.valueMap = valueMap as PolysemyValueMap<T, TupleToUnion<U>>;
    this.switch(this.currentKey);
  }
}

export function createPolysemyConfigurator<T, U extends string[]>(
  params: IConfigurator<T>,
  keys: U,
) {
  return new PolysemyConfigurator(params, keys);
}
