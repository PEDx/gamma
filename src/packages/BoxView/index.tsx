import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from 'react';
import { StyleView, StyleItem, StyleUnitItem } from '../StyleItem';

export class BoxDataView extends StyleView {
  constructor(element: HTMLElement) {
    super(element, {
      display: new StyleItem('display', 'block'),
      width: new StyleUnitItem('width', element.offsetWidth),
      height: new StyleUnitItem('height', element.offsetHeight),
      top: new StyleUnitItem('top', element.offsetTop),
      left: new StyleUnitItem('left', element.offsetLeft),
    });
  }
}

export type BoxViewProps = {
  onMouseDown: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children: React.ReactNode;
};

export interface BoxViewMethods {
  dataView: BoxDataView | null;
}

export const BoxView = forwardRef<BoxViewMethods, BoxViewProps>(
  ({ onMouseDown, children }, ref) => {
    const eleRef = useRef<HTMLDivElement | null>(null);
    const [dataView, setDataView] = useState<BoxDataView | null>(null);
    useEffect(() => {
      setDataView(new BoxDataView(eleRef.current as HTMLDivElement));
    }, [eleRef]);
    useImperativeHandle(
      ref,
      () => ({
        dataView,
      }),
      [dataView],
    );
    return (
      <div
        ref={eleRef}
        className="editable-view"
        onMouseDown={onMouseDown}
        style={{
          position: 'absolute',
          cursor: 'pointer',
        }}
      >
        {children}
      </div>
    );
  },
);
