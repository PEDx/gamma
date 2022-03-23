import { isUrl } from '@/utils/isUrl';
import { Editor, Transforms } from 'slate';
import { imageExtensions } from '@/utils/imageExtensions';
import { TextAlign } from '.';

export type EmptyText = {
  text: string;
};

export type TURL = string | ArrayBuffer;

export interface IImageElement {
  type: 'image';
  url: TURL;
  textAlign: TextAlign;
  children: EmptyText[];
}

export const isImageUrl = (url: TURL) => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url as string).pathname.split('.').pop() || '';
  return imageExtensions.includes(ext);
};

export const insertImage = (editor: Editor, url: TURL) => {
  const text = { text: '' };
  const image: IImageElement = {
    type: 'image',
    url,
    children: [text],
    textAlign: 'center',
  };
  Transforms.insertNodes(editor, image);
};

export const withImages = (editor: Editor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === 'image' ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split('/');

        if (mime === 'image') {
          reader.addEventListener('load', () => {
            const url = reader.result;
            url && insertImage(editor, url);
          });

          reader.readAsDataURL(file);
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};
