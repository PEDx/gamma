import { groundColor, minorColor, primaryColor } from '@/editor/color';
import { Box, Flex, useColorMode } from '@chakra-ui/react';
import { commandHistory } from '@/editor/core/CommandHistory';
import { useEffect, useRef } from 'react';
import { ConcreteObserver } from '@/commom/Observer';
import { Command } from '@/editor/core/Command';
import { useForceRender } from '@/editor/hooks/useForceRender';

// TODO 有没有必要加历史记录

export function Snapshot() {
  const render = useForceRender();
  const { colorMode } = useColorMode();
  const history = useRef<Command[]>([]);
  const head = useRef<number>(commandHistory.getHead());
  useEffect(() => {
    commandHistory.attach(
      new ConcreteObserver(() => {
        history.current = commandHistory.getHistory();
        head.current = commandHistory.getHead();
        render();
      }),
    );
  }, []);

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
        历史命令 head = {head.current}
      </Flex>
      <Box>
        {history.current.map((cmd, idx) => (
          <Box cursor="pointer" p="4px" key={idx}>
            {cmd.constructor.name}
            {head.current === idx ? ' <--' : '  '}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
