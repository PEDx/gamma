import { useState, useCallback, useRef, FC, useEffect } from 'react';
import { Input, Box } from '@chakra-ui/react';
import { handlePrevent } from '@/utils';
import { IConfiguratorComponentProps } from '..';

export function TextInput({
  value,
  onChange,
}: IConfiguratorComponentProps<string>) {
  const [localValue, setLocalValue] = useState<string>(value);
  const oldValue = useRef(localValue);

  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const value = ev.target.value;
      setLocalValue(value);
    },
    [],
  );

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = useCallback(() => {
    if (oldValue.current === localValue) return;
    onChange(localValue);
  }, [localValue]);

  return (
    <Box>
      <Input
        size="xs"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onDragEnter={handlePrevent}
        onDragOver={handlePrevent}
        onDrop={handlePrevent}
      />
    </Box>
  );
}
