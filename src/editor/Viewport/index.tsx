import { useEffect, useCallback, useRef, FC } from 'react';
import { ShadowView } from '@/components/ShadowView';
import useClickAwayListener from '@/hooks/useClickAwayListener';
import { BoxView, BoxViewMethods } from '@/packages/BoxView';
import EditableBox from '../EditableBox';
import './style.scss';

export const Viewport: FC = () => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const editableBoxRef = useRef<any>(null);
  const editableViewList = useRef<BoxViewMethods[]>([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleViewMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>, idx: number) => {
      const selectEditableView = editableViewList.current[idx].dataView;
      editableBoxRef.current.setEditElement(selectEditableView);
      editableBoxRef.current.elementMousedown(e);
    },
    [],
  );
  const handleEditableBoxMouseDown = useCallback(() => {}, []);
  const handleEditableBoxChange = useCallback(() => {}, []);
  useClickAwayListener(viewportRef, () => {
    editableBoxRef.current.clearEditElement();
  });
  return (
    <div className="viewport" ref={viewportRef}>
      <div className="editable-box-layer">
        <EditableBox
          ref={editableBoxRef}
          adsorbLineArr={[]}
          onMouseDown={handleEditableBoxMouseDown}
          onChange={handleEditableBoxChange}
        />
      </div>
      <ShadowView>
        <BoxView
          ref={(r) => {
            if (r) editableViewList.current[0] = r;
          }}
          onMouseDown={(e) => handleViewMouseDown(e, 0)}
        >
          Hello
          <span>asdas</span>
        </BoxView>
        <BoxView
          ref={(r) => {
            if (r) editableViewList.current[1] = r;
          }}
          onMouseDown={(e) => handleViewMouseDown(e, 1)}
        >
          Hello
        </BoxView>
      </ShadowView>
    </div>
  );
};
