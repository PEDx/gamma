import { Originator } from '../Originator';
import { nodesContainer } from './NodeHelper';
import { uuid } from '../utils';

export type TNodeId = string;
export interface INodeParams {
  id?: TNodeId;
}

export const ELEMENT_NODE_TAG = 'gmNode';

export const CONTAINER_NODE_TAG = 'gmCont';

export enum ENodeType {
  Element = 'Element',
  Container = 'Container',
  Layout = 'Layout',
  Srcipt = 'Srcipt',
  Root = 'Root',
  Node = 'Node',
}
/**
 * 只有 nodesContainer 中存有 node 的引用实体
 * 其他地方应该只持有 node 的 id
 */

export class Node implements Originator {
  /**
   * 节点类型
   */
  readonly type: ENodeType = ENodeType.Node;
  /**
   * 唯一 id
   */
  readonly id: TNodeId;
  /**
   * 节点的父级元素
   */
  private _parent: TNodeId | null = null;

  constructor({ id }: INodeParams) {
    this.id = id || `${uuid()}`;
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
