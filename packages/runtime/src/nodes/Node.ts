import { Collection } from '../Collection';
import { IConfiguratorMap, IElementMeta } from '../elements/IElement';
import { Originator } from '../Originator';
import { uuid } from '../utils';
import { NodeHelper } from './NodeHelper';

type TNodeId = string;
export interface INodeParams {
  id?: TNodeId;
  meta: IElementMeta;
  configurators: IConfiguratorMap;
}

/**
 * 只有 nodesContainer 中存有 node 的引用实体
 * 其他地方尽量只持有 node 的 id
 */

export enum ENodeType {
  Element = 'Element',
  Layout = 'Layout',
  Srcipt = 'Srcipt',
  Root = 'Root',
  Node = 'Node',
}

export const nodesContainer = new Collection<Node>();
export const nodeHelper = new NodeHelper();

export class Node implements Originator {
  readonly type: ENodeType = ENodeType.Node; // 节点类型
  readonly id: TNodeId; // 唯一 id
  readonly meta: IElementMeta; // 元数据
  readonly configurators: IConfiguratorMap; // 配置器表
  private _parent: TNodeId | null = null;

  constructor({ id, configurators = {}, meta }: INodeParams) {
    this.id = id || `${uuid()}`;
    this.configurators = configurators;
    this.meta = meta;
    nodesContainer.addItem(this);
  }

  get suspend() {
    return !!this._parent;
  }

  get parent() {
    return this._parent;
  }

  append(id: TNodeId | null) {
    this._parent = id;
  }

  save() {
    return '';
  }

  restore() {}
}
