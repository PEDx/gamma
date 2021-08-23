import { useEffect, useRef } from 'react';
export default function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (e: HTMLElementEventMap[K]) => void,
  element = document,
) {
  // 创建一个 ref 来存储处理程序
  const saveHandler = useRef<((e: HTMLElementEventMap[K]) => void) | null>(
    null,
  );

  useEffect(() => {
    saveHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    const eventListener = (e: HTMLElementEventMap[K]) =>
      saveHandler.current!(e);

    element.addEventListener(eventName, eventListener);

    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
}
