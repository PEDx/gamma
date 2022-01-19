import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { DIRECTIONS } from '@/utils';
import { EditableDOMElement } from '@/core/Editable/EditableDOMElement';
import { AspectConfigurator } from '@/core/Editable/AspectConfigurator';
import { PositionConfigurator } from '@/core/Editable/PositionConfigurator';
import { MAIN_COLOR } from '@/color';
import { isEqual } from 'lodash';
import './style.scss';
import { safeEventBus, SafeEventType } from '@/events';
import { getOffsetParentEdge } from '@/core/Editable/EditableElement';

export interface EditBoxLayerMethods {
  visible: (show: boolean) => void;
  setShadowElement: (el: HTMLElement) => void;
  attachMouseDownEvent: (e: MouseEvent) => void;
}
export interface EditBoxLayerProps {
  onEditStart: () => void;
  onMoveStart: () => void;
}

// TODO 可禁用某些方向的拖拽配置

export const EditBoxLayer = forwardRef<EditBoxLayerMethods, EditBoxLayerProps>(
  ({ onEditStart, onMoveStart }, ref) => {
    const element = useRef<HTMLDivElement>(null);
    const editableElement = useRef<EditableDOMElement | null>(null);
    const aspectConfigurator = useRef<AspectConfigurator | null>(null);
    const positionConfigurator = useRef<PositionConfigurator | null>(null);
    const editBoxLayer = useRef<HTMLDivElement>(null);
    useEffect(() => {
      editableElement.current = new EditableDOMElement({
        element: element.current as HTMLElement,
      });
      aspectConfigurator.current = new AspectConfigurator({
        element: editableElement.current,
        distance: 10,
        limit: true,
        effect: (newRect, oldRect) => {
          if (
            isEqual(
              { width: newRect.width, height: newRect.height },
              { width: oldRect.width, height: oldRect.height },
            )
          )
            return;
          safeEventBus.emit(SafeEventType.PUSH_VIEWDATA_SNAPSHOT_COMMAND);
        },
      });
      positionConfigurator.current = new PositionConfigurator({
        element: editableElement.current,
        distance: 10,
        effect: (newRect, oldRect) => {
          if (
            isEqual(
              { x: newRect.x, y: newRect.y },
              { x: oldRect.x, y: oldRect.y },
            )
          )
            return;
          safeEventBus.emit(SafeEventType.PUSH_VIEWDATA_SNAPSHOT_COMMAND);
        },
      });
      visible(false);
      // 不能在 jsx 中绑定事件，因为父元素做了阻止冒泡操作
      element.current!.addEventListener('mousedown', (e) => {
        const _direction = (e.target as HTMLDivElement).dataset.direction || '';
        if (!_direction) return;
        const direction = parseInt(_direction);
        onEditStart && onEditStart();
        positionConfigurator.current!.block();
        aspectConfigurator.current!.setDirection(direction as DIRECTIONS);
      });
    }, []);

    const visible = (show: boolean) => {
      element.current?.style.setProperty('display', show ? 'block' : 'none');
    };

    useImperativeHandle(
      ref,
      () => ({
        visible: visible,
        setShadowElement: (el: HTMLElement) => {
          editableElement.current?.updateEdge(getOffsetParentEdge(el));
          aspectConfigurator.current?.attachConfigurator(el);
          positionConfigurator.current?.attachConfigurator(el);
        },
        attachMouseDownEvent: (e: MouseEvent) => {
          onMoveStart && onMoveStart();
          positionConfigurator.current?.attachMouseDownEvent(e);
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
            outline: `1px solid ${MAIN_COLOR}`,
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
