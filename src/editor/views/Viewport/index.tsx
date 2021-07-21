import { FC, useCallback, useEffect, useRef, useState } from 'react';
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
import { LayoutViewData } from '@/runtime/LayoutViewData';
import { WidgetTree, WidgetTreeMethods } from '@/editor/views/WidgetTree';
import { ShadowView } from '@/editor/views/ShadowView';
import { useSettingState } from '@/editor/store/setting';
import { globalBus } from '@/editor/core/Event';
import { commandHistory } from '@/editor/core/CommandHistory';
import {
  ViewDataSnapshotCommand,
} from '@/editor/commands';
import './style.scss';
import { ViewportHelper } from './ViewportHelper';

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

    dispatch({
      type: ActionType.SetRootViewData,
      data: rootViewData,
    });
  }, []);

  const handleAddLayoutClick = useCallback(() => {
    if (!rootViewData) return;
    viewportHelper.current!.addLayoutViewData(rootViewData);
  }, [rootViewData]);

  const clearActive = useCallback(() => {
    dispatch({
      type: ActionType.SetActiveViewData,
      data: null,
    });
  }, []);


  useEffect(() => {
    editBoxLayer.current!.visible(false);
    editLayoutLayer.current!.visible(false);
    if (!activeViewData) return;
    activeViewData.configuratorsNotify();
    if (activeViewData.isRoot) return;
    if (activeViewData?.isLayout) {
      viewportHelper.current!.selectLayoutViewData(
        activeViewData as LayoutViewData,
      );
    } else {
      viewportHelper.current!.selectViewData(activeViewData);
    }
  }, [activeViewData]);

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
    <div
      className="viewport-wrap"
      onClick={() => {
        globalBus.emit('set-active-viewdata', null);
      }}
    >
      <WidgetTree ref={widgetTree} />
      <Snapshot />
      <div
        onClick={() => {
          editBoxLayer.current?.setaspectRatio(0.5);
        }}
      >
        设置宽高比
      </div>
      <div
        className="viewport"
        id="viewport"
        style={{
          width: `${viewportDevice?.resolution.width}px`,
          padding: '0 50px 50px 50px',
        }}
        onClick={(e) => {
          e.stopPropagation();
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
        <EditLayoutLayer
          ref={editLayoutLayer}
          onEditStart={() => {
            hoverHighlightLayer.current?.block(true);
          }}
          onAddClick={handleAddLayoutClick}
        />
        <ShadowView>
          <div className="root-view" ref={rootViewRef}></div>;
        </ShadowView>
      </div>
    </div>
  );
};
