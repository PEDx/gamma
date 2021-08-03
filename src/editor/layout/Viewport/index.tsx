import { FC, useCallback, useEffect, useRef } from 'react';
import { EditBoxLayer, EditBoxLayerMethods } from '@/editor/views/EditBoxLayer';
import {
  EditLayoutLayer,
  EditLayoutLayerMethods,
} from '@/editor/views/EditLayoutLayer';
import {
  HighlightLayer,
  HighlightLayerMethods,
} from '@/editor/views/HighlightLayer';
import { logger } from '@/common/Logger';
import { Snapshot } from '@/editor/views/Snapshot';
import {
  useEditorState,
  useEditorDispatch,
  ActionType,
} from '@/editor/store/editor';
import { ViewData } from '@/runtime/ViewData';
import { WidgetTree, WidgetTreeMethods } from '@/editor/views/WidgetTree';
import { ShadowView } from '@/editor/views/ShadowView';
import { useSettingState } from '@/editor/store/setting';
import { commandHistory } from '@/editor/core/CommandHistory';
import {
  SelectWidgetCommand,
  ViewDataSnapshotCommand,
} from '@/editor/commands';
import { ViewportHelper } from '@/editor/core/ViewportHelper';
import { viewTypeMap } from '@/packages';
import { LayoutMode } from '@/runtime/LayoutMode';
import { RootViewData } from '@/runtime/RootViewData';
import { Renderer } from '@/runtime/Renderer';
import { RenderData } from '@/runtime/RenderData';
import './style.scss';
import { safeEventBus, SafeEventType } from '@/editor/events';

// TODO 动态添加 Configurator
// TODO 动态添加 Container

export const Viewport: FC = () => {
  const { activeViewData, rootViewData } = useEditorState();
  const dispatch = useEditorDispatch();
  const { viewportDevice } = useSettingState();
  const viewportHelper = useRef<ViewportHelper | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const renderDataRef = useRef<RenderData | null>(null);
  const widgetTree = useRef<WidgetTreeMethods>(null);
  const editBoxLayer = useRef<EditBoxLayerMethods>(null);
  const editLayoutLayer = useRef<EditLayoutLayerMethods>(null);
  const highlightLayer = useRef<HighlightLayerMethods | null>(null);

  const initViewportElement = useCallback((element: HTMLDivElement) => {
    if (!element) return;

    viewportRef.current = element;
    /**
     * 获取配置数据，可以是本地也可以是远端
     */
    renderDataRef.current = new RenderData();

    if (renderDataRef.current.isEmpty()) {
      safeEventBus.emit(SafeEventType.SET_LAYOUT_MODAL_VISIBLE, true);
      return;
    }

    const rootRenderData = renderDataRef.current.getRootRenderData();

    if (!rootRenderData) return;

    initViewport(element, rootRenderData.mode);
  }, []);

  /**
   * 初始化整个编辑器组件编辑交互
   */
  const initViewport = useCallback(
    (element: HTMLDivElement, mode: LayoutMode) => {
      logger.info('init viewport');

      viewportHelper.current = new ViewportHelper({
        editBoxLayer: editBoxLayer.current!,
        editLayoutLayer: editLayoutLayer.current!,
        highlightLayer: highlightLayer.current!,
      });

      const rootViewData = new RootViewData({
        element,
        mode,
      });

      const renderer = new Renderer(viewTypeMap);

      renderer.render(rootViewData, renderDataRef.current!);

      viewportHelper.current.initDrop(element);

      viewportHelper.current.initMouseDown(element);

      highlightLayer.current?.setInspectElement(element);

      safeEventBus.emit(SafeEventType.RENDER_VIEWDATA_TREE);

      dispatch({
        type: ActionType.SetRootViewData,
        data: rootViewData,
      });
    },
    [],
  );

  const handleAddLayoutClick = useCallback(() => {
    if (!rootViewData) return;
    viewportHelper.current!.addLayoutViewData(rootViewData);
  }, [rootViewData]);

  const handleTreeViewDataClick = useCallback((viewData: ViewData) => {
    commandHistory.push(new SelectWidgetCommand(viewData.id));
  }, []);

  useEffect(() => {
    safeEventBus.on(SafeEventType.SET_ACTIVE_VIEWDATA, (viewData) => {
      viewportHelper.current?.setViewDataActive(viewData);
      dispatch({
        type: ActionType.SetActiveViewData,
        data: viewData,
      });
    });

    safeEventBus.on(SafeEventType.CHOOSE_LAYOUT_MODE, (mode) => {
      if (!viewportRef.current) return;
      initViewport(viewportRef.current, mode);
    });
  }, []);

  useEffect(() => {
    if (!activeViewData) return;
    safeEventBus.on(SafeEventType.PUSH_VIEWDATA_SNAPSHOT_COMMAND, () => {
      commandHistory.push(new ViewDataSnapshotCommand(activeViewData.id));
    });
    return () => {
      safeEventBus.clear(SafeEventType.PUSH_VIEWDATA_SNAPSHOT_COMMAND);
    };
  }, [activeViewData]);

  return (
    <div
      className="viewport-wrap"
      onClick={() => {
        viewportHelper.current?.clearActive();
        dispatch({
          type: ActionType.SetActiveViewData,
          data: null,
        });
      }}
    >
      <WidgetTree ref={widgetTree} onViewDataClick={handleTreeViewDataClick} />
      <Snapshot />
      <div
        className="viewport"
        id="viewport"
        style={{
          width: `${viewportDevice?.resolution.width}px`,
          padding: '0 50px 50px 50px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <EditBoxLayer
          ref={editBoxLayer}
          onEditStart={() => {
            highlightLayer.current?.block(true);
          }}
          onMoveStart={() => {
            highlightLayer.current?.block(true);
          }}
        />
        <EditLayoutLayer
          ref={editLayoutLayer}
          onEditStart={() => {
            highlightLayer.current?.block(true);
          }}
          onAddClick={handleAddLayoutClick}
        />
        <HighlightLayer ref={highlightLayer} />
        <ShadowView>
          <div className="root-view" ref={initViewportElement}></div>
        </ShadowView>
      </div>
    </div>
  );
};
