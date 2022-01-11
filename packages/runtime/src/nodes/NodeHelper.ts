import { Collection } from '../Collection';
import {
  Configurator,
  EConfiguratorType,
  TConfigurator,
} from '../configurator/Configurator';
import { BaseViewElement } from '../elements/BaseViewElement';
import { ConfigableNode } from './ConfigableNode';
import { ViewNode } from './ViewNode';
import { LayoutNode } from './LayoutNode';
import { ENodeType, Node, TNodeId } from './Node';
import { CONTAINER_NODE_TAG, ELEMENT_NODE_TAG } from './Node';
import { RootNode } from './RootNode';
import { PXNumberValueEntity } from '../values/UnitNumberValueEntity';

const tryCall = <T extends Function>(fn: T) => {
  try {
    return fn();
  } catch (error) {
    throw error;
  }
};

export class NodeHelper {
  container: Collection<Node>;
  constructor(container: Collection<Node>) {
    this.container = container;
  }
  getNodeByID(id: TNodeId) {
    return this.container.getItemByID(id);
  }
  getViewNodeByID(id: TNodeId) {
    return this.container.getItemByID(id) as ViewNode;
  }
  getViewNodeByTag(element: HTMLElement, tag: string) {
    if (!element || !element.dataset) return null;
    const id = element.dataset[tag] || '';
    if (!id) return null;
    return this.getNodeByID(id);
  }
  getViewNodeByElement(element: HTMLElement) {
    return this.getViewNodeByTag(element, ELEMENT_NODE_TAG) as ViewNode;
  }
  isViewNode(element: HTMLElement | null) {
    if (!element) return false;
    return !!this.getViewNodeByElement(element);
  }
  isContainerNode(element: HTMLElement | null) {
    if (!element || !element.dataset) return null;
    const bol = element.dataset[CONTAINER_NODE_TAG] || '';
    return bol === 'true';
  }
  findViewNode(element: HTMLElement) {
    let _element: HTMLElement | null = element;
    while (!this.isViewNode(_element) && _element) {
      _element = _element?.parentElement;
    }
    if (!_element) return null;
    return this.getViewNodeByElement(_element) as ViewNode;
  }
  findContainerNode(element: HTMLElement) {
    let _element: HTMLElement | null = element;
    while (!this.isContainerNode(_element) && _element) {
      _element = _element?.parentElement;
    }
    if (!_element) return null;
    return this.getViewNodeByElement(_element) as ViewNode;
  }
  createRootNode(rootElement: HTMLElement) {
    const root = new RootNode({
      width: 375,
    });
    root.mount(rootElement);
    return root;
  }
  createViewNode() {
    const { meta, create } = new BaseViewElement();
    const { element, configurators } = tryCall(create);
    return new ViewNode({ meta, element, configurators, container: true });
  }
  createLayoutNode() {
    return new LayoutNode({});
  }
  appendViewNode(sourceId: TNodeId, targetId: TNodeId) {
    const snode = nodeHelper.getViewNodeByID(sourceId);
    const tnode = nodeHelper.getViewNodeByID(targetId);
    snode.append(targetId);
    if (!tnode) throw 'append not view node';
    tnode.element.appendChild(snode.element);
  }
  addLayoutNode(rootId: TNodeId) {
    console.log(rootId);

    const ln = this.createLayoutNode();
    this.appendViewNode(ln.id, rootId);
    return ln;
  }
  addViewNode(id: TNodeId) {
    const en = this.createViewNode();
    this.appendViewNode(en.id, id);
    return en;
  }
  isLayoutNode(node: Node) {
    return node.type === ENodeType.Layout;
  }
  isRootNode(node: Node) {
    return node.type === ENodeType.Root;
  }
  private getConfiguratorByType<T extends EConfiguratorType>(
    node: ConfigableNode,
    type: T,
  ) {
    const configurators = node.configurators;

    let ret: TConfigurator | null = null;

    Object.values(configurators).forEach((conf) => {
      if (conf.type === type) ret = conf;
    });

    return ret as Configurator<PXNumberValueEntity> | null;
  }
  getTypeXConfigurator(node: ConfigableNode) {
    return this.getConfiguratorByType(node, EConfiguratorType.X);
  }
  getTypeYConfigurator(node: ConfigableNode) {
    return this.getConfiguratorByType(node, EConfiguratorType.Y);
  }
  getTypeWConfigurator(node: ConfigableNode) {
    return this.getConfiguratorByType(node, EConfiguratorType.Width);
  }
  getTypeHConfigurator(node: ConfigableNode) {
    return this.getConfiguratorByType(node, EConfiguratorType.Height);
  }
}

export const nodesContainer = new Collection<Node>();

export const nodeHelper = new NodeHelper(nodesContainer);
