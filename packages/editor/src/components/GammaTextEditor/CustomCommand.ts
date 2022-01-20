import {
  Transforms,
  Text,
  Editor,
  Range,
  Element as SlateElement,
} from 'slate';
import {
  CustomElement,
  CustomElementType,
  CustomTextFormat,
  TextAlign,
} from '.';
import { ContentTextTypeMap, BlockContentType } from './config';
import { LinkElement } from './Link';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

// Define our own custom set of helpers.
export const CustomCommand = {
  toggleMark: (
    editor: Editor,
    format: CustomTextFormat,
    value: string | boolean = true,
  ) => {
    const isActive = CustomCommand.isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, value);
    }
  },
  setMark: (
    editor: Editor,
    format: CustomTextFormat,
    value: string | boolean = true,
  ) => {
    Editor.addMark(editor, format, value);
  },
  setBlock: (editor: Editor, format: CustomElementType) => {
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        LIST_TYPES.includes(
          !Editor.isEditor(n) ? (SlateElement.isElement(n) ? n.type : '') : '',
        ),
      split: true,
    });
    const valueNode = ContentTextTypeMap[format as BlockContentType];

    if (valueNode) {
      /**
       * 将整个 block 的子节点都转换
       */
      const position = Editor.positions(editor, {
        unit: 'block',
      }).next();

      Transforms.setNodes(
        editor,
        {
          fontSize: valueNode['fontSize'],
          bold: format === 'paragraph' ? false : true,
        },
        {
          at: [(position.value as any).path[0]],
          match: (node) => Text.isText(node),
        },
      );
    }

    const newProperties: Partial<SlateElement> = {
      type: format,
    };

    Transforms.setNodes(editor, newProperties);
  },
  getBlockValue: (editor: Editor, key: keyof CustomElement) => {
    const [match] = Editor.nodes(editor, {
      match: (n) => {
        return !Editor.isEditor(n) && SlateElement.isElement(n);
      },
    });
    if (!match) return '';
    return (match[0] as CustomElement)[key];
  },
  isBlockAlignValue: (editor: Editor, value: TextAlign) => {
    const [match] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (n as CustomElement).textAlign === value,
    });
    return !!match;
  },
  setBlockAlignValue: (editor: Editor, value: TextAlign) => {
    const newProperties: Partial<SlateElement> = {
      textAlign: value,
    };
    Transforms.setNodes(editor, newProperties as any);
  },
  toggleBlock: (editor: Editor, format: CustomElementType) => {
    const isActive = CustomCommand.isBlockActive(editor, format);
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        LIST_TYPES.includes(
          !Editor.isEditor(n) ? (SlateElement.isElement(n) ? n.type : '') : '',
        ),
      split: true,
    });
    const newProperties: Partial<SlateElement> = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    };
    Transforms.setNodes(editor, newProperties);

    if (!isActive && isList) {
      const block = { type: format, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  },
  isMarkActive: (editor: Editor, format: CustomTextFormat) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  },
  getMarkValue: (editor: Editor, format: CustomTextFormat) => {
    const marks = Editor.marks(editor);
    if (!marks) return false;
    return marks[format];
  },
  isBlockActive: (editor: Editor, format: CustomElementType) => {
    const [match] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    });
    return !!match;
  },
  isLinkActive: (editor: Editor) => {
    const [link] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
    });
    return !!link;
  },
  unwrapLink: (editor: Editor) => {
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
    });
  },
  wrapLink: (editor: Editor, url: string) => {
    if (CustomCommand.isLinkActive(editor)) {
      CustomCommand.unwrapLink(editor);
    }

    const { selection } = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);
    const link: LinkElement = {
      type: 'link',
      url,
      children: isCollapsed ? [{ text: url }] : [],
    };

    if (isCollapsed) {
      Transforms.insertNodes(editor, link);
    } else {
      Transforms.wrapNodes(editor, link, { split: true });
      Transforms.collapse(editor, { edge: 'end' });
    }
  },
  insertLink: (editor: Editor, url: string) => {
    if (editor.selection) {
      CustomCommand.wrapLink(editor, url);
    }
  },
};
