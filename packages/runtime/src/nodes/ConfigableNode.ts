import { IConfiguratorMap, IElementMeta } from '../elements/IElement';
import { Originator } from '../Originator';
import { Node, INodeParams, TNodeId, ENodeType } from './Node';
import { isNil } from '../utils';

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
      values: getValues(configurators),
      children,
    };
  }

  restore(snapshot: IConfigableNodeSnapshot) {
    const { values } = snapshot;
    setValues(this.configurators, values);
  }
}

function getValues(map: IConfiguratorMap) {
  const values: IConfiguratorValueMap = {};
  Object.keys(map).forEach((key) => {
    values[key] = map[key].value;
  });
  return values;
}

function setValues(
  configurators: IConfiguratorMap,
  data: IConfiguratorValueMap,
) {
  Object.keys(configurators).forEach((key) => {
    const configurator = configurators[key];
    const value = data[key];
    if (isNil(value)) return;
    configurator.value = value;
  });
}
