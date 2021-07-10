import { Flex, Box, useRadio, UseRadioProps } from '@chakra-ui/react';
import { FC } from 'react';

export const RadioTag: FC<UseRadioProps> = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label" flex="1">
      <input {...input} />
      <Flex
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="2px"
        h="19px"
        _checked={{
          backgroundColor: 'rgba(188, 188, 188, 0.5)',
        }}
        flex="1"
        alignItems="center"
        justifyContent="center"
      >
        {props.children}
      </Flex>
    </Box>
  );
};
