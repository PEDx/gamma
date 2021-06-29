import { Configurator } from '@/class/Configurator';
import { ConcreteSubject } from '@/class/Observer';
import { ConcreteObserver } from '@/class/Observer';
import { ConfiguratorMap } from '@/packages';
import { toArray, mapValues } from 'lodash';

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
      configurator.attach(new ConcreteObserver(this.update));
    });
  }
  update = () => this.notify();
}


type ConfiguratorValueMap<T extends ConfiguratorMap> = { [P in keyof T]: T[P]['value'] }

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
  return { attachEffect: _attachEffect<ConfiguratorValueMap<T>>(configuratorGroup) };
}
