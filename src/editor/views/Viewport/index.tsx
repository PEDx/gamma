import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { EditBoxLayer, EditBoxLayerMethods } from '@/editor/views/EditBoxLayer';
import {
  EditPageLayer,
  EditPageLayerMethods,
} from '@/editor/views/EditPageLayer';
import {
  HoverHighlightLayer,
  HoverHighlightLayerMethods,
} from '@/editor/views/HoverHighlightLayer';
import { logger } from '@/commom/Logger';
import { Snapshot } from '@/editor/views/Snapshot';
import { useEditorState, useEditorDispatch, ActionType } from '@/editor/store/editor';
import { ViewData } from '@/runtime/ViewData';
import { LayoutViewData } from '@/runtime/LayoutViewData';
import { IRootViewMethods, RootView } from '@/editor/views/RootView';
import { WidgetTree, WidgetTreeMethods } from '@/editor/views/WidgetTree';
import { ShadowView } from '@/editor/views/ShadowView';
import { useSettingState } from '@/editor/store/setting';
import { globalBus } from '@/commom/Event';
import { commandHistory } from '@/editor/core/CommandHistory';
import { ViewDataSnapshotCommand } from '@/editor/commands';
import './style.scss';

// TODO 命令模式：实现撤销和重做
// TODO 动态添加 Configurator
// TODO 动态添加 Container

export const Viewport: FC = () => {
  const { activeViewData } = useEditorState();
  const dispatch = useEditorDispatch();
  const { viewportDevice } = useSettingState();
  const widgetTree = useRef<WidgetTreeMethods>(null);
  const editBoxLayer = useRef<EditBoxLayerMethods>(null);
  const editPageLayer = useRef<EditPageLayerMethods>(null);
  const hoverHighlightLayer = useRef<HoverHighlightLayerMethods | null>(null);
  const [rootView, setRootView] = useState<IRootViewMethods | null>(null);
  const [viewport, setViewport] = useState<HTMLElement | null>(null);

  const rootViewRef = useCallback((rootView: IRootViewMethods) => {
    rootView && setRootView(rootView);
  }, []);

  const handleAddClick = useCallback(() => {
    rootView?.addRootView();
    console.log('onAddClick');
  }, [rootView]);

  const selectViewData = useCallback((viewData: ViewData) => {
    if (viewData.isHidden()) return;
    editBoxLayer.current!.visible(true);
    editBoxLayer.current!.setShadowViewData(viewData);
  }, []);

  const selectLayoutViewData = useCallback(
    (viewData: ViewData) => {
      editPageLayer.current!.visible(true);
      editPageLayer.current!.setShadowViewData(viewData as LayoutViewData);
    },
    [activeViewData],
  );

  useEffect(() => {
    editBoxLayer.current!.visible(false);
    editPageLayer.current!.visible(false);
    if (!activeViewData) return;
    activeViewData.initViewByConfigurators();
    if (activeViewData?.isLayout) {
      selectLayoutViewData(activeViewData);
    } else {
      selectViewData(activeViewData);
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
        className="viewport"
        id="viewport"
        ref={(node) => setViewport(node)}
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
        <EditPageLayer
          ref={editPageLayer}
          onEditStart={() => {
            hoverHighlightLayer.current?.block(true);
          }}
          onAddClick={handleAddClick}
        />
        {rootView && (
          <HoverHighlightLayer
            root={rootView.node}
            out={viewport}
            ref={hoverHighlightLayer}
          />
        )}
        <ShadowView>
          <RootView
            ref={rootViewRef}
            onViewMousedown={(e) => {
              editBoxLayer.current?.attachMouseDownEvent(e);
            }}
            onViewDragenter={() => {
              hoverHighlightLayer.current?.block(true);
            }}
            onViewDragend={() => {
              hoverHighlightLayer.current?.block(false);
            }}
          />
        </ShadowView>
      </div>
    </div>
  );
};
