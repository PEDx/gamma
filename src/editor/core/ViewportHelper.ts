import { AddWidgetCommand, SelectWidgetCommand } from '@/editor/commands';
import { commandHistory } from '@/editor/core/CommandHistory';
import { globalBus } from '@/editor/core/Event';
import { viewTypeMap } from '@/packages';
import { createLayoutViewData, LayoutViewData } from '@/runtime/LayoutViewData';
import { Renderer } from '@/runtime/Renderer';
import { RootViewData } from '@/runtime/RootViewData';
import { ViewData } from '@/runtime/ViewData';
import { IViewDataSnapshotMap } from '@/runtime/ViewDataCollection';
import { ViewDataContainer } from '@/runtime/ViewDataContainer';
import { storage } from '@/utils';
import { EditBoxLayerMethods } from '@/editor/views/EditBoxLayer';
import { EditLayoutLayerMethods } from '@/editor/views/EditLayoutLayer';
import { HoverHighlightLayerMethods } from '@/editor/views/HoverHighlightLayer';
import { MAIN_COLOR } from '@/editor/color';
import { DragType } from '@/editor/core/DragAndDrop/drag';
import { DropItem } from '@/editor/core/DragAndDrop/drop';
import { WidgetDragMeta } from '@/editor/views/WidgetSource';

export interface IViewportParams {
  editBoxLayer: EditBoxLayerMethods;
  editLayoutLayer: EditLayoutLayerMethods;
  hoverHighlightLayer: HoverHighlightLayerMethods;
}

export const setDragEnterStyle = (node: HTMLElement) => {
  node.style.setProperty('outline', `2px dashed ${MAIN_COLOR}`);
};

export const clearDragEnterStyle = (node: HTMLElement) => {
  node.style.setProperty('outline', ``);
};

export class ViewportHelper {
  editBoxLayer: EditBoxLayerMethods;
  editLayoutLayer: EditLayoutLayerMethods;
  hoverHighlightLayer: HoverHighlightLayerMethods;
  constructor({
    editBoxLayer,
    editLayoutLayer,
    hoverHighlightLayer,
  }: IViewportParams) {
    this.editBoxLayer = editBoxLayer;
    this.editLayoutLayer = editLayoutLayer;
    this.hoverHighlightLayer = hoverHighlightLayer;
  }
  /**
   * 清除选中
   */
  clearSelected() {
    this.editBoxLayer.visible(false);
    this.editLayoutLayer.visible(false);
  }
  selectViewData(viewData: ViewData) {
    if (viewData.isHidden()) return;
    this.editBoxLayer.visible(true);
    this.editBoxLayer.setShadowViewData(viewData);
  }
  selectLayoutViewData(viewData: LayoutViewData) {
    if (viewData.isHidden()) return;
    this.editLayoutLayer.visible(true);
    this.editLayoutLayer.setShadowViewData(viewData);
  }
  /**
   *
   * @param widgetName 组件名
   * @param container 添加到的容器
   * @param offset 初始的偏移量
   * @returns
   */
  addViewData(
    widgetName: string,
    container: ViewDataContainer,
    offset: { x: number; y: number },
  ) {
    const createView = viewTypeMap.get(widgetName);
    if (!createView) throw `connot found widget ${widgetName}`;
    const { element, configurators, containers, meta } = createView();
    configurators?.x?.setValue(offset.x);
    configurators?.y?.setValue(offset.y);

    // TODO 此处应该有一次保存到本地的操作
    const viewData = new ViewData({
      element,
      meta,
      configurators,
      containerElements: containers,
    });
    commandHistory.push(new AddWidgetCommand(viewData.id, container.id));
    return viewData;
  }
  /**
   * 添加布局组件
   * @param rootViewData
   */
  addLayoutViewData(rootViewData: RootViewData) {
    const container = rootViewData.getContainer();
    commandHistory.push(
      new AddWidgetCommand(createLayoutViewData().id, container.id),
    );
  }
  /**
   * 添加根组件
   * @param element 根组件挂载的 dom 元素
   * @returns
   */
  addRootViewData(element: HTMLElement) {
    const rootViewData = new RootViewData({
      element,
    });
    return rootViewData;
  }
  /**
   * 初始化根组件
   * @param rootViewData
   */
  initRootViewData(rootViewData: RootViewData) {
    const renderData = storage.get<IViewDataSnapshotMap>('collection') || {};
    const renderer = new Renderer({
      root: rootViewData,
      widgetMap: viewTypeMap,
    });
    renderer.render(renderData);
    globalBus.emit('render-viewdata-tree');
  }
  /**
   * 为元素添加拖放事件，使得组件可以拖拽添加
   * @param element
   */
  initDrop(element: HTMLElement) {
    let dragEnterContainer: HTMLElement | null = null;
    const dropItem = new DropItem<WidgetDragMeta>({
      node: element,
      type: DragType.widget,
      onDragenter: ({ target }) => {
        const node = target as HTMLElement;
        const container = ViewDataContainer.collection.findContainer(node);
        if (!container) return;
        if (dragEnterContainer && dragEnterContainer !== container.element) {
          clearDragEnterStyle(dragEnterContainer);
        }
        dragEnterContainer = container.element;
        setDragEnterStyle(container.element);
      },
      onDragleave: ({ target }) => {
        const node = target as HTMLElement;
        /**
         * 此处保证拿到的是最近父级有 ViewData 的 dom
         */
        const container = ViewDataContainer.collection.findContainer(node);

        if (!container) return false;
        if (dragEnterContainer === container.element) return false;
        /**
         * 从选中容器的子元素移动到父元素，父元素不选中
         */
        clearDragEnterStyle(container.element);
      },
      onDrop: (evt) => {
        if (!dragEnterContainer) return false;
        clearDragEnterStyle(dragEnterContainer);
        const container =
          ViewDataContainer.collection.getViewDataContainerByElement(
            dragEnterContainer,
          );
        const dragMeta = dropItem.getDragMeta(evt);

        if (!dragMeta) throw 'connot found draged widget meta';
        if (!container) throw 'connot found draging container';

        this.addViewData(dragMeta.data, container, {
          x: evt.offsetX,
          y: evt.offsetY,
        });
      },
      onDragend: () => {
        dragEnterContainer && clearDragEnterStyle(dragEnterContainer);
      },
    });
  }
  /**
   * 初始化组件点击处理事件
   * @param element
   */
  initMouseDown(element: HTMLElement) {
    let activeViewData: ViewData;

    const handleMousedown = (event: MouseEvent) => {
      // TODO 多次点击同一个元素，实现逐级向上选中父可编辑元素

      const activeNode = event.target as HTMLElement;
      /**
       * 只有实例化了 ViewData 的节点才能被选中
       */
      const viewData = ViewData.collection.findViewData(activeNode);

      if (!viewData) return;
      /**
       * 点击了相同元素直接透传事件
       */

      if (activeViewData?.id === viewData.id) {
        if (viewData.isLayout) return;
        this.editBoxLayer.attachMouseDownEvent(event);
        return;
      }

      /**
       * root 组件暂时不能选中
       */
      if (viewData.isRoot) return;

      activeViewData = viewData;

      this.handleViewDataMouedown(viewData);

      if (activeViewData?.isLayout) return;

      this.editBoxLayer?.attachMouseDownEvent(event);
    };

    element.addEventListener('mousedown', handleMousedown);
  }
  handleViewDataMouedown(activeViewData: ViewData) {
    this.clearSelected();

    if (!activeViewData) return;

    activeViewData.callConfiguratorsNotify();

    if (activeViewData.isRoot) return;

    commandHistory.push(new SelectWidgetCommand(activeViewData.id));

    if (activeViewData?.isLayout) {
      this.selectLayoutViewData(activeViewData as LayoutViewData);
      return;
    }
    this.selectViewData(activeViewData);
  }
}
