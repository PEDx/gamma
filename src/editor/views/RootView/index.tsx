import { commandHistory } from '@/editor/core/CommandHistory';
import { DragType } from '@/editor/core/DragAndDrop/drag';
import { DropItem } from '@/editor/core/DragAndDrop/drop';
import { globalBus } from '@/editor/core/Event';
import { Renderer } from '@/runtime/Renderer';
import { ViewData } from '@/runtime/ViewData';
import { IViewDataSnapshotMap } from '@/runtime/ViewDataCollection';
import { RootViewData } from '@/runtime/RootViewData';
import { ViewDataContainer } from '@/runtime/ViewDataContainer';
import { LayoutViewDataManager } from '@/editor/core/LayoutViewDataManager';
import { WidgetDragMeta } from '@/editor/views/WidgetSource';
import {
  ActionType,
  useEditorDispatch,
  useEditorState,
} from '@/editor/store/editor';
import { storage } from '@/utils';
import { MAIN_COLOR } from '@/editor/color';
import { viewTypeMap } from '@/packages';
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useImperativeHandle,
} from 'react';
import { AddWidgetCommand, SelectWidgetCommand } from '@/editor/commands';

// TODO 构建到文件，各个编辑组件以怎样的形式存在
// TODO 各个组件的版本管理问题

export const setDragEnterStyle = (node: HTMLElement) => {
  node.style.setProperty('outline', `2px dashed ${MAIN_COLOR}`);
};

export const clearDragEnterStyle = (node: HTMLElement) => {
  node.style.setProperty('outline', ``);
};
interface IRootViewProps {
  onViewMousedown: (e: MouseEvent) => void;
  onViewDragenter: () => void;
  onViewDragend: () => void;
}
export interface IRootViewMethods {
  node: HTMLElement;
  addRootView(): void;
  deleteRootView(): void;
}

export const RootView = forwardRef<IRootViewMethods, IRootViewProps>(
  ({ onViewMousedown, onViewDragenter, onViewDragend }, ref) => {
    const { activeViewData } = useEditorState();
    const dispatch = useEditorDispatch();
    const rootViewRef = useRef<HTMLDivElement | null>(null);
    const layoutViewDataManager = useRef<LayoutViewDataManager | null>(null);

    useEffect(() => {
      if (!rootViewRef.current) return;

      layoutViewDataManager.current = new LayoutViewDataManager(
        rootViewRef.current,
      );

      const rootViewData = new RootViewData({
        element: rootViewRef.current,
      });

      dispatch({
        type: ActionType.SetRootViewData,
        data: rootViewData,
      });

      console.log(rootViewData);

      const renderData = storage.get<IViewDataSnapshotMap>('collection') || {};

      const renderer = new Renderer({
        root: rootViewData,
        widgetMap: viewTypeMap,
      });

      renderer.render(renderData);

      globalBus.emit('render-viewdata-tree');

      let dragEnterContainerElement: HTMLElement | null = null;
      const dropItem = new DropItem<WidgetDragMeta>({
        node: rootViewRef.current,
        type: DragType.widget,
        onDragenter: ({ target }) => {
          const node = target as HTMLElement;
          onViewDragenter();
          const containerElement =
            ViewDataContainer.collection.findContainer(node);
          if (!containerElement) return;
          if (
            dragEnterContainerElement &&
            dragEnterContainerElement !== containerElement
          ) {
            clearDragEnterStyle(dragEnterContainerElement);
          }
          dragEnterContainerElement = containerElement;
          setDragEnterStyle(containerElement);
        },
        onDragleave: ({ target }) => {
          const node = target as HTMLElement;
          const containerElement =
            ViewDataContainer.collection.findContainer(node);
          // ANCHOR 此处保证拿到的是最近父级有 ViewData 的 dom
          // TODO 组件可禁用拖拽功能
          if (!containerElement) return false;
          if (dragEnterContainerElement === containerElement) return false;
          // 从选中容器的子元素移动到父元素，父元素不选中
          clearDragEnterStyle(containerElement);
        },
        onDrop: (evt) => {
          if (!dragEnterContainerElement) return false;
          clearDragEnterStyle(dragEnterContainerElement);
          const container =
            ViewDataContainer.collection.getViewDataContainerByElement(
              dragEnterContainerElement,
            );
          const dragMeta = dropItem.getDragMeta(evt);

          if (!dragMeta) throw 'connot found draged widget meta';
          if (!container) throw 'connot found draging container';

          addWidgetToContainer(dragMeta.data, container, {
            x: evt.offsetX,
            y: evt.offsetY,
          });
        },
        onDragend: () => {
          onViewDragend();
          dragEnterContainerElement &&
            clearDragEnterStyle(dragEnterContainerElement);
        },
      });

      clearActive();
    }, []);

    const handleViewDataClick = useCallback(
      (e) => {
        // TODO 多次点击同一个元素，实现逐级向上选中父可编辑元素
        const activeNode = e.target as HTMLElement;
        // 只有实例化了 ViewData 的节点才能被选中
        const viewData = ViewData.collection.findViewData(activeNode);

        if (!viewData) return;
        if (activeViewData?.id === viewData.id) {
          onViewMousedown(e);
          return;
        }
        clearActive();
        commandHistory.push(new SelectWidgetCommand(viewData.id));
        if (viewData?.isLayout) return;
        onViewMousedown(e);
      },
      [activeViewData],
    );

    const addWidgetToContainer = useCallback(
      (
        widgetName: string,
        container: ViewDataContainer,
        offset: { x: number; y: number },
      ) => {
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
      },
      [],
    );

    const clearActive = useCallback(() => {
      dispatch({
        type: ActionType.SetActiveViewData,
        data: null,
      });
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        node: rootViewRef.current as HTMLElement,
        addRootView: () => {},
        deleteRootView: () => {},
      }),
      [],
    );

    return (
      <div
        className="root-view"
        ref={rootViewRef}
        onMouseDown={handleViewDataClick}
      ></div>
    );
  },
);
