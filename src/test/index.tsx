import { FC, useCallback, useEffect, useRef } from 'react';
import { EditBoxLayer, EditBoxLayerMethods } from '@/components/EditBoxLayer';
import { ViewData } from '@/class/ViewData';
import { createEmptyBox, createText, createImage } from './widget';
import './style.scss';
import './widget.scss';

interface dragType {
  [key: string]: () => HTMLElement;
}

const drag_type_map: dragType = {
  '1': createEmptyBox,
  '2': createText,
  '3': createImage,
};

const clearClassName = (node: Element, name: string) => {
  return node.classList.remove(name);
};

const ACTIVE_CLASSNAME = 'm-box-active';
const EDITABLE_CLASSNAME = 'm-box';
const DRAG_ENTER_CLASSNAME = 'm-box-drag-enter';

const Test: FC = () => {
  const editBoxLayer = useRef<EditBoxLayerMethods>(null);
  const dragSource = useRef<HTMLDivElement>(null);
  const rootContainer = useRef<HTMLDivElement>(null);
  const dragItem = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = document.getElementsByClassName(EDITABLE_CLASSNAME);
    const arr = Array.from(elements);

    arr.forEach((element) => new ViewData({ element: element as HTMLElement }));
    new ViewData({ element: rootContainer.current as HTMLElement });

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
        editBoxLayer.current!.visible(true);
        activeVDNode = viewData.element;
        activeVDNode.classList.add(ACTIVE_CLASSNAME);
        const editable = editBoxLayer.current!.getEditable();
        editable.setShadowViewData(viewData);
        editable.attachMouseDownEvent(e);
      }
    });

    // 拖拽 api
    let offset = { x: 0, y: 0 };
    let dragEnterNode: Element | null = null;
    let type = '1';
    let dragNode: Element | null = null;

    dragSource.current!.addEventListener('dragstart', (e: Event) => {
      const evt = e as DragEvent;
      const node = evt.target as HTMLElement;
      type = node.dataset.type || '1';
      dragNode = node;
      dragNode.classList.add('drag-item-dragstart');
      evt.dataTransfer!.setData('text', '');
      evt.dataTransfer!.effectAllowed = 'move';
      offset = {
        x: evt.offsetX,
        y: evt.offsetY,
      };
    });
    dragSource.current!.addEventListener('dragend', () => {
      if (dragNode) dragNode.classList.remove('drag-item-dragstart');
    });
    rootContainer.current?.addEventListener('dragenter', (e) => {
      const node = e.target as HTMLElement;
      const vd = ViewData.findViewData(node);
      if (!vd) return;
      dragEnterNode = vd.element;
      dragEnterNode.classList.add(DRAG_ENTER_CLASSNAME);
      return true;
    });
    rootContainer.current?.addEventListener('dragover', (e) => {
      e.preventDefault();
      return true;
    });
    // 先触发下个元素的 dragenter，然后触发当前离开元素的 dragleave
    rootContainer.current?.addEventListener('dragleave', (e: DragEvent) => {
      const node = e.target as HTMLElement;
      const vd = ViewData.findViewData(node);
      if (!vd) return false;
      if (dragEnterNode === vd.element) return false; // 修复从子元素移动到父元素，父元素不选中
      vd.element.classList.remove(DRAG_ENTER_CLASSNAME);
      return false;
    });
    rootContainer.current?.addEventListener('drop', (e: DragEvent) => {
      if (!dragEnterNode) return false;
      dragEnterNode.classList.remove(DRAG_ENTER_CLASSNAME);
      const vd = insetElement(dragEnterNode, type);
      vd.updatePosition({
        x: e.offsetX,
        y: e.offsetY,
      });
      return false;
    });
  }, []);

  const insetElement = useCallback((container: Element, type: string) => {
    const element = drag_type_map[type]();
    container?.appendChild(element);
    return new ViewData({ element: element as HTMLElement });
  }, []);

  return (
    <div className="test">
      <div className="drag-source" ref={dragSource}>
        <div className="drag-item" draggable="true" data-type="1">
          空盒子
        </div>
        <div
          className="drag-item"
          draggable="true"
          data-type="2"
          ref={dragItem}
        >
          文字
        </div>
        <div className="drag-item" draggable="true" data-type="3">
          图片
        </div>
      </div>
      <div className="drag-destination">
        <EditBoxLayer ref={editBoxLayer} />
        <div className="root-container " ref={rootContainer}>
          <div className="m-box-01 m-box">
            <div className="m-box-02 m-box">
              <div>test_1234</div>
              <div className="m-box-03 m-box">test_1234</div>
            </div>
            <div className="m-box-02 m-box"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
