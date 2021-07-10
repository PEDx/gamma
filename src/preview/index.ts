import { LayoutViewData } from '@/class/ViewData/LayoutViewData';
import { AsyncRender } from '@/class/AsyncRender';
import { IViewDataSnapshotMap } from '@/class/ViewData/ViewDataCollection';
import { ViewDataSnapshot } from '@/class/ViewData/ViewDataSnapshot';
import { storage } from '@/utils';
import './cssreset.css';

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
      if (data.isRoot) return data;
    })
    .sort((a, b) => a.index! - b.index!);

  rootRenderData.forEach((data) => {
    const layoutViewData = addRootView(data, element);
    const target = new AsyncRender({
      target: layoutViewData,
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
