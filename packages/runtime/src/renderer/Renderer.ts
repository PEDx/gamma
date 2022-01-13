import {
  ConfigableNode,
  IConfigableNodeSnapshot,
} from '../nodes/ConfigableNode';
import { ENodeType } from '../nodes/Node';
import { nodeHelper } from '../nodes/NodeHelper';
import { RootNode } from '../nodes/RootNode';

export class Renderer {
  constructor() {}
  init(element: HTMLElement) {
    const rootNode = nodeHelper.createRootNode();
    rootNode.mount(element);
    nodeHelper.addLayoutNode(rootNode.id);
  }
  build(element: HTMLElement, data: IConfigableNodeSnapshot[]) {

    let rootData: IConfigableNodeSnapshot | null = null;

    const dataMap: { [key: string]: IConfigableNodeSnapshot } = {};

    data.forEach((data) => {
      if (data.type === ENodeType.Root) rootData = data;
      dataMap[data.id] = data;
      const node = this.create(data);
      this.restore(node, data);
    });

    const rootId = nodeHelper.root;
    if (!rootId) throw 'not found root';

    const rootNode = nodeHelper.getViewNodeByID(rootId) as RootNode;
    rootNode.mount(element);

    if (!rootData) throw 'not found root data';

    this.link(rootData, dataMap);
  }
  /**
   * 创建元素阶段
   */
  private create(data: IConfigableNodeSnapshot) {
    const { id } = data;
    if (data.type === ENodeType.Root) {
      return nodeHelper.createRootNode(id);
    }
    if (data.type === ENodeType.Layout) {
      return nodeHelper.createLayoutNode(id);
    }
    return nodeHelper.createViewNode(id);
  }
  /**
   * 恢复数据阶段
   */
  private restore(node: ConfigableNode, data: IConfigableNodeSnapshot) {
    node.restore(data);
  }
  /**
   * 链接节点阶段
   */
  private link(
    rootData: IConfigableNodeSnapshot,
    map: { [key: string]: IConfigableNodeSnapshot },
  ) {
    const walk = (id: string, parentId: string) => {
      const node = nodeHelper.getViewNodeByID(id);
      const data = map[id];
      if (!node) return;
      nodeHelper.appendViewNode(node.id, parentId);
      data.children.forEach((childId) => walk(childId, id));
    };

    const rootId = rootData.id;
    rootData.children.forEach((id) => walk(id, rootId));
  }
}
