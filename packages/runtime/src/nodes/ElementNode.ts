import { ConfigableNode, TConfigableNodeParams } from './ConfigableNode';
import {
  CONTAINER_NODE_TAG,
  ELEMENT_NODE_TAG,
  ENodeType,
  TNodeId,
} from './Node';
import { nodeHelper } from './NodeHelper';

type TElementNodeParams = TConfigableNodeParams & {
  element: HTMLElement;
  container?: boolean;
};

export class ElementNode extends ConfigableNode {

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
  }: TElementNodeParams) {
    super({ id, configurators, meta });
    this.element = element;
    this.container = !!container;
    this.element.dataset[ELEMENT_NODE_TAG] = this.id;
    if (this.container) this.element.dataset[CONTAINER_NODE_TAG] = 'true';
  }
  appendTo(id: TNodeId) {
    this.append(id);
    const node = nodeHelper.getNodeByID(id) as ElementNode;
    if (!node.element) throw 'append not view node';
    const element = node.element;
    element.appendChild(this.element);
  }
}
