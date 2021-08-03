import './style.scss';
import { IconButton } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createEditor, BaseEditor, Descendant } from 'slate';
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  RenderLeafProps,
} from 'slate-react';
import { CustomCommand } from './CustomCommand';
import { Icon } from '@/icons';

export type CustomElement = {
  type: 'paragraph';
  children: CustomText[];
};
export type CustomText = {
  text: string;
  type: 'text' | 'code';
  bold: boolean;
  underline: boolean;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

function CodeLeaf(props: RenderLeafProps) {
  return (
    <pre
      {...props.attributes}
      style={{
        backgroundColor: '#eee',
        padding: '0 4px',
        borderRadius: '4px',
      }}
    >
      <code>{props.children}</code>
    </pre>
  );
}
function DefaultLeaf(props: RenderLeafProps) {
  return (
    <span
      {...props.attributes}
      style={{
        fontWeight: props.leaf.bold ? 'bold' : 'normal',
      }}
    >
      {props.children}
    </span>
  );
}

export const GammaTextEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [
        {
          text: 'A line of text in a paragraph.',
          bold: false,
          type: 'text',
          underline: false,
        },
      ],
    },
  ]);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    switch (props.leaf.type) {
      case 'code':
        return <CodeLeaf {...props} />;
      default:
        return <DefaultLeaf {...props} />;
    }
  }, []);

  return (
    <div className="wrap">
      <div className="text-editor">
        <div className="toolbar flex-box">
          <IconButton
            variant="outline"
            aria-label="加粗"
            colorScheme="blue"
            mr="8px"
            icon={<Icon name="bold" />}
            onMouseDown={(event) => {
              event.preventDefault();
              CustomCommand.toggleBoldMark(editor);
            }}
          />
          <IconButton
            variant="outline"
            aria-label="代码块"
            colorScheme="blue"
            icon={<Icon name="code-slash" />}
            onMouseDown={(event) => {
              event.preventDefault();
              CustomCommand.toggleCodeBlock(editor);
            }}
          />
        </div>
        <div className="content">
          <Slate
            editor={editor}
            value={value}
            onChange={(newValue) => setValue(newValue)}
          >
            <Editable renderLeaf={renderLeaf} />
          </Slate>
        </div>
      </div>
    </div>
  );
};
