import {
  useImperativeHandle,
  useState,
  useCallback,
  forwardRef,
  useRef,
  useEffect,
} from 'react';
import { ConfiguratorComponent } from '@/runtime/Configurator';
import { GammaTextEditor } from '@/preview/GammaTextEditor';
import { Descendant } from 'slate';

interface IRichTextEditorData {
  json: Descendant[];
  html: string;
}

export const RichTextEditor = forwardRef<
  ConfiguratorComponent<IRichTextEditorData>['methods'],
  ConfiguratorComponent<IRichTextEditorData>['props']
>(({ onChange }, ref) => {
  const [value, setValue] = useState<IRichTextEditorData>({
    json: [],
    html: '',
  });

  useImperativeHandle(
    ref,
    () => ({
      setValue: (value) => {
        setValue(value);
      },
    }),
    [],
  );
  return (
    <div>
      <GammaTextEditor
        value={value.json}
        onChange={(data, str) => {
          onChange(
            {
              json: data,
              html: str,
            },
            false,
          );
        }}
      />
    </div>
  );
});
