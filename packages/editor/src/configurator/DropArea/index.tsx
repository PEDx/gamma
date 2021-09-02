import {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Box, Image, useColorMode } from '@chakra-ui/react';
import { DropItem } from '@/core/DragAndDrop/drop';
import { DragType } from '@/core/DragAndDrop/drag';
import { ResourceDragMeta } from '@/views/ResourceManager';
import { Resource, ConfiguratorComponent } from '@gamma/runtime';
import { MAIN_COLOR, borderColor } from '@/color';

export const DropArea = forwardRef<
  ConfiguratorComponent<Resource>['methods'],
  ConfiguratorComponent<Resource>['props']
>(({ onChange }, ref) => {
  const { colorMode } = useColorMode();
  const dropArea = useRef<HTMLDivElement | null>(null);
  const [resource, setReource] = useState<Resource | null>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);

  useEffect(() => {
    const dropItem = new DropItem<ResourceDragMeta>({
      node: dropArea.current as HTMLElement,
      type: DragType.media,
      onDragenter: () => {
        setDragOver(true);
      },
      onDragleave: () => {
        setDragOver(false);
      },
      onDrop: (evt) => {
        const meta = dropItem.getDragMeta(evt);
        if (!meta?.data) return;
        setReource(meta?.data);
        onChange(meta?.data || '');
      },
      onDragend: () => {
        setDragOver(false);
      },
    });
    return () => {
      dropItem.destory();
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      setValue: (v) => {
        setReource(v);
      },
    }),
    [],
  );

  return (
    <Box
      h="28px"
      borderRadius="var(--chakra-radii-sm)"
      border={dragOver || resource ? 'solid' : 'dashed'}
      borderColor={dragOver || resource ? MAIN_COLOR : borderColor[colorMode]}
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
        zIndex="2"
        isTruncated
        lineHeight="28px"
        h="28px"
        w="100%"
        p="0 8px"
        textAlign="center"
        position="relative"
      >
        {resource ? resource.name : '拖拽到此处'}
      </Box>
    </Box>
  );
});
