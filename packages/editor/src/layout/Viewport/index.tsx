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
import { WidgetTree, WidgetTreeMethods } from '@/views/WidgetTree';
import { ShadowView } from '@/views/ShadowView';
import { ViewportHelper } from '@/core/ViewportHelper';
import { safeEventBus, SafeEventType } from '@/events';
import { observerStyle } from '@/utils';

import { nodeHelper } from '@/nodeHelper';

import './style.scss';

// TODO 动态添加 Configurator
// TODO 动态添加 Container

export const Viewport: FC = () => {
  const viewportHelper = useRef<ViewportHelper | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const loadingLayerRef = useRef<HTMLDivElement | null>(null);
  const widgetTree = useRef<WidgetTreeMethods>(null);
  const editBoxLayer = useRef<EditBoxLayerMethods>(null);
  const editLayoutLayer = useRef<EditLayoutLayerMethods>(null);
  const highlightLayer = useRef<HighlightLayerMethods | null>(null);

  const initViewportElement = useCallback((element: HTMLDivElement) => {
    if (!element) return;

    const rootNode = nodeHelper.createRootNode(element);

    nodeHelper.addLayoutNode(rootNode.id);

    viewportRef.current = element;

    initViewport(viewportRef.current!);
  }, []);

  /**
   * 初始化整个编辑器组件编辑交互
   */
  const initViewport = useCallback((element: HTMLDivElement) => {
    if (viewportHelper.current) {
      logger.warn('viewport already init!');
      return;
    }
    logger.info('init viewport');
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

    loadingLayerRef.current?.style.setProperty('display', 'none');

    safeEventBus.emit(SafeEventType.RENDER_VIEWDATA_TREE);

    viewportHelper.current.initDragDropEvent(element);

    viewportHelper.current.initMouseDown(element);

    highlightLayer.current?.setInspectElement(element);
  }, []);

  const handleAddLayoutClick = useCallback(() => {}, []);

  const handleTreeViewDataClick = useCallback(() => {}, []);

  useEffect(() => {
    safeEventBus.on(SafeEventType.CUT_VIEWDATA, () => {});
    safeEventBus.on(SafeEventType.COPY_VIEWDATA, () => {});
    safeEventBus.on(SafeEventType.PASTE_VIEWDATA, () => {});
    safeEventBus.on(SafeEventType.CHOOSE_LAYOUT_MODE, () => {});
  }, []);

  return (
    <div
      className="viewport-wrap"
      onClick={() => {
        viewportHelper.current?.clearActive();
      }}
    >
      <WidgetTree ref={widgetTree} onViewDataClick={handleTreeViewDataClick} />
      <Snapshot />
      <div
        className="viewport"
        id="viewport"
        style={{
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
