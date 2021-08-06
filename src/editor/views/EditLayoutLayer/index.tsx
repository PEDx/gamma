import {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import './style.scss';
import { DIRECTIONS } from '@/utils';
import { LayoutViewData } from '@/runtime/LayoutViewData';
import { MAIN_COLOR } from '@/editor/color';
import { isEqual } from 'lodash';
import { IconButton } from '@chakra-ui/react';
import { logger } from '@/common/Logger';
import { AddIcon } from '@chakra-ui/icons';
import { EditableElement } from '@/editor/core/EditableElement';
import { AspectConfigurator } from '@/editor/core/AspectConfigurator';
import { PositionConfigurator } from '@/editor/core/PositionConfigurator';
import { Icon } from '@/icons';
import { safeEventBus, SafeEventType } from '@/editor/events';

export interface EditLayoutLayerMethods {
  visible: (show: boolean) => void;
  setShadowViewData: (vd: LayoutViewData) => void;
}

export interface EditLayoutLayerProps {
  onAddClick: () => void;
  onEditStart: () => void;
}

export const EditLayoutLayer = forwardRef<
  EditLayoutLayerMethods,
  EditLayoutLayerProps
>(({ onAddClick, onEditStart }, ref) => {
  const element = useRef<HTMLDivElement>(null);
  const aspectConfigurator = useRef<AspectConfigurator | null>(null);
  const positionConfigurator = useRef<PositionConfigurator | null>(null);

  const editPageLayer = useRef<HTMLDivElement>(null);
  const [showAddBtn, setShowAddBtn] = useState(false);
  useEffect(() => {
    if (!element.current) return;
    const editableElement = new EditableElement({
      element: element.current as HTMLElement,
    });
    aspectConfigurator.current = new AspectConfigurator({
      editableElement,
      distance: 10,
      effect: (newRect, oldRect) => {
        if (isEqual(newRect, oldRect)) return;
        safeEventBus.emit(SafeEventType.PUSH_VIEWDATA_SNAPSHOT_COMMAND);
      },
    });
    positionConfigurator.current = new PositionConfigurator({
      editableElement: editableElement,
      distance: 10,
      effect: (newRect, oldRect) => {},
    });
    visible(false);
    editPageLayer.current?.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
    });

    // 不能在 jsx 中绑定事件，因为父元素做了阻止冒泡操作
    element.current!.addEventListener('mousedown', (e) => {
      const _direction = (e.target as HTMLDivElement).dataset.direction || '';
      if (!_direction) return;
      const direction = parseInt(_direction);
      onEditStart && onEditStart();
      // FIXME 此处需要 block 调移动
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
      setShadowViewData: (vd: LayoutViewData) => {
        aspectConfigurator.current?.attachConfigurator(vd);
        positionConfigurator.current?.attachConfigurator(vd);
        if (vd.isLast) {
          setShowAddBtn(true);
          return;
        }
        setShowAddBtn(true);
      },
    }),
    [],
  );

  return (
    <div className="edit-layout-layer" ref={editPageLayer}>
      <div className="edit-layout" ref={element}>
        <div
          className="drag-handler flex-box-c"
          style={{
            backgroundColor: `${MAIN_COLOR}`,
          }}
        >
          <Icon name="sort"></Icon>
        </div>
        <div
          className="outline"
          style={{
            border: `2px solid ${MAIN_COLOR}`,
          }}
        ></div>
        <div
          className="page-bottom"
          style={{
            backgroundColor: MAIN_COLOR,
          }}
        >
          <i
            className="page-arrow-handler page-bottom-arrow-handler"
            data-direction={DIRECTIONS.B}
            style={{
              backgroundColor: '#fff',
            }}
          />
        </div>
        {showAddBtn && (
          <IconButton
            onClick={onAddClick}
            aria-label="add canvas"
            size="md"
            height="32px"
            width="100%"
            variant="solid"
            pointerEvents="auto"
            className="page-add-box"
            icon={<AddIcon />}
          ></IconButton>
        )}
      </div>
    </div>
  );
});
