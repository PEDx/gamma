import { ConfigableNode, TConfigableNodeParams } from './ConfigableNode';
import { ENodeType } from './Node';

type TScriptNodeParams = TConfigableNodeParams & {
  setup(): void;
};
export class ScriptNode extends ConfigableNode {
  readonly type = ENodeType.Srcipt;
  readonly setup: () => void;
  constructor({ id, meta, configurators, setup }: TScriptNodeParams) {
    super({ id, meta, configurators });
    this.setup = setup;
  }
}
