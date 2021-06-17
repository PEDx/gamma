import { useRef, useEffect, forwardRef, useCallback } from 'react';
import { ViewData } from '@/class/ViewData';
import { RootViewData } from '@/class/ViewData/RootViewData';
import { debounce } from 'lodash';
import { useEditorState } from '@/store/editor';
import { useSettingState } from '@/store/setting';
import { MAIN_COLOR } from '@/editor/color';
import './style.scss';

export interface HoverHighlightLayerProps {
  root: HTMLElement;
  out: HTMLElement | null;
}

export const HoverHighlightLayer = forwardRef<{}, HoverHighlightLayerProps>(
  ({ root, out }, ref) => {
    const { selectViewData } = useEditorState();
    const { viewportDevice } = useSettingState();
    const container = useRef<HTMLDivElement>(null);
    const hoverBox = useRef<HTMLDivElement>(null);
    const og_rect = useRef<DOMRect | null>(null);

    useEffect(() => {
      if (!container.current) return;
      og_rect.current = container.current.getBoundingClientRect();

      hideHoverBox();
    }, [viewportDevice]);

    const isSelectViewData = useCallback(
      (currentVD) => {
        if (!selectViewData || !currentVD) return false;
        if (selectViewData.id === currentVD.id) return true;
        return false;
      },
      [selectViewData],
    );

    const showHoverBox = useCallback((host: HTMLElement) => {
      const box = hoverBox.current;
      if (!box || !og_rect.current) return;
      const h_rect = host.getBoundingClientRect();

      const diff_x = h_rect.x - og_rect.current.x;
      const diff_y = h_rect.y - og_rect.current.y;

      box.style.setProperty('display', `block`);
      box.style.setProperty(
        'transform',
        `translate3d(${diff_x}px, ${diff_y}px, 0)`,
      );
      box.style.setProperty('width', `${host.clientWidth}px`);
      box.style.setProperty('height', `${host.clientHeight}px`);
    }, []);

    useEffect(() => {
      const debounceShowHoverBox = debounce((node) => {
        const newVD = ViewData.collection.findViewData(node) as RootViewData;
        hideHoverBox();
        if (!newVD || newVD.isRoot) return; // 根组件不用高亮
        if (isSelectViewData(newVD)) return; // 选中的组件不用高亮
        showHoverBox(newVD.element);
      }, 50);

      function handleMouseover(evt: Event) {
        const node = evt.target as HTMLElement;
        debounceShowHoverBox(node);
        evt.stopPropagation();
        evt.preventDefault();
      }
      function handleMouseout(evt: Event) {
        hideHoverBox();
      }

      root.addEventListener('mouseover', handleMouseover);
      out?.addEventListener('mouseout', handleMouseout);
      return () => {
        root.removeEventListener('mouseover', handleMouseover);
        out?.removeEventListener('mouseover', handleMouseout);
      };
    }, [isSelectViewData, showHoverBox]);

    useEffect(() => {
      hideHoverBox();
    }, [selectViewData]);

    const hideHoverBox = useCallback(() => {
      const box = hoverBox.current;
      if (!box) return;
      box.style.setProperty('display', `none`);
    }, []);

    return (
      <div
        className="hover-highlight-layer"
        style={{
          pointerEvents: 'none',
          zIndex: 9,
          height: '100%',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        ref={container}
      >
        <div
          ref={hoverBox}
          style={{
            display: 'block',
            position: 'absolute',
            outline: `1px dashed ${MAIN_COLOR}`,
          }}
        ></div>
      </div>
    );
  },
);
