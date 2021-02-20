import React, { useRef, useState, useEffect, FC } from 'react';
import ReactDOM from 'react-dom';

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
  const [visible, setVisible] = useState(false);
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
          <link
            rel="stylesheet"
            href="./cssreset.css"
            onLoad={() => {
              setVisible(true);
            }}
          />
          <div
            className="view-content"
            ref={viewContentRef}
            style={{
              visibility: visible ? 'visible' : 'hidden',
            }}
          >
            {children}
          </div>
        </ShadowContent>
      )}
    </div>
  );
};
