import { Configurator } from '../configurator/Configurator';
import { ValueEntity } from '../values/ValueEntity';

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
  [key: string]: Configurator<ValueEntity<unknown>>;
}

export interface IViewElementCreateResult {
  element: HTMLElement;
  configurators: IConfiguratorMap;
  containers?: HTMLElement[];
}

export interface IElement {
  meta: IElementMeta;
  create: () => IViewElementCreateResult;
}
