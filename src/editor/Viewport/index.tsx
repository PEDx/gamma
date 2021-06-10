import {
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
  useMemo,
} from 'react';
import { EditBoxLayer, EditBoxLayerMethods } from '@/components/EditBoxLayer';
import { EditorContext } from '@/store/editor';
import { ViewData } from '@/class/ViewData';
import { DropItem } from '@/class/DragAndDrop/drop';
import { viewTypeMap, attachViewData } from '@/packages';
import {
  DragWidgetMeta,
  DRAG_ENTER_CLASSNAME,
} from '@/components/WidgetSource';
import { ShadowView } from '@/components/ShadowView';

import './style.scss';

export const Viewport: FC = () => {
  const { state, dispatch } = useContext(EditorContext)!;
  const editBoxLayer = useRef<EditBoxLayerMethods>(null);
  const [rootContainer, setRootContainer] = useState<HTMLElement | null>(null);

  const rootContainerRef = useCallback((node) => {
    if (!node) return;
    new ViewData({
      element: node as HTMLElement,
      configurators: null,
    });
    setRootContainer(node);

    let dragEnterNode: Element | null = null;
    const dropItem = new DropItem<DragWidgetMeta>({
      node,
      meta: {
        type: 'widget',
      },
      onDragenter: (evt) => {
        const node = evt.target as HTMLElement;
        const vd = ViewData.findViewData(node); // ANCHOR 此处保证拿到的是最近父级有 ViewData 的 dom
        if (!vd) return;
        dragEnterNode = vd.element;
        dragEnterNode.classList.add(DRAG_ENTER_CLASSNAME);
      },
      onDragleave: (evt) => {
        const node = evt.target as HTMLElement;

        const vd = ViewData.findViewData(node);
        if (!vd) return false;
        if (dragEnterNode === vd.element) return false; // 从子元素移动到父元素，父元素不选中
        vd.element.classList.remove(DRAG_ENTER_CLASSNAME);
      },
      onDrop: (evt) => {
        if (!dragEnterNode) return false;
        dragEnterNode.classList.remove(DRAG_ENTER_CLASSNAME);
        const meta = dropItem.getDragMeta(evt);
        const createView = viewTypeMap.get(meta?.data || 1);
        if (!createView) return;
        const [element, configurators] = createView();
        // ANCHOR 此处插入组件到父组件中
        const vd = attachViewData(dragEnterNode, element, configurators);
        vd.editableConfigurators?.x?.setDefaultValue(evt.offsetX);
        vd.editableConfigurators?.y?.setDefaultValue(evt.offsetY);
        vd.initViewByConfigurators();
      },
      onDragend: () => {
        dragEnterNode && dragEnterNode.classList.remove(DRAG_ENTER_CLASSNAME);
      },
    });
  }, []);

  const activeViewData = useCallback((viewData: ViewData) => {
    if (!viewData) return;
    dispatch({
      type: 'set_select_view_data',
      data: viewData,
    });
    editBoxLayer.current!.visible(true);
    const editable = editBoxLayer.current!.getEditable();
    editable.setShadowViewData(viewData);
    viewData.initViewByConfigurators();
  }, []);

  useEffect(() => {
    if (!state.select_view_data && editBoxLayer.current)
      editBoxLayer.current!.visible(false);
  }, [state.select_view_data]);

  useEffect(() => {
    if (!rootContainer) return;
    let activeVDNode: HTMLElement | null = null;
    const clearActive = () => {
      editBoxLayer.current!.visible(false);
      dispatch({
        type: 'set_select_view_data',
        data: null,
      });
    };
    clearActive();

    // TODO 多次点击同一个元素，实现逐级向上选中父可编辑元素

    rootContainer.addEventListener('mousedown', (e) => {
      clearActive();
      const activeNode = e.target as HTMLElement;
      // 只有实例化了 ViewData 的节点才能被编辑
      const viewData = ViewData.findViewData(activeNode);
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
      <div className="viewport">
        <EditBoxLayer ref={editBoxLayer} />
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
