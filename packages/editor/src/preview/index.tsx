import { useRef, useEffect, FC } from 'react';
import { Renderer, RenderData, ElementLoader } from '@gamma/renderer';

export const renderer = new Renderer();

export const Preview: FC = () => {
  const root = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!root.current) return;
    const renderData = new RenderData();

    const rootRenderData = renderData.getRootSnapshotData();
    const ids = renderData.getElementIDFromData();

    ids.unshift('@gamma-element/base-box');

    new ElementLoader({
      elementIds: ids,
    })
      .loadAll()
      .then(() => {
        /**
         * 所有组件加载完成
         */
        renderer!.render(root.current!, rootRenderData.mode, renderData);
      });
  }, []);
  return <div ref={root}></div>;
};
