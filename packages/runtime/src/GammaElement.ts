import { Configurator } from './Configurator';
import { PolysemyConfigurator } from './PolysemyConfigurator';

export enum ElementType {
  Element,
  View,
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

/**
 * 视图组件创建
 */
export interface IElementCreateResult {
  element: HTMLElement;
  configurators: IConfiguratorMap;
  containers?: HTMLElement[];
}

/**
 * 脚本组件创建
 */
export interface IScriptCreateResult {
  configurators: IConfiguratorMap;
  ready: () => void;
  destroy?: () => void;
}

export type TGammaElementType = IElementCreateResult | IScriptCreateResult;

export interface IGammaElement<T extends TGammaElementType> {
  meta: IElementMeta;
  create: (element?: HTMLElement) => T;
}
