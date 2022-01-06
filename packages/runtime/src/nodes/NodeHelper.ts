import { Collection } from '../Collection';
import {
  EConfiguratorType,
  IConfiguratorType,
} from '../configurator/Configurator';
import { BaseViewElement } from '../elements/BaseViewElement';
import { ConfigableNode } from './ConfigableNode';
import { ElementNode } from './ElementNode';
import { LayoutNode } from './LayoutNode';
import { ENodeType, Node, TNodeId } from './Node';
import { CONTAINER_NODE_TAG, ELEMENT_NODE_TAG } from './Node';
import { RootNode } from './RootNode';

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
  getElementNodeByID(id: TNodeId) {
    return this.container.getItemByID(id) as ElementNode;
  }
  getElementNodeByTag(element: HTMLElement, tag: string) {
    if (!element || !element.dataset) return null;
    const id = element.dataset[tag] || '';
    if (!id) return null;
    return this.getNodeByID(id);
  }
  getElementNodeByElement(element: HTMLElement) {
    return this.getElementNodeByTag(element, ELEMENT_NODE_TAG) as ElementNode;
  }
  isElementNode(element: HTMLElement | null) {
    if (!element) return false;
    return !!this.getElementNodeByElement(element);
  }
  isContainerNode(element: HTMLElement | null) {
    if (!element || !element.dataset) return null;
    const bol = element.dataset[CONTAINER_NODE_TAG] || '';
    return bol === 'true';
  }
  findElementNode(element: HTMLElement) {
    let _element: HTMLElement | null = element;
    while (!this.isElementNode(_element) && _element) {
      _element = _element?.parentElement;
    }
    if (!_element) return null;
    return this.getElementNodeByElement(_element) as ElementNode;
  }
  findContainerNode(element: HTMLElement) {
    let _element: HTMLElement | null = element;
    while (!this.isContainerNode(_element) && _element) {
      _element = _element?.parentElement;
    }
    if (!_element) return null;
    return this.getElementNodeByElement(_element) as ElementNode;
  }
  createRootNode(rootElement: HTMLElement) {
    const root = new RootNode({
      width: 375,
    });
    root.mount(rootElement);
    return root;
  }
  createElementNode() {
    const { meta, create } = new BaseViewElement();
    const { element, configurators } = tryCall(create);
    return new ElementNode({ meta, element, configurators, container: true });
  }
  createLayoutNode() {
    return new LayoutNode({});
  }
  addLayoutNode(id: TNodeId) {
    const ln = this.createLayoutNode();
    ln.appendTo(id);
    return ln;
  }
  addElementNode(id: TNodeId) {
    const en = this.createElementNode();
    en.appendTo(id);
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

    let ret: IConfiguratorType[typeof type] | null = null;

    Object.values(configurators).forEach((conf) => {
      if (conf.type === type) ret = conf as IConfiguratorType[typeof type];
    });

    return ret as IConfiguratorType[typeof type] | null;
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
