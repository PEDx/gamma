import {
  useRef,
  useEffect,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from 'react';
import { ViewData, viewDataHelper, ViewDataType } from '@gamma/runtime';
import { debounce } from 'lodash';
import { MAIN_COLOR } from '@/color';
import { globalBus } from '@/core/Event';

export interface HighlightLayerMethods {
  block: (bol: boolean) => void;
  setInspectElement: (element: HTMLElement) => void;
  showHighlightBox: (element: HTMLElement) => void;
  hideHighhightBox: () => void;
}

export const HighlightLayer = forwardRef<HighlightLayerMethods>((_, ref) => {
  const inspectElement = useRef<HTMLElement | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const highlightBox = useRef<HTMLDivElement>(null);
  const containerRect = useRef<DOMRect | null>(null);
  const block = useRef<boolean>(false);

  useEffect(() => {
    if (!container.current) return;
    containerRect.current = container.current.getBoundingClientRect();
    hideHighhightBox();
  }, []);

  const showHighlightBox = useCallback((host: HTMLElement) => {
    const box = highlightBox.current;
    if (!box || !containerRect.current) return;
    const hostRect = host.getBoundingClientRect();

    const diff_x = hostRect.x - containerRect.current.x;
    const diff_y = hostRect.y - containerRect.current.y;

    box.style.setProperty('display', `block`);
    box.style.setProperty(
      'transform',
      `translate3d(${diff_x}px, ${diff_y}px, 0)`,
    );
    box.style.setProperty('width', `${host.offsetWidth}px`);
    box.style.setProperty('height', `${host.offsetHeight}px`);
  }, []);

  const debounceShowHoverBox = useCallback(
    debounce((node) => {
      const viewData = viewDataHelper.findViewData(node) as ViewData;
      if (!viewData) return;
      if (viewData.type === ViewDataType.Root) return;
      // 选中的组件不用高亮
      globalBus.emit('tree-hover-high-light', viewData);
      showHighlightBox(viewData.element);
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
    const node = evt.target as HTMLElement;
    /**
     * 在检查区域元素内部的元素不用清除，除非鼠标移除了整个检查区域才清理
     */
    if (inspectElement.current?.contains(node)) return;
    hideHighhightBox();
  }, []);

  const hideHighhightBox = useCallback(() => {
    const box = highlightBox.current;
    if (!box) return;
    globalBus.emit('tree-clear-hover-high-light');
    if (container.current)
      containerRect.current = container.current.getBoundingClientRect();
    box.style.setProperty('display', `none`);
  }, []);

  useEffect(() => {
    globalBus.on('set-hover-high-light', (viewData: ViewData) => {
      if (viewData.type === ViewDataType.Root) return;
      showHighlightBox(viewData.element);
    });
    globalBus.on('clear-hover-high-light', () => {
      hideHighhightBox();
    });

    document.addEventListener('mouseup', () => {
      block.current = false;
    });

    return cleanEvent;
  }, []);

  const cleanEvent = useCallback(() => {
    if (inspectElement.current) {
      inspectElement.current.removeEventListener('mouseover', handleMouseover);
      document.removeEventListener('mouseout', handleMouseout);
    }
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      block: (bol: boolean) => {
        if (bol) hideHighhightBox();
        block.current = bol;
      },
      showHighlightBox: showHighlightBox,
      hideHighhightBox: hideHighhightBox,
      setInspectElement(element: HTMLElement) {
        cleanEvent();
        inspectElement.current = element;
        element.addEventListener('mouseover', handleMouseover);
        document.addEventListener('mouseout', handleMouseout);
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
        ref={highlightBox}
        style={{
          display: 'block',
          position: 'absolute',
          outline: `2px dashed ${MAIN_COLOR}`,
        }}
      ></div>
    </div>
  );
});
