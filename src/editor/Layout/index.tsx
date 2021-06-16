/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback, useRef, FC, ReactNode } from 'react';
import { Box, useColorMode } from '@chakra-ui/react';
import { DARG_PANEL_TYPE, MIN_PANEL_WIDTH, joinClassName } from '@/utils';
import { useStorageState } from '@/hooks/useStorageState';
import './style.scss';
import {
  contentBgColor,
  girdBgColor,
  subColor,
  primaryColor,
  color,
  groundColor,
} from '@/editor/color';

type LayoutProps = {
  top: ReactNode;
  bottom: ReactNode;
  left: ReactNode;
  middleContainer: ReactNode;
  middleBottom: ReactNode;
  right: ReactNode;
};

export const Layout: FC<LayoutProps> = ({
  top,
  bottom,
  left,
  middleContainer,
  middleBottom,
  right,
}) => {
  const { colorMode } = useColorMode();
  const dragType = useRef<DARG_PANEL_TYPE | null>(DARG_PANEL_TYPE.NONE);
  const dragLeftPanel = useRef<HTMLDivElement | null>(null);
  const dragRightPanel = useRef<HTMLDivElement | null>(null);
  const [showDragHandle, setShowDragHandle] = useState(false);
  const [layoutLeft, setLayoutLeft] = useStorageState<number>(
    'layoutLeft',
    260,
  );
  const [layoutRight, setLayoutRight] = useStorageState<number>(
    'layoutRight',
    260,
  );
  const x0 = useRef<number>(0);
  const w0 = useRef<number>(0);
  const handleMouseDown = useCallback((e, type) => {
    dragType.current = type;
    x0.current = e.clientX;
    setShowDragHandle(true);
    if (dragType.current === DARG_PANEL_TYPE.LEFT) {
      w0.current = dragLeftPanel.current!.clientWidth;
    }
    if (dragType.current === DARG_PANEL_TYPE.RIGHT) {
      w0.current = dragRightPanel.current!.clientWidth;
    }
  }, []);
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
      {/* 上 */}
      <Box
        className="layout-top-bar"
        bg={primaryColor[colorMode]}
        color={color[colorMode]}
        borderBottomColor={groundColor[colorMode]}
      >
        {top}
      </Box>
      {/* 上 */}
      {/* 中间 */}
      <div className="layout-center-container g-bd5 ">
        {/* 左边 */}
        <Box
          bg={primaryColor[colorMode]}
          color={color[colorMode]}
          className="layout-left-panel layout-panel g-sd51"
          style={{
            width: `${layoutLeft}px`,
            marginRight: `-${layoutLeft}px`,
          }}
          ref={dragLeftPanel}
        >
          <Box
            bg={subColor[colorMode]}
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
        {/* 左边 */}
        {/* 中心 */}
        <div className="g-mn5">
          <Box
            bg={contentBgColor[colorMode]}
            className="layout-middle-panel layout-panel"
            style={{
              margin: `0 ${layoutRight}px 0 ${layoutLeft}px`,
              backgroundImage: `linear-gradient(45deg,${girdBgColor[colorMode]} 25%,transparent 0,transparent 75%,${girdBgColor[colorMode]} 0,${girdBgColor[colorMode]}),linear-gradient(45deg,${girdBgColor[colorMode]} 25%,transparent 0,transparent 75%,${girdBgColor[colorMode]} 0,${girdBgColor[colorMode]})`,
            }}
          >
            {middleContainer}
            <Box
              bg={contentBgColor[colorMode]}
              className="layout-middle-bottom-panel"
            >
              {middleBottom}
            </Box>
          </Box>
        </div>
        {/* 中心 */}
        {/* 右边 */}
        <Box
          bg={primaryColor[colorMode]}
          color={color[colorMode]}
          className="layout-right-panel g-sd52 layout-panel"
          style={{
            width: `${layoutRight}px`,
            marginLeft: `-${layoutRight}px`,
          }}
          ref={dragRightPanel}
        >
          <Box
            bg={subColor[colorMode]}
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
        {/* 右边 */}
      </div>
      {/* 中间 */}
      {/* 下 */}
      <Box
        className="layout-bottom-bar"
        bg={primaryColor[colorMode]}
        color={color[colorMode]}
        borderTopColor={groundColor[colorMode]}
      >
        {bottom}
      </Box>
      {/* 下 */}
    </div>
  );
};
