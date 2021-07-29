import { useEffect, PropsWithChildren, useState } from 'react';

type RequestIdleCallbackHandle = any;
type RequestIdleCallbackOptions = {
  timeout: number;
};
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: () => number;
};

declare global {
  interface Window {
    requestIdleCallback: (
      callback: (deadline: RequestIdleCallbackDeadline) => void,
      opts?: RequestIdleCallbackOptions,
    ) => RequestIdleCallbackHandle;
    cancelIdleCallback: (handle: RequestIdleCallbackHandle) => void;
  }
}

interface IIdleComponentProps {
  onMounted?: () => void;
}

/**
 * 浏览器空闲时间才渲染的组件
 * 用以在不阻塞交互
 * 在 Chrome 下支持度较好
 * @param param0
 * @returns
 */
export function IdleComponent({
  children,
  onMounted,
}: PropsWithChildren<IIdleComponentProps>) {
  const [child, setChild] = useState<React.ReactNode | null>(null);
  useEffect(() => {
    window.requestIdleCallback(
      () => {
        setChild(children);
      },
      { timeout: 16 },
    );
  }, []);

  useEffect(() => {
    if (!child) return;
    onMounted && onMounted();
  }, [child]);

  return <div className="idle-component">{child}</div>;
}
