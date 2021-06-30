import { Box, Flex, useColorMode } from '@chakra-ui/react';
import {
  primaryColor,
  color,
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
} from 'react';
import { ViewData } from '@/class/ViewData/ViewData';
import { globalBus } from '@/class/Event';
import { ActionType, useEditorDispatch, useEditorState } from '@/store/editor';
import { useRefresh } from '@/hooks/useRefresh';

let opcity = '0.05';

function TreeNode(props: {
  level: number;
  viewData?: ViewData | null;
  onClick?: (viewData: ViewData) => void;
  onMouseOver?: (viewData: ViewData) => void;
  onMouseOut?: (viewData: ViewData) => void;
}) {
  const { selectViewData } = useEditorState();
  const { level, viewData, onClick, onMouseOver, onMouseOut } = props;
  if (!viewData) return null;
  const containers = viewData?.containers || [];
  const select = selectViewData && selectViewData.id === viewData.id;
  return (
    <Box>
      {viewData && (
        <Box bg={`rgba(0,0,0,${opcity})`}>
          <Box
            cursor="pointer"
            _hover={{
              outline: `1px dashed ${MAIN_COLOR}`,
            }}
            outline={select ? `1px solid ${MAIN_COLOR}` : ''}
            p="4px"
            onClick={() => onClick && onClick(viewData)}
            onMouseOver={() => onMouseOver && onMouseOver(viewData)}
            onMouseOut={() => onMouseOut && onMouseOut(viewData)}
            color={viewData.isHidden() ? '#999' : ''}
          >
            {viewData.meta?.id}
          </Box>
          {containers.map((container, idx) => {
            if (container.children.length <= 0) return null;
            return (
              <Box ml="10px" key={viewData.id + idx}>
                {container.children.map((child) => (
                  <TreeNode
                    level={level + 1}
                    viewData={child}
                    key={child.id}
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

export const WidgetTree = forwardRef(({}, ref) => {
  const refresh = useRefresh();
  const { colorMode } = useColorMode();
  const dispatch = useEditorDispatch();
  const [rootViewData, setRootViewData] = useState<ViewData | null>(null);
  if (colorMode === 'dark') opcity = '0.13';
  if (colorMode === 'light') opcity = '0.05';
  useEffect(() => {
    globalBus.on('viewport-render-end', () => {
      console.log('viewport-render-end');
      const rootViewData = ViewData.collection.getRootViewData();
      console.log(rootViewData);
      setRootViewData(rootViewData);
    });
    globalBus.on('hover-high-light', () => {});
  }, []);

  const handleClick = useCallback((viewData: ViewData) => {
    if (viewData.isHidden()) return;
    dispatch({
      type: ActionType.SetSelectViewData,
      data: viewData,
    });
  }, []);

  const handleMouseover = useCallback((viewData: ViewData) => {
    if (viewData.isHidden()) return;
    if (viewData.isRoot) return;
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
          refresh();
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
      color={color[colorMode]}
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
        <TreeNode
          level={0}
          viewData={rootViewData}
          onClick={handleClick}
          onMouseOver={handleMouseover}
          onMouseOut={handleMouseout}
        />
      </Box>
    </Box>
  );
});
