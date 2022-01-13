import { ConfigableNode, TConfigableNodeParams } from './ConfigableNode';
import {
  CONTAINER_NODE_TAG,
  ELEMENT_NODE_TAG,
  ENodeType,
} from './Node';

type TViewNodeParams = TConfigableNodeParams & {
  element: HTMLElement;
  container?: boolean;
};

export class ViewNode extends ConfigableNode {

  readonly type: ENodeType = ENodeType.Element;
  /**
   * dom 节点
   */
  readonly element: HTMLElement;
  /**
   * 是否是视图容器
   */
  container: boolean = false;

  constructor({
    id,
    meta,
    element,
    configurators,
    container,
  }: TViewNodeParams) {
    super({ id, configurators, meta });
    this.element = element;
    this.container = !!container;
    this.element.dataset[ELEMENT_NODE_TAG] = this.id;

    /**
     * 标记一个节点是否同时是容器
     */
    if (this.container) this.element.dataset[CONTAINER_NODE_TAG] = 'true';
  }
}
