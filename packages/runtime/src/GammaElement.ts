import { Configurator } from './Configurator';
import { GammaScript } from './GammaScript';
import { PolysemyConfigurator } from './PolysemyConfigurator';

export enum ElementType {
  Element,
  DOM,
  Script,
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
export interface IScriptCreateResult {
  script: GammaScript;
}
export interface IGammaElement<
  T extends IElementCreateResult | IScriptCreateResult,
> {
  meta: IElementMeta;
  create: (element?: HTMLElement) => T;
}
