import { useEffect, useCallback, useRef, FC } from 'react';
import { ShadowView } from '@/components/ShadowView';
import useClickAwayListener from '@/hooks/useClickAwayListener';
import { BoxView, BoxViewMethods } from '@/packages/BoxView';
import { EditableBox, EditableBoxMethods } from '../EditableBox';
import './style.scss';

export const Viewport: FC = () => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const editableBoxRef = useRef<EditableBoxMethods>(null);
  const editableViewList = useRef<BoxViewMethods[] | null[]>([null]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleViewMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>, idx: number) => {
      const selectEditableView = editableViewList.current[idx]!.dataView;
      // console.log(selectEditableView);
      editableBoxRef.current!.setEditElement(selectEditableView!);
      editableBoxRef.current!.elementMousedown(e);
    },
    [],
  );
  const handleEditableBoxMouseDown = useCallback(() => {}, []);
  const handleEditableBoxChange = useCallback(() => {}, []);
  useClickAwayListener(viewportRef, () => {
    editableBoxRef.current!.clearEditElement();
  });
  return (
    <div className="viewport-wrap">
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
              editableViewList.current[0] = r;
            }}
            onMouseDown={(e) => handleViewMouseDown(e, 0)}
          >
            Hello
            <BoxView
              ref={(r) => {
                editableViewList.current[1] = r;
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                handleViewMouseDown(e, 1);
              }}
            >
              Hello
            </BoxView>
          </BoxView>
        </ShadowView>
      </div>
    </div>
  );
};
