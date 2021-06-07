import { useImperativeHandle, useState, useCallback, forwardRef } from 'react';
import { Textarea } from '@chakra-ui/react';
import {
  ConfiguratorMethods,
  ConfiguratorProps,
} from '@/class/Configurator';

export const SectionInput = forwardRef<ConfiguratorMethods, ConfiguratorProps>(
  ({ onChange }, ref) => {
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
          setValue(v as string);
        },
      }),
      [],
    );
    return (
      <Textarea
        placeholder="Here is a sample placeholder"
        size="xs"
        rows={3}
        value={value}
        onChange={handleChange}
      />
    );
  },
);
