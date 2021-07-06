import { ViewData } from '@/class/ViewData/ViewData';

export enum WidgetType {
  React,
  Vue,
  DOM,
}
export interface WidgetMeta {
  id: string;
  name: string;
  icon?: string;
  type: WidgetType;
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
