import { Renderer } from '@/runtime/Renderer';
import { viewTypeMap } from '@/packages';
import { RootViewData } from '@/runtime/RootViewData';
import { LayoutMode } from "@/runtime/LayoutMode";
import { RenderData } from '@/runtime/RenderData';
import '@/runtime/style/cssreset.css';

const init = (element: HTMLElement) => {
  if (!element) return;

  const rootViewData = new RootViewData({
    element,
    mode: LayoutMode.LongPage,
  });

  const renderData = new RenderData();


  const renderer = new Renderer(viewTypeMap);

  renderer.render(rootViewData, renderData);
};

window.onload = () => {
  const root = document.getElementById('root');
  if (!root) return;
  init(root);
};
