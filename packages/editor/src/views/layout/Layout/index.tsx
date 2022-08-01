/* eslint-disable react-hooks/exhaustive-deps */
import {
  useState,
  useEffect,
  useCallback,
  useRef,
  FC,
  ReactNode,
  MouseEvent,
} from 'react';
import { Box } from '@chakra-ui/react';
import { DARG_PANEL_TYPE, MIN_PANEL_WIDTH, joinClassName } from '@/utils';
import { useStorageState } from '@/hooks/useStorageState';
import './style.scss';

type LayoutProps = {
  top: ReactNode;
  left: ReactNode;
  main: ReactNode;
  right: ReactNode;
};

export const Layout: FC<Partial<LayoutProps>> = ({
  top,
  left,
  main,
  right,
}) => {
  const dragType = useRef<DARG_PANEL_TYPE | null>(DARG_PANEL_TYPE.NONE);
  const dragLeftPanel = useRef<HTMLDivElement | null>(null);
  const dragRightPanel = useRef<HTMLDivElement | null>(null);
  const [showDragHandle, setShowDragHandle] = useState(false);
  const [layoutLeft, setLayoutLeft] = useStorageState<number>(
    'layout_left',
    260,
  );
  const [layoutRight, setLayoutRight] = useStorageState<number>(
    'layout_right',
    260,
  );
  const x0 = useRef<number>(0);
  const w0 = useRef<number>(0);
  const handleMouseDown = useCallback(
    (e: MouseEvent, type: DARG_PANEL_TYPE) => {
      dragType.current = type;
      x0.current = e.clientX;
      setShowDragHandle(true);
      if (dragType.current === DARG_PANEL_TYPE.LEFT) {
        w0.current = dragLeftPanel.current!.clientWidth;
      }
      if (dragType.current === DARG_PANEL_TYPE.RIGHT) {
        w0.current = dragRightPanel.current!.clientWidth;
      }
    },
    [],
  );
  useEffect(() => {
    document.addEventListener('mousemove', (e) => {
      if (dragType.current === DARG_PANEL_TYPE.NONE) return;
      if (dragType.current === DARG_PANEL_TYPE.LEFT) {
        setLayoutLeft(
          Math.max(MIN_PANEL_WIDTH, w0.current + e.clientX - x0.current),
        );
      }
      if (dragType.current === DARG_PANEL_TYPE.RIGHT) {
        setLayoutRight(
          Math.max(MIN_PANEL_WIDTH, w0.current - (e.clientX - x0.current)),
        );
      }
    });
    document.addEventListener('mouseup', () => {
      setShowDragHandle(false);
      dragType.current = DARG_PANEL_TYPE.NONE;
    });
  }, []);
  return (
    <div className="editor-layout">
      <Box
        className="layout-top-bar"
        bg={'var(--editor-bg-color)'}
        borderBottomColor={'var(--editor-border-color)'}
      >
        {top}
      </Box>
      <div className="layout-center-container g-bd5 ">
        <Box
          bg={'var(--editor-bg-color)'}
          className="layout-left-panel layout-panel g-sd51"
          style={{
            width: `${layoutLeft}px`,
            marginRight: `-${layoutLeft}px`,
          }}
          ref={dragLeftPanel}
        >
          <Box
            bg={'var(--editor-border-color)'}
            className={joinClassName([
              'drag-handle',
              showDragHandle && dragType.current === DARG_PANEL_TYPE.LEFT
                ? 'drag-handle-show'
                : '',
            ])}
            onMouseDown={(e) => handleMouseDown(e, DARG_PANEL_TYPE.LEFT)}
          >
            <i className="circle"></i>
          </Box>
          {left}
        </Box>
        <div className="g-mn5">
          <Box
            bg={'var(--editor-bg-content-color)'}
            className="layout-middle-panel layout-panel"
            style={{
              margin: `0 ${layoutRight}px 0 ${layoutLeft}px`,
              backgroundImage: `linear-gradient(45deg,${'var(--editor-gird-color)'} 25%,transparent 0,transparent 75%,${'var(--editor-gird-color)'} 0,${'var(--editor-gird-color)'}),linear-gradient(45deg,${'var(--editor-gird-color)'} 25%,transparent 0,transparent 75%,${'var(--editor-gird-color)'} 0,${'var(--editor-gird-color)'})`,
            }}
          >
            {main}
          </Box>
        </div>
        <Box
          bg={'var(--editor-bg-color)'}
          className="layout-right-panel g-sd52 layout-panel"
          style={{
            width: `${layoutRight}px`,
            marginLeft: `-${layoutRight}px`,
          }}
          ref={dragRightPanel}
        >
          <Box
            bg={'var(--editor-border-color)'}
            className={joinClassName([
              'drag-handle',
              showDragHandle && dragType.current === DARG_PANEL_TYPE.RIGHT
                ? 'drag-handle-show'
                : '',
            ])}
            onMouseDown={(e) => handleMouseDown(e, DARG_PANEL_TYPE.RIGHT)}
          >
            <i className="circle"></i>
          </Box>
          {right}
        </Box>
      </div>
    </div>
  );
};
