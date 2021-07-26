import { ConcreteObserver } from '@/common/Observer';
import { clone } from 'lodash';
import { Configurator, IConfigurator } from './Configurator';

type IKey = string | number | symbol;

type PolysemyValueMap<T, K extends IKey> = {
  [P in K]: T;
};
type TupleToUnion<T extends unknown[]> = T[number];

export class PolysemyConfigurator<
  T,
  U extends string[],
> extends Configurator<T> {
  polysemyValueMap: PolysemyValueMap<T, TupleToUnion<U>> =
    {} as PolysemyValueMap<T, TupleToUnion<U>>;
  currentKey: TupleToUnion<U> = '';
  constructor(params: IConfigurator<T>, keys: U) {
    super(params);
    this.currentKey = keys[0];
    keys.forEach((key: TupleToUnion<U>) => {
      this.polysemyValueMap[key] = clone(this.value);
    });
  }
  switch(key: TupleToUnion<U>) {
    const value = this.polysemyValueMap[key];
    this.currentKey = key;
    this.setValue(value);
  }
  attachPolysemyValueEffect(
    effect?: (polysemyValueMap: PolysemyValueMap<T, TupleToUnion<U>>) => void,
  ) {
    if (!effect) return this;
    this.attach(
      new ConcreteObserver<Configurator<T>>(({ value }) => {
        this.polysemyValueMap[this.currentKey] = clone(value);
        effect(this.polysemyValueMap);
      }),
    );
    return this;
  }
}
