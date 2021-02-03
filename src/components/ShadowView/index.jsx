import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';

export function ShadowContent({ root, children }) {
  return ReactDOM.createPortal(children, root);
}

export default function ShadowView({ children }) {
  const [root, setRoot] = useState(null);
  const viewContentRef = useRef(null);
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
