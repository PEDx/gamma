import { borderColor } from '@/color';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { Flex, Box, Tooltip, useColorMode } from '@chakra-ui/react';
import { FC } from 'react';
import { ConfiguratorWrap, ConfiguratorWrapProps } from '..';

export const TopDown: FC<ConfiguratorWrapProps<unknown>> = ({
  configurator,
}) => {
  const { colorMode } = useColorMode();
  const lable = configurator.lable;
  const describe = configurator.describe || '';
  return (
    <Flex
      mb="16px"
      flexDirection="column"
      border={`1px solid ${borderColor[colorMode]}`}
      p="8px"
      borderTopWidth="3px"
    >
      <Box className="text-omit" fontSize={12} textAlign="left" pb="12px">
        <Box textAlign="left">{lable}</Box>
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

      <Box>
        <ConfiguratorWrap configurator={configurator} />
      </Box>
    </Flex>
  );
};
