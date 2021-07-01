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
import { ViewData } from '@/class/ViewData/ViewData';
import { globalBus } from '@/class/Event';
import { ActionType, useEditorDispatch, useEditorState } from '@/store/editor';
import { useForceRender } from '@/hooks/useRender';


function TreeNode(props: {
  level: number;
  viewData?: ViewData | null;
  onClick?: (viewData: ViewData) => void;
  onMouseOver?: (viewData: ViewData) => void;
  onMouseOut?: (viewData: ViewData) => void;
}) {
  const { hoverViewDataId } = useContext(TreeContext);
  const { level, viewData, onClick, onMouseOver, onMouseOut } = props;
  const { selectViewData } = useEditorState();
  if (!viewData) return null;
  const containers = viewData?.containers || [];
  const select = selectViewData && selectViewData.id === viewData.id;
  const hover = hoverViewDataId === viewData.id;
  return (
    <Box>
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

export interface WidgetTreeMethods {
  refresh: () => void;
}

const TreeContext = createContext({
  hoverViewDataId: '',
});

export const WidgetTree = forwardRef<WidgetTreeMethods>(({}, ref) => {
  const render = useForceRender();
  const { colorMode } = useColorMode();
  const dispatch = useEditorDispatch();
  const [hoverViewDataId, setHoverViewDataId] = useState('');
  const [rootViewData, setRootViewData] = useState<ViewData | null>(null);
  useEffect(() => {
    globalBus.on('viewport-render-end', () => {
      console.log('viewport-render-end');
      const rootViewData = ViewData.collection.getRootViewData();
      setRootViewData(rootViewData); // 对象引用无变化，强制重新渲染
      render();
    });
    globalBus.on('tree-hover-high-light', (viewData: ViewData) => {
      setHoverViewDataId(viewData.id);
    });
    globalBus.on('tree-clear-hover-high-light', () => {
      setHoverViewDataId('');
    });
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
          <TreeNode
            level={0}
            viewData={rootViewData}
            onClick={handleClick}
            onMouseOver={handleMouseover}
            onMouseOut={handleMouseout}
          />
        </TreeContext.Provider>
      </Box>
    </Box>
  );
});