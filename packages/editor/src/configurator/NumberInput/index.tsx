import { useState, useCallback, useRef, FC } from 'react';
import {
  Box,
  NumberInput as CNumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { handlePrevent } from '@/utils';

interface INumberInputProps {
  value?: number;
  max?: number;
  min?: number;
  suffix?: string;
  prefix?: string;
}

export const NumberInput: FC<INumberInputProps> = ({
  value = 0,
  max = 99999,
  min = 0,
  suffix = '',
}) => {
  const [localValue, setLocalValue] = useState<string | number>(value);
  const oldValue = useRef(localValue);

  const handleBlur = useCallback(() => {
    if (oldValue.current === localValue) return;
    oldValue.current = localValue;
  }, [localValue]);

  return (
    <Box>
      <CNumberInput
        size="xs"
        max={max}
        min={min}
        value={`${localValue}${suffix}`}
        onBlur={handleBlur}
        onChange={(_, n) => {
          if (isNaN(n)) n = 0;
          setLocalValue(n);
        }}
        onDrop={handlePrevent}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </CNumberInput>
    </Box>
  );
};
