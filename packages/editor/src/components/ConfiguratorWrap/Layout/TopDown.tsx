import { borderColor } from '@/color';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { Flex, Box, Tooltip, useColorMode } from '@chakra-ui/react';
import { FC } from 'react';
import { ConfiguratorWrap, ConfiguratorWrapProps } from '..';

export const TopDown: FC<ConfiguratorWrapProps<unknown> & { height: number }> =
  ({ configurator, height }) => {
    const { colorMode } = useColorMode();
    const lable = configurator.lable;
    const describe = configurator.describe || '';
    return (
      <Flex mb="16px" h={`${height}px`} flexDirection="column">
        <Box
          className="text-omit"
          fontSize={12}
          h="22px"
          lineHeight="22px"
          borderRadius="2px"
          textAlign="center"
          border={`1px solid ${borderColor[colorMode]}`}
          borderBottom="0"
        >
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

        <Box
          h={`${height - 22}px`}
          sx={{
            '&>div': {
              height: '100%',
            },
          }}
        >
          <ConfiguratorWrap configurator={configurator} />
        </Box>
      </Flex>
    );
  };
