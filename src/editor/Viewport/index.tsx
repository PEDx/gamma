import {
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
} from 'react';
import { EditBoxLayer, EditBoxLayerMethods } from '@/components/EditBoxLayer';
import { EditorContext } from '@/store/editor';
import { ViewData } from '@/class/ViewData';
import { ShadowView } from '@/components/ShadowView';
import './style.scss';

export const Viewport: FC = () => {
  const { state, dispatch } = useContext(EditorContext)!;
  const [selectViewData, setSelectViewData] = useState<ViewData | null>(null);
  const editBoxLayer = useRef<EditBoxLayerMethods>(null);
  const rootContainer = useRef<HTMLDivElement>(null);
  return (
    <div className="viewport-wrap">
      <div className="viewport">
        <EditBoxLayer ref={editBoxLayer} />
        <ShadowView>
          <div ref={rootContainer}></div>
        </ShadowView>
      </div>
    </div>
  );
};
