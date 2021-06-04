import { SectionInput, NumberInput } from '@/configurator';
import { ConcreteSubject } from '@/class/Observer';
import { throttle } from 'lodash';

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

export interface ConfiguratorMethods {
  setValue: (value: ConfiguratorValue) => void;
  emitValue: () => void;
}
export interface ConfiguratorProps {
  onChange: (value: ConfiguratorValue) => void;
}

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

// Configurator 是数据和视图的中间层，同时代表视图对可编辑数据的声明。
// 配置数据全部要通过此来集散，由此影响视图
// 视图配置数据可能来自拖拽产生，也可能来自右侧配置栏各项配置器来产生
//
export class Configurator extends ConcreteSubject implements IConfigurator {
  lable: string;
  name?: string;
  describe?: string;
  type: ConfiguratorValueType;
  value: ConfiguratorValue;
  links: ILinks = {};
  effect?: (value: ConfiguratorValue, links: ILinks) => void;
  component:
    | React.ForwardRefExoticComponent<
        ConfiguratorProps & React.RefAttributes<ConfiguratorMethods>
      >
    | undefined;
  constructor({
    lable,
    name,
    type,
    value,
    describe,
    effect,
    links,
  }: IConfigurator) {
    super();
    this.lable = lable;
    this.name = name;
    this.value = value;
    this.type = type;
    this.describe = describe;
    this.effect = effect && throttle(effect, 16);
    this.component = this.getComponet();
    if (links) this.link(links);
  }
  setValue(value: ConfiguratorValue) {
    this.value = value;
    this.notify();
    if (this.effect) this.effect(value, this.links);
  }
  getValue() {
    return this.value;
  }
  getComponet() {
    const _comp = configuratorComponentMap.get(this.type);
    if (!_comp) throw 'can not find configurator component';
    return configuratorComponentMap.get(this.type);
  }
  link(links: ILinks) {
    this.links = links;
  }
}
