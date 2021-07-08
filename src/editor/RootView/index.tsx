import { commandHistory } from '@/class/CommandHistory';
import { DragType } from '@/class/DragAndDrop/drag';
import {
  clearDragEnterStyle,
  DropItem,
  setDragEnterStyle,
} from '@/class/DragAndDrop/drop';
import { globalBus } from '@/class/Event';
import { Render } from '@/class/Render';
import { RootViewData } from '@/class/ViewData/RootViewData';
import { ViewData } from '@/class/ViewData/ViewData';
import { IViewDataSnapshotMap } from '@/class/ViewData/ViewDataCollection';
import { ViewDataContainer } from '@/class/ViewData/ViewDataContainer';
import { ViewDataSnapshot } from '@/class/ViewData/ViewDataSnapshot';
import { WidgetType } from '@/class/Widget';
import { WidgetDragMeta } from '@/components/WidgetSource';
import { viewTypeMap } from '@/packages';
import { ActionType, useEditorDispatch } from '@/store/editor';
import { storage } from '@/utils';
import { isEmpty } from 'lodash';
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useImperativeHandle,
  useState,
  useMemo,
} from 'react';
import { AddWidgetCommand, SelectWidgetCommand } from '../commands';

// TODO 构建到文件，各个编辑组件以怎样的形式存在
// TODO 各个组件的版本管理问题

const meta = {
  id: 'gamma-layout-view-widget',
  name: '根容器',
  icon: '',
  type: WidgetType.DOM,
};

interface IRootViewProps {
  onViewMousedown: (e: MouseEvent) => void;
  onViewDragenter: () => void;
  onViewDragend: () => void;
}
interface IRootViewMethods {}

const defualtRoot = new ViewDataSnapshot({
  meta: meta,
  isRoot: true,
  index: 1,
  configurators: {
    height: 500,
  },
  containers: [[]],
});

export const RootView = forwardRef<IRootViewMethods, IRootViewProps>(
  ({ onViewMousedown, onViewDragenter, onViewDragend }, ref) => {
    const dispatch = useEditorDispatch();
    const rootViewRef = useRef<HTMLDivElement | null>(null);
    const activeViewDataElement = useRef<HTMLElement | null>(null);
    const rootNodeList = useRef<HTMLElement[]>([]);
    const [rootDataList, setRootDataList] = useState<ViewDataSnapshot[]>([]);

    useEffect(() => {
      const renderData = storage.get<IViewDataSnapshotMap>('collection') || {};

      const rootRenderData = Object.values(renderData)
        .filter((data) => {
          if (data.isRoot) return data;
        })
        .sort((a, b) => a.index! - b.index!);

      if (isEmpty(rootRenderData)) {
        rootRenderData.push(defualtRoot);
      }

      setRootDataList(rootRenderData);
    }, []);

    useEffect(() => {
      if (!rootViewRef.current) return;

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
        if (viewData?.isRoot) return;
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

    const intRootView = useCallback(
      (node: HTMLElement, data: ViewDataSnapshot) => {
        const renderData = storage.get<IViewDataSnapshotMap>('collection');

        if (isEmpty(renderData)) {
          const defualtRootViewData = new RootViewData({
            meta,
            element: node,
          });
          defualtRootViewData.restore(data);
          dispatch({
            type: ActionType.SetRootViewData,
            data: defualtRootViewData,
          });
          return;
        }

        const rootViewData = new RootViewData({
          meta,
          element: node,
        });

        if (data.index === 1) {
          dispatch({
            type: ActionType.SetRootViewData,
            data: rootViewData,
          });
        }

        globalBus.emit('viewport-render-start');
        const target = new Render({
          target: rootViewData,
        });
        if (!renderData) return;
        target.render(data, renderData);
        globalBus.emit('viewport-render-end');
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
        node: rootViewRef.current,
      }),
      [],
    );

    return useMemo(
      () => (
        <div className="root-view" ref={rootViewRef}>
          {rootDataList.map((data, idx) => {
            return (
              <div
                key={idx}
                className="layout-view"
                ref={(node) => {
                  if (!node) return;
                  rootNodeList.current[idx] = node;
                  intRootView(node, data);
                }}
                style={{
                  height: '100%',
                  position: 'relative',
                  backgroundColor: '#fff',
                }}
              ></div>
            );
          })}
        </div>
      ),
      [rootDataList],
    );
  },
);
