import { Transforms, Text, Editor } from 'slate';
import { CustomText } from './GammaTextEditor';

// Define our own custom set of helpers.
export const CustomCommand = {
  // 当前光标的文字，是否加粗？
  isBoldMarkActive(editor: Editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => (n as CustomText).bold === true,
      universal: true,
    });
    return !!match;
  },
  // 当前光标的文字，是否是代码块？
  isCodeBlockActive(editor: Editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => (n as CustomText).type === 'code',
    });
    return !!match;
  },
  // 设置/取消 加粗
  toggleBoldMark(editor: Editor) {
    const isActive = CustomCommand.isBoldMarkActive(editor);
    Transforms.setNodes(
      editor,
      { bold: isActive ? false : true },
      {
        match: (n) => Text.isText(n),
        split: true,
      },
    );
  },
  // 设置/取消 代码块
  toggleCodeBlock(editor: Editor) {
    const isActive = CustomCommand.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? 'text' : 'code' },
      {
        match: (n) => Text.isText(n),
      },
    );
  },
};
