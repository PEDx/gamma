import { ViewData } from '@/class/ViewData/ViewData';

export enum WidgetType {
  React,
  Vue,
  DOM,
}

interface ReactContainerMethods {
  appendChild: (content: HTMLElement) => void;
}

export interface WidgetMeta {
  id: string;
  name: string;
  icon?: string;
  type: WidgetType;
  data?: ReactContainerMethods;
}

export interface WidgetParams {
  viewData: ViewData;
  meta: WidgetMeta;
}

export class Widget {
  viewData: ViewData;
  meta: WidgetMeta;
  constructor({ viewData, meta }: WidgetParams) {
    this.viewData = viewData;
    this.meta = meta;
  }
}
