import { useCallback, useEffect, useMemo, useState } from 'react';
import { createEditor, BaseEditor, Descendant } from 'slate';
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  RenderLeafProps,
  RenderElementProps,
} from 'slate-react';
import { withHistory } from 'slate-history';
import { Toolbar } from './Toolbar';

import { Leaf } from './Leaf';
import { Element } from './Element';

import './style/index.scss';
import './style/typo.css';

export type CustomElementType =
  | 'block-quote'
  | 'bulleted-list'
  | 'list-item'
  | 'numbered-list'
  | 'paragraph';

export type CustomElement = {
  type: CustomElementType;
  children: CustomText[];
};

export type CustomTextFormat =
  | 'bold'
  | 'italic'
  | 'code'
  | 'underline'
  | 'fontFamily'
  | 'fontSize'
  | 'color';

export type CustomText = {
  text: string;
  type: 'text';
  bold: boolean;
  fontFamily: string;
  fontSize: string;
  color: string;
  italic: boolean;
  code: boolean;
  underline: boolean;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export const GammaTextEditor = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: 'A line of text in a paragraph.',
          bold: false,
          code: false,
          italic: false,
          underline: false,
          color: '#000000',
          fontFamily: 'SimSun',
          fontSize: '14px',
        },
      ],
    },
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: '只能输入26个英文字母中的三个字母，以A开头',
          bold: false,
          code: false,
          italic: false,
          underline: false,
          color: '#000000',
          fontFamily: 'SimSun',
          fontSize: '14px',
        },
      ],
    },
  ]);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  const renderElement = useCallback((props: RenderElementProps) => {
    return <Element {...props} />;
  }, []);

  return (
    <div className="wrap">
      <div className="text-editor">
        <Slate
          editor={editor}
          value={value}
          onChange={(newValue) => setValue(newValue)}
        >
          <Toolbar />
          <div className="content typo">
            <Editable renderLeaf={renderLeaf} renderElement={renderElement} />
          </div>
        </Slate>
      </div>
    </div>
  );
};
