import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { DIRECTIONS } from '@/utils';
import { EditableElement } from '@/editor/core/EditableElement';
import { AspectConfigurator } from '@/editor/core/AspectConfigurator';
import { PositionConfigurator } from '@/editor/core/PositionConfigurator';
import { MAIN_COLOR } from '@/editor/color';
import { ViewData } from '@/runtime/ViewData';
import { isEqual } from 'lodash';
import './style.scss';
import { safeEventBus, SafeEventType } from '@/editor/events';

export interface EditBoxLayerMethods {
  visible: (show: boolean) => void;
  setaspectRatio: (aspectRatio: number) => void;
  setShadowViewData: (vd: ViewData) => void;
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
    const aspectConfigurator = useRef<AspectConfigurator | null>(null);
    const positionConfigurator = useRef<PositionConfigurator | null>(null);
    const editBoxLayer = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const editableElement = new EditableElement({
        element: element.current as HTMLElement,
      });
      aspectConfigurator.current = new AspectConfigurator({
        editableElement: editableElement,
        distance: 10,
        effect: (newRect, oldRect) => {
          if (isEqual(newRect, oldRect)) return;
          safeEventBus.emit(SafeEventType.PUSH_VIEWDATA_SNAPSHOT_COMMAND);
        },
      });
      positionConfigurator.current = new PositionConfigurator({
        editableElement: editableElement,
        distance: 10,
        effect: (newRect, oldRect) => {
          if (isEqual(newRect, oldRect)) return;
          safeEventBus.emit(SafeEventType.PUSH_VIEWDATA_SNAPSHOT_COMMAND);
        },
      });
      visible(false);
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
        console.log('ff');

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
        setShadowViewData: (viewData: ViewData) => {
          aspectConfigurator.current?.attachConfigurator(viewData);
          positionConfigurator.current?.attachConfigurator(viewData);
        },
        setaspectRatio: (aspectRatio: number) => {},
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
