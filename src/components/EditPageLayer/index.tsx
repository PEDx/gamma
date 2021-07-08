import {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import './style.scss';
import { DIRECTIONS } from '@/utils';
import { ShadowEditable } from '@/class/ShadowEditable';
import { RootViewData } from '@/class/ViewData/RootViewData';
import { MAIN_COLOR } from '@/editor/color';
import { globalBus } from '@/class/Event';
import { isEqual } from 'lodash';
import { IconButton } from '@chakra-ui/react';
import { logger } from '@/class/Logger';
import { AddIcon } from '@chakra-ui/icons';

export interface EditPageLayerMethods {
  visible: (show: Boolean) => void;
  setShadowViewData: (vd: RootViewData) => void;
}

export interface EditPageLayerProps {
  onAddClick: () => void;
}

// TODO 可禁用某些方向的拖拽配置

export const EditPageLayer = forwardRef<
  EditPageLayerMethods,
  EditPageLayerProps
>(({ onAddClick }, ref) => {
  const [editPageShow, setEditBoxShow] = useState<Boolean>(true);
  const element = useRef<HTMLDivElement>(null);
  const editable = useRef<ShadowEditable | null>(null);
  const editPageLayer = useRef<HTMLDivElement>(null);
  const [showAddBtn, setShowAddBtn] = useState(false);
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
    editPageLayer.current?.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
    });

    // 不能在 jsx 中绑定事件，因为父元素做了阻止冒泡操作
    element.current!.addEventListener('mousedown', (e) => {
      const _direction = (e.target as HTMLDivElement).dataset.direction || '';
      if (!_direction) return;
      const direction = parseInt(_direction);
      editable.current!.setDirection(direction as DIRECTIONS);
    });
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      visible: (show: Boolean) => {
        setEditBoxShow(show);
      },
      setShadowViewData: (vd: RootViewData) => {
        editable.current?.setShadowViewData(vd);
        if (vd.isLast) {
          setShowAddBtn(true);
          return;
        }
        setShowAddBtn(false);
      },
    }),
    [],
  );

  return (
    <div className="edit-page-layer" ref={editPageLayer}>
      <div
        className="edit-page"
        ref={element}
        style={{
          display: editPageShow ? 'block' : 'none',
        }}
      >
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
            style={{
              display: editPageShow ? 'block' : 'none',
            }}
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
