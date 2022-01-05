import { IConfiguratorMap, IElementMeta } from '../elements/IElement';
import { Node, INodeParams } from './Node';

export type TConfigableNodeParams = INodeParams & {
  meta: IElementMeta;
  configurators: IConfiguratorMap;
};

export abstract class ConfigableNode extends Node {
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
}
