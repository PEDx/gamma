import { EditBoxLayerMethods } from '@/views/EditBoxLayer';
import { EditLayoutLayerMethods } from '@/views/EditLayoutLayer';
import { HighlightLayerMethods } from '@/views/HighlightLayer';
import { DragType } from '@/core/DragAndDrop/drag';
import { DropItem } from '@/core/DragAndDrop/drop';
import { IGammaElementDragMeta } from '@/views/WidgetSource';
import { nodeHelper } from '@/nodeHelper';

export interface IViewportParams {
  editBoxLayer: EditBoxLayerMethods;
  editLayoutLayer: EditLayoutLayerMethods;
  highlightLayer: HighlightLayerMethods;
}

export class ViewportHelper {
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
  clearActive() {}
  activeViewData() {}
  activeLayoutViewData() {}
  /**
   * 为元素添加拖放事件，使得组件可以拖拽添加
   * @param element
   */
  initDragDropEvent(element: HTMLElement) {
    new DropItem<IGammaElementDragMeta>({
      node: element,
      inner: true,
      type: DragType.element,
      onDragenter: ({ target }) => {
        const node = target as HTMLElement;
      },
      onDragleave: ({ target }) => {
        const node = target as HTMLElement;
        /**
         * 此处保证拿到的是最近父级有 ViewData 的 dom
         */
        /**
         * 从选中容器的子元素移动到父元素，父元素不选中
         */
      },
      onDrop: (evt) => {},
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
      const activeNode = event.target as HTMLElement;
      const en = nodeHelper.findElementNode(activeNode);
      if (!en) return;
      if (nodeHelper.isLayoutNode(en)) {
        this.editLayoutLayer.visible(true);
        this.editLayoutLayer.setShadowElement(en.element, en.configurators);
        return;
      }
      this.editBoxLayer.visible(true);
    };
    element.addEventListener('mousedown', handleMousedown);
  }
  copyViewData() {}
  pasteViewData() {
    // add node
  }
}
