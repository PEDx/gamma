import {
  ConfigableNode,
  IConfigableNodeSnapshot,
} from './nodes/ConfigableNode';
import { ENodeType } from './nodes/Node';
import { RootNode } from './nodes/RootNode';
import { Runtime } from './Runtime';

export class Renderer {
  init(element: HTMLElement) {
    const rootNode = Runtime.createRootNode();
    rootNode.mount(element);
    Runtime.addLayoutNode(rootNode.id);
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

    if (!rootData) {
      /**
       * 根节点数据丢失
       */
      this.init(element);
      return;
    }

    const rootId = (<IConfigableNodeSnapshot>rootData).id;

    if (!rootId) throw 'not found root';

    this.link(rootData, dataMap);

    const rootNode = Runtime.getViewNodeByID(rootId) as RootNode;

    rootNode.mount(element);
  }
  /**
   * 创建元素
   */
  private create(data: IConfigableNodeSnapshot) {
    const { id } = data;
    if (data.type === ENodeType.Root) {
      return Runtime.createRootNode(id);
    }
    if (data.type === ENodeType.Layout) {
      return Runtime.createLayoutNode(id);
    }
    return Runtime.createViewNode(id);
  }
  /**
   * 恢复数据
   */
  private restore(node: ConfigableNode, data: IConfigableNodeSnapshot) {
    node.restore(data);
  }
  /**
   * 链接节点
   */
  private link(
    rootData: IConfigableNodeSnapshot,
    map: { [key: string]: IConfigableNodeSnapshot },
  ) {
    const walk = (id: string, parentId: string) => {
      const node = Runtime.getViewNodeByID(id);
      const data = map[id];
      if (!node) return;
      Runtime.appendViewNode(node.id, parentId);
      data.children.forEach((childId) => walk(childId, id));
    };

    const rootId = rootData.id;
    rootData.children.forEach((id) => walk(id, rootId));
  }
}
