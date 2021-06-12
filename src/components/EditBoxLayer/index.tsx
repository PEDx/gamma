import {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { DIRECTIONS } from '@/utils';
import { ShaodwEditable } from '@/class/ShaodwEditable';
import './style.scss';

export interface EditBoxLayerMethods {
  visible: (show: Boolean) => void;
  getEditable: () => ShaodwEditable;
  getShaodwEditableBoxElement: () => HTMLDivElement;
}

// TODO 可禁用某些方向的拖拽配置

export const EditBoxLayer = forwardRef<EditBoxLayerMethods>(({}, ref) => {
  const [editBoxShow, setEditBoxShow] = useState<Boolean>(true);
  const element = useRef<HTMLDivElement>(null);
  const edNode = useRef<ShaodwEditable | null>(null);
  const editBoxLayer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    edNode.current = new ShaodwEditable({
      element: element.current as HTMLElement,
      distance: 10,
    });
    setEditBoxShow(false);
    editBoxLayer.current?.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
    });

    // 不能在 jsx 中绑定事件，因为父元素做了阻止冒泡操作
    element.current!.addEventListener('mousedown', (e) => {
      const _direction = (e.target as HTMLDivElement).dataset.direction || '';
      if (!_direction) return;
      const direction = parseInt(_direction);
      edNode.current!.setDirection(direction as DIRECTIONS);
    });

  }, []);

  useImperativeHandle(
    ref,
    () => ({
      visible: (show: Boolean) => {
        setEditBoxShow(show);
      },
      getEditable: () => edNode.current!,
      getShaodwEditableBoxElement: () => element.current!,
    }),
    [],
  );

  return (
    <div className="edit-box-layer" ref={editBoxLayer}>
      <div
        className="edit-box"
        ref={element}
        style={{
          display: editBoxShow ? 'block' : 'none',
        }}
      >
        <i
          className="arrow-handler corner top-left-arrow-handler"
          data-direction={DIRECTIONS.L | DIRECTIONS.T}
        />
        <i
          className="arrow-handler corner bottom-left-arrow-handler"
          data-direction={DIRECTIONS.L | DIRECTIONS.B}
        />
        <i
          className="arrow-handler corner top-right-arrow-handler"
          data-direction={DIRECTIONS.T | DIRECTIONS.R}
        />
        <i
          className="arrow-handler corner bottom-right-arrow-handler"
          data-direction={DIRECTIONS.B | DIRECTIONS.R}
        />
        <i
          className="arrow-handler top-arrow-handler"
          data-direction={DIRECTIONS.T}
        />
        <i
          className="arrow-handler left-arrow-handler"
          data-direction={DIRECTIONS.L}
        />
        <i
          className="arrow-handler bottom-arrow-handler"
          data-direction={DIRECTIONS.B}
        />
        <i
          className="arrow-handler right-arrow-handler"
          data-direction={DIRECTIONS.R}
        />
      </div>
    </div>
  );
});
