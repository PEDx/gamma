import { Transforms, Text, Editor } from 'slate';
import { CustomText } from './GammaTextEditor';

// Define our own custom set of helpers.
export const CustomCommand = {
  // 当前光标的文字，是否是代码块？
  isCodeBlockActive(editor: Editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => (n as CustomText).type === 'code',
      universal: true,
    });
    return !!match;
  },
  isFontStyleActive(editor: Editor, key: string) {
    const [match] = Editor.nodes(editor, {
      match: (n) => (n as any)[key] === true,
      universal: true,
    });
    return !!match;
  },
  // 设置/取消
  toggleFontStyle(editor: Editor, key: string) {
    const isActive = CustomCommand.isFontStyleActive(editor, key);
    Transforms.setNodes(
      editor,
      { [key]: isActive ? false : true },
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
        split: true,
      },
    );
  },
};
