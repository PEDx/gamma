import { useRef, useState, useEffect, FC } from 'react';
import ReactDOM from 'react-dom';
import cssreset from '@gamma/runtime/src/style/cssreset.css';
import innner from './innner.css';

export interface IShadowContentProps {
  root: ShadowRoot | Element;
}
export const ShadowContent: FC<IShadowContentProps> = ({ root, children }) => {
  return ReactDOM.createPortal(children, root as Element);
};

export const ShadowView: FC = ({ children }) => {
  const [root, setRoot] = useState<ShadowRoot | null>(null);
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
        height: '100%',
      }}
    >
      {root && (
        <ShadowContent root={root}>
          <style type="text/css">{cssreset}</style>
          <style type="text/css">{innner}</style>
          {children}
        </ShadowContent>
      )}
    </div>
  );
};
