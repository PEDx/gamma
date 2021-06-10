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
    dispatch({
      type: 'set_drag_destination',
      data: node,
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
