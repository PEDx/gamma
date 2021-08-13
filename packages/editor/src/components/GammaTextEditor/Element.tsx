import { RenderElementProps } from 'slate-react';



export function Element({
  attributes,
  children,
  element,
  style,
}: RenderElementProps & { style: React.CSSProperties | undefined }) {
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote {...attributes} style={style}>
          {children}
        </blockquote>
      );
    case 'bulleted-list':
      return (
        <ul {...attributes} style={style}>
          {children}
        </ul>
      );
    case 'list-item':
      return (
        <li {...attributes} style={style}>
          {children}
        </li>
      );
    case 'numbered-list':
      return (
        <ol {...attributes} style={style}>
          {children}
        </ol>
      );
    case 'heading-one':
      return (
        <h1 {...attributes} style={style}>
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 {...attributes} style={style}>
          {children}
        </h2>
      );
    case 'heading-three':
      return (
        <h3 {...attributes} style={style}>
          {children}
        </h3>
      );
    case 'heading-four':
      return (
        <h4 {...attributes} style={style}>
          {children}
        </h4>
      );
    case 'paragraph':
      return (
        <p {...attributes} style={style}>
          {children}
        </p>
      );
    default:
      return (
        <div {...attributes} style={style}>
          {children}
        </div>
      );
  }
}
