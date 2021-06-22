import { Configurator, ConfiguratorValue } from '@/class/Configurator';
import { ConcreteSubject } from '@/class/Observer';
import { ConfiguratorMap } from '@/packages';
import { ConcreteObserver } from '@/class/Observer';
import { throttle, toArray, mapValues } from 'lodash';

export class ConfiguratorGroup extends ConcreteSubject {
  configuratorMap: ConfiguratorMap;
  configuratorArr: Configurator[];
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
  update = throttle(() => this.notify(), 16);
}

export interface ConfiguratorValueMap {
  [key: string]: ConfiguratorValue;
}

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
  const configurator = new ConfiguratorGroup(params);
  return { attachEffect: _attachEffect(configurator) };
}
