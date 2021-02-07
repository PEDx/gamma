import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from 'react';
import { StyleView, StyleItem, StyleUnitItem } from '../StyleItem/index.js';

class BoxDataView extends StyleView {
  constructor(element) {
    super(element, {
      display: new StyleItem('display', 'block'),
      width: new StyleUnitItem('width', element.offsetWidth),
      height: new StyleUnitItem('height', element.offsetHeight),
      top: new StyleUnitItem('top', element.offsetTop),
      left: new StyleUnitItem('left', element.offsetLeft),
    });
  }
}

function BoxView({ children, onMouseDown }, ref) {
  const eleRef = useRef(null);
  const [dataView, setDataView] = useState(null);
  useEffect(() => {
    setDataView(new BoxDataView(eleRef.current));
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
}
export default forwardRef(BoxView);
