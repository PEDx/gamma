import { FC, useEffect, useRef } from 'react';
import { DragItem } from '@/class/DragAndDrop/drag';
import './style.scss';

export const DRAG_ENTER_CLASSNAME = 'm-box-drag-enter';

export interface DragWidgetMeta {
  type: 'widget';
  data?: number;
}

export const WidgetSource: FC = () => {
  const dragSource = useRef<HTMLDivElement>(null);
  const dragWidgets = useRef<HTMLDivElement[]>([]);

  const widgetList = [
    {
      name: '空盒子',
      type: 1,
    },
    {
      name: '文字',
      type: 2,
    },
    {
      name: '图片',
      type: 3,
    },
    {
      name: 'react组件',
      type: 4,
    },
  ];

  useEffect(() => {
    dragWidgets.current.forEach((node, idx) => {
      const widget = widgetList[idx];
      console.log(widget);

      new DragItem<DragWidgetMeta>({
        node,
        meta: {
          type: 'widget',
          data: widget.type,
        },
      });
    });
  }, []);

  return (
    <div className="drag-source" ref={dragSource}>
      {widgetList.map((widget, idx) => (
        <div
          className="drag-item"
          key={idx}
          ref={(node) => (dragWidgets.current[idx] = node!)}
        >
          {widget.name}
        </div>
      ))}
    </div>
  );
};
