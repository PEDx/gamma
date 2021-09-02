import { FC, useEffect, useRef } from 'react';
import { Box, Tag, useColorMode } from '@chakra-ui/react';
import { DragItem, DragType } from '@/core/DragAndDrop/drag';
import { minorColor } from '@/color';
export interface IGammaElementDragMeta {
  type: DragType.element | DragType.script;
  data: string;
}

export const gammaElementList = [
  '@gamma-element/base-box',
  '@gamma-element/widget-button',
  '@gamma-element/widget-image',
  '@gamma-element/widget-rich-text',
  '@gamma-element/widget-text',
  '@gamma-element/widget-tab',
  '@gamma-element/script-pendant-gala',
];

const scriptName = '@gamma-element/script-pendant-gala';

export const WidgetSource: FC = () => {
  const { colorMode } = useColorMode();
  const dragElement = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    dragElement.current.forEach((node, idx) => {
      const name = gammaElementList[idx];
      new DragItem<IGammaElementDragMeta>({
        node,
        type: name === scriptName ? DragType.script : DragType.element,
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
          pl="8px"
          className="flex-box"
          bgColor={minorColor[colorMode]}
          ref={(node) => (dragElement.current[idx] = node!)}
        >
          <Tag
            variant="outline"
            colorScheme={id === scriptName ? 'whatsapp' : 'telegram'}
            mr="4px"
          >
            {id === scriptName ? '脚本' : '组件'}
          </Tag>
          {id}
        </Box>
      ))}
    </Box>
  );
};
