import { FC, useCallback, useEffect, useRef } from 'react';
import { EditBoxLayer, EditBoxLayerMethods } from '@/views/layer/EditBoxLayer';
import {
  EditLayoutLayer,
  EditLayoutLayerMethods,
} from '@/views/layer/EditLayoutLayer';
import {
  HighlightLayer,
  IHighlightLayerMethods,
} from '@/views/layer/HighlightLayer';
import { logger } from '@/core/Logger';
import { History } from '@/views/function/History';
import { GraduallyLoading } from '@/views/components/GraduallyLoading';
import { INodeTreeMethods, NodeTree } from '@/views/function/NodeTree';
import { ShadowView } from '@/views/components/ShadowView';
import { ViewportHelper } from '@/core/ViewportHelper';
import { observerStyle } from '@/utils';
import { Editor } from '@/core/Editor';

import './style.scss';

// TODO 动态添加 Configurator
// TODO 动态添加 Container

export const Viewport: FC = () => {
  const viewportHelper = useRef<ViewportHelper | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const loadingLayerRef = useRef<HTMLDivElement | null>(null);
  const editBoxLayer = useRef<EditBoxLayerMethods>(null);
  const nodeTree = useRef<INodeTreeMethods>(null);
  const editLayoutLayer = useRef<EditLayoutLayerMethods>(null);
  const highlightLayer = useRef<IHighlightLayerMethods | null>(null);

  const hideLoading = useCallback(() => {
    loadingLayerRef.current?.style.setProperty('display', 'none');
  }, []);

  const initViewportElement = useCallback((element: HTMLDivElement) => {
    if (!element) return;

    const data = Editor.runtime.storage.get();

    if (!data.length) {
      Editor.runtime.renderer.init(element);
    } else {
      Editor.runtime.renderer.build(element, data);
    }

    viewportRef.current = element;

    initViewport(viewportRef.current!);

    hideLoading();
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

    viewportHelper.current.initDragDropEvent(element);

    viewportHelper.current.initMouseDown(element);

    highlightLayer.current?.setInspectElement(element);

    Editor.selector.onSelect((id) => {
      nodeTree.current?.active(id || '');
    });
  }, []);

  const handleAddLayoutClick = useCallback(() => {
    if (!Editor.runtime.root) return;
    Editor.runtime.addLayoutNode(Editor.runtime.root);
  }, []);

  useEffect(() => {}, []);

  return (
    <div
      className="viewport-wrap"
      onClick={() => {
        Editor.selector.unselect();
      }}
    >
      <NodeTree
        ref={nodeTree}
        onNodeClick={(id) => {
          Editor.selector.select(id);
        }}
        onNodeHover={(id) => {
          highlightLayer.current?.showHighlight(id);
        }}
      />
      <History />
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
        {/* <EditBoxLayer
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
        /> */}
        <HighlightLayer
          ref={highlightLayer}
          onHightlight={(id: string) => {
            nodeTree.current?.hightlight(id);
          }}
        />
        <ShadowView>
          <div
            className="root-view"
            ref={(e) => initViewportElement(e as HTMLDivElement)}
          ></div>
        </ShadowView>
      </div>
    </div>
  );
};
