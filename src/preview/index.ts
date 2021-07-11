import { LayoutViewData } from '@/runtime/LayoutViewData';
import { Render } from '@/runtime/Render';
import { IViewDataSnapshotMap } from '@/runtime/ViewDataCollection';
import { ViewDataSnapshot } from '@/runtime/ViewDataSnapshot';
import { storage } from '@/utils';
import '@/runtime/cssreset.css';
import { viewTypeMap } from '@/packages';

const createRootDiv = () => {
  const element = document.createElement('DIV');
  element.style.setProperty('position', 'relative');
  element.style.setProperty('overflow', 'hidden');
  return element;
};

const addRootView = (data: ViewDataSnapshot, parent: Element) => {
  const layoutViewData = new LayoutViewData({
    element: createRootDiv(),
  });
  layoutViewData.restore(data);
  parent.appendChild(layoutViewData.element);
  return layoutViewData;
};

const init = (element: Element) => {
  if (!element) return;
  const renderData = storage.get<IViewDataSnapshotMap>('collection') || {};
  const rootRenderData = Object.values(renderData)
    .filter((data) => {
      if (data.isLayout) return data;
    })
    .sort((a, b) => a.index! - b.index!);

  rootRenderData.forEach((data) => {
    const layoutViewData = addRootView(data, element);
    const target = new Render({
      target: layoutViewData,
      widgetMap: viewTypeMap,
    });
    if (!renderData) return;
    target.render(data, renderData);
  });
};

window.onload = () => {
  const root = document.getElementById('root');
  if (!root) return;
  init(root);
};
