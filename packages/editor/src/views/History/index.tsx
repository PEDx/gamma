import { Box, Flex, Kbd } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

export function History() {
  const history = useRef<string[]>([]);
  const head = useRef<number>(0);
  useEffect(() => {}, []);

  return (
    <Box
      width="260px"
      h="600px"
      bg={'var(--editor-bg-color)'}
      position="absolute"
      right="20px"
    >
      <Flex
        height="20px"
        className="title"
        bg={'var(--editor-bar-color)'}
        alignItems="center"
        pl="8px"
        border={`1px solid var(--editor-border-color)`}
      >
        历史命令 head = {head.current}
      </Flex>
      <Box p="8px">
        <Box p="8px" bg="rgba(0,0,0,.2)">
          <Box>
            <Kbd>⌘</Kbd> + <Kbd>z</Kbd> 回退
          </Box>
          <Box>
            <Kbd>⌘</Kbd> + <Kbd>shift</Kbd> + <Kbd>z</Kbd> 重做
          </Box>
          <Box>
            <Kbd>⌘</Kbd> + <Kbd>c</Kbd> 复制组件
          </Box>
          <Box>
            <Kbd>⌘</Kbd> + <Kbd>v</Kbd> 粘贴组件
          </Box>
        </Box>
        {history.current.map((cmd, idx) => (
          <Box p="4px" key={idx}></Box>
        ))}
      </Box>
    </Box>
  );
}
