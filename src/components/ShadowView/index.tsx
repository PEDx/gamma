import { useRef, useState, useEffect, FC } from 'react';
import ReactDOM from 'react-dom';
import cssreset from './cssreset.css';

export interface IShadowContentProps {
  root: ShadowRoot | Element;
}
export const ShadowContent: FC<IShadowContentProps> = ({ root, children }) => {
  return ReactDOM.createPortal(children, root as Element);
};

export const ShadowView: FC = ({ children }) => {
  const [root, setRoot] = useState<ShadowRoot | null>(null);
  const viewContentRef = useRef<HTMLDivElement | null>(null);
  const shadowViewRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setRoot(shadowViewRef.current!.attachShadow({ mode: 'open' }));
  }, [shadowViewRef]);
  return (
    <div
      ref={shadowViewRef}
      className="shadow-view"
      style={{
        all: 'initial',
      }}
    >
      {root && (
        <ShadowContent root={root}>
          <style type="text/css">{cssreset}</style>
          <div className="view-content" ref={viewContentRef}>
            {children}
          </div>
        </ShadowContent>
      )}
    </div>
  );
};
