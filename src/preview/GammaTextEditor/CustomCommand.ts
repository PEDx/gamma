import { Transforms, Text, Editor, Element as SlateElement } from 'slate';
import { CustomElement, CustomElementType, CustomTextFormat } from '.';

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
    const newProperties: Partial<SlateElement> = {
      type: format,
    };
    Transforms.setNodes(editor, newProperties);
  },
  getBlockType: (editor: Editor) => {},
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
    return CustomCommand.getMarkValue(editor, format) !== false ? true : false;
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
};
