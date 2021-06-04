import {
  useEffect,
  FunctionComponentElement,
  FC,
  createElement,
  useRef,
} from 'react';
import { Box, Flex, Tooltip } from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { Configurator, ConfiguratorMethods } from '@/prototype/Configurator';

export interface ConfiguratorWrapProps {
  configurator: Configurator;
  component: React.ForwardRefExoticComponent<
    React.RefAttributes<ConfiguratorMethods>
  >;
}

export const ConfiguratorWrap: FC<ConfiguratorWrapProps> = ({
  configurator,
  component,
}) => {
  const instance = useRef<ConfiguratorMethods | null>(null);
  const name = configurator.name;
  const description = configurator.describe;
  useEffect(() => {
    console.log(instance.current);
  }, [instance]);

  return (
    <Flex align="center" mb="8px">
      <Box w="25%" className="text-omit">
        {name}
        {description ? (
          <Tooltip
            label={description}
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
        {component
          ? createElement<React.RefAttributes<ConfiguratorMethods>>(component, {
              ref: (ref) => {
                instance.current = ref;
              },
            })
          : null}
      </Box>
    </Flex>
  );
};
