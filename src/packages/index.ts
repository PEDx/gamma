import { ViewData } from '@/class/ViewData';
import { Configurator } from '@/class/Configurator';
import { createBaseView } from './BaseView';
import { createImageView } from './ImageView';
import { createTextView } from './TextView';
import { createReactView } from './ReactView';

export type CreationView = [HTMLElement, Configurator[]];

export function attachViewData(
  container: Element,
  element: HTMLElement,
  configurators: Configurator[],
): ViewData {
  container?.appendChild(element);
  const vd = new ViewData({ element: element as HTMLElement, configurators });
  return vd;
}

export const viewTypeMap = new Map([
  [1, createBaseView],
  [2, createTextView],
  [3, createImageView],
  [4, createReactView],
]);
