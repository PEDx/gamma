import { EditBoxLayerMethods } from '@/views/EditBoxLayer';
import { EditLayoutLayerMethods } from '@/views/EditLayoutLayer';
import { IHighlightLayerMethods } from '@/views/HighlightLayer';
import { DragType } from '@/core/DragAndDrop/DragItem';
import { DropItem } from '@/core/DragAndDrop/DropItem';
import { Editor } from '@/core/Editor';

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

    Editor.selector.onSelect((id) => {
      id ? this.active(id) : this.inactive();
    });
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
    const node = Editor.runtime.getViewNodeByID(id);
    if (!node) return;

    this.inactive();

    if (Editor.runtime.isLayoutNode(node)) {
      this.editLayoutLayer.visible(true, Editor.runtime.isLastLayoutNode(node));
      this.editLayoutLayer.setShadowElement(node.element);
      return;
    }

    this.editBoxLayer.visible(true);
    this.editBoxLayer.setShadowElement(node.element);
  }
  /**
   * 将 viewport 区域变为可拖放区域
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
        const enode = Editor.runtime.findContainerNode(node);
        if (!enode) return;

        if (enode.id !== activeContainerId) {
          this.highlightLayer.hideHighhight();
        }

        activeContainerId = enode.id;

        this.highlightLayer.showHighlight(activeContainerId);
      },
      onDragleave: ({ target }) => {
        const node = target as HTMLElement;

        const enode = Editor.runtime.findContainerNode(node);

        if (!enode) return false;

        if (activeContainerId === enode.id) return false;
      },
      onDrop: (evt) => {
        const dragMeta = dropItem.getDragMeta(evt);
        console.log(dragMeta);

        const enode = Editor.runtime.createViewNode();

        if (!activeContainerId) return;

        Editor.runtime.appendViewNode(enode.id, activeContainerId);

        const xConf = Editor.runtime.getTypeXConfigurator(enode);

        const yConf = Editor.runtime.getTypeYConfigurator(enode);

        if (xConf) xConf.value = evt.offsetX;

        if (yConf) yConf.value = evt.offsetY;

        Editor.selector.select(enode.id);
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
   * 监听 viewport 区域的鼠标点击操作
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
      const enode = Editor.runtime.findViewNode(target);
      if (!enode) return;

      if (Editor.selector.same(enode.id)) {
        this.editBoxLayer.attachMouseDownEvent(event);
        return;
      }

      Editor.selector.select(enode.id);

      this.editBoxLayer.attachMouseDownEvent(event);
    };
    element.addEventListener('mousedown', handleMousedown);
  }
}
