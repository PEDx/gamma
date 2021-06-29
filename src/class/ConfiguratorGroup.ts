import { Configurator, PickConfiguratorValueType } from '@/class/Configurator';
import { ConcreteSubject } from '@/class/Observer';
import { ConcreteObserver } from '@/class/Observer';
import { ConfiguratorMap } from '@/packages';
import { toArray, mapValues, throttle } from 'lodash';

export class ConfiguratorGroup extends ConcreteSubject {
  configuratorMap: ConfiguratorMap;
  configuratorArr: Configurator<any>[];
  constructor(configurators: ConfiguratorMap) {
    super();
    this.configuratorMap = configurators;
    this.configuratorArr = toArray(configurators);
    this.init();
  }
  init() {
    this.configuratorArr.forEach((configurator) => {
      configurator.attach(new ConcreteObserver(() => this.update()));
    });
  }
  update = throttle(this.notify, 10);
}


export type PickConfiguratorValueTypeMap<T extends ConfiguratorMap> = { [P in keyof T]: PickConfiguratorValueType<T[P]> }

const _attachEffect =
  <T>(configuratorGroup: ConfiguratorGroup) =>
    (effect?: (values: T) => void) => {
      if (!effect) return configuratorGroup;
      configuratorGroup.attach(
        new ConcreteObserver(() => {
          const t = mapValues(configuratorGroup.configuratorMap, 'value')
          effect(t as T)
        }),
      );
      return configuratorGroup;
    };


export function createConfiguratorGroup<T extends ConfiguratorMap>(params: T) {
  const configuratorGroup = new ConfiguratorGroup(params);
  return { attachEffect: _attachEffect<PickConfiguratorValueTypeMap<T>>(configuratorGroup) };
}
