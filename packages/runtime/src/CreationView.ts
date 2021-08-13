import { Configurator } from './Configurator';
import { PolysemyConfigurator } from './PolysemyConfigurator';

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

export interface ConfiguratorMap {
  [key: string]: Configurator<any> | PolysemyConfigurator<any, string[]>;
}

export interface CreationView {
  meta: WidgetMeta;
  element: HTMLElement;
  configurators: ConfiguratorMap;
  containers?: HTMLElement[];
}
