import { RootViewData } from '@/class/ViewData/RootViewData';
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
  const rootViewData = new RootViewData({
    element: createRootDiv(),
  });
  rootViewData.restore(data);
  parent.appendChild(rootViewData.element);
  return rootViewData;
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
    const rootViewData = addRootView(data, element);
    const target = new AsyncRender({
      target: rootViewData,
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
