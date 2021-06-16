import { useRef, useEffect, forwardRef, useCallback } from 'react';
import { ViewData } from '@/class/ViewData';
import { RootViewData } from '@/class/ViewData/RootViewData';
import { debounce } from 'lodash';
import { useEditorState } from '@/store/editor';
import { BLUE_COLOR } from '@/editor/color';
import './style.scss';

export interface HoverLightLayerProps {
  root: HTMLElement;
}

export const HoverLightLayer = forwardRef<{}, HoverLightLayerProps>(
  ({ root }, ref) => {
    const { selectViewData } = useEditorState();
    const hoverBox = useRef<HTMLDivElement>(null);
    let og_rect: DOMRect | null = null;
    let currentVD: ViewData | null = null;
    useEffect(() => {
      if (!hoverBox.current) return;
      og_rect = hoverBox.current.getBoundingClientRect();
      hideHoverBox();
      const dea = debounce((node) => {
        const vd = ViewData.collection.findViewData(node) as RootViewData;
        if (!vd || vd.isRoot) return;
        currentVD = vd;
        if (clearSelectViewDate()) return;
        showHoverBox(vd.element);
      }, 100);

      root.addEventListener('mouseover', (evt) => {
        const node = evt.target as HTMLElement;
        dea(node);
      });
      root.addEventListener('mouseout', (evt) => {
        const node = evt.target as HTMLElement;
        hideHoverBox();
      });
    }, []);

    const clearSelectViewDate = useCallback(() => {
      console.log('currentVD', currentVD);
      console.log('selectViewData', selectViewData);
      if (!selectViewData || !currentVD) return false;
      console.log('selectViewData', selectViewData.id);
      if (selectViewData.id === currentVD.id) {
        hideHoverBox();
        return true;
      }
      return false;
    }, [selectViewData]);

    useEffect(() => {
      clearSelectViewDate();
    }, [selectViewData]);

    const showHoverBox = useCallback((host: HTMLElement) => {
      const box = hoverBox.current;
      if (!box || !og_rect) return;
      const h_rect = host.getBoundingClientRect();

      const diff_x = h_rect.x - og_rect.x;
      const diff_y = h_rect.y - og_rect.y;

      box.style.setProperty('display', `block`);
      box.style.setProperty(
        'transform',
        `translate3d(${diff_x}px, ${diff_y}px, 0)`,
      );
      box.style.setProperty('width', `${host.clientWidth}px`);
      box.style.setProperty('height', `${host.clientHeight}px`);
    }, []);

    const hideHoverBox = useCallback(() => {
      const box = hoverBox.current;
      if (!box) return;
      box.style.setProperty('display', `none`);
    }, []);

    return (
      <div
        className="hover-light-layer"
        style={{
          pointerEvents: 'none',
          zIndex: 9,
          position: 'relative',
        }}
      >
        <div
          ref={hoverBox}
          style={{
            display: 'block',
            position: 'absolute',
            outline: `1px solid ${BLUE_COLOR}`,
          }}
        ></div>
      </div>
    );
  },
);
