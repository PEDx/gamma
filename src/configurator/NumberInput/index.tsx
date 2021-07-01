import { useImperativeHandle, forwardRef, useState, useCallback } from 'react';
import {
  Box,
  NumberInput as CNumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { ConfiguratorComponentNumber } from '@/class/Configurator';

export const NumberInput = forwardRef<
  ConfiguratorComponentNumber['methods'],
  ConfiguratorComponentNumber['props']
>(({ onChange }, ref) => {
  const [value, setValue] = useState(0);
  const handleBlur = useCallback(() => {
    onChange(value);
  }, [value]);
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
      <CNumberInput
        size="xs"
        value={value}
        onBlur={handleBlur}
        focusBorderColor="gamma.main"
        onChange={(s, n) => {
          if (isNaN(n)) n = 0;
          setValue(n);
        }}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper onClick={() => onChange(value)} />
          <NumberDecrementStepper onClick={() => onChange(value)} />
        </NumberInputStepper>
      </CNumberInput>
    </Box>
  );
});
