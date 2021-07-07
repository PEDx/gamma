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
import { ConfiguratorComponent, StringOrNumber } from '@/class/Configurator';

interface INumberInputProps {
  onChange: ConfiguratorComponent<number>['props']['onChange'];
  max?: number;
  min?: number;
}

export const NumberInput = forwardRef<
  ConfiguratorComponent<StringOrNumber>['methods'],
  INumberInputProps
>(({ onChange, max = 99999, min = 0 }, ref) => {
  const [value, setValue] = useState<StringOrNumber>(0);
  const oldValue = useRef(value);

  const handleBlur = useCallback(() => {
    if (oldValue.current === value) return;
    onChange(Number(value));
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
        max={max}
        min={min}
        value={value}
        onBlur={handleBlur}
        onChange={(_, n) => {
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
