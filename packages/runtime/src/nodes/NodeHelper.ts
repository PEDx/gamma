import { Collection } from '../Collection';
import {
  Configurator,
  EConfiguratorType,
  TConfigurator,
} from '../configurator/Configurator';
import { BaseViewElement } from '../elements/BaseViewElement';
import { ConfigableNode, IConfiguratorValueMap } from './ConfigableNode';
import { ViewNode } from './ViewNode';
import { LayoutNode } from './LayoutNode';
import { ENodeType, Node, TNodeId } from './Node';
import { CONTAINER_NODE_TAG, ELEMENT_NODE_TAG } from './Node';
import { RootNode } from './RootNode';
import { PXNumberValueEntity } from '../values/UnitNumberValueEntity';
import { IConfiguratorMap } from '../elements/IElement';
import { storage } from '../renderer/Storage';
import { isNil } from '../utils';

const tryCall = <T extends Function>(fn: T) => {
  try {
    return fn();
  } catch (error) {
    throw error;
  }
};

export class NodeHelper {
  container: Collection<Node>;
  root: string | null = null;
  constructor(container: Collection<Node>) {
    this.container = container;
  }
  getNodeByID(id: TNodeId) {
    return this.container.getItemByID(id);
  }
  getViewNodeByID(id: TNodeId) {
    return this.container.getItemByID(id) as ViewNode | null;
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
  createRootNode(id?: string) {
    const root = new RootNode({
      id,
      width: 375,
    });
    this.root = root.id;
    return root;
  }
  createViewNode(id?: string) {
    const { meta, create } = new BaseViewElement();
    const { element, configurators } = tryCall(create);
    return new ViewNode({ id, meta, element, configurators, container: true });
  }
  createLayoutNode(id?: string) {
    return new LayoutNode({ id });
  }
  appendViewNode(sourceId: TNodeId, targetId: TNodeId) {
    const snode = nodeHelper.getViewNodeByID(sourceId);
    const tnode = nodeHelper.getViewNodeByID(targetId);
    if (!snode) return;
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
  getConfiguratorValueMap(map: IConfiguratorMap) {
    const values: IConfiguratorValueMap = {};
    Object.keys(map).forEach((key) => {
      values[key] = map[key].value;
    });
    return values;
  }
  setConfiguratorValue(
    configurators: IConfiguratorMap,
    data: IConfiguratorValueMap,
  ) {
    Object.keys(configurators).forEach((key) => {
      const configurator = configurators[key];
      const value = data[key];
      if(isNil(value)) return
      configurator.value = value;
    });
  }
  save() {
    const colletion = this.container.getCollection();
    const data = Object.values(colletion).map((item) =>
      (<ViewNode>item).save(),
    );
    storage.save(data);
  }
  getLocalData() {
    return storage.get();
  }
}

export const nodesContainer = new Collection<Node>();

export const nodeHelper = new NodeHelper(nodesContainer);

export const link = (childId: TNodeId, parentId: TNodeId) => {
  const child = nodesContainer.getItemByID(childId);
  const parent = nodesContainer.getItemByID(parentId);
  if (!child || !parent) return;

  if (child.parent) unlink(child.id);

  child.parent = parent.id;
  parent.children.push(childId);
};

export const unlink = (id: TNodeId) => {
  const node = nodesContainer.getItemByID(id);
  if (!node || !node.parent) return;
  const _parant = nodesContainer.getItemByID(node.parent);
  if (!_parant) return;
  var index = _parant.children.indexOf(node.id);
  if (index > -1) {
    _parant.children.splice(index, 1);
  }
  node.parent = null;
};
