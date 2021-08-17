import { Configurator } from './Configurator';
import { PolysemyConfigurator } from './PolysemyConfigurator';

export enum ElementType {
  React,
  Vue,
  DOM,
}
export interface IElementMeta {
  id: string;
  name: string;
  icon?: string;
  type: ElementType;
}

export interface ConfiguratorMap {
  [key: string]: Configurator<any> | PolysemyConfigurator<any, string[]>;
}

export interface CreationView {
  meta: IElementMeta;
  element: HTMLElement;
  configurators: ConfiguratorMap;
  containers?: HTMLElement[];
}

export interface IElementCreateResult {
  element: HTMLElement;
  configurators: ConfiguratorMap;
  containers?: HTMLElement[];
}

export interface IGammaElement {
  meta: IElementMeta;
  create: (element?: HTMLElement) => IElementCreateResult;
}
