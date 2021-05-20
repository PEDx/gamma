export type ConfiguratorValue = string | number;
import { IPosition } from '@/class/Movable';

export enum ConfiguratorValueType { // 值类型，对应不同的值配置器
  Text,
  RichText,
  Number,
  UnitNumber,
  Color,
  GradientColor,
  Boolean,
}

export enum ConfiguratorSetterType { // 配置器类型
  Data, // 数据类型
  Style, // 样式类型
}

export interface IConfigurator {
  lable: string;
  name: string;
  describe?: string;
  type: ConfiguratorValueType;
  value: ConfiguratorValue;
}

export function styleSetter(el: HTMLElement, property: string, value: string) {
  el.style.setProperty(property, value);
}

export class ConfiguratorSetter {
  element: HTMLElement;
  configurator: Configurator;
  constructor(element: HTMLElement, configurator: Configurator) {
    this.element = element;
    this.configurator = configurator;
  }
  positonSetter(positon: IPosition) {
    this.styleSetter(
      'transform',
      `translate3d(${positon.x}px, ${positon.y}px, 0)`,
    );
  }
  styleSetter(property: string, value: string) {
    this.element.style.setProperty(property, value);
  }
}

export class Configurator implements IConfigurator {
  lable: string;
  name: string;
  describe?: string;
  type: ConfiguratorValueType;
  value: ConfiguratorValue;
  constructor({ lable, name, type, value, describe }: IConfigurator) {
    this.lable = lable;
    this.name = name;
    this.value = value;
    this.type = type;
    this.describe = describe;
  }
  setValue(value: ConfiguratorValue) {
    this.value = value;
  }
  setStyle(el: HTMLElement, property: string, value: string) {
    el.style.setProperty(property, value);
  }
  getValue() {
    return this.value;
  }
}
