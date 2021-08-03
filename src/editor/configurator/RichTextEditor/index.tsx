import {
  useImperativeHandle,
  useState,
  useCallback,
  forwardRef,
  useRef,
  useEffect,
} from 'react';
import { ConfiguratorComponent } from '@/runtime/Configurator';
import { color } from '@/editor/color';
import { Box, useColorMode } from '@chakra-ui/react';

export const RichTextEditor = forwardRef<
  ConfiguratorComponent<string>['methods'],
  ConfiguratorComponent<string>['props']
>(({ onChange }, ref) => {
  const richTextEditorRef = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState('');
  const oldValue = useRef(value);

  useEffect(() => {
    if (!richTextEditorRef.current) return;
  }, []);

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
  return <></>;
});
