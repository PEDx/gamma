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
    /**
     * onChange 调用后，触发外部的观察者，value 也会相应改变
     * 但是此时 oldValue === value ，因此 setLocalValue 调用不会触发更新
     */
    setLocalValue(value);
  }, [value]);

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
