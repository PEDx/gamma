import { Transforms, Text, Editor, Element as SlateElement } from 'slate';
import {
  CustomElementType,
  CustomTextFormat,
} from '.';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

// Define our own custom set of helpers.
export const CustomCommand = {
  toggleMark: (editor: Editor, format: CustomTextFormat) => {
    const isActive = CustomCommand.isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
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
  isBlockActive: (editor: Editor, format: CustomElementType) => {
    const [match] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    });
    return !!match;
  },
};
