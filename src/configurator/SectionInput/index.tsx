import { useImperativeHandle, useState, useCallback, forwardRef } from 'react';
import { Textarea, Box } from '@chakra-ui/react';
import { ConfiguratorComponentString } from '@/class/Configurator';

export const SectionInput = forwardRef<
  ConfiguratorComponentString['methods'],
  ConfiguratorComponentString['props']
>(({ onChange }, ref) => {
  const [value, setValue] = useState('');
  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = ev.target.value;
      onChange(value);
    },
    [],
  );
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
      <Textarea
        placeholder="Here is a sample placeholder"
        size="xs"
        rows={3}
        value={value}
        onChange={handleChange}
      />
    </Box>
  );
});
