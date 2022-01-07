import type { TConfigurator } from '../configurator/Configurator';

export enum EElementType {
  View,
  Script,
}

export interface IElementMeta {
  id: string;
  name: string;
  type: EElementType;
}

export interface IConfiguratorMap {
  [key: string]: TConfigurator;
}

export interface IViewElementCreateResult {
  element: HTMLElement;
  configurators: IConfiguratorMap;
  containers?: HTMLElement[];
}

export interface IViewElement {
  meta: IElementMeta;
  create: () => IViewElementCreateResult;
}

export interface IScriptElementCreateResult {
  configurators: IConfiguratorMap;
  setup(): void;
}
export interface IScriptElement {
  meta: IElementMeta;
  create: () => IScriptElementCreateResult;
}
