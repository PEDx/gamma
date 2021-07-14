import { Renderer } from '@/runtime/Renderer';
import { IViewDataSnapshotMap } from '@/runtime/ViewDataCollection';
import { storage } from '@/utils';
import { viewTypeMap } from '@/packages';
import { RootViewData } from '@/runtime/RootViewData';
import '@/runtime/style/cssreset.css';

const init = (element: HTMLElement) => {
  if (!element) return;
  const renderData = storage.get<IViewDataSnapshotMap>('collection') || {};

  const rootViewData = new RootViewData({
    element,
  });

  const renderer = new Renderer({
    root: rootViewData,
    widgetMap: viewTypeMap,
  });

  renderer.render(renderData);
};

window.onload = () => {
  const root = document.getElementById('root');
  if (!root) return;
  init(root);
};
