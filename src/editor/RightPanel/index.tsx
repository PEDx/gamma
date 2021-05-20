import { useEffect, FC } from 'react';
import { Box, Flex, Tooltip } from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { FoldPanel } from '@/components/FoldPanel';
import {
  NumberInput,
  StringInput,
  Switch,
  ColorPicker,
  Select,
  SectionInput,
  GradientColorPicker,
} from '@/configurator';

interface ConfiguratorWrapProps {
  name: string;
  description?: string;
}

/**
 *
 * @param props
 * @returns
 */
const ConfiguratorWrap: FC<ConfiguratorWrapProps> = (props) => {
  return (
    <Flex align="center" mb="8px">
      <Box w="25%" className="text-omit">
        {props.name}
        {props.description ? (
          <Tooltip
            label={props.description}
            fontSize="xs"
            arrowSize={12}
            arrowShadowColor="#eee"
          >
            <QuestionOutlineIcon cursor="pointer" ml="2px" mt="-2px" />
          </Tooltip>
        ) : (
          ''
        )}
      </Box>
      <Box flex="1" pl="8px">
        {props.children}
      </Box>
    </Flex>
  );
};

const panel_list = [
  {
    title: '控制',
    component: () => (
      <Box p="8px" pt="18px">
        <ConfiguratorWrap
          name="数字输入"
          description="描述描述描述描述描述描述描述描述"
          children={<NumberInput />}
        />
        <ConfiguratorWrap name="字符串输入" children={<StringInput />} />
        <ConfiguratorWrap name="开关" children={<Switch />} />
        <ConfiguratorWrap name="颜色选择" children={<ColorPicker />} />
        <ConfiguratorWrap name="选择" children={<Select />} />
        <ConfiguratorWrap name="文段输入" children={<SectionInput />} />
        <ConfiguratorWrap name="渐变颜色" children={<GradientColorPicker />} />
      </Box>
    ),
  },
];

export const RightPanel: FC = () => {
  useEffect(() => {}, []);
  return <FoldPanel panelList={panel_list} name="right_panel" />;
};
