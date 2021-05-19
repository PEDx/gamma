import { FC, useEffect, useRef } from 'react';
import './style.scss';
import { EditBoxLayer, EditBoxLayerMethods } from '@/components/EditBoxLayer';
import { ViewData } from '@/class/ViewData';

const clearClassName = (node: Element, name: string) => {
  return node.classList.remove(name);
};

const ACTIVE_CLASSNAME = 'm-box-active';
const EDITABLE_CLASSNAME = 'm-box';

const Test: FC = () => {
  const editBoxLayer = useRef<EditBoxLayerMethods>(null);
  const rootContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = document.getElementsByClassName(EDITABLE_CLASSNAME);
    const arr = Array.from(elements);

    arr.forEach((element) => new ViewData({ element: element as HTMLElement }));

    const clearActive = () => {
      editBoxLayer.current!.visible(false);
      clearClassName(rootContainer.current!, ACTIVE_CLASSNAME);
      arr.forEach((ele) => clearClassName(ele, ACTIVE_CLASSNAME));
    };
    clearActive();
    document.addEventListener('mousedown', (e) => {
      clearActive();
      const activeNode = e.target as HTMLElement;
      if (
        rootContainer.current?.contains(activeNode) &&
        rootContainer.current !== activeNode
      ) {
        editBoxLayer.current!.visible(true);
        activeNode.classList.add(ACTIVE_CLASSNAME);
        const viewData = ViewData.getViewDataByElement(activeNode);
        const editable = editBoxLayer.current!.getEditable();
        editable.setShadowViewData(viewData);
        editable.attachMouseDownEvent(e);
      }
    });
  }, []);

  return (
    <div className="test">
      <EditBoxLayer ref={editBoxLayer} />
      <div className="root-container" ref={rootContainer}>
        <div className="m-box-01 m-box">
          <div className="m-box-02 m-box">
            test_1234
            <div className="m-box-03 m-box">test_1234</div>
          </div>
          <div className="m-box-02 m-box"></div>
        </div>
      </div>
    </div>
  );
};

export default Test;
