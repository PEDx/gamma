import { useEffect, useImperativeHandle, forwardRef } from 'react';
import {
  Box,
  NumberInput as CNumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { ConfiguratorMethods } from '@/prototype/Configurator';

export type BoxViewProps = {
  onMouseDown: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children: React.ReactNode;
};

export const NumberInput = forwardRef<ConfiguratorMethods>(({}, ref) => {
  useEffect(() => {}, []);
  useImperativeHandle(
    ref,
    () => ({
      setValue: (v) => {
        console.log(v);
      },
      emitValue: () => {},
    }),
    [],
  );
  return (
    <Box>
      <CNumberInput size="xs">
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </CNumberInput>
    </Box>
  );
});
