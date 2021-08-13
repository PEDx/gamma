import { Skeleton } from '@chakra-ui/react';
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

const requestIdleCallback = window.requestIdleCallback || window.setTimeout;

/**
 * 浏览器空闲时间才渲染的组件
 * 减少对交互事件地阻塞
 * @param param0
 * @returns
 */
export function IdleComponent({
  children,
  onMounted,
}: PropsWithChildren<IIdleComponentProps>) {
  const [child, setChild] = useState<React.ReactNode | null>(null);
  useEffect(() => {
    requestIdleCallback(
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

  const isPedding = !child;
  if (isPedding) return <Skeleton height="20px" />;

  return <>{child}</>;
}
