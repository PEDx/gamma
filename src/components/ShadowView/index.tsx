import React, { useRef, useState, FC } from 'react';
import ReactDOM from 'react-dom';


export interface IShadowContentProps {
  root: any;
}
export const ShadowContent: FC<IShadowContentProps> = ({ root, children }) => {
  return ReactDOM.createPortal(children, root);
}

export const ShadowView: FC = ({ children }) => {
  const [root, setRoot] = useState<ShadowRoot | null>(null);
  const viewContentRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  return (
    <div
      ref={(ele) => {
        if (!ele || root) return;
        setRoot(ele.attachShadow({ mode: 'open' }));
      }}
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
}
