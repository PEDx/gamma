import { Configurator } from '@/class/Configurator';
import { ConcreteSubject } from '@/class/Observer';
import { ConcreteObserver } from '@/class/Observer';
import { throttle, toArray, mapValues } from 'lodash';

export class ConfiguratorGroup extends ConcreteSubject {
  configuratorMap: ConfiguratorMap;
  configuratorArr: Configurator<string | number>[];
  constructor(configurators: ConfiguratorMap) {
    super();
    this.configuratorMap = configurators;
    this.configuratorArr = toArray(configurators);
    this.init();
  }
  init() {
    this.configuratorArr.forEach((configurator) => {
      configurator.attach(new ConcreteObserver(this.update));
    });
  }
  update = () => this.notify();
}

export interface ConfiguratorValueMap {
  [key: string]: Configurator<string | number>['value'];
}
export interface ConfiguratorMap {
  [key: string]: Configurator<string | number>;
}

type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type MyReadonly<T> = { readonly [P in keyof T]: T[P] };
type TupleToObject<T extends readonly any[]> = { [P in T[number]]: P };
type First<T extends unknown[]> = T extends [infer F, ...infer L] ? F : never;
type Length<T extends unknown[]> = T['length'];
type Exclude<T, U> = T extends U ? never : T;
type MyReturnType<T> = T extends (key: any) => infer P ? P : never;
type MyOmit<T, U extends keyof T> = MyPick<T, Exclude<keyof T, U>>;
type MyReadonly2<T, U extends keyof T> = {
  readonly [P in U]: T[P];
} &
  { [Q in Exclude<keyof T, U>]: T[Q] };

type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> };
type TupleToUnion<T extends unknown[]> = T[number];

class Chainable<T = {}> {
  option!: <K extends string, V>(
    key: K,
    value: V,
  ) => Chainable<T & { [key in K]: V }>;
  get!: () => T;
}
interface IChainable<T = {}> {
  option<K extends string, V>(
    key: K,
    value: V,
  ): IChainable<T & { [key in K]: V }>;
  get(): T;
}

declare const config: IChainable;

const result = config
  .option('foo', 123)
  .option('name', 'type-challenges')
  .option('bar', { value: 'Hello World' })
  .get();

type a = typeof result;

type ConfiguratorType<T> = T extends Configurator<infer P> ? P : T;

const _attachEffect =
  (configuratorGroup: ConfiguratorGroup) =>
  (effect?: (values: ConfiguratorValueMap) => void) => {
    if (!effect) return configuratorGroup;
    configuratorGroup.attach(
      new ConcreteObserver(() => {
        effect(mapValues(configuratorGroup.configuratorMap, 'value'));
      }),
    );
    return configuratorGroup;
  };

export function createConfiguratorGroup(params: ConfiguratorMap) {
  const configuratorGroup = new ConfiguratorGroup(params);
  return { attachEffect: _attachEffect(configuratorGroup) };
}
