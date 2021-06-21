import {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Box, Image, useColorMode } from '@chakra-ui/react';
import { DropItem } from '@/class/DragAndDrop/drop';
import { DragType } from '@/class/DragAndDrop/drag';
import { ResourceDragMeta } from '@/components/ResourceManager';
import { Resource } from '@/class/Resource';
import { MAIN_COLOR, borderColor } from '@/editor/color';
import { ConfiguratorMethods, ConfiguratorProps } from '@/class/Configurator';

export const DropArea = forwardRef<ConfiguratorMethods, ConfiguratorProps>(
  ({ onChange }, ref) => {
    const { colorMode } = useColorMode();
    const dropArea = useRef<HTMLDivElement | null>(null);
    const [resource, setReource] = useState<Resource | null>(null);
    const [dragOver, setDragOver] = useState<boolean>(false);

    useEffect(() => {
      const dropItem = new DropItem<ResourceDragMeta>({
        node: dropArea.current as HTMLElement,
        type: DragType.resource,
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
          onChange(meta?.data.url || '');
        },
        onDragend: () => {
          setDragOver(false);
        },
      });
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        setValue: (v) => {
          const url = v as string;
          const res = Resource.getResourceByUrl(url);
          setReource(res);
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
  },
);