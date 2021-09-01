import { IConfiguratorMap, IElementMeta } from './GammaElement';
import { RuntimeElement } from './RuntimeElement';
import { ScriptDataSnapshot } from './Snapshot';

export interface IScriptDataParams {
  id?: string;
  meta: IElementMeta;
  configurators: IConfiguratorMap;
  ready: () => void;
}

export class ScriptData extends RuntimeElement {
  readonly ready: () => void;
  constructor({ meta, configurators, id, ready }: IScriptDataParams) {
    super({
      id,
      meta,
      configurators: configurators,
    });
    this.ready = ready;
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
