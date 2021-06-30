import {
  useRef,
  useEffect,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from 'react';
import { ViewData } from '@/class/ViewData/ViewData';
import { debounce } from 'lodash';
import { useEditorState } from '@/store/editor';
import { useSettingState } from '@/store/setting';
import { MAIN_COLOR } from '@/editor/color';
import { globalBus } from '@/class/Event';
import './style.scss';

export interface HoverHighlightLayerProps {
  root: HTMLElement;
  out: HTMLElement | null;
}
export interface HoverHighlightLayerMethods {
  block: (bol: boolean) => void;
}

export const HoverHighlightLayer = forwardRef<
  HoverHighlightLayerMethods,
  HoverHighlightLayerProps
>(({ root, out }, ref) => {
  const { selectViewData } = useEditorState();
  const { viewportDevice } = useSettingState();
  const container = useRef<HTMLDivElement>(null);
  const hoverBox = useRef<HTMLDivElement>(null);
  const og_rect = useRef<DOMRect | null>(null);
  const block = useRef<boolean>(false);

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
      const newVD = ViewData.collection.findViewData(node);
      hideHoverBox();
      if (!newVD || newVD.isRoot) return; // 根组件不用高亮
      if (isSelectViewData(newVD)) return; // 选中的组件不用高亮
      globalBus.emit('hover-high-light', newVD);
      showHoverBox(newVD.element);
    }, 10);

    globalBus.on('set-hover-high-light', (viewData: ViewData) => {
      showHoverBox(viewData.element);
    });
    globalBus.on('clear-hover-high-light', () => {
      hideHoverBox();
    });

    function handleMouseover(evt: Event) {
      if (block.current) return;
      const node = evt.target as HTMLElement;
      debounceShowHoverBox(node);
      evt.stopPropagation();
      evt.preventDefault();
    }
    function handleMouseout() {
      if (block.current) return;
      hideHoverBox();
    }

    root.addEventListener('mouseover', handleMouseover);
    // 为了让高亮区域检测到鼠标离开（内部元素贴边情况下），
    // 使用外层盒子来检测，外层盒子必须比高亮区域大
    out?.addEventListener('mouseout', handleMouseout);
    return () => {
      root.removeEventListener('mouseover', handleMouseover);
      out?.removeEventListener('mouseout', handleMouseout);
    };
  }, [isSelectViewData, showHoverBox]);

  useEffect(() => {
    hideHoverBox();
  }, [selectViewData]);

  const hideHoverBox = useCallback(() => {
    const box = hoverBox.current;
    if (!box) return;
    if (container.current)
      og_rect.current = container.current.getBoundingClientRect();
    box.style.setProperty('display', `none`);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      block: (bol: boolean) => {
        block.current = bol;
      },
    }),
    [],
  );

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
});
