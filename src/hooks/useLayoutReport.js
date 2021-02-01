import { useRef, useEffect, useCallback } from 'react';
import lz from '@lizhife/lz-jssdk';
import { getPlatform } from '@/utils.js';
const isAndroid = getPlatform() === 'android';
const devicePixelRatio = window.devicePixelRatio;

export default function useLayoutReport() {
  const webviewSize = useRef(null);
  const reportHeight = useRef(null);
  useEffect(() => {
    lz.ready(() => {
      lz.setAppDisplayInfo({ visible: true }, (ret) => {});
      lz.getWebDisplayInfo({ key: 'webviewSize' }, (ret) => {
        webviewSize.current = ret.webviewSize;
        refreshLayoutReport();
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const refreshLayoutReport = useCallback((height) => {
    if (height >= 0) {
      reportHeight.current = isAndroid ? devicePixelRatio * height : height;
    }
    if (!webviewSize.current) return;
    lz.realWidgetsLayoutChanged(
      {
        clickWidgets: [
          {
            x: 0,
            y: 0,
            w: webviewSize.current.w,
            h: reportHeight.current,
          },
        ],
        slideWidgets: [
          {
            x: 0,
            y: 0,
            w: webviewSize.current.w,
            h: reportHeight.current,
          },
        ],
      },
      (ret) => {}
    );
  }, []);
  return refreshLayoutReport;
}
