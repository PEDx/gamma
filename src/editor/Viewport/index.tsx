import {
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
} from 'react';
import { EditBoxLayer, EditBoxLayerMethods } from '@/components/EditBoxLayer';
import { EditorContext } from '@/store/editor';
import { ViewData } from '@/class/ViewData';
import { ShadowView } from '@/components/ShadowView';
import './style.scss';

const clearClassName = (node: Element, name: string) => {
  return node.classList.remove(name);
};

const ACTIVE_CLASSNAME = 'm-box-active';

export const Viewport: FC = () => {
  const { state, dispatch } = useContext(EditorContext)!;
  const [selectViewData, setSelectViewData] = useState<ViewData | null>(null);
  const editBoxLayer = useRef<EditBoxLayerMethods>(null);

  const rootContainerRef = useCallback((node) => {
    if (!node) return;
    new ViewData({
      element: node as HTMLElement,
      configurators: null,
    });
    dispatch({
      type: 'set_drag_destination',
      data: node,
    });
  }, []);

  const activeViewData = useCallback((viewData: ViewData) => {
    if (!viewData) return;
    setSelectViewData(viewData);
    editBoxLayer.current!.visible(true);
    const activeVDNode = viewData.element;
    activeVDNode.classList.add(ACTIVE_CLASSNAME);
    const editable = editBoxLayer.current!.getEditable();
    editable.setShadowViewData(viewData);
    viewData.initViewByConfigurators();
  }, []);

  useEffect(() => {
    const rootContainer = state.drag_destination;
    if (!rootContainer) return;
    console.log(rootContainer);

    let activeVDNode: HTMLElement | null = null;
    const clearActive = () => {
      editBoxLayer.current!.visible(false);
      clearClassName(rootContainer!, ACTIVE_CLASSNAME);
      if (activeVDNode) clearClassName(activeVDNode, ACTIVE_CLASSNAME);
    };
    clearActive();

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
  }, [state]);

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
            }}
          ></div>
        </ShadowView>
      </div>
    </div>
  );
};
