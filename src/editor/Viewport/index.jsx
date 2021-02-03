import { useEffect, useCallback, useRef } from 'react';
import ShadowView from '@/components/ShadowView';
import EditableView from '../EditableView/view.jsx';
import EditableBox from '../EditableBox';
import './style.scss';

export default function Viewport() {
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
  const handleEditableLayerClick = useCallback(() => {
    editableBoxRef.current.clearEditElement();
  }, []);
  return (
    <div className="viewport">
      <div className="editable-box-layer" onClick={handleEditableLayerClick}>
        <EditableBox
          ref={editableBoxRef}
          adsorbLineArr={[]}
          onMouseDown={handleEditableBoxMouseDown}
          onChange={handleEditableBoxChange}
        />
      </div>
      <ShadowView>
        <EditableView
          ref={(r) => (editableViewList.current[0] = r)}
          onMouseDown={(e) => handleViewMouseDown(e, 0)}
        >
          Hello
        </EditableView>
        <EditableView
          ref={(r) => (editableViewList.current[1] = r)}
          onMouseDown={(e) => handleViewMouseDown(e, 1)}
        >
          Hello
        </EditableView>
      </ShadowView>
    </div>
  );
}
