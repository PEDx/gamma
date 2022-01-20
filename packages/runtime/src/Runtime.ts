import { AsyncUpdateQueue } from './AsyncUpdateQueue';
import { Collection } from './Collection';
import { BaseViewElement } from './elements/BaseViewElement';
import { LayoutNode } from './nodes/LayoutNode';
import { RootNode } from './nodes/RootNode';
import {
  CONTAINER_NODE_TAG,
  ELEMENT_NODE_TAG,
  ENodeType,
  Node,
  TNodeId,
} from './nodes/Node';
import { ViewNode } from './nodes/ViewNode';
import { Renderer } from './Renderer';
import { Storage } from './Storage';
import { remove, tryCall } from './utils';
import { Configurator, EConfiguratorType, TConfigurator } from './Configurator';
import { ConfigableNode } from './nodes/ConfigableNode';
import { PXNumberValueEntity } from './values/UnitNumberValueEntity';

export namespace Runtime {
  export const container = new Collection<Node>();
  export const storage = new Storage();
  export const updateQueue = new AsyncUpdateQueue();
  export const renderer = new Renderer();

  export let root = '';

  export function createRootNode(id?: string) {
    const node = new RootNode({
      id,
      width: 375,
    });
    root = node.id;
    return node;
  }

  export function createViewNode(id?: string) {
    const { meta, create } = new BaseViewElement();
    const { element, configurators } = tryCall(create);
    return new ViewNode({ id, meta, element, configurators, container: true });
  }

  export function createLayoutNode(id?: string) {
    return new LayoutNode({ id });
  }

  export function getNodeByID(id: TNodeId) {
    return container.getItemByID(id);
  }

  export function getViewNodeByID(id: TNodeId) {
    return container.getItemByID(id) as ViewNode | null;
  }

  export function getViewNodeByTag(element: HTMLElement, tag: string) {
    if (!element || !element.dataset) return null;
    const id = element.dataset[tag] || '';
    if (!id) return null;
    return getNodeByID(id);
  }

  export function getViewNodeByElement(element: HTMLElement) {
    return getViewNodeByTag(element, ELEMENT_NODE_TAG) as ViewNode;
  }

  export function isViewNode(element: HTMLElement | null) {
    if (!element) return false;
    return !!getViewNodeByElement(element);
  }

  export function isContainerNode(element: HTMLElement | null) {
    if (!element || !element.dataset) return null;
    const bol = element.dataset[CONTAINER_NODE_TAG] || '';
    return bol === 'true';
  }

  export function findViewNode(element: HTMLElement) {
    let _element: HTMLElement | null = element;
    while (!isViewNode(_element) && _element) {
      _element = _element?.parentElement;
    }
    if (!_element) return null;
    return getViewNodeByElement(_element) as ViewNode;
  }

  export function findContainerNode(element: HTMLElement) {
    let _element: HTMLElement | null = element;
    while (!isContainerNode(_element) && _element) {
      _element = _element?.parentElement;
    }
    if (!_element) return null;
    return getViewNodeByElement(_element) as ViewNode;
  }

  export function appendViewNode(sourceId: TNodeId, targetId: TNodeId) {
    const snode = getViewNodeByID(sourceId);
    const tnode = getViewNodeByID(targetId);
    if (!snode || !tnode) throw 'could not append viewnode';
    tnode.element.appendChild(snode.element);
    snode.append(targetId);
  }

  export function removeViewNode(id: TNodeId) {
    const node = getViewNodeByID(id);
    if (!node || !node.parent) return;
    const pnode = getViewNodeByID(node.parent);
    if (!pnode) return;
    /**
     * 在视图上删掉 node
     */
    pnode.element.removeChild(node.element);
    /**
     * 将 node 悬挂起来
     */
    node.append(null);
  }

  export function addLayoutNode(rootId: TNodeId) {
    const ln = createLayoutNode();
    appendViewNode(ln.id, rootId);
    return ln;
  }

  export function addViewNode(id: TNodeId) {
    const en = createViewNode();
    appendViewNode(en.id, id);
    return en;
  }

  export function isLayoutNode(node: Node) {
    return node.type === ENodeType.Layout;
  }

  export function isRootNode(node: Node) {
    return node.type === ENodeType.Root;
  }

  export function isLastLayoutNode(node: ViewNode) {
    const rootNode = getViewNodeByID(root!);
    const layoutIds = rootNode!.children;
    const lastId = layoutIds[layoutIds.length - 1];
    return lastId === node.id;
  }

  export function save() {
    const colletion = container.getCollection();
    const list = Object.values(colletion).filter(
      (item) => !item.suspend || item.type === ENodeType.Root,
    );
    const data = list.map((item) => (<ViewNode>item).save());
    storage.save(data);
  }

  export function unlink(id: TNodeId) {
    const node = container.getItemByID(id);
    if (!node || !node.parent) return;
    const _parant = container.getItemByID(node.parent);
    if (!_parant) return;
    remove(_parant.children, node.id);
    node.parent = null;
  }

  export function link(childId: TNodeId, parentId: TNodeId) {
    const child = container.getItemByID(childId);
    const parent = container.getItemByID(parentId);
    if (!child || !parent) return;

    if (child.parent) unlink(child.id);

    child.parent = parent.id;
    parent.children.push(childId);
  }

  export type CPVE = Configurator<PXNumberValueEntity>;

  export function getConfiguratorByType<T extends EConfiguratorType>(
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
  export function getTypeXConfigurator(node: ConfigableNode) {
    return getConfiguratorByType(node, EConfiguratorType.X);
  }
  export function getTypeYConfigurator(node: ConfigableNode) {
    return getConfiguratorByType(node, EConfiguratorType.Y);
  }
  export function getTypeWConfigurator(node: ConfigableNode) {
    return getConfiguratorByType(node, EConfiguratorType.Width);
  }
  export function getTypeHConfigurator(node: ConfigableNode) {
    return getConfiguratorByType(node, EConfiguratorType.Height);
  }
}
