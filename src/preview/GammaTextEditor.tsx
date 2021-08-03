import './style.scss';
import { Box, IconButton } from '@chakra-ui/react';
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
import { SketchPicker, RGBColor } from 'react-color';

export type CustomElement = {
  type: 'paragraph';
  children: CustomText[];
};
export type CustomText = {
  text: string;
  type: 'text' | 'code';
  bold: boolean;
  italic: boolean;
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
        display: 'inline-block',
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
        fontStyle: props.leaf.italic ? 'italic' : 'normal',
        textDecoration: props.leaf.underline ? 'underline' : 'none',
      }}
    >
      {props.children}
    </span>
  );
}

export const GammaTextEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [showPicker, setShowPicker] = useState(false);
  const [colorRGBA, setColorRGBA] = useState<RGBColor>({
    r: 241,
    g: 112,
    b: 19,
    a: 1,
  });
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [
        {
          text: 'A line of text in a paragraph.',
          bold: false,
          italic: false,
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
        <Box className="toolbar flex-box" position="relative">
          <IconButton
            aria-label="加粗"
            mr="8px"
            icon={<Icon fontSize="16px" name="bold" />}
            onClick={(event) => {
              event.preventDefault();
              CustomCommand.toggleFontStyle(editor, 'bold');
            }}
          />
          <IconButton
            aria-label="斜体"
            mr="8px"
            icon={<Icon fontSize="16px" name="italic" />}
            onClick={(event) => {
              event.preventDefault();
              CustomCommand.toggleFontStyle(editor, 'italic');
            }}
          />
          <IconButton
            aria-label="下划线"
            mr="8px"
            icon={<Icon fontSize="16px" name="underline" />}
            onClick={(event) => {
              event.preventDefault();
              CustomCommand.toggleFontStyle(editor, 'underline');
            }}
          />
          <IconButton
            aria-label="颜色"
            mr="8px"
            icon={<Icon fontSize="16px" name="font-color" />}
            onClick={(event) => {
              setShowPicker(!showPicker);
            }}
          />
          <IconButton
            aria-label="代码块"
            icon={<Icon fontSize="16px" name="code-slash" />}
            onClick={(event) => {
              event.preventDefault();
              CustomCommand.toggleCodeBlock(editor);
            }}
          />
          <Box
            position="absolute"
            zIndex="2"
            top="34px"
            right="0"
            color="#333"
            display={showPicker ? 'block' : 'none'}
          >
            <SketchPicker
              color={colorRGBA}
              width="220px"
              disableAlpha={false}
              onChange={(color) => {
                setColorRGBA(color.rgb);
              }}
            >
              asdf
            </SketchPicker>
          </Box>
        </Box>
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
