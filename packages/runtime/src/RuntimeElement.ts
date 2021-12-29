import { Collection } from './Collection';
import { IConfiguratorMap, IElementMeta } from './GammaElement';
import { Originator } from './Originator';
import { isNil, uuid } from './utils';
import { RuntimeElementSnapshot } from './Snapshot';
import { PickConfiguratorValueTypeMap } from './Configurator';

interface IRuntimeElementParams {
  meta: IElementMeta;
  id?: string;
  configurators: IConfiguratorMap;
}

export abstract class RuntimeElement implements Originator {
  static collection = new Collection<RuntimeElement>();
  readonly meta: IElementMeta;
  readonly id: string;
  readonly configurators: IConfiguratorMap;
  public suspend: boolean = false;
  constructor({ meta, id, configurators }: IRuntimeElementParams) {
    this.meta = meta;
    this.id = id || `${uuid()}`;
    this.configurators = configurators || {};

    RuntimeElement.collection.addItem(this);
  }
  getConfiguratorsValue() {
    const configuratorValueMap: PickConfiguratorValueTypeMap<IConfiguratorMap> =
      {};
    Object.keys(this.configurators).forEach((key) => {
      const configurator = this.configurators[key];
      configuratorValueMap[key] = configurator.save();
    });
    return configuratorValueMap;
  }
  restoreConfiguratorValue(snapshot: RuntimeElementSnapshot) {
    Object.keys(this.configurators).forEach((key) => {
      let value = snapshot.configurators[key]; // 此处做值检查，不要为 undfined null NaN
      const defualtValue = this.configurators[key].value;
      if (isNil(value)) {
        if (isNil(defualtValue)) return;
        value = defualtValue;
      }
      const configurator = this.configurators[key];

      configurator.restore(value);
    });
  }
  abstract save(): RuntimeElementSnapshot;
  abstract restore(snapshot: RuntimeElementSnapshot): void;
}

export function getSerializeCollection() {
  const collections = RuntimeElement.collection.getCollection();
  const arr: RuntimeElementSnapshot[] = [];
  Object.keys(collections).forEach((key) => {
    const runtimeElement = collections[key];
    if (runtimeElement.suspend) return;
    const snapshot = runtimeElement.save();
    arr.push(snapshot);
  });
  return arr;
}
