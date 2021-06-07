import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { EditBoxLayer, EditBoxLayerMethods } from '@/components/EditBoxLayer';
import { DragSource } from '@/components/DragSource';
import { ConfiguratorWrap } from '@/components/ConfiguratorWrap';
import { Configurator } from './Configurator';
import { ViewData } from '@/class/ViewData';
import { createBox, createText, createImage, attachViewData } from './widget';
import './style.scss';
import './widget.scss';

interface dragType {
  [key: string]: () => [HTMLElement, Configurator[]];
}

const drag_type_map: dragType = {
  '1': createBox,
  '2': createText,
  '3': createImage,
};

const clearClassName = (node: Element, name: string) => {
  return node.classList.remove(name);
};

const ACTIVE_CLASSNAME = 'm-box-active';

const Prototype: FC = () => {
  const [selectViewData, setSelectViewData] = useState<ViewData | null>(null);
  const editBoxLayer = useRef<EditBoxLayerMethods>(null);
  const rootContainer = useRef<HTMLDivElement>(null);

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

  const handleDrop = useCallback((container, type, e) => {
    const [element, configurators] = drag_type_map[type]();
    const vd = attachViewData(container, element, configurators);
    vd.editableConfigurators?.x?.setDefaultValue(e.offsetX);
    vd.editableConfigurators?.y?.setDefaultValue(e.offsetY);
    activeViewData(vd);
  }, []);

  useEffect(() => {
    new ViewData({
      element: rootContainer.current as HTMLElement,
      configurators: null,
    });

    let activeVDNode: HTMLElement | null = null;

    const clearActive = () => {
      editBoxLayer.current!.visible(false);
      clearClassName(rootContainer.current!, ACTIVE_CLASSNAME);
      if (activeVDNode) clearClassName(activeVDNode, ACTIVE_CLASSNAME);
    };
    clearActive();

    document.addEventListener('mousedown', (e) => {
      clearActive();
      const activeNode = e.target as HTMLElement;
      // 只有实例化了 ViewData 的节点才能被编辑
      const viewData = ViewData.findViewData(activeNode);
      if (
        rootContainer.current?.contains(activeNode) &&
        rootContainer.current !== activeNode &&
        viewData
      ) {
        activeViewData(viewData);
        activeVDNode = viewData.element;
        const editable = editBoxLayer.current!.getEditable();
        editable.attachMouseDownEvent(e);
      }
    });
  }, []);

  return (
    <div className="prototype">
      <DragSource dragDestination={rootContainer} drop={handleDrop} />
      <div className="drag-destination">
        <EditBoxLayer ref={editBoxLayer} />
        <div className="root-container " ref={rootContainer}></div>
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
