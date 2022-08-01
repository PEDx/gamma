import { isUrl } from '@/utils/isUrl';
import { Editor } from 'slate';
import { CustomCommand } from './CustomCommand';

export type LinkElement = {
  type: 'link';
  url: string;
  children: { text: string }[];
};

export const withLinks = (editor: Editor) => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element) => {
    return element.type === 'link' ? true : isInline(element);
  };

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      CustomCommand.wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');

    if (text && isUrl(text)) {
      CustomCommand.wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};
