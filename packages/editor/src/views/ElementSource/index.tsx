import { FC, useEffect, useRef } from 'react';
import { Box, Tag } from '@chakra-ui/react';
import { DragItem, DragType } from '@/core/DragAndDrop/DragItem';
export interface IElementDragMeta {
  type: DragType.element | DragType.script;
  data: string;
}

export const gammaElementList = ['base-box'];

const scriptName = '@gamma-element/script-pendant-gala';

export const ElementSource: FC = () => {
  const dragElement = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    dragElement.current.forEach((node, idx) => {
      const name = gammaElementList[idx];
      new DragItem({
        node,
        type: DragType.element,
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
          bgColor={'var(--editor-bar-color)'}
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
