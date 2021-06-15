import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { EditBoxLayer, EditBoxLayerMethods } from '@/components/EditBoxLayer';
import { MiniMap } from '@/components/MiniMap';
import { useEditorState, useEditorDispatch, ActionType } from '@/store/editor';
import { RootViewData, ViewData } from '@/class/ViewData';
import {
  DropItem,
  setDragEnterStyle,
  clearDragEnterStyle,
} from '@/class/DragAndDrop/drop';
import { DragType } from '@/class/DragAndDrop/drag';
import { viewTypeMap, attachViewData } from '@/packages';
import { WidgetDragMeta } from '@/components/WidgetSource';
import { ShadowView } from '@/components/ShadowView';

import './style.scss';

// TODO 命令模式：实现撤销和重做
// TODO 简单的键盘对应

export const Viewport: FC = () => {
  const state = useEditorState();
  const dispatch = useEditorDispatch();
  const editBoxLayer = useRef<EditBoxLayerMethods>(null);
  const [rootContainer, setRootContainer] = useState<HTMLElement | null>(null);
  const [viewport, setViewport] = useState<HTMLElement | null>(null);

  const rootContainerRef = useCallback((node) => {
    if (!node) return;
    // TODO 根节点有特殊的配置选项，比如可以定义页面标题，配置页面高度，页面布局模式
    const rootViewData = new RootViewData({
      element: node as HTMLElement,
      configurators: null,
    });
    setRootContainer(node);

    let dragEnterNode: HTMLElement | null = null;
    const dropItem = new DropItem<WidgetDragMeta>({
      node,
      type: DragType.widget,
      onDragenter: (evt) => {
        const node = evt.target as HTMLElement;
        const vd = ViewData.collection.findViewData(node); // ANCHOR 此处保证拿到的是最近父级有 ViewData 的 dom
        if (!vd) return;
        dragEnterNode = vd.element;
        setDragEnterStyle(dragEnterNode);
      },
      onDragleave: (evt) => {
        const node = evt.target as HTMLElement;

        const vd = ViewData.collection.findViewData(node);
        if (!vd) return false;
        if (dragEnterNode === vd.element) return false; // 从子元素移动到父元素，父元素不选中
        clearDragEnterStyle(vd.element);
      },
      onDrop: (evt) => {
        if (!dragEnterNode) return false;
        console.log(rootViewData.getTemplateStruct());
        clearDragEnterStyle(dragEnterNode);
        const meta = dropItem.getDragMeta(evt);

        if (!meta) throw 'connot found draged widget meta';

        const createView = viewTypeMap.get(meta.data);
        if (!createView) return;
        const [element, configurators] = createView();
        // ANCHOR 此处插入组件到父组件中
        const vd = attachViewData(dragEnterNode, element, configurators);
        vd.editableConfigurators?.x?.setDefaultValue(evt.offsetX);
        vd.editableConfigurators?.y?.setDefaultValue(evt.offsetY);
        vd.initViewByConfigurators();
      },
      onDragend: () => {
        dragEnterNode && clearDragEnterStyle(dragEnterNode);
      },
    });
  }, []);

  const activeViewData = useCallback((viewData: ViewData) => {
    if (!viewData) return;
    dispatch({
      type: ActionType.SetSelectViewData,
      data: viewData,
    });
    editBoxLayer.current!.visible(true);
    const editable = editBoxLayer.current!.getEditable();
    editable.setShadowViewData(viewData);
    viewData.initViewByConfigurators();
  }, []);

  useEffect(() => {
    if (!state.selectViewData && editBoxLayer.current)
      editBoxLayer.current!.visible(false);
  }, [state.selectViewData]);

  useEffect(() => {
    if (!rootContainer) return;
    let activeVDNode: HTMLElement | null = null;
    const clearActive = () => {
      activeVDNode = null;
      editBoxLayer.current!.visible(false);
      dispatch({
        type: ActionType.SetSelectViewData,
        data: null,
      });
    };
    clearActive();

    // TODO 多次点击同一个元素，实现逐级向上选中父可编辑元素

    rootContainer.addEventListener('mousedown', (e) => {
      const activeNode = e.target as HTMLElement;
      // 只有实例化了 ViewData 的节点才能被编辑
      const viewData = ViewData.collection.findViewData(activeNode);
      if (activeVDNode === viewData?.element) {
        const editable = editBoxLayer.current!.getEditable();
        editable.attachMouseDownEvent(e);
        return;
      }
      clearActive();
      if (
        rootContainer?.contains(activeNode) &&
        rootContainer !== activeNode &&
        viewData
      ) {
        activeViewData(viewData);
        activeVDNode = viewData.element;
        const editable = editBoxLayer.current!.getEditable();
        editable.attachMouseDownEvent(e);
      }
    });
  }, [rootContainer]);

  return (
    <div className="viewport-wrap">
      <EditBoxLayer ref={editBoxLayer} />
      {viewport && <MiniMap host={viewport} />}
      <div className="viewport" id="viewport" ref={(node) => setViewport(node)}>
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
