import { FC, ReactNode, useEffect, useRef } from 'react';
import { Box, useColorMode } from '@chakra-ui/react';
import { groundColor } from '@/color';
import { Icon } from '@/icons';
import { DragItem, DragType } from '@/core/DragAndDrop/drag';
import { Resource, ResourceType } from '@gamma/runtime';

const ResourceTypeIconMap = new Map<ResourceType, ReactNode>([
  ['image', <Icon name="image-fill" />],
  ['audio', <Icon name="file-music-fill" />],
]);

export interface ResourceDragMeta {
  type: DragType.media;
  data: Resource;
}

const resList: Resource[] = [
  new Resource({
    type: 'image',
    url: 'https://cdnimg101.gzlzfm.com/web_res/activityimage/2021/06/09/2877583513626151936.jpg',
    name: 'iamge_ansondf.png',
  }),
  new Resource({
    type: 'audio',
    url: 'https://cdn.dribbble.com/users/5276/screenshots/14717116/media/93092e09a643f9f212dd51e39b2aad2c.jpg?compress=1&resize=1200x900',
    name: 'aw3era303fkawaw3era303fkawaw3era303fkawaw3era303fkawaw3era303fkaw.mp3',
  }),
  new Resource({
    type: 'image',
    url: 'https://cdn.dribbble.com/users/485324/screenshots/15655930/media/84356311d2616423183ff0c09b91c8d1.png?compress=1&resize=1200x900',
    name: 'iamge_ansondf.png',
  }),
  new Resource({
    type: 'image',
    url: 'https://cdn.gzlzfm.com/sociality/2020/03/13/2793527126844231228.png',
    name: 'pendant.png',
  }),
];

export const ResourceManager: FC = () => {
  const { colorMode } = useColorMode();
  const dragItems = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    dragItems.current.forEach((node, idx) => {
      const resource = resList[idx];
      new DragItem({
        node,
        type: DragType.media,
        data: resource,
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
