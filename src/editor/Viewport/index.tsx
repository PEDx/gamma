import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { EditBoxLayer, EditBoxLayerMethods } from '@/components/EditBoxLayer';
import {
  EditPageLayer,
  EditPageLayerMethods,
} from '@/components/EditPageLayer';
import {
  HoverHighlightLayer,
  HoverHighlightLayerMethods,
} from '@/components/HoverHighlightLayer';
import { logger } from '@/class/Logger';
import { Snapshot } from '@/components/Snapshot';
import { useEditorState, useEditorDispatch, ActionType } from '@/store/editor';
import { ViewData } from '@/class/ViewData/ViewData';
import { RootViewData } from '@/class/ViewData/RootViewData';
import { ViewDataContainer } from '@/class/ViewData/ViewDataContainer';
import {
  DropItem,
  setDragEnterStyle,
  clearDragEnterStyle,
} from '@/class/DragAndDrop/drop';
import { DragType } from '@/class/DragAndDrop/drag';
import { viewTypeMap } from '@/packages';
import { WidgetDragMeta } from '@/components/WidgetSource';
import { WidgetTree, WidgetTreeMethods } from '@/components/WidgetTree';
import { ShadowView } from '@/components/ShadowView';
import { useSettingState } from '@/store/setting';
import { storage } from '@/utils';
import { IViewDataSnapshotMap } from '@/class/ViewData/ViewDataCollection';
import { Render } from '@/class/Render';
import { globalBus } from '@/class/Event';
import { commandHistory } from '@/class/CommandHistory';
import {
  AddWidgetCommand,
  SelectWidgetCommand,
  ViewDataSnapshotCommand,
} from '@/editor/commands';
import './style.scss';

// TODO 命令模式：实现撤销和重做
// TODO 动态添加 Configurator
// TODO 动态添加 Container

export const Viewport: FC = () => {
  const { activeViewData } = useEditorState();
  const dispatch = useEditorDispatch();
  const { viewportDevice } = useSettingState();
  const activeViewDataElement = useRef<HTMLElement | null>(null);
  const widgetTree = useRef<WidgetTreeMethods>(null);
  const editBoxLayer = useRef<EditBoxLayerMethods>(null);
  const editPageLayer = useRef<EditPageLayerMethods>(null);
  const hoverHighlightLayer = useRef<HoverHighlightLayerMethods | null>(null);
  const [rootContainer, setRootContainer] = useState<HTMLElement | null>(null);
  const [viewport, setViewport] = useState<HTMLElement | null>(null);

  const rootContainerRef = useCallback((rootContainer) => {
    if (!rootContainer) return;

    logger.log('init editor RootViewData');

    // TODO 根节点有特殊的配置选项，比如可以定义页面标题，配置页面高度，页面布局模式

    const rootViewData = new RootViewData({
      element: rootContainer as HTMLElement,
    });

    dispatch({
      type: ActionType.SetRootViewData,
      data: rootViewData,
    });

    renderDataToRootViewData(rootViewData);

    setRootContainer(rootContainer);

    let dragEnterContainerElement: HTMLElement | null = null;
    const dropItem = new DropItem<WidgetDragMeta>({
      node: rootContainer,
      type: DragType.widget,
      onDragenter: ({ target }) => {
        const node = target as HTMLElement;
        hoverHighlightLayer.current?.block(true);
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
        hoverHighlightLayer.current?.block(false);
        dragEnterContainerElement &&
          clearDragEnterStyle(dragEnterContainerElement);
      },
    });
  }, []);

  const renderDataToRootViewData = useCallback((rootViewData: RootViewData) => {
    const renderData = storage.get<IViewDataSnapshotMap>('collection');
    if (!renderData) return;
    globalBus.emit('viewport-render-start');
    const target = new Render({
      target: rootViewData,
    });
    target.render(renderData);
    globalBus.emit('viewport-render-end');
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

      if (configurators.rect) {
        configurators.rect.setValue({
          ...configurators.rect.value,
          x: offset.x,
          y: offset.y,
        });
      }

      // ANCHOR 此处插入组件到父组件中
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

  const selectViewData = useCallback((viewData: ViewData) => {
    if (viewData.isHidden()) return;
    editBoxLayer.current!.visible(true);
    editBoxLayer.current!.setShadowViewData(viewData);
  }, []);

  const selectRootViewData = useCallback(
    (viewData: ViewData) => {
      editPageLayer.current!.visible(true);
      editPageLayer.current!.setShadowViewData(viewData as RootViewData);
    },
    [activeViewData],
  );

  useEffect(() => {
    editBoxLayer.current!.visible(false);
    editPageLayer.current!.visible(false);
    if (!activeViewData) return;
    activeViewData.initViewByConfigurators();
    if (activeViewData?.isRoot) {
      selectRootViewData(activeViewData);
    } else {
      selectViewData(activeViewData);
    }
  }, [activeViewData]);

  const clearActive = useCallback(() => {
    dispatch({
      type: ActionType.SetActiveViewData,
      data: null,
    });
  }, []);

  useEffect(() => {
    if (!rootContainer) return;
    clearActive();
    // TODO 多次点击同一个元素，实现逐级向上选中父可编辑元素
    rootContainer.addEventListener('mousedown', (e) => {
      const activeNode = e.target as HTMLElement;
      // 只有实例化了 ViewData 的节点才能被选中
      const viewData = ViewData.collection.findViewData(activeNode);
      if (!viewData) return;
      if (activeViewDataElement.current === viewData?.element) {
        editBoxLayer.current!.attachMouseDownEvent(e);
        return;
      }
      clearActive();
      activeViewDataElement.current = viewData.element;
      commandHistory.push(new SelectWidgetCommand(viewData.id));
      if (viewData?.isRoot) return;
      editBoxLayer.current!.attachMouseDownEvent(e);
    });
  }, [rootContainer]);

  useEffect(() => {
    document.addEventListener('mouseup', () => {
      hoverHighlightLayer.current?.block(false);
    });
    globalBus.on('set-active-viewdata', (viewData: ViewData | null) => {
      dispatch({
        type: ActionType.SetActiveViewData,
        data: viewData,
      });
    });
  }, []);

  useEffect(() => {
    if (!activeViewData) return;
    const command = () => {
      commandHistory.push(new ViewDataSnapshotCommand(activeViewData.id));
    };
    globalBus.on('push-viewdata-snapshot-command', command);
    return () => {
      globalBus.off('push-viewdata-snapshot-command', command);
    };
  }, [activeViewData]);

  return (
    <div className="viewport-wrap">
      <WidgetTree ref={widgetTree} />
      <Snapshot />
      <div
        className="viewport"
        id="viewport"
        ref={(node) => setViewport(node)}
        style={{
          width: `${viewportDevice?.resolution.width}px`,
          padding: '0 50px 50px 50px',
        }}
      >
        <EditBoxLayer
          ref={editBoxLayer}
          onEditStart={() => {
            hoverHighlightLayer.current?.block(true);
          }}
          onMoveStart={() => {
            hoverHighlightLayer.current?.block(true);
          }}
        />
        <EditPageLayer ref={editPageLayer} />
        {rootContainer && (
          <HoverHighlightLayer
            root={rootContainer}
            out={viewport}
            ref={hoverHighlightLayer}
          />
        )}
        <ShadowView>
          <div
            ref={rootContainerRef}
            style={{
              height: '100%',
              position: 'relative',
              backgroundColor: '#fff',
            }}
          ></div>
        </ShadowView>
      </div>
    </div>
  );
};
