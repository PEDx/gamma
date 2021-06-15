import { Movable } from '@/class/Movable';
import { Box, useColorMode } from '@chakra-ui/react';
import { groundColor, minorColor } from '@/editor/color';
import { FC, useEffect, useRef } from 'react';

interface IMiniMapParams {
  host: HTMLElement | null;
}

// TODO 解决 viewport 滚动问题

const ratio = 0.25;
export const MiniMap: FC<IMiniMapParams> = ({ host }) => {
  const { colorMode } = useColorMode();
  const moveElement = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!moveElement.current) return;
    const move = new Movable({
      element: moveElement.current,
      distance: 0,
      onMove: ({ y }) => {
        host?.style.setProperty('top', `-${y / 0.2}px`);
      },
    });
    move.init();
  }, []);
  const hostSrollParent = host!.parentElement!;

  return (
    <Box position="absolute" right="20px" top="40px">
      <Box
        borderColor={groundColor[colorMode]}
        bg={minorColor[colorMode]}
        p="0 4px"
      >
        视图
      </Box>
      <Box
        position="relative"
        w={host!.clientWidth * ratio}
        h={host!.clientHeight * ratio}
        backgroundColor="#fff"
      >
        <Box
          position="absolute"
          cursor="ns-resize"
          right="0"
          top="0"
          w="100%"
          h={hostSrollParent?.clientHeight * ratio}
          backgroundColor="#aaa"
          ref={moveElement}
        ></Box>
      </Box>
    </Box>
  );
};
