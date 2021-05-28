import { useEffect, FC } from 'react';
import { Box, Flex, Tooltip } from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';

export interface ConfiguratorWrapProps {
  name: string;
  description?: string;
}

export const ConfiguratorWrap: FC<ConfiguratorWrapProps> = (props) => {
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
