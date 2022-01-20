import { uuid } from '../utils';
import { Runtime } from '../Runtime';

export type TNodeId = string;
export interface INodeParams {
  id?: TNodeId;
}

export const ELEMENT_NODE_TAG = 'gmNode';

export const CONTAINER_NODE_TAG = 'gmCont';

export enum ENodeType {
  Element,
  Container,
  Layout,
  Srcipt,
  Root,
  Node,
}
/**
 * 只有 nodesContainer 中存有 node 的引用实体
 * 其他地方应该只持有 node 的 id
 */

export class Node {
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
  /**
   * 节点的子级元素
   */
  private _children: TNodeId[] = [];

  constructor({ id }: INodeParams) {
    this.id = id || `${uuid()}`;
    Runtime.container.addItem(this);
  }

  get suspend() {
    return !this._parent;
  }

  get parent() {
    return this._parent;
  }
  set parent(value: TNodeId | null) {
    this._parent = value;
  }
  get children() {
    return this._children;
  }

  append(id: TNodeId | null) {
    id ? Runtime.link(this.id, id) : Runtime.unlink(this.id);
  }
}
