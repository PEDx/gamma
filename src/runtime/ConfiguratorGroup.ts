import { Configurator, PickConfiguratorValueType } from '@/runtime/Configurator';
import { ConcreteSubject } from '@/commom/Observer';
import { ConcreteObserver } from '@/commom/Observer';
import { ConfiguratorMap } from '@/runtime/CreationView';
import { toArray, mapValues } from 'lodash';
import { AsyncUpdateQueue } from '@/runtime/AsyncUpdateQueue';


const asyncUpdateQueue = new AsyncUpdateQueue()
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
      configurator.attach(new ConcreteObserver(() => {
        asyncUpdateQueue.push(this.update)
      }));
    });
  }
  update = () => this.notify();
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
