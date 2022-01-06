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
  onChange: any;
  max?: number;
  min?: number;
  suffix?: string;
  prefix?: string;
}

export const NumberInput: FC<INumberInputProps> = ({
  onChange,
  max = 99999,
  min = 0,
  suffix = '',
}) => {
  const [value, setValue] = useState<string | number>(0);
  const oldValue = useRef(value);

  const handleBlur = useCallback(() => {
    if (oldValue.current === value) return;
    onChange(Number(value));
    oldValue.current = value;
  }, [value]);

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
