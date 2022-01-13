import { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Image, useColorMode } from '@chakra-ui/react';
import { DropItem } from '@/core/DragAndDrop/drop';
import { DragType } from '@/core/DragAndDrop/drag';
import { Resource } from '@gamma/runtime';
import { MAIN_COLOR, borderColor } from '@/color';
import { Icon } from '@/icons';
import { IConfiguratorComponentProps } from '..';

export const DropArea = ({
  value,
  onChange,
}: IConfiguratorComponentProps<string>) => {
  const { colorMode } = useColorMode();
  const dropArea = useRef<HTMLDivElement | null>(null);
  const [resource, setReource] = useState<Resource | null>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);

  useEffect(() => {
    const dropItem = new DropItem<Resource, DragType.media>({
      node: dropArea.current as HTMLElement,
      type: DragType.media,
      onDragenter: (event) => {
        setDragOver(false);
        if (dropArea.current?.contains(event.target as Node)) setDragOver(true);
      },
      onDrop: (evt) => {
        const meta = dropItem.getDragMeta(evt);
        if (!meta?.data) return;
        setReource(meta?.data);
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
      border={resource?.url ? 'solid' : 'dashed'}
      borderColor={dragOver ? MAIN_COLOR : borderColor[colorMode]}
      borderWidth="1px"
      position="relative"
      overflow="hidden"
    >
      {resource?.url && (
        <Image
          src={resource?.url}
          alt={resource?.name}
          position="absolute"
          w="100%"
          sx={{ filter: 'blur(3px)' }}
          objectFit={'cover'}
          h="100%"
        />
      )}
      <Box
        ref={dropArea}
        zIndex="1"
        isTruncated
        lineHeight="28px"
        h="28px"
        w="100%"
        p="0 8px"
        textAlign="center"
        position="relative"
        className="flex-box-c"
      >
        {resource?.url ? (
          <>
            <Box>{resource.name}</Box>
            <Box h="100%" className="flex-box">
              <IconButton
                aria-label="delete"
                icon={<Icon name="delete" />}
                m="0 4px"
              />
            </Box>
          </>
        ) : (
          '拖拽到此处'
        )}
      </Box>
    </Box>
  );
};
