import { Box, Flex, useColorMode } from '@chakra-ui/react';
import {
  primaryColor,
  color,
  groundColor,
  minorColor,
  MAIN_COLOR,
} from '@/editor/color';
import { useEffect, useState } from 'react';
import { ViewData } from '@/class/ViewData/ViewData';
import { globalBus } from '@/class/Event';

let opcity = '0.05';

function TreeNode(props: { level: number; viewData?: ViewData }) {
  const { level, viewData } = props;
  const containers = viewData?.containers || [];
  return (
    <Box>
      {viewData && (
        <Box bg={`rgba(0,0,0,${opcity})`} pl="10px">
          <Box
            cursor="pointer"
            _hover={{
              background: MAIN_COLOR,
            }}
          >
            {viewData.meta?.id}
          </Box>
          {containers.map((container, idx) => {
            if (container.children.length <= 0) return null;
            return (
              <Box
                key={viewData.id + idx}
                border={`1px solid ${primaryColor['dark']}`}
              >
                {container.children.map((child) => (
                  <TreeNode
                    level={level + 1}
                    viewData={child}
                    key={child.id}
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

export function WidgetTree() {
  const { colorMode } = useColorMode();
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
  }, []);
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
        border="1px"
        borderColor={groundColor[colorMode]}
      >
        组件树
      </Flex>
      <Box>
        {rootViewData && <TreeNode level={0} viewData={rootViewData} />}
      </Box>
    </Box>
  );
}
