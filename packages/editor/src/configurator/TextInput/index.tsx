import {
  useImperativeHandle,
  useState,
  useCallback,
  forwardRef,
  useRef,
} from 'react';
import { Input, Box } from '@chakra-ui/react';
import { ConfiguratorComponent } from '@gamma/runtime';

export const TextInput = forwardRef<
  ConfiguratorComponent<string>['methods'],
  ConfiguratorComponent<string>['props']
>(({ onChange }, ref) => {
  const [value, setValue] = useState('');
  const oldValue = useRef(value);

  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const value = ev.target.value;
      setValue(value);
    },
    [],
  );

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
      <Input
        placeholder="Here is a sample placeholder"
        size="xs"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </Box>
  );
});
