import { Box, useColorMode } from '@chakra-ui/react';
import { FC } from 'react';
import { ConfiguratorWrapProps } from '..';
import { RuntimeElement } from '@gamma/runtime';
import { LeftRight } from './LeftRight';
import { minorColor } from '@/color';

export const Subsidiary: FC<ConfiguratorWrapProps<unknown>> = ({
  configurator,
}) => {
  const { colorMode } = useColorMode();
  const id = configurator.value as string;
  const element = RuntimeElement.collection.getItemByID(id);
  if (!element) return null;
  return (
    <Box bgColor={minorColor[colorMode]} mt="8px" p="8px">
      {Object.values(element.configurators).map((configurator, idx) => {
        return <LeftRight configurator={configurator} key={idx} />;
      })}
    </Box>
  );
};
