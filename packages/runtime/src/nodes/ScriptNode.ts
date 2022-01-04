import { INodeParams, Node } from './Node';

type TScriptNodeParams = INodeParams & {
  setup(): void;
};
export class ScriptNode extends Node {
  readonly setup: () => void;
  constructor({ id, meta, configurators, setup }: TScriptNodeParams) {
    super({ id, meta, configurators });
    this.setup = setup;
  }
}
