import {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Box, useColorMode } from '@chakra-ui/react';
import { DropItem } from '@/core/DragAndDrop/drop';
import { DragType } from '@/core/DragAndDrop/drag';
import {
  ConfiguratorComponent,
  RuntimeElement,
  ViewData,
} from '@gamma/runtime';
import { MAIN_COLOR, borderColor } from '@/color';
import { INodeDragMeta } from '@/views/WidgetTree';

export const NodeDropArea = forwardRef<
  ConfiguratorComponent<INodeDragMeta['data']>['methods'],
  ConfiguratorComponent<INodeDragMeta['data']>['props']
>(({ onChange }, ref) => {
  const { colorMode } = useColorMode();
  const viewData = useRef<ViewData | null>(null);
  const [nodeId, setNodeId] = useState('');
  const dropArea = useRef<HTMLDivElement | null>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);

  useEffect(() => {
    const dropItem = new DropItem<INodeDragMeta>({
      node: dropArea.current as HTMLElement,
      type: DragType.node,
      onDragenter: () => {
        setDragOver(true);
      },
      onDragleave: () => {
        setDragOver(false);
      },
      onDrop: (evt) => {
        const meta = dropItem.getDragMeta(evt);
        if (!meta?.data) return;
        const viewDataId = meta.data;
        onChange(viewDataId);
        setNodeId(viewDataId);
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
      setValue: (id) => {
        setNodeId(id);
        viewData.current = RuntimeElement.collection.getItemByID(
          id,
        ) as ViewData;
      },
    }),
    [],
  );

  return (
    <Box
      h="28px"
      borderRadius="var(--chakra-radii-sm)"
      border={dragOver ? 'solid' : 'dashed'}
      borderColor={dragOver ? MAIN_COLOR : borderColor[colorMode]}
      borderWidth="1px"
      position="relative"
      overflow="hidden"
    >
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
        {nodeId ? nodeId : '拖拽节点树中节点到此处'}
      </Box>
    </Box>
  );
});
