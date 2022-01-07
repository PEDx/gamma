import { useForceRender } from '@/hooks/useForceRender';
import { Skeleton } from '@chakra-ui/react';
import { useEffect, PropsWithChildren, useState } from 'react';

interface IIdleComponentProps {
  onMounted?: () => void;
}

const requestIdleCallback = window.requestIdleCallback || window.setTimeout;
const cancelIdleCallback = window.cancelIdleCallback || window.clearTimeout;

/**
 * 浏览器空闲时间才渲染的组件
 * 减少对交互事件地阻塞
 * @param param0
 * @returns
 */
export function IdleComponentWrap({
  children,
}: PropsWithChildren<IIdleComponentProps>) {
  const render = useForceRender();
  const [ready, setReady] = useState<boolean>(false);
  useEffect(() => {
    const id = requestIdleCallback(
      () => {
        setReady(true);
      },
      { timeout: 100 },
    );
    return () => {
      cancelIdleCallback(id);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    render();
  }, [children]);


  if (!ready) return <Skeleton height="20px" />;

  return <>{ready && children}</>;
}
