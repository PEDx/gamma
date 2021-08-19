import { FC, useEffect, useRef } from 'react';
import { Box, useColorMode } from '@chakra-ui/react';
import { DragItem, DragType } from '@/core/DragAndDrop/drag';
import { minorColor } from '@/color';

export interface WidgetDragMeta {
  type: DragType.widget;
  data: string;
}

const widgetList = [
  {
    name: '空盒子',
    type: 'gamma-base-view-widget',
  },
  {
    name: '文字',
    type: 'gamma-text-view-widget',
  },
  {
    name: '按钮',
    type: 'gamma-button-view-widget',
  },
  {
    name: '图片',
    type: 'gamma-image-view-widget',
  },
  {
    name: '富文本',
    type: 'gamma-rich-text-view-widget',
  },
  {
    name: 'react Tab容器组件',
    type: 'gamma-tab-container-view-widget',
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
    <Box ref={dragSource} p="8px">
      {widgetList.map((widget, idx) => (
        <Box
          key={idx}
          w="100%"
          h="32px"
          backgroundColor="#343438"
          mb="8px"
          borderRadius="4px"
          cursor="grab"
          className="flex-box-c"
          bgColor={minorColor[colorMode]}
          ref={(node) => (dragWidgets.current[idx] = node!)}
        >
          {widget.name}
        </Box>
      ))}
    </Box>
  );
};
