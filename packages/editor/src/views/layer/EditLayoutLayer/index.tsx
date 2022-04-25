import {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import './style.scss';
import { DIRECTIONS } from '@/utils';
import { isEqual } from 'lodash';
import { IconButton } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { EditableDOMElement } from '@/core/Editable/EditableDOMElement';
import { AspectConfigurator } from '@/core/Editable/AspectConfigurator';
import { Icon } from '@/icons';
import { getOffsetParentEdge } from '@/core/Editable/EditableElement';

export interface EditLayoutLayerMethods {
  visible: (show: boolean, isLast?: boolean) => void;
  setShadowElement: (el: HTMLElement) => void;
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
  const editableElement = useRef<EditableDOMElement | null>(null);
  const aspectConfigurator = useRef<AspectConfigurator | null>(null);

  const editPageLayer = useRef<HTMLDivElement>(null);
  const [showAddBtn, setShowAddBtn] = useState(false);

  useEffect(() => {
    if (!element.current) return;

    editableElement.current = new EditableDOMElement({
      element: element.current as HTMLElement,
    });

    aspectConfigurator.current = new AspectConfigurator({
      element: editableElement.current,
      distance: 10,
      limit: false,
      effect: (newRect, oldRect) => {
        if (
          isEqual(
            { width: newRect.width, height: newRect.height },
            { width: oldRect.width, height: oldRect.height },
          )
        )
          return;
      },
    });

    visible(false);

    element.current!.addEventListener('mousedown', (e) => {
      const _direction = (e.target as HTMLDivElement).dataset.direction || '';
      if (!_direction) return;
      const direction = parseInt(_direction);
      onEditStart && onEditStart();
      aspectConfigurator.current!.setDirection(direction as DIRECTIONS);
    });
  }, []);

  const visible = (show: boolean, isLast: boolean = false) => {
    element.current?.style.setProperty('display', show ? 'block' : 'none');
    setShowAddBtn(isLast && show);
  };

  useImperativeHandle(
    ref,
    () => ({
      visible: visible,
      setShadowElement: (el: HTMLElement) => {
        editableElement.current?.updateEdge(getOffsetParentEdge(el));
        aspectConfigurator.current?.attachConfigurator(el);
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
            backgroundColor: `var(--editor-main-color)`,
          }}
        >
          <Icon name="sort"></Icon>
        </div>
        <div
          className="outline"
          style={{
            border: `2px solid var(--editor-main-color)`,
          }}
        ></div>
        <div
          className="page-bottom"
          style={{
            backgroundColor: 'var(--editor-main-color)',
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