import { IConfiguratorMap, IElementMeta } from './GammaElement';
import { RuntimeElement } from './RuntimeElement';
import { RuntimeElementSnapshot } from './Snapshot';
import { isNil } from './utils';

export interface IScriptDataParams {
  id?: string;
  meta: IElementMeta;
  configurators: IConfiguratorMap;
}

export class ScriptData extends RuntimeElement {
  constructor({ meta, configurators, id }: IScriptDataParams) {
    super({
      id,
      meta,
      configurators: configurators,
    });
  }
  save() {
    return new RuntimeElementSnapshot({
      meta: this.meta,
      configurators: this.getConfiguratorsValue(),
    });
  }
  restore(snapshot: RuntimeElementSnapshot) {
    if (!snapshot) return;
    this.restoreConfiguratorValue(snapshot);
  }
}
