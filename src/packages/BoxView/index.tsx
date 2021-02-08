import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from 'react';
import { StyleView, StyleItem, StyleUnitItem } from '../StyleItem';

class BoxDataView extends StyleView {
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

type BoxViewProps = {
  onMouseDown: () => void,
}

export interface BoxViewMethods {
  dataView: BoxDataView | null;
}


export const BoxView = forwardRef<BoxViewMethods, BoxViewProps>((props, ref) => {
  const eleRef = useRef<HTMLDivElement>(null);
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
      onMouseDown={props.onMouseDown}
      style={{
        position: 'absolute',
        cursor: 'pointer',
      }}
    >
      {props.children}
    </div>
  );
})

