import { useEffect, FC } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { FoldPanel } from '@/components/FoldPanel';
import { NumberInput } from '@/configurator/NumberInput';
import { StringInput } from '@/configurator/StringInput';
import { Switch } from '@/configurator/Switch';
import { ColorPicker } from '@/configurator/ColorPicker';

const panel_list = [
  {
    title: '控制',
    component: () => (
      <Box p="8px" pt="18px">
        <Box mb="8px">
          <Flex align="center">
            <Box pr="8px">名称</Box>
            <Box flex="1" pl="8px">
              <NumberInput />
            </Box>
          </Flex>
        </Box>
        <Box mb="8px">
          <Flex align="center">
            <Box pr="8px">名称</Box>
            <Box flex="1" pl="8px">
              <StringInput />
            </Box>
          </Flex>
        </Box>
        <Box mb="8px">
          <Flex align="center">
            <Box pr="8px">名称名称名称名称</Box>
            <Box flex="1" pl="8px">
              <Switch />
            </Box>
          </Flex>
        </Box>
        <Box mb="8px">
          <Flex align="center">
            <Box pr="8px">名称</Box>
            <Box flex="1" pl="8px">
              <ColorPicker />
            </Box>
          </Flex>
        </Box>
      </Box>
    ),
  },
];

export const RightPanel: FC = () => {
  useEffect(() => {}, []);
  return <FoldPanel panelList={panel_list} name="right_panel" />;
};
