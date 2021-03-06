import { RenderLeafProps } from 'slate-react';

export function Leaf({ attributes, children, leaf }: RenderLeafProps) {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = (
      <code
        style={{
          display: 'inline-block',
          backgroundColor: '#dadada',
          padding: '0 4px',
          borderRadius: '4px',
        }}
      >
        {children}
      </code>
    );
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return (
    <span
      style={{
        color: leaf.color,
        fontFamily: leaf.fontFamily,
        fontSize: leaf.fontSize,
      }}
      {...attributes}
    >
      {children}
    </span>
  );
}
