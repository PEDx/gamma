import { FC, useCallback, useEffect, useRef } from 'react';
import { EditBoxLayer, EditBoxLayerMethods } from '@/views/EditBoxLayer';
import {
  EditLayoutLayer,
  EditLayoutLayerMethods,
} from '@/views/EditLayoutLayer';
import { HighlightLayer, HighlightLayerMethods } from '@/views/HighlightLayer';
import { logger } from '@/core/Logger';
import { Snapshot } from '@/views/Snapshot';
import { GraduallyLoading } from '@/components/GraduallyLoading';
import { useEditorState, useEditorDispatch, ActionType } from '@/store/editor';
import { ViewData } from '@gamma/runtime';
import { WidgetTree, WidgetTreeMethods } from '@/views/WidgetTree';
import { ShadowView } from '@/views/ShadowView';
import { useSettingState } from '@/store/setting';
import { commandHistory } from '@/core/CommandHistory';
import { SelectWidgetCommand, ViewDataSnapshotCommand } from '@/commands';
import { ViewportHelper } from '@/core/ViewportHelper';
import { LayoutMode } from '@gamma/runtime';
import { RootViewData } from '@gamma/runtime';
import { gammaElementList } from '@/views/WidgetSource';
import { Renderer, RenderData, ElementLoader } from '@gamma/renderer';
import { safeEventBus, SafeEventType } from '@/events';
import { observerStyle } from '@/utils';
import './style.scss';

// TODO 动态添加 Configurator
// TODO 动态添加 Container

export const renderer = new Renderer();

export const Viewport: FC = () => {
  const { activeViewData, rootViewData } = useEditorState();
  const dispatch = useEditorDispatch();
  const { viewportDevice } = useSettingState();
  const viewportHelper = useRef<ViewportHelper | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const loadingLayerRef = useRef<HTMLDivElement | null>(null);
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

    if (!renderDataRef.current) return;

    const rootRenderData = renderDataRef.current.getRootRenderData();

    if (!rootRenderData) return;

    initViewport(viewportRef.current!, rootRenderData.mode);
  }, []);

  /**
   * 初始化整个编辑器组件编辑交互
   */
  const initViewport = useCallback(
    (element: HTMLDivElement, mode: LayoutMode) => {
      if (viewportHelper.current) {
        logger.warn('viewport already init!');
        return;
      }

      logger.info('init viewport');

      const rootViewData = new RootViewData({
        element,
        mode,
      });
      /**
       * 组件文件是运行时加载
       * 因此实际上不需要传递 viewTypeMap
       * 在编辑器中：会得到一个组件的总列表，每次随编辑器一起初始化
       * 在页面运行时中：组件通过页面配置数据按需加载
       */

      viewportHelper.current = new ViewportHelper({
        editBoxLayer: editBoxLayer.current!,
        editLayoutLayer: editLayoutLayer.current!,
        highlightLayer: highlightLayer.current!,
        renderer: renderer!,
      });

      /**
       * 组件载入时，组件样式需要注入到 shadow dom 中
       */
      const shadowViewElement = viewportRef.current!.parentNode;
      observerStyle((list) => {
        list.forEach((node) => {
          const isEmotionStyleNode = node.dataset.emotion;
          if (isEmotionStyleNode) return;
          shadowViewElement?.appendChild(node.cloneNode(true));
        });
      });

      new ElementLoader({
        elementIds: gammaElementList,
        onLoad: () => {},
      })
        .loadAll()
        .then((res) => {
          /**
           * 所有组件加载完成
           */
          console.log(res);
          renderer!.render(rootViewData, renderDataRef.current!);
          safeEventBus.emit(SafeEventType.RENDER_VIEWDATA_TREE);
          loadingLayerRef.current?.style.setProperty('display', 'none');
        });

      viewportHelper.current.initDropEvent(element);

      viewportHelper.current.initMouseDown(element);

      highlightLayer.current?.setInspectElement(element);

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
      if (!renderer) return;
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
        <div className="loading-layer flex-box-c" ref={loadingLayerRef}>
          <GraduallyLoading />
        </div>
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
