import { FC, useEffect, useRef } from 'react';
import { Box, useColorMode } from '@chakra-ui/react';
import { DragItem, DragType } from '@/core/DragAndDrop/drag';
import { minorColor } from '@/color';
export interface WidgetDragMeta {
  type: DragType.widget;
  data: string;
}

export const gammaElementList = [
  '@gamma-element/base-box',
  '@gamma-element/widget-button',
  '@gamma-element/widget-image',
  '@gamma-element/widget-rich-text',
  '@gamma-element/widget-text',
  '@gamma-element/widget-tab',
];

export const WidgetSource: FC = () => {
  const { colorMode } = useColorMode();
  const dragElement = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    dragElement.current.forEach((node, idx) => {
      new DragItem<WidgetDragMeta>({
        node,
        type: DragType.widget,
        data: gammaElementList[idx],
      });
    });
  }, []);

  return (
    <Box p="8px">
      {gammaElementList.map((id, idx) => (
        <Box
          key={id}
          w="100%"
          h="32px"
          backgroundColor="#343438"
          mb="8px"
          borderRadius="4px"
          cursor="grab"
          className="flex-box-c"
          bgColor={minorColor[colorMode]}
          ref={(node) => (dragElement.current[idx] = node!)}
        >
          {id}
        </Box>
      ))}
    </Box>
  );
};
