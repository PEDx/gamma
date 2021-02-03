import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from 'react';
// import { movable } from '@/utils';
import StyleView from './index';

function EditableView({ children, onMouseDown }, ref) {
  const eleRef = useRef(null);
  const [dataView, setDataView] = useState(null);
  useEffect(() => {
    setDataView(new StyleView(eleRef.current));
  }, []);
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
export default forwardRef(EditableView);
