import { AddWidgetCommand, SelectWidgetCommand } from '@/commands';
import { commandHistory } from '@/core/CommandHistory';
import {
  createLayoutViewData,
  LayoutViewData,
  ViewData,
  RootViewData,
  ViewDataContainer,
  viewDataHelper,
  ViewDataType,
  RuntimeElement,
} from '@gamma/runtime';
import type { Renderer } from '@gamma/Renderer';
import { EditBoxLayerMethods } from '@/views/EditBoxLayer';
import { EditLayoutLayerMethods } from '@/views/EditLayoutLayer';
import { HighlightLayerMethods } from '@/views/HighlightLayer';
import { DragType } from '@/core/DragAndDrop/drag';
import { DropItem } from '@/core/DragAndDrop/drop';
import { IGammaElementDragMeta } from '@/views/WidgetSource';

export interface IViewportParams {
  editBoxLayer: EditBoxLayerMethods;
  editLayoutLayer: EditLayoutLayerMethods;
  highlightLayer: HighlightLayerMethods;
  renderer: Renderer;
}

export class ViewportHelper {
  private currentActiveViewDataId: string = '';
  private currentOperateViewDataId: string = '';
  readonly editBoxLayer: EditBoxLayerMethods;
  readonly editLayoutLayer: EditLayoutLayerMethods;
  readonly highlightLayer: HighlightLayerMethods;
  readonly renderer: Renderer;
  constructor({
    editBoxLayer,
    editLayoutLayer,
    highlightLayer,
    renderer,
  }: IViewportParams) {
    this.currentActiveViewDataId = '';
    this.editBoxLayer = editBoxLayer;
    this.editLayoutLayer = editLayoutLayer;
    this.highlightLayer = highlightLayer;
    this.renderer = renderer;
  }
  /**
   * 清除选中
   */
  clearActive() {
    this.currentActiveViewDataId = '';
    this.editBoxLayer.visible(false);
    this.editLayoutLayer.visible(false);
  }
  activeViewData(viewData: ViewData) {
    if (viewData.isHidden()) return;
    this.editBoxLayer.visible(true);
    this.editBoxLayer.setShadowViewData(viewData);
  }
  activeLayoutViewData(viewData: LayoutViewData) {
    if (viewData.isHidden()) return;
    this.editLayoutLayer.visible(true);
    this.editLayoutLayer.setShadowViewData(viewData);
  }
  /**
   *
   * @param id 组件名
   * @param container 添加到的容器
   * @param offset 初始的偏移量
   * @returns
   */
  addViewData(
    id: string,
    container: ViewDataContainer,
    offset: { x: number; y: number },
  ) {
    const viewData = this.renderer.createRuntimeElement(id);

    if (!viewData) throw `gamma-element: ${id} not found`;

    const configurators = viewData?.configurators;

    configurators?.x?.setValue(offset.x);
    configurators?.y?.setValue(offset.y);

    commandHistory.push(new AddWidgetCommand(viewData.id, container.id));

    return viewData;
  }
  /**
   * 添加布局组件
   * @param rootViewData
   */
  addLayoutViewData(rootViewData: RootViewData) {
    const container = rootViewData.getContainer();
    const layoutViewData = createLayoutViewData(rootViewData.mode);
    commandHistory.push(new AddWidgetCommand(layoutViewData.id, container.id));
  }
  /**
   * 为元素添加拖放事件，使得组件可以拖拽添加
   * @param element
   */
  initDropEvent(element: HTMLElement) {
    let dragEnterContainer: HTMLElement | null = null;
    const dropItem = new DropItem<IGammaElementDragMeta>({
      node: element,
      type: DragType.element,
      onDragenter: ({ target }) => {
        const node = target as HTMLElement;
        const container = ViewDataContainer.findContainer(node);
        if (!container) return;
        if (
          dragEnterContainer &&
          dragEnterContainer !== container.getElement()
        ) {
          this.highlightLayer.hideHighhightBox();
        }
        dragEnterContainer = container.getElement();
        if (!dragEnterContainer) return;
        this.highlightLayer.showHighlightBox(dragEnterContainer);
      },
      onDragleave: ({ target }) => {
        const node = target as HTMLElement;
        /**
         * 此处保证拿到的是最近父级有 ViewData 的 dom
         */
        const container = ViewDataContainer.findContainer(node);

        if (!container) return false;
        if (dragEnterContainer === container.getElement()) return false;
        /**
         * 从选中容器的子元素移动到父元素，父元素不选中
         */
      },
      onDrop: (evt) => {
        if (!dragEnterContainer) return false;
        const container =
          ViewDataContainer.getViewDataContainerByElement(dragEnterContainer);
        const dragMeta = dropItem.getDragMeta(evt);

        if (!dragMeta) throw 'onDrop: widget meta connot found ';
        if (!container) throw 'onDrop: container connot found';

        this.addViewData(dragMeta.data, container, {
          x: evt.offsetX,
          y: evt.offsetY,
        });
      },
      onDragstart: () => {
        this.clearActive();
      },
      onDragend: () => {
        this.highlightLayer.hideHighhightBox();
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
      // TODO 多次点击同一个元素，实现逐级向上选中父可编辑元素

      const activeNode = event.target as HTMLElement;
      /**
       * 只有实例化了 ViewData 的节点才能被选中
       */
      const viewData = viewDataHelper.findViewData(activeNode) as ViewData;

      if (!viewData) return;

      /**
       * 点击了相同元素直接透传事件
       */
      if (this.currentActiveViewDataId === viewData.id) {
        if (viewData.type === ViewDataType.Layout) return;
        this.editBoxLayer.attachMouseDownEvent(event);
        return;
      }
      /**
       * root 组件暂时不能选中
       */
      if (viewData.type === ViewDataType.Root) return;

      commandHistory.push(new SelectWidgetCommand(viewData.id));

      if (viewData.type === ViewDataType.Layout) return;

      this.editBoxLayer?.attachMouseDownEvent(event);
    };

    element.addEventListener('mousedown', handleMousedown);
  }
  /**
   * 此函数只由 SelectWidgetCommand 命令来调用
   * @param viewData
   * @returns
   */
  setViewDataActive(viewData: ViewData | null) {
    if (!viewData) {
      this.clearActive();
      return;
    }

    if (this.currentActiveViewDataId === viewData.id) return;

    this.clearActive();

    viewData.callConfiguratorsNotify();

    if (viewData.type === ViewDataType.Root) return;

    this.currentActiveViewDataId = viewData.id;

    if (viewData.type === ViewDataType.Layout) {
      this.activeLayoutViewData(viewData as LayoutViewData);
    } else {
      this.activeViewData(viewData);
    }
  }
  cutViewData() {
    this.currentOperateViewDataId = this.currentActiveViewDataId;
  }
  copyViewData() {
    this.currentOperateViewDataId = this.currentActiveViewDataId;
  }
  pasteViewData() {
    if (!this.currentOperateViewDataId) return;
    const operateViewData = RuntimeElement.collection.getItemByID(
      this.currentOperateViewDataId,
    ) as ViewData;

    let container: ViewDataContainer | null = null;

    /**
     * 如果不选中其他组件，就粘贴到当前复制组件的父级
     */
    console.log(this.currentOperateViewDataId === this.currentActiveViewDataId);

    if (this.currentOperateViewDataId === this.currentActiveViewDataId) {
      const viewData = RuntimeElement.collection.getItemByID(
        this.currentActiveViewDataId,
      ) as ViewData;
      container = ViewDataContainer.collection.getItemByID(
        viewData.getParent(),
      );
    } else {
      (
        RuntimeElement.collection.getItemByID(
          this.currentActiveViewDataId,
        ) as ViewData
      ).containers.forEach((id) => {
        const _container = ViewDataContainer.collection.getItemByID(id);
        /**
         * 找到 viewdata 能粘贴的容器
         * TODO 并列显示的多容器需要处理
         */
        if (_container?.getElement()?.offsetParent) container = _container;
      });
    }

    if (!container) return;
    if (!operateViewData) return;

    const viewData = this.addViewData(operateViewData.meta.id, container, {
      x: 0,
      y: 0,
    }) as ViewData;
    viewData.restore(operateViewData.save());
  }
}
