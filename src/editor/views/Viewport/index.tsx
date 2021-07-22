import { FC, useCallback, useEffect, useRef } from 'react';
import { EditBoxLayer, EditBoxLayerMethods } from '@/editor/views/EditBoxLayer';
import {
  EditLayoutLayer,
  EditLayoutLayerMethods,
} from '@/editor/views/EditLayoutLayer';
import {
  HoverHighlightLayer,
  HoverHighlightLayerMethods,
} from '@/editor/views/HoverHighlightLayer';
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
import { ViewDataSnapshotCommand } from '@/editor/commands';
import './style.scss';
import { ViewportHelper } from '@/editor/core/ViewportHelper';

// TODO 命令模式：实现撤销和重做
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
  const hoverHighlightLayer = useRef<HoverHighlightLayerMethods | null>(null);

  /**
   * 初始化整个编辑器组件编辑交互
   */
  const rootViewRef = useCallback((element: HTMLDivElement) => {
    viewportHelper.current = new ViewportHelper({
      editBoxLayer: editBoxLayer.current!,
      editLayoutLayer: editLayoutLayer.current!,
      hoverHighlightLayer: hoverHighlightLayer.current!,
    });
    const rootViewData = viewportHelper.current.addRootViewData(element);
    viewportHelper.current.initRootViewData(rootViewData);
    viewportHelper.current.initDrop(element);
    viewportHelper.current.initMouseDown(element);
    hoverHighlightLayer.current?.setInspectElement(element);
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
    viewportHelper.current?.handleViewDataMouedown(viewData);
  }, []);

  useEffect(() => {
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
    <div
      className="viewport-wrap"
      onClick={() => viewportHelper.current?.clearSelected()}
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
            hoverHighlightLayer.current?.visible(false);
          }}
          onMoveStart={() => {
            hoverHighlightLayer.current?.visible(false);
          }}
        />
        <EditLayoutLayer
          ref={editLayoutLayer}
          onEditStart={() => {
            hoverHighlightLayer.current?.visible(false);
          }}
          onAddClick={handleAddLayoutClick}
        />
        <HoverHighlightLayer ref={hoverHighlightLayer} />
        <ShadowView>
          <div className="root-view" ref={rootViewRef}></div>;
        </ShadowView>
      </div>
    </div>
  );
};
