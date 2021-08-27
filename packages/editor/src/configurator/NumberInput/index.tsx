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
import { ConfiguratorComponent } from '@gamma/runtime';

interface INumberInputProps {
  onChange: ConfiguratorComponent<number>['props']['onChange'];
  max?: number;
  min?: number;
  suffix?: string;
  prefix?: string;
}

export const NumberInput = forwardRef<
  ConfiguratorComponent<string | number>['methods'],
  INumberInputProps
>(({ onChange, max = 99999, min = 0, suffix = '', prefix = '' }, ref) => {
  const [value, setValue] = useState<string | number>(0);
  const oldValue = useRef(value);

  const handleBlur = useCallback(() => {
    if (oldValue.current === value) return;
    onChange(Number(value));
    oldValue.current = value;
  }, [value]);

  useImperativeHandle(
    ref,
    () => ({
      setValue: (value) => {
        const val = Number(value);
        setValue(val);
        oldValue.current = val;
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
        value={`${value}${suffix}`}
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
