import { useState, useCallback, useRef, FC, useEffect } from 'react';
import {
  Box,
  NumberInput as CNumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { handlePrevent } from '@/utils';
import { IConfiguratorComponentProps } from '..';

export function NumberInput({
  value,
  onChange,
}: IConfiguratorComponentProps<number>) {
  const [localValue, setLocalValue] = useState<string | number>(value);
  const oldValue = useRef(localValue);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    console.log('render NumberInput');
  }, []);

  const handleBlur = useCallback(() => {
    if (oldValue.current === localValue) return;
    oldValue.current = localValue;
    onChange(+localValue);
  }, [localValue]);

  return (
    <Box>
      <CNumberInput
        size="xs"
        max={99999}
        min={0}
        value={`${localValue}`}
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
}
