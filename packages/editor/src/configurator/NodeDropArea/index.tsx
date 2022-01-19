import { useEffect, useRef, useState } from 'react';
import { Box, useColorMode, IconButton } from '@chakra-ui/react';
import { DropItem } from '@/core/DragAndDrop/DropItem';
import { DragType } from '@/core/DragAndDrop/DragItem';
import { MAIN_COLOR, borderColor } from '@/color';
import { Icon } from '@/icons';

export const NodeDropArea = () => {
  const { colorMode } = useColorMode();
  const [nodeId, setNodeId] = useState('');
  const dropArea = useRef<HTMLDivElement | null>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);

  useEffect(() => {
    const dropItem = new DropItem({
      node: dropArea.current as HTMLElement,
      type: DragType.node,
      onDragenter: (event) => {
        setDragOver(false);
        if (dropArea.current?.contains(event.target as Node)) setDragOver(true);
      },
      onDrop: (evt) => {
        const meta = dropItem.getDragMeta(evt);
        if (!meta?.data) return;
      },
      onDragend: () => {
        setDragOver(false);
      },
    });
    return () => {
      dropItem.destory();
    };
  }, []);

  return (
    <Box
      borderRadius="var(--chakra-radii-sm)"
      border={nodeId ? 'solid' : 'dashed'}
      borderColor={dragOver ? MAIN_COLOR : borderColor[colorMode]}
      borderWidth="1px"
      position="relative"
      overflow="hidden"
    >
      <Box
        ref={dropArea}
        isTruncated
        lineHeight="28px"
        h="28px"
        w="100%"
        p="0 8px"
        textAlign="center"
        position="relative"
        className="flex-box"
      >
        {nodeId ? (
          <>
            <Box flex="1">{nodeId}</Box>
            <Box h="100%" className="flex-box">
              <IconButton
                aria-label="delete"
                icon={<Icon name="delete" />}
                mr="0 4px"
              />
            </Box>
          </>
        ) : (
          '拖拽节点树中节点到此处'
        )}
      </Box>
    </Box>
  );
};
