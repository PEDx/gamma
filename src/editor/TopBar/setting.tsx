import { useEffect, FC } from 'react';
import {
  Flex,
  Box,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
} from '@chakra-ui/react';

export const Setting: FC = () => {
  useEffect(() => {}, []);
  return (
    <div className="Setting">
      <Flex justify="space-between" align="center">
        <Box fontSize="12px">深色模式:</Box>
        <Switch color="bannerman" />
      </Flex>
      <Flex justify="space-between" align="center">
        <Box fontSize="12px">深色模式跟随系统:</Box>
        <Switch color="bannerman" />
      </Flex>
      <Flex justify="space-between" align="center">
        <Box fontSize="12px">边缘吸附:</Box>
        <Switch color="bannerman" />
      </Flex>
      <Flex justify="space-between" align="center" mt="4px">
        <Box fontSize="12px">吸附距离:</Box>
        <NumberInput w="100px" min={0} max={20} defaultValue={5}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>
    </div>
  );
};
