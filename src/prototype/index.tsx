import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { EditBoxLayer, EditBoxLayerMethods } from '@/components/EditBoxLayer';
import { WidgetSource } from '@/components/WidgetSource';
import { ConfiguratorWrap } from '@/components/ConfiguratorWrap';
import { viewTypeMap, attachViewData } from '@/packages';
import { ViewData } from '@/class/ViewData';
import { clearClassName } from '@/utils';
import './style.scss';

const ACTIVE_CLASSNAME = 'm-box-active';

const Prototype: FC = () => {
  console.log('render Prototype');

  const [selectViewData, setSelectViewData] = useState<ViewData | null>(null);
  const [rootContainer, setRootContainer] =
    useState<HTMLDivElement | null>(null);
  const editBoxLayer = useRef<EditBoxLayerMethods>(null);

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

  const handleDrop = useCallback(
    (container: Element, type: number, e: DragEvent) => {
      const createView = viewTypeMap.get(type);
      if (!createView) return;
      const [element, configurators] = createView();
      const vd = attachViewData(container, element, configurators);
      vd.editableConfigurators?.x?.setDefaultValue(e.offsetX);
      vd.editableConfigurators?.y?.setDefaultValue(e.offsetY);
      activeViewData(vd);
    },
    [],
  );
  const rootContainerRef = useCallback((node) => {
    setRootContainer(node);
  }, []);

  useEffect(() => {
    if (!rootContainer) return;

    new ViewData({
      element: rootContainer as HTMLElement,
      configurators: null,
    });

    let activeVDNode: HTMLElement | null = null;

    const clearActive = () => {
      editBoxLayer.current!.visible(false);
      clearClassName(rootContainer!, ACTIVE_CLASSNAME);
      if (activeVDNode) clearClassName(activeVDNode, ACTIVE_CLASSNAME);
    };
    clearActive();

    document.addEventListener('mousedown', (e) => {
      clearActive();
      const activeNode = e.target as HTMLElement;
      // 只有实例化了 ViewData 的节点才能被编辑
      const viewData = ViewData.collection.findViewData(activeNode);
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
    <div className="prototype">
      <WidgetSource />
      <div className="drag-destination">
        <EditBoxLayer ref={editBoxLayer} />
        <div className="root-container" ref={rootContainerRef}></div>
      </div>
      <div className="configurator">
        {selectViewData &&
          selectViewData.configurators.map((ctor) => {
            const component = ctor.component;
            if (!component) return null;
            return (
              <ConfiguratorWrap
                key={`${selectViewData.id}${ctor.name}`}
                configurator={ctor}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Prototype;
