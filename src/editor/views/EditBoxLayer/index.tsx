import {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { DIRECTIONS } from '@/utils';
import { ShadowEditable } from '@/editor/core/ShadowEditable';
import './style.scss';
import { MAIN_COLOR } from '@/editor/color';
import { ViewData } from '@/runtime/ViewData';
import { globalBus } from '@/editor/core/Event';
import { isEqual } from 'lodash';

export interface EditBoxLayerMethods {
  visible: (show: Boolean) => void;
  setShadowViewData: (vd: ViewData) => void;
  attachMouseDownEvent: (e: MouseEvent) => void;
}
export interface EditBoxLayerProps {
  onEditStart: () => void;
  onMoveStart: () => void;
}

// TODO 可禁用某些方向的拖拽配置
// FIXME 编辑框盒子与宿主是单向配置，需要双向绑定

export const EditBoxLayer = forwardRef<EditBoxLayerMethods, EditBoxLayerProps>(
  ({ onEditStart, onMoveStart }, ref) => {
    const [editBoxShow, setEditBoxShow] = useState<Boolean>(true);
    const element = useRef<HTMLDivElement>(null);
    const editable = useRef<ShadowEditable | null>(null);
    const editBoxLayer = useRef<HTMLDivElement>(null);
    useEffect(() => {
      editable.current = new ShadowEditable({
        element: element.current as HTMLElement,
        distance: 10,
        effect: (newRect, oldRect) => {
          if (isEqual(newRect, oldRect)) return;
          globalBus.emit('push-viewdata-snapshot-command');
        },
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
        onEditStart && onEditStart();
        editable.current!.setDirection(direction as DIRECTIONS);
      });
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        visible: (show: Boolean) => {
          setEditBoxShow(show);
        },
        setShadowViewData: (vd: ViewData) => {
          editable.current?.setShadowViewData(vd);
        },
        attachMouseDownEvent: (e: MouseEvent) => {
          onMoveStart && onMoveStart();
          editable.current?.attachMouseDownEvent(e);
        },
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
            outline: `2px solid ${MAIN_COLOR}`,
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
  },
);