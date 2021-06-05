import { useEffect, FC, createElement, useRef } from 'react';
import { Box, Flex, Tooltip } from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  Configurator,
  ConfiguratorMethods,
  ConfiguratorProps,
} from '@/prototype/Configurator';
import { ConcreteObserver } from '@/class/Observer';

export interface ConfiguratorWrapProps {
  configurator: Configurator;
}

export const ConfiguratorWrap: FC<ConfiguratorWrapProps> = ({
  configurator,
}) => {
  const instance = useRef<ConfiguratorMethods | null>(null);
  const name = configurator.lable;
  const description = configurator.describe;
  const component = configurator.component;
  useEffect(() => {
    const coc = new ConcreteObserver<Configurator>((s) => {
      instance.current?.setValue(s.value);
    });
    configurator.attach(coc);
    return () => {
      configurator.detach(coc);
    };
  }, []);

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
          ? createElement<
              ConfiguratorProps & React.RefAttributes<ConfiguratorMethods>
            >(component, {
              ref: (ref) => {
                instance.current = ref;
              },
              onChange: (v) => {
                configurator.setValue(v);
              },
            })
          : null}
      </Box>
    </Flex>
  );
};
