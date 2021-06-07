import { useEffect, FC } from 'react';
import { Box } from '@chakra-ui/react';
import { DragSource } from '@/components/DragSource';
import { FoldPanel } from '@/components/FoldPanel';

const panel_list = [
  {
    title: '组件',
    component: () => (
      <Box>
        {/* <DragSource dragDestination={rootContainer} drop={handleDrop} /> */}
      </Box>
    ),
  },
  {
    title: '资源',
    component: () => <Box></Box>,
  },
];

export const LeftPanel: FC = () => {
  useEffect(() => {}, []);
  return <FoldPanel panelList={panel_list} name="left_panel" />;
};
