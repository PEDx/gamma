import {
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
  useRef,
} from 'react';
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
  const oldValue = useRef(value);

  const handleBlur = useCallback(() => {
    if (oldValue.current === value) return;
    onChange(value);
  }, [value]);

  useImperativeHandle(
    ref,
    () => ({
      setValue: (value) => {
        setValue(value);
        oldValue.current = value;
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
        onChange={(s, n) => {
          if (isNaN(n)) n = 0;
          setValue(n);
        }}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </CNumberInput>
    </Box>
  );
});
