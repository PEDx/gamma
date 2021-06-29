import { useImperativeHandle, forwardRef, useState, useCallback } from 'react';
import {
  Box,
  NumberInput as CNumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import {
  ConfiguratorComponentNumber,
} from '@/class/Configurator';


export const NumberInput = forwardRef<
  ConfiguratorComponentNumber['methods'],
  ConfiguratorComponentNumber['props']
>(({ onChange }, ref) => {
  const [value, setValue] = useState(0);
  const handleChange = useCallback((_: string, vn: number) => {
    if (isNaN(vn)) vn = 0;
    onChange(vn);
  }, []);
  useImperativeHandle(
    ref,
    () => ({
      setValue: (v) => {
        setValue(v);
      },
    }),
    [],
  );
  return (
    <Box>
      <CNumberInput size="xs" value={value} onChange={handleChange}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </CNumberInput>
    </Box>
  );
});
