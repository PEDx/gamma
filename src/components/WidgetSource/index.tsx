import { FC, useEffect, useRef } from 'react';
import { Box, useColorMode } from '@chakra-ui/react';
import { DragItem, DragType } from '@/class/DragAndDrop/drag';
import { minorColor } from '@/editor/color';
import './style.scss';

export interface WidgetDragMeta {
  type: DragType.widget;
  data: number;
}

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

export const WidgetSource: FC = () => {
  const { colorMode } = useColorMode();
  const dragSource = useRef<HTMLDivElement>(null);
  const dragWidgets = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    dragWidgets.current.forEach((node, idx) => {
      const widget = widgetList[idx];
      new DragItem<WidgetDragMeta>({
        node,
        type: DragType.widget,
        data: widget.type,
      });
    });
  }, []);

  return (
    <div className="drag-source" ref={dragSource}>
      {widgetList.map((widget, idx) => (
        <Box
          key={idx}
          className="drag-item"
          bgColor={minorColor[colorMode]}
          ref={(node) => (dragWidgets.current[idx] = node!)}
        >
          {widget.name}
        </Box>
      ))}
    </div>
  );
};
