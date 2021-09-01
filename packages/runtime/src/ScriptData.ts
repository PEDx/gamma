import { IConfiguratorMap, IElementMeta } from './GammaElement';
import { RuntimeElement } from './RuntimeElement';
import { ScriptDataSnapshot } from './Snapshot';

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
    return new ScriptDataSnapshot({
      id: this.id,
      meta: this.meta,
      configurators: this.getConfiguratorsValue(),
    });
  }
  restore(snapshot: ScriptDataSnapshot) {
    if (!snapshot) return;
    this.restoreConfiguratorValue(snapshot);
  }
}
