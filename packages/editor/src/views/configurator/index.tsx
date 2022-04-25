import { IdleComponentWrap } from '@/views/components/IdleComponent';
import { useForceRender } from '@/hooks/useForceRender';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { Box, Flex, Tooltip } from '@chakra-ui/react';
import { Observer, EConfiguratorType, TConfigurator } from '@gamma/runtime';
import { useCallback, useEffect, useRef } from 'react';
import { NumberInput } from './NumberInput';
import { TextInput } from './TextInput';
import { Switch } from './Switch';
import { BackgroundConfig } from './BackgroundConfig';

export interface IConfiguratorComponentProps<T> {
  value: T;
  onChange: (v: T) => void;
}

export const ConfiguratorViewTypeMap = {
  [EConfiguratorType.Width]: NumberInput,
  [EConfiguratorType.Height]: NumberInput,
  [EConfiguratorType.X]: NumberInput,
  [EConfiguratorType.Y]: NumberInput,
  [EConfiguratorType.Number]: NumberInput,
  [EConfiguratorType.Font]: TextInput,
  [EConfiguratorType.Background]: BackgroundConfig,
  [EConfiguratorType.Border]: TextInput,
  [EConfiguratorType.Text]: TextInput,
  [EConfiguratorType.Switch]: Switch,
};

export const ConfiguratorView = ({
  configurator,
}: {
  configurator: TConfigurator;
}) => {
  const configuratorRef = useRef(configurator);

  type TConfiguratorValueType = typeof configurator.value;

  const render = useForceRender();

  const handleViewValueChange = useCallback((v: TConfiguratorValueType) => {
    configuratorRef.current.value = v;
  }, []);

  useEffect(() => {
    const observer = new Observer(render);
    configuratorRef.current = configurator;
    configurator.attach(observer);
    return () => {
      configurator.detach(observer);
    };
  }, [configurator]);

  if (!configurator.lable) return null; // 无 lable 属性不显示组件

  const { type, value, describe, lable } = configurator;

  const View = ConfiguratorViewTypeMap[type] as (
    props: IConfiguratorComponentProps<TConfiguratorValueType>,
  ) => JSX.Element;

  if (!View) return null; // 未找到对应配置器视图

  return (
    <Box mb="6px">
      <IdleComponentWrap>
        <Flex align="flex-start" alignItems="center" minH="20px">
          <Box w="25%" className="text-omit" fontSize={12} h="100%">
            {lable}
            {describe ? (
              <Tooltip
                label={describe}
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
          <Box w="75%" pl="8px">
            <View value={value} onChange={handleViewValueChange} />
          </Box>
        </Flex>
      </IdleComponentWrap>
    </Box>
  );
};