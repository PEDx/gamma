import { Box, Flex, useColorMode } from '@chakra-ui/react';
import { primaryColor, groundColor, minorColor, MAIN_COLOR } from '@/color';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
  useContext,
  createContext,
} from 'react';
import { ViewData, ViewDataContainer } from '@gamma/runtime';
import { globalBus } from '@/core/Event';
import { useEditorState } from '@/store/editor';
import { useForceRender } from '@/hooks/useForceRender';
import { logger } from '@/core/Logger';
import { noop } from '@/utils';
import { safeEventBus, SafeEventType } from '@/events';

interface IWidgetTreeContext {
  hoverViewDataId: string;
  onClick?: (viewData: ViewData) => void;
  onMousoover?: (viewData: ViewData) => void;
  onMouseout?: (viewData: ViewData) => void;
}

const WidgetTreeContext = createContext<IWidgetTreeContext>({
  hoverViewDataId: '',
  onClick: noop,
  onMousoover: noop,
  onMouseout: noop,
});

function TreeNode(props: { level: number; viewData?: ViewData | null }) {
  const { level, viewData } = props;
  const { hoverViewDataId, onClick, onMouseout, onMousoover } =
    useContext(WidgetTreeContext);
  const { activeViewData } = useEditorState();
  if (!viewData) return null;
  const containers = viewData?.containers || [];
  const select = activeViewData && activeViewData.id === viewData.id;
  const hover = hoverViewDataId === viewData.id;
  return (
    <Box
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Box
        cursor="pointer"
        _hover={{
          outline: `1px dashed ${MAIN_COLOR}`,
        }}
        outline={hover ? `1px dashed ${MAIN_COLOR}` : ''}
        bgColor={select ? 'rgba(255, 122, 71, 0.3)' : ''}
        p="4px"
        onClick={() => onClick && onClick(viewData)}
        onMouseOver={() => onMousoover && onMousoover(viewData)}
        onMouseOut={() => onMouseout && onMouseout(viewData)}
        color={viewData.isHidden() ? 'rgba(255, 122, 71, 0.4)' : ''}
      >
        {viewData.meta?.id}
      </Box>
      {containers.map((containerId, idx) => {
        const container = ViewDataContainer.collection.getItemByID(containerId);
        if (!container) return null;
        if (container.children.length <= 0) return null;
        return (
          <Box ml="10px" key={viewData.id + idx}>
            {container.children.map((childId) => (
              <TreeNode
                level={level + 1}
                viewData={ViewData.collection.getItemByID(childId)}
                key={childId}
              ></TreeNode>
            ))}
          </Box>
        );
      })}
    </Box>
  );
}

export interface WidgetTreeMethods {}
export interface WidgetTreeProps {
  onViewDataClick: (viewData: ViewData) => void;
}

export const WidgetTree = forwardRef<WidgetTreeMethods, WidgetTreeProps>(
  ({ onViewDataClick }, ref) => {
    const render = useForceRender();
    const { colorMode } = useColorMode();
    const { rootViewData } = useEditorState();
    const [hoverViewDataId, setHoverViewDataId] = useState('');
    useEffect(() => {
      safeEventBus.on(SafeEventType.RENDER_VIEWDATA_TREE, () => {
        logger.debug('render-viewdata-tree');
        render();
      });
      globalBus.on('tree-hover-high-light', (viewData: ViewData) => {
        setHoverViewDataId(viewData.id);
      });
      globalBus.on('tree-clear-hover-high-light', () => {
        setHoverViewDataId('');
      });
      return () => {
        safeEventBus.clear(SafeEventType.RENDER_VIEWDATA_TREE);
        globalBus.clear('tree-clear-hover-high-light');
        globalBus.clear('tree-hover-high-light');
      };
    }, []);

    const handleClick = useCallback((viewData: ViewData) => {
      if (viewData.isHidden()) return;
      onViewDataClick(viewData);
    }, []);

    const handleMouseover = useCallback((viewData: ViewData) => {
      if (viewData.isHidden()) return;
      globalBus.emit('set-hover-high-light', viewData);
    }, []);

    const handleMouseout = useCallback(() => {
      globalBus.emit('clear-hover-high-light');
    }, []);

    useImperativeHandle(
      ref,
      () => {
        return {};
      },
      [],
    );
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
          border={`1px solid ${groundColor[colorMode]}`}
        >
          组件树
        </Flex>
        <Box p="8px">
          <WidgetTreeContext.Provider
            value={{
              hoverViewDataId,
              onClick: handleClick,
              onMousoover: handleMouseover,
              onMouseout: handleMouseout,
            }}
          >
            <TreeNode level={0} viewData={rootViewData} />
          </WidgetTreeContext.Provider>
        </Box>
      </Box>
    );
  },
);
