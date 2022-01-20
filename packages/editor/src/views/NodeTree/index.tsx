import { Box, Flex, useColorMode } from '@chakra-ui/react';
import { primaryColor, groundColor, minorColor } from '@/color';
import {
  useCallback,
  useEffect,
  useState,
  createContext,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useForceRender } from '@/hooks/useForceRender';
import { logger } from '@/core/Logger';
import { noop } from '@/utils';
import { TreeNode } from './TreeNode';
import { Editor } from '@/core/Editor';

interface INodeTreeContext {
  hightlightId: string;
  activeId: string;
  onClick?: (id: string) => void;
  onMousoover?: (id: string) => void;
  onMouseout?: (id: string) => void;
}

export const NodeTreeContext = createContext<INodeTreeContext>({
  hightlightId: '',
  activeId: '',
  onClick: noop,
  onMousoover: noop,
  onMouseout: noop,
});

export interface INodeTreeProps {
  onNodeClick: (id: string) => void;
  onNodeHover: (id: string) => void;
}
export interface INodeTreeMethods {
  hightlight(id: string): void;
  active(id: string): void;
}

export const NodeTree = forwardRef<INodeTreeMethods, INodeTreeProps>(
  ({ onNodeClick, onNodeHover }: INodeTreeProps, ref) => {
    const render = useForceRender();
    const { colorMode } = useColorMode();
    const [hightlightId, setHightlightId] = useState('');
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
      logger.debug('render node tree');
      return () => {};
    }, []);

    const handleClick = useCallback((id) => {
      setActiveId(id);
      onNodeClick(id);
    }, []);

    const handleMouseover = useCallback((id) => {
      setHightlightId(id);
      onNodeHover(id);
    }, []);

    const handleMouseout = useCallback(() => {
      handleMouseover('');
    }, []);

    useImperativeHandle(ref, () => ({
      hightlight(id) {
        setHightlightId(id);
      },
      active(id) {
        setActiveId(id);
      },
    }));

    return (
      <Box
        width="260px"
        h="600px"
        bg={primaryColor[colorMode]}
        position="absolute"
        left="20px"
      >
        <Flex
          height="20px"
          className="title"
          bg={minorColor[colorMode]}
          alignItems="center"
          pl="8px"
          onClick={render}
          border={`1px solid ${groundColor[colorMode]}`}
        >
          节点树
        </Flex>
        <Box p="8px">
          <NodeTreeContext.Provider
            value={{
              hightlightId,
              activeId,
              onClick: handleClick,
              onMousoover: handleMouseover,
              onMouseout: handleMouseout,
            }}
          >
            <TreeNode level={0} id={Editor.runtime.root} />
          </NodeTreeContext.Provider>
        </Box>
      </Box>
    );
  },
);
