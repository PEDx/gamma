import { EditBoxLayerMethods } from '@/views/EditBoxLayer';
import { EditLayoutLayerMethods } from '@/views/EditLayoutLayer';
import { IHighlightLayerMethods } from '@/views/HighlightLayer';
import { DragType } from '@/core/DragAndDrop/DragItem';
import { DropItem } from '@/core/DragAndDrop/DropItem';
import { nodeHelper } from '@/nodeHelper';
import { activeNodeManager } from './ActiveNodeManager';

export interface IViewportParams {
  editBoxLayer: EditBoxLayerMethods;
  editLayoutLayer: EditLayoutLayerMethods;
  highlightLayer: IHighlightLayerMethods;
}

export class ViewportHelper {
  readonly editBoxLayer: EditBoxLayerMethods;
  readonly editLayoutLayer: EditLayoutLayerMethods;
  readonly highlightLayer: IHighlightLayerMethods;
  constructor({
    editBoxLayer,
    editLayoutLayer,
    highlightLayer,
  }: IViewportParams) {
    this.editBoxLayer = editBoxLayer;
    this.editLayoutLayer = editLayoutLayer;
    this.highlightLayer = highlightLayer;

    activeNodeManager.onActive((id) => {
      id ? this.active(id) : this.inactive();
    });
  }
  /**
   * 为元素添加拖放事件，使得组件可以拖拽添加
   * @param element
   */
  initDragDropEvent(element: HTMLElement) {
    let activeContainerId: string | null = null;
    const dropItem = new DropItem({
      node: element,
      inner: true,
      type: DragType.element,
      onDragenter: ({ target }) => {
        const node = target as HTMLElement;
        const enode = nodeHelper.findContainerNode(node);
        if (!enode) return;

        if (enode.id !== activeContainerId) {
          this.highlightLayer.hideHighhight();
        }

        activeContainerId = enode.id;

        this.highlightLayer.showHighlight(activeContainerId);
      },
      onDragleave: ({ target }) => {
        const node = target as HTMLElement;

        const enode = nodeHelper.findContainerNode(node);

        if (!enode) return false;

        if (activeContainerId === enode.id) return false;
      },
      onDrop: (evt) => {
        const dragMeta = dropItem.getDragMeta(evt);
        console.log(dragMeta);

        const enode = nodeHelper.createViewNode();

        if (!activeContainerId) return;

        nodeHelper.appendViewNode(enode.id, activeContainerId);

        const xConf = nodeHelper.getTypeXConfigurator(enode);

        const yConf = nodeHelper.getTypeYConfigurator(enode);

        if (xConf) xConf.value = evt.offsetX;

        if (yConf) yConf.value = evt.offsetY;
      },
      onDragstart: () => {
        this.inactive();
      },
      onDragend: () => {
        this.highlightLayer.hideHighhight();
      },
    });
  }
  /**
   * 初始化组件点击处理事件
   * @param element
   */
  initMouseDown(element: HTMLElement) {
    /**
     * 此处处理点击有可能是单纯的选中，也可能是直接拖拽移动
     * 因此要透传事件给编辑层
     * @param event
     * @returns
     */
    const handleMousedown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const enode = nodeHelper.findViewNode(target);
      if (!enode) return;

      if (activeNodeManager.same(enode)) {
        this.editBoxLayer.attachMouseDownEvent(event);
        return;
      }

      activeNodeManager.active(enode.id);

      this.editBoxLayer.attachMouseDownEvent(event);
    };
    element.addEventListener('mousedown', handleMousedown);
  }
  /**
   * 清除选中
   */
  private inactive() {
    this.editBoxLayer.visible(false);
    this.editLayoutLayer.visible(false);
  }
  /**
   * 选中节点
   */
  private active(id: string) {
    const node = nodeHelper.getViewNodeByID(id);
    if (!node) return;

    this.inactive();

    if (nodeHelper.isLayoutNode(node)) {
      this.editLayoutLayer.visible(true, nodeHelper.isLastLayoutNode(node));
      this.editLayoutLayer.setShadowElement(node.element);
      return;
    }

    this.editBoxLayer.visible(true);
    this.editBoxLayer.setShadowElement(node.element);
  }
}
