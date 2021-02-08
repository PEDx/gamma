import { useEffect, useCallback, useRef } from 'react';
import { ShadowView } from '@/components/ShadowView';
import useClickAwayListener from '@/hooks/useClickAwayListener';
import { BoxView } from '@/packages/BoxView';
import EditableBox from '../EditableBox';
import './style.scss';

export default function Viewport() {
  const viewportRef = useRef(null);
  const editableBoxRef = useRef(null);
  const editableViewList = useRef([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleViewMouseDown = useCallback((e, idx) => {
    const selectEditableView = editableViewList.current[idx].dataView;
    editableBoxRef.current.setEditElement(selectEditableView);
    editableBoxRef.current.elementMousedown(e);
  }, []);
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
          ref={(r) => (editableViewList.current[0] = r)}
          onMouseDown={(e) => handleViewMouseDown(e, 0)}
        >
          Hello
        </BoxView>
        <BoxView
          ref={(r) => (editableViewList.current[1] = r)}
          onMouseDown={(e) => handleViewMouseDown(e, 1)}
        >
          Hello
        </BoxView>
      </ShadowView>
    </div>
  );
}
