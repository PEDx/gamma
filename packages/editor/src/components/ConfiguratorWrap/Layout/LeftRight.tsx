import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { Flex, Box, Tooltip } from '@chakra-ui/react';
import { FC } from 'react';
import { ConfiguratorWrap, ConfiguratorWrapProps } from '..';

export const LeftRight: FC<ConfiguratorWrapProps<unknown>> = ({
  configurator,
}) => {
  const lable = configurator.lable;
  const describe = configurator.describe || '';
  return (
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
        <ConfiguratorWrap configurator={configurator} />
      </Box>
    </Flex>
  );
};
