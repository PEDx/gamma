import { Collection } from './Collection';
import { IConfiguratorMap, IElementMeta } from './GammaElement';
import { Originator } from './Originator';
import { uuid } from './utils';

interface IRuntimeElementDataParams {
  meta: IElementMeta;
  id: string;
  configurators: IConfiguratorMap;
}

export class RuntimeElementData implements Originator {
  static collection = new Collection<RuntimeElementData>();
  readonly meta: IElementMeta;
  readonly id: string;
  readonly configurators: IConfiguratorMap;
  constructor({ meta, id, configurators }: IRuntimeElementDataParams) {
    this.meta = meta;
    this.id = id || `${uuid()}`;
    this.configurators = configurators || {};
  }
  save() {
    return '' as any;
  }
  restore() {}
}
