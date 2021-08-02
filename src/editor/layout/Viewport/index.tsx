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
import { globalBus } from '@/editor/core/Event';
import { commandHistory } from '@/editor/core/CommandHistory';
import {
  SelectWidgetCommand,
  ViewDataSnapshotCommand,
} from '@/editor/commands';
import './style.scss';
import { ViewportHelper } from '@/editor/core/ViewportHelper';
import { viewTypeMap } from '@/packages';
import { LayoutMode } from "@/runtime/LayoutMode";
import { RootViewData } from '@/runtime/RootViewData';
import { Renderer } from '@/runtime/Renderer';
import { RenderData } from '@/runtime/RenderData';


// TODO 动态添加 Configurator
// TODO 动态添加 Container

export const Viewport: FC = () => {
  const { activeViewData, rootViewData } = useEditorState();
  const dispatch = useEditorDispatch();
  const { viewportDevice } = useSettingState();
  const viewportHelper = useRef<ViewportHelper | null>(null);
  const widgetTree = useRef<WidgetTreeMethods>(null);
  const editBoxLayer = useRef<EditBoxLayerMethods>(null);
  const editLayoutLayer = useRef<EditLayoutLayerMethods>(null);
  const highlightLayer = useRef<HighlightLayerMethods | null>(null);

  /**
   * 初始化整个编辑器组件编辑交互
   */
  const initViewport = useCallback((element: HTMLDivElement) => {
    logger.info('init viewport');

    viewportHelper.current = new ViewportHelper({
      editBoxLayer: editBoxLayer.current!,
      editLayoutLayer: editLayoutLayer.current!,
      highlightLayer: highlightLayer.current!,
    });

    const rootViewData = new RootViewData({
      element,
      mode: LayoutMode.LongPage,
    });

    /**
     * 获取配置数据，可以是本地也可以是远端
     */
    const renderData = new RenderData();

    const renderer = new Renderer(viewTypeMap);

    renderer.render(rootViewData, renderData);

    viewportHelper.current.initDrop(element);
    viewportHelper.current.initMouseDown(element);
    highlightLayer.current?.setInspectElement(element);

    globalBus.emit('render-viewdata-tree');

    dispatch({
      type: ActionType.SetRootViewData,
      data: rootViewData,
    });
  }, []);

  const handleAddLayoutClick = useCallback(() => {
    if (!rootViewData) return;
    viewportHelper.current!.addLayoutViewData(rootViewData);
  }, [rootViewData]);

  const handleTreeViewDataClick = useCallback((viewData: ViewData) => {
    commandHistory.push(new SelectWidgetCommand(viewData.id));
  }, []);

  useEffect(() => {
    globalBus.on('set-active-viewdata', (viewData: ViewData | null) => {
      viewportHelper.current?.setViewDataActive(viewData);
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
          <div className="root-view" ref={initViewport}></div>;
        </ShadowView>
      </div>
    </div>
  );
};
