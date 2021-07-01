import { groundColor, minorColor, primaryColor } from '@/editor/color';
import { Box, Flex, useColorMode } from '@chakra-ui/react';

// TODO 有没有必要加历史记录

export function Snapshot() {
  const { colorMode } = useColorMode();
  return (
    <Box
      width="260px"
      h="600px"
      bg={primaryColor[colorMode]}
      position="absolute"
      right="20px"
    >
      <Flex
        height="20px"
        className="title"
        bg={minorColor[colorMode]}
        alignItems="center"
        pl="8px"
        border={`1px solid ${groundColor[colorMode]}`}
      >
        页面快照
      </Flex>
      <Box></Box>
    </Box>
  );
}
