import { useEffect, useRef, FC, PropsWithChildren } from 'react';

export const DropArea: FC<PropsWithChildren> = ({ children }) => {
  const element = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    element.current?.setAttribute('allowdrop', '');
  }, []);
  return (
    <div className="drop-area" ref={element}>
      {children}
    </div>
  );
};
