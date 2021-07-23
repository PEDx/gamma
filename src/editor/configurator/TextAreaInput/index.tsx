import {
  useImperativeHandle,
  useState,
  useCallback,
  forwardRef,
  useRef,
} from 'react';
import { Textarea, Box } from '@chakra-ui/react';
import { ConfiguratorComponent } from '@/runtime/Configurator';

export const TextAreaInput = forwardRef<
  ConfiguratorComponent<string>['methods'],
  ConfiguratorComponent<string>['props']
>(({ onChange }, ref) => {
  const [value, setValue] = useState('');
  const oldValue = useRef(value);

  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      <Textarea
        placeholder="Here is a sample placeholder"
        size="xs"
        rows={3}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </Box>
  );
});
