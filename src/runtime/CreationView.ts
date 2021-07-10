import { Configurator } from "./Configurator";



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
    [key: string]: Configurator<any>;
}

export interface CreationView {
    meta: WidgetMeta;
    element: HTMLElement;
    configurators: ConfiguratorMap;
    containers?: HTMLElement[];
}
