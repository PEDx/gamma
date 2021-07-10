import { commandHistory } from '@/editor/core/CommandHistory';
import { DragType } from '@/editor/core/DragAndDrop/drag';
import { DropItem } from '@/editor/core/DragAndDrop/drop';
import { globalBus } from '@/editor/core/Event';
import { Render } from '@/runtime/Render';
import { LayoutViewData } from '@/runtime/LayoutViewData';
import { ViewData } from '@/runtime/ViewData';
import { IViewDataSnapshotMap } from '@/runtime/ViewDataCollection';
import { ViewDataContainer } from '@/runtime/ViewDataContainer';
import { ViewDataSnapshot } from '@/runtime/ViewDataSnapshot';
import { LayoutViewDataManager } from '@/editor/core/LayoutViewDataManager';
import { WidgetType } from '@/runtime/CreationView';
import { WidgetDragMeta } from '@/editor/views/WidgetSource';
import { ActionType, useEditorDispatch } from '@/editor/store/editor';
import { storage } from '@/utils';
import { isEmpty } from 'lodash';
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
import './style.scss';

// TODO 构建到文件，各个编辑组件以怎样的形式存在
// TODO 各个组件的版本管理问题

export const setDragEnterStyle = (node: HTMLElement) => {
  node.style.setProperty('outline', `2px dashed ${MAIN_COLOR}`);
};

export const clearDragEnterStyle = (node: HTMLElement) => {
  node.style.setProperty('outline', ``);
};

const meta = {
  id: 'gamma-layout-container',
  name: '布局容器',
  icon: '',
  type: WidgetType.DOM,
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

const getDefualtRoot = () =>
  new ViewDataSnapshot({
    meta: meta,
    isLayout: true,
    index: 1,
    configurators: {
      height: 500,
      backgroundColor: {
        r: 255,
        g: 255,
        b: 255,
        a: 1,
      },
    },
    containers: [[]],
  });

const createRootDiv = () => {
  const element = document.createElement('DIV');
  element.style.setProperty('position', 'relative');
  element.style.setProperty('overflow', 'hidden');
  return element;
};

export const RootView = forwardRef<IRootViewMethods, IRootViewProps>(
  ({ onViewMousedown, onViewDragenter, onViewDragend }, ref) => {
    const dispatch = useEditorDispatch();
    const rootViewRef = useRef<HTMLDivElement | null>(null);
    const activeViewDataElement = useRef<HTMLElement | null>(null);
    const layoutViewDataManager = useRef<LayoutViewDataManager | null>(null);

    const initRootRenderData = useCallback(() => {
      const renderData = storage.get<IViewDataSnapshotMap>('collection') || {};

      const rootRenderData = Object.values(renderData)
        .filter((data) => {
          if (data.isLayout) return data;
        })
        .sort((a, b) => a.index! - b.index!);

      if (isEmpty(rootRenderData)) {
        rootRenderData.push(getDefualtRoot());
      }

      rootRenderData.forEach((data) => {
        const layoutViewData = addRootView(data);
        const target = new Render({
          target: layoutViewData,
          widgetMap: viewTypeMap,
        });
        if (!renderData) return;
        target.render(data, renderData);
        globalBus.emit('render-viewdata-tree');
      });
    }, []);

    useEffect(() => {
      if (!rootViewRef.current) return;

      layoutViewDataManager.current = new LayoutViewDataManager(
        rootViewRef.current,
      );

      initRootRenderData();

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
          if (!container) throw 'connot found  draging container';

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
      // TODO 多次点击同一个元素，实现逐级向上选中父可编辑元素
      rootViewRef.current.addEventListener('mousedown', (e) => {
        const activeNode = e.target as HTMLElement;
        // 只有实例化了 ViewData 的节点才能被选中
        const viewData = ViewData.collection.findViewData(activeNode);

        if (!viewData) return;
        if (activeViewDataElement.current === viewData?.element) {
          onViewMousedown(e);
          return;
        }
        clearActive();
        activeViewDataElement.current = viewData.element;
        commandHistory.push(new SelectWidgetCommand(viewData.id));
        if (viewData?.isLayout) return;
        onViewMousedown(e);
      });
    }, []);

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

    const addRootView = useCallback((data?: ViewDataSnapshot) => {
      const layoutViewData = new LayoutViewData({
        meta,
        element: createRootDiv(),
      });
      if (!data) {
        data = getDefualtRoot();
      }
      layoutViewData.restore(data);
      layoutViewDataManager.current?.addLayoutViewData(layoutViewData);
      globalBus.emit('render-viewdata-tree');
      return layoutViewData;
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        node: rootViewRef.current as HTMLElement,
        addRootView: () => {
          addRootView();
        },
        deleteRootView: () => {},
      }),
      [],
    );

    return <div className="root-view" ref={rootViewRef}></div>;
  },
);
