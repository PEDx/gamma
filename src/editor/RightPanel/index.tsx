import { useEffect, FC } from 'react';
import { Box } from '@chakra-ui/react';
import { ConfiguratorWrap } from '@/components/ConfiguratorWrap';
import { Configurator } from '@/class/Configurator';
import { FoldPanel } from '@/components/FoldPanel';

const panel_list = [
  {
    title: '控制',
    component: () => <Box p="8px" pt="18px"></Box>,
  },
];

export const RightPanel: FC = () => {
  useEffect(() => {}, []);
  return <FoldPanel panelList={panel_list} name="right_panel" />;
};
