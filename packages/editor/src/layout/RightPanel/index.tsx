import { FC, useCallback, useEffect } from 'react';
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorMode,
} from '@chakra-ui/react';
import { logger } from '@/core/Logger';
import { minorColor, groundColor } from '@/color';
import { StylePanel } from './StylePanel';

const TabDataList = [
  {
    name: '样式',
    component: StylePanel,
  },
  {
    name: '数据',
    component: () => <div>empty</div>,
  },
  {
    name: '事件',
    component: () => <div>empty</div>,
  },
  {
    name: '动画',
    component: () => <div>empty</div>,
  },
];

export const RightPanel: FC = () => {
  const { colorMode } = useColorMode();

  useEffect(() => {}, []);

  /**
   * 单个组件渲染耗时过大依旧会造成 longtask
   * 优化方向：编辑器载入时，就生成一遍各个配置组件
   * 多个相同组件以数量下标来标记 key
   */

  logger.debug('render configurator list');

  return (
    <div className="right-panel">
      <Tabs colorScheme="null" variant="unstyled">
        <TabList
          p="0 8px"
          h="21px"
          borderColor={groundColor[colorMode]}
          bg={minorColor[colorMode]}
        >
          {TabDataList.map((tab, idx) => (
            <Tab
              key={idx}
              p="4px 12px"
              _selected={{ borderColor: '#999' }}
              borderBottom="1px solid transparent"
            >
              {tab.name}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          {TabDataList.map((tab, idx) => (
            <TabPanel key={idx}>
              <tab.component />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </div>
  );
};
