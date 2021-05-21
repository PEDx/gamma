import { SectionInput, NumberInput } from '@/configurator';

export type ConfiguratorValue = string | number;

export enum ConfiguratorValueType { // 值类型，对应不同的值配置器
  Text,
  RichText,
  Number,
  UnitNumber,
  Color,
  GradientColor,
  Boolean,
  Width,
  Height,
  X,
  Y,
}

export const configuratorComponentMap = new Map([
  [ConfiguratorValueType.Text, SectionInput],
  [ConfiguratorValueType.Number, NumberInput],
  [ConfiguratorValueType.Width, NumberInput],
  [ConfiguratorValueType.Height, NumberInput],
  [ConfiguratorValueType.X, NumberInput],
  [ConfiguratorValueType.Y, NumberInput],
]);

export interface IConfigurator {
  lable: string;
  name?: string;
  describe?: string;
  type: ConfiguratorValueType;
  value: ConfiguratorValue;
  links?: ILinks;
  effect?: (value: ConfiguratorValue, linksValue: ILinks) => void;
}

export interface ILinks {
  [key: string]: Configurator;
}

export class Configurator implements IConfigurator {
  lable: string;
  name?: string;
  describe?: string;
  type: ConfiguratorValueType;
  value: ConfiguratorValue;
  links: ILinks = {};
  effect?: (value: ConfiguratorValue, links: ILinks) => void;
  constructor({
    lable,
    name,
    type,
    value,
    describe,
    effect,
    links,
  }: IConfigurator) {
    this.lable = lable;
    this.name = name;
    this.value = value;
    this.type = type;
    this.describe = describe;
    this.effect = effect;
    if (links) this.link(links);
  }
  setValue(value: ConfiguratorValue) {
    this.value = value;
    if (this.effect) this.effect(value, this.links);
  }
  getValue() {
    return this.value;
  }
  link(links: ILinks) {
    this.links = links;
  }
}
