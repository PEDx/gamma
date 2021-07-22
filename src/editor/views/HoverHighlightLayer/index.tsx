import {
  useRef,
  useEffect,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from 'react';
import { ViewData } from '@/runtime/ViewData';
import { debounce } from 'lodash';
import { MAIN_COLOR } from '@/editor/color';
import { globalBus } from '@/editor/core/Event';

export interface HoverHighlightLayerMethods {
  visible: (bol: boolean) => void;
  setInspectElement: (element: HTMLElement) => void;
}

export const HoverHighlightLayer = forwardRef<HoverHighlightLayerMethods>(
  (_, ref) => {
    const inspectElement = useRef<HTMLElement | null>(null);
    const container = useRef<HTMLDivElement>(null);
    const hoverBox = useRef<HTMLDivElement>(null);
    const containerRect = useRef<DOMRect | null>(null);
    const block = useRef<boolean>(false);

    useEffect(() => {
      if (!container.current) return;
      containerRect.current = container.current.getBoundingClientRect();
      hideHoverBox();
    }, []);

    const showHoverBox = useCallback((host: HTMLElement) => {
      const box = hoverBox.current;
      if (!box || !containerRect.current) return;
      const hostRect = host.getBoundingClientRect();

      const diff_x = hostRect.x - containerRect.current.x;
      const diff_y = hostRect.y - containerRect.current.y;

      box.style.setProperty('display', `block`);
      box.style.setProperty(
        'transform',
        `translate3d(${diff_x}px, ${diff_y}px, 0)`,
      );
      box.style.setProperty('width', `${host.clientWidth}px`);
      box.style.setProperty('height', `${host.clientHeight}px`);
    }, []);

    const debounceShowHoverBox = useCallback(
      debounce((node) => {
        const viewData = ViewData.collection.findViewData(node);
        hideHoverBox();
        if (!viewData) return;
        if (viewData.isRoot) return;
        // 选中的组件不用高亮
        globalBus.emit('tree-hover-high-light', viewData);
        showHoverBox(viewData.element);
      }, 10),
      [],
    );

    const handleMouseover = useCallback((evt: Event) => {
      if (block.current) return;
      const node = evt.target as HTMLElement;
      debounceShowHoverBox(node);
      evt.stopPropagation();
      evt.preventDefault();
    }, []);

    const handleMouseout = useCallback((evt: Event) => {
      if (block.current) return;
      hideHoverBox();
    }, []);

    const hideHoverBox = useCallback(() => {
      const box = hoverBox.current;
      if (!box) return;
      globalBus.emit('tree-clear-hover-high-light');
      if (container.current)
        containerRect.current = container.current.getBoundingClientRect();
      box.style.setProperty('display', `none`);
    }, []);

    useEffect(() => {
      globalBus.on('set-hover-high-light', (viewData: ViewData) => {
        if (viewData.isRoot) return;
        showHoverBox(viewData.element);
      });
      globalBus.on('clear-hover-high-light', () => {
        hideHoverBox();
      });

      document.addEventListener('mouseup', () => {
        block.current = false;
      });

      return cleanEvent;
    }, []);

    const cleanEvent = useCallback(() => {
      if (inspectElement.current) {
        inspectElement.current.removeEventListener(
          'mouseover',
          handleMouseover,
        );
        inspectElement.current.removeEventListener('mouseout', handleMouseout);
      }
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        visible: (show: boolean) => {
          if (!show) hideHoverBox();
          block.current = show;
        },
        setInspectElement(element: HTMLElement) {
          cleanEvent();
          inspectElement.current = element;
          element.addEventListener('mouseover', handleMouseover);
          element.addEventListener('mouseout', handleMouseout);
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
            outline: `2px dashed ${MAIN_COLOR}`,
          }}
        ></div>
      </div>
    );
  },
);
