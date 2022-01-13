import { Originator } from '../Originator';
import { nodeHelper, link, unlink } from './NodeHelper';
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
  /**
   * 节点的子级元素
   */
  private _children: TNodeId[] = [];

  constructor({ id }: INodeParams) {
    this.id = id || `${uuid()}`;
    nodeHelper.container.addItem(this);
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
    id ? link(this.id, id) : unlink(this.id);
  }

  save() {
    return '';
  }

  restore() {}
}
