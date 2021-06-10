import { FC, useEffect, useRef } from 'react';
import { ViewData } from '@/class/ViewData';
import './style.scss';

const DRAG_ENTER_CLASSNAME = 'm-box-drag-enter';
const DRAG_ITEM_DRAGSTART = 'drag-item-dragstart';

export interface WidgetSourceProps {
  dragDestination: HTMLDivElement | null;
  drop: (el: Element, type: number, ev: DragEvent) => void;
}

export const WidgetSource: FC<WidgetSourceProps> = ({
  dragDestination,
  drop,
}) => {
  const dragSource = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!dragDestination) return;
    let dragNode: Element | null = null;
    let dragEnterNode: Element | null = null;
    let offset = { x: 0, y: 0 };
    let type: string | null = null;
    let dragStart = false;

    dragSource.current!.addEventListener('dragstart', (e: Event) => {
      const evt = e as DragEvent;
      const node = evt.target as HTMLElement;
      type = node.dataset.type || '1';
      dragNode = node;
      dragNode.classList.add(DRAG_ITEM_DRAGSTART);
      evt.dataTransfer!.setData('text', '');
      evt.dataTransfer!.effectAllowed = 'move';
      offset = {
        x: evt.offsetX,
        y: evt.offsetY,
      };
      dragStart = true;
    });
    dragSource.current!.addEventListener('dragend', () => {
      if (dragNode) dragNode.classList.remove(DRAG_ITEM_DRAGSTART);
      if (dragEnterNode) dragEnterNode.classList.remove(DRAG_ENTER_CLASSNAME);
      dragStart = false;
    });

    dragDestination.addEventListener('dragenter', (e) => {
      if (!dragStart) return;
      const node = e.target as HTMLElement;
      const vd = ViewData.findViewData(node); // ANCHOR 此处保证拿到的是最近父级有 ViewData 的 dom
      if (!vd) return;
      dragEnterNode = vd.element;
      dragEnterNode.classList.add(DRAG_ENTER_CLASSNAME);
      return true;
    });
    dragDestination.addEventListener('dragover', (e) => {
      e.preventDefault();
      return true;
    });

    // 先触发下个元素的 dragenter，然后触发当前离开元素的 dragleave
    dragDestination.addEventListener('dragleave', (e: DragEvent) => {
      const node = e.target as HTMLElement;

      const vd = ViewData.findViewData(node);
      if (!vd) return false;
      if (dragEnterNode === vd.element) return false; // 从子元素移动到父元素，父元素不选中
      vd.element.classList.remove(DRAG_ENTER_CLASSNAME);
      return false;
    });

    dragDestination.addEventListener('drop', (e: DragEvent) => {
      if (!dragEnterNode) return false;
      if (type === null) return false;
      dragEnterNode.classList.remove(DRAG_ENTER_CLASSNAME);
      drop && drop(dragEnterNode, parseInt(type), e);
      type = null;
      return false;
    });
  }, [dragDestination]);

  return (
    <div className="drag-source" ref={dragSource}>
      <div className="drag-item" draggable="true" data-type="1">
        空盒子
      </div>
      <div className="drag-item" draggable="true" data-type="2">
        文字
      </div>
      <div className="drag-item" draggable="true" data-type="3">
        图片
      </div>
      <div className="drag-item" draggable="true" data-type="4">
        react组件
      </div>
    </div>
  );
};
