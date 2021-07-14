import { Box, Flex, useColorMode } from '@chakra-ui/react';
import {
  primaryColor,
  groundColor,
  minorColor,
  MAIN_COLOR,
} from '@/editor/color';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
  useContext,
  createContext,
} from 'react';
import { ViewData } from '@/runtime/ViewData';
import { globalBus } from '@/editor/core/Event';
import { useEditorState } from '@/editor/store/editor';
import { useForceRender } from '@/editor/hooks/useForceRender';
import { commandHistory } from '@/editor/core/CommandHistory';
import { SelectWidgetCommand } from '@/editor/commands';
import { logger } from '@/commom/Logger';

function TreeNode(props: {
  level: number;
  viewData?: ViewData | null;
  onClick?: (viewData: ViewData) => void;
  onMouseOver?: (viewData: ViewData) => void;
  onMouseOut?: (viewData: ViewData) => void;
}) {
  const { hoverViewDataId } = useContext(TreeContext);
  const { level, viewData, onClick, onMouseOver, onMouseOut } = props;
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
      {viewData && (
        <Box>
          <Box
            cursor="pointer"
            _hover={{
              outline: `1px dashed ${MAIN_COLOR}`,
            }}
            outline={hover ? `1px dashed ${MAIN_COLOR}` : ''}
            bgColor={select ? 'rgba(255, 122, 71, 0.3)' : ''}
            p="4px"
            onClick={() => onClick && onClick(viewData)}
            onMouseOver={() => onMouseOver && onMouseOver(viewData)}
            onMouseOut={() => onMouseOut && onMouseOut(viewData)}
            color={viewData.isHidden() ? 'rgba(255, 122, 71, 0.4)' : ''}
          >
            {viewData.meta?.id}
          </Box>
          {containers.map((container, idx) => {
            if (container.children.length <= 0) return null;
            return (
              <Box ml="10px" key={viewData.id + idx}>
                {container.children.map((childId) => (
                  <TreeNode
                    level={level + 1}
                    viewData={ViewData.collection.getItemByID(childId)}
                    key={childId}
                    onClick={onClick}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                  ></TreeNode>
                ))}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

export interface WidgetTreeMethods {
  refresh: () => void;
}

const TreeContext = createContext({
  hoverViewDataId: '',
});

export const WidgetTree = forwardRef<WidgetTreeMethods>(({}, ref) => {
  const render = useForceRender();
  const { colorMode } = useColorMode();
  const { activeViewData } = useEditorState();
  const [hoverViewDataId, setHoverViewDataId] = useState('');
  const [layoutViewDataList, setLayoutViewDataList] = useState<ViewData[]>([]);
  useEffect(() => {
    globalBus.on('render-viewdata-tree', () => {
      logger.debug('render-viewdata-tree');
      const arr = ViewData.collection.getLayoutViewData();
      setLayoutViewDataList(arr); // 对象引用无变化，强制重新渲染
      render();
    });
    globalBus.on('tree-hover-high-light', (viewData: ViewData) => {
      setHoverViewDataId(viewData.id);
    });
    globalBus.on('tree-clear-hover-high-light', () => {
      setHoverViewDataId('');
    });
    return () => {
      globalBus.clear('render-viewdata-tree');
      globalBus.clear('tree-clear-hover-high-light');
      globalBus.clear('tree-hover-high-light');
    };
  }, []);

  const handleClick = useCallback(
    (viewData: ViewData) => {
      if (viewData.isHidden()) return;
      if (activeViewData?.id === viewData.id) return;
      commandHistory.push(new SelectWidgetCommand(viewData.id));
    },
    [activeViewData],
  );

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
      return {
        refresh() {
          render();
        },
      };
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
        <TreeContext.Provider value={{ hoverViewDataId }}>
          {layoutViewDataList.map((layoutViewData, idx) => (
            <TreeNode
              key={idx}
              level={0}
              viewData={layoutViewData}
              onClick={handleClick}
              onMouseOver={handleMouseover}
              onMouseOut={handleMouseout}
            />
          ))}
        </TreeContext.Provider>
      </Box>
    </Box>
  );
});
