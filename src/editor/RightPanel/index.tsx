import { useEffect, FC } from 'react';
import { Box } from '@chakra-ui/react';
import { FoldPanel } from '@/components/FoldPanel';

const panel_list = [
  {
    title: '控制',
    component: () => <Box></Box>,
  },
];

export const RightPanel: FC = () => {
  useEffect(() => {}, []);
  return <FoldPanel panelList={panel_list} name="right_panel" />;
};
