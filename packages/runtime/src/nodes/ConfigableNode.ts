import { IConfiguratorMap, IElementMeta } from '../elements/IElement';
import { Originator } from '../Originator';
import { Node, INodeParams, TNodeId, ENodeType } from './Node';
import { nodeHelper } from './NodeHelper';

export type TConfigableNodeParams = INodeParams & {
  meta: IElementMeta;
  configurators: IConfiguratorMap;
};

export interface IConfiguratorValueMap {
  [key: string]: unknown;
}

export interface IConfigableNodeSnapshot {
  id: TNodeId;
  type: ENodeType;
  meta: IElementMeta;
  values: IConfiguratorValueMap;
  children: TNodeId[];
}

export class ConfigableNode extends Node implements Originator {
  /**
   * 元数据
   */
  readonly meta: IElementMeta;
  /**
   * 配置器表
   * TODO 配置器的动态添加
   */
  readonly configurators: IConfiguratorMap;
  constructor({ id, meta, configurators }: TConfigableNodeParams) {
    super({ id });
    this.meta = meta;
    this.configurators = configurators;
  }

  save(): IConfigableNodeSnapshot {
    const { id, type, meta, children, configurators } = this;
    return {
      id,
      type,
      meta,
      values: nodeHelper.getConfiguratorValueMap(configurators),
      children,
    };
  }

  restore(snapshot: IConfigableNodeSnapshot) {
    const { values } = snapshot;
    nodeHelper.setConfiguratorValue(this.configurators, values);
  }
}
