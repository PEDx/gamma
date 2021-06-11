import {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Box, Image } from '@chakra-ui/react';
import { DropItem } from '@/class/DragAndDrop/drop';
import { ResourceDragMeta } from '@/components/ResourceManager';
import { Resource } from '@/class/Resource';
import { ConfiguratorMethods, ConfiguratorProps } from '@/class/Configurator';

export const DropArea = forwardRef<ConfiguratorMethods, ConfiguratorProps>(
  ({ onChange }, ref) => {
    const dropArea = useRef<HTMLDivElement | null>(null);
    const [resource, setReource] = useState<Resource | null>(null);
    const [dragOver, setDragOver] = useState<boolean>(false);

    useEffect(() => {
      const dropItem = new DropItem<ResourceDragMeta>({
        node: dropArea.current as HTMLElement,
        type: 'resource',
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
        borderColor={
          dragOver ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)'
        }
        borderWidth="1px"
        position="relative"
        overflow="hidden"
      >
        <Image
          src={resource?.url}
          alt={resource?.name}
          position="absolute"
          w="100%"
          sx={{ filter: 'blur(3px)' }}
          objectFit={'cover'}
          h="100%"
        />
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
