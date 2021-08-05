import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createEditor,
  BaseEditor,
  Descendant,
  Editor,
  Transforms,
} from 'slate';
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
import { BlockContentType } from './config';
import { IImageElement, withImages } from './Image';
import { ImageElement } from './ImageElement';
import { LinkElement, withLinks } from './Link';

export type CustomElementType =
  | 'image'
  | 'link'
  | 'block-quote'
  | 'bulleted-list'
  | 'list-item'
  | 'numbered-list'
  | BlockContentType;

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
  italic: boolean;
  code: boolean;
  underline: boolean;
  fontFamily: string;
  fontSize: string;
  color: string;
};

export type TextAlign = 'left' | 'center' | 'right';

export type CustomElement = {
  type: CustomElementType;
  children: CustomText[];
  textAlign?: TextAlign;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement | IImageElement | LinkElement;
    Text: CustomText;
  }
}

interface IGammaTextEditorProps {
  onChange: (data: Descendant[], HTMLString: string) => void;
  value: Descendant[];
}

const defaultValue: Descendant[] = [
  {
    type: 'paragraph',
    textAlign: 'center',
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
    textAlign: 'left',
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
];

export const GammaTextEditor = ({ onChange, value }: IGammaTextEditorProps) => {
  if (!value || value.length === 0) return null;
  const contentRef = useRef<HTMLDivElement | null>(null);
  const editor = useMemo(
    () => withLinks(withImages(withHistory(withReact(createEditor())))),
    [],
  );
  const [editorValue, setEditorValue] = useState<Descendant[]>(value);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'image':
        return (
          <ImageElement
            {...props}
            style={{
              textAlign: props.element.textAlign || 'left',
            }}
          />
        );
      case 'link':
        return (
          <a {...props.attributes} href={(props.element as LinkElement).url}>
            {props.children}
          </a>
        );
      default:
        return (
          <Element
            {...props}
            style={{
              textAlign: (props.element as CustomElement).textAlign || 'left',
            }}
          />
        );
    }
  }, []);

  useEffect(() => {
    /**
     * 光标默认选择到文尾
     */
    ReactEditor.focus(editor);
    Transforms.select(editor, Editor.end(editor, []));
  }, []);

  return (
    <div
      className="wrap"
      onKeyUp={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <div className="text-editor" style={{}}>
        <Slate
          editor={editor}
          value={editorValue}
          onChange={(newValue) => {
            setEditorValue(newValue);
            setTimeout(() => {
              onChange(newValue, contentRef.current?.innerHTML || '');
            });
          }}
        >
          <Toolbar />
          <div className="content typo" ref={contentRef}>
            <Editable renderLeaf={renderLeaf} renderElement={renderElement} />
          </div>
        </Slate>
      </div>
    </div>
  );
};