import { RenderElementProps } from 'slate-react';
import { useFocused, useSelected } from 'slate-react';
import { IImageElement } from './Image';

export const ImageElement = ({
  attributes,
  children,
  element,
  style,
}: RenderElementProps & { style: React.CSSProperties | undefined }) => {
  const selected = useSelected();
  const focused = useFocused();
  return (
    <div {...attributes}>
      <div contentEditable={false} style={style}>
        <img
          src={(element as IImageElement).url as string}
          style={{
            display: 'inline-block',
            maxWidth: '100%',
            maxHeight: '20em',
            boxShadow: selected && focused ? '0 0 0 3px #B4D5FF' : 'none',
          }}
        />
      </div>
      {children}
    </div>
  );
};
