import { EditBoxLayerMethods } from '@/views/EditBoxLayer';
import { EditLayoutLayerMethods } from '@/views/EditLayoutLayer';
import { HighlightLayerMethods } from '@/views/HighlightLayer';
import { DragType } from '@/core/DragAndDrop/drag';
import { DropItem } from '@/core/DragAndDrop/drop';
import { IElementDragMeta } from '@/views/WidgetSource';
import { nodeHelper } from '@/nodeHelper';

export interface IViewportParams {
  editBoxLayer: EditBoxLayerMethods;
  editLayoutLayer: EditLayoutLayerMethods;
  highlightLayer: HighlightLayerMethods;
}

export class ViewportHelper {
  private activeNodeId: string | null = null;
  readonly editBoxLayer: EditBoxLayerMethods;
  readonly editLayoutLayer: EditLayoutLayerMethods;
  readonly highlightLayer: HighlightLayerMethods;
  constructor({
    editBoxLayer,
    editLayoutLayer,
    highlightLayer,
  }: IViewportParams) {
    this.editBoxLayer = editBoxLayer;
    this.editLayoutLayer = editLayoutLayer;
    this.highlightLayer = highlightLayer;
  }
  /**
   * 清除选中
   */
  clearActive() {
    this.activeNodeId = null;
    this.editBoxLayer.visible(false);
    this.editLayoutLayer.visible(false);
  }
  /**
   * 为元素添加拖放事件，使得组件可以拖拽添加
   * @param element
   */
  initDragDropEvent(element: HTMLElement) {
    let activeContainerId: string | null = null;
    const dropItem = new DropItem<IElementDragMeta>({
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

        this.highlightLayer.showHighlight(node);
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

        const enode = nodeHelper.createElementNode();

        if (!activeContainerId) return;

        enode.appendTo(activeContainerId);
      },
      onDragstart: () => {
        this.clearActive();
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
      const enode = nodeHelper.findElementNode(target);
      if (!enode) return;

      if (this.activeNodeId === enode.id) {
        this.editBoxLayer.attachMouseDownEvent(event);
        return;
      }

      this.clearActive();

      this.activeNodeId = enode.id;

      if (nodeHelper.isLayoutNode(enode)) {
        this.editLayoutLayer.visible(true);
        this.editLayoutLayer.setShadowElement(
          enode.element,
          enode.configurators,
        );
        return;
      }

      this.editBoxLayer.visible(true);
      this.editBoxLayer.setShadowElement(enode.element, enode.configurators);
      this.editBoxLayer.attachMouseDownEvent(event);
    };
    element.addEventListener('mousedown', handleMousedown);
  }
}
