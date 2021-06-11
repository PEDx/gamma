import { FC, ReactNode, useEffect, useRef } from 'react';
import { Box, useColorMode } from '@chakra-ui/react';
import { groundColor } from '@/editor/color';
import { AudioIcon, ImageIcon } from '@/chakra/icon';
import { DragItem } from '@/class/DragAndDrop/drag';

type ResourceType = 'image' | 'audio' | 'video' | 'svga';

const ResourceTypeIconMap = new Map<ResourceType, ReactNode>([
  ['image', <ImageIcon />],
  ['audio', <AudioIcon />],
]);

interface IResource {
  type: ResourceType;
  url: string;
  name?: string;
}

export interface ResourceDragMeta {
  type: 'resource';
  data: string;
}

export const ResourceManager: FC = () => {
  const { colorMode } = useColorMode();
  const dragItems = useRef<HTMLDivElement[]>([]);
  const resList: IResource[] = [
    {
      type: 'image',
      url: 'http://www.badiu.com',
      name: 'iamge_ansondf.png',
    },
    {
      type: 'audio',
      url: 'http://www.badiu.com',
      name: 'aw3era303fkawaw3era303fkawaw3era303fkawaw3era303fkawaw3era303fkaw.mp3',
    },
    {
      type: 'image',
      url: 'http://www.badiu.com',
      name: 'iamge_ansondf.png',
    },
  ];
  useEffect(() => {
    dragItems.current.forEach((node, idx) => {
      const resource = resList[idx];
      new DragItem<ResourceDragMeta>({
        node,
        meta: {
          type: 'resource',
          data: resource.type,
        },
      });
    });
  }, []);

  return (
    <Box p="4px 0" className="resource-manager">
      {resList.map((res, idx) => (
        <Box
          draggable="true"
          p="0 8px"
          key={idx}
          h="20px"
          mb="2px"
          _hover={{
            background: groundColor[colorMode],
          }}
          cursor="pointer"
          className="flex-box"
          ref={(node) => (dragItems.current[idx] = node!)}
        >
          {ResourceTypeIconMap.get(res.type)}
          <Box ml="3px" isTruncated>
            {res.name}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
