import { Configurator } from './Configurator';
import { PolysemyConfigurator } from './PolysemyConfigurator';

export enum ElementType {
  React = 0,
  Vue = 1,
  DOM = 2,
}
export interface IElementMeta {
  id: string;
  name: string;
  icon?: string;
  type: ElementType;
}
export interface IConfiguratorMap {
  [key: string]:
    | Configurator<unknown>
    | PolysemyConfigurator<unknown, string[]>;
}
export interface CreationView {
  meta: IElementMeta;
  element: HTMLElement;
  configurators: IConfiguratorMap;
  containers?: HTMLElement[];
}
export interface IElementCreateResult {
  element: HTMLElement;
  configurators: IConfiguratorMap;
  containers?: HTMLElement[];
}
export interface IGammaElement<T extends IElementCreateResult> {
  meta: IElementMeta;
  create: (element?: HTMLElement) => T;
}
