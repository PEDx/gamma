import { SectionInput, NumberInput, DropArea } from '@/configurator';
import { ConcreteSubject } from '@/class/Observer';
import { ConcreteObserver } from '@/class/Observer';
import { UNIT, noop } from '@/utils';
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
  Resource,
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
  [ConfiguratorValueType.Resource, DropArea],
]);

function getComponet(type: ConfiguratorValueType) {
  const _comp = configuratorComponentMap.get(type);
  if (!_comp) throw 'can not find configurator component';
  return configuratorComponentMap.get(type);
}

export interface ConfiguratorMethods {
  setValue: (value: ConfiguratorValue) => void;
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
  unit?: UNIT;
  links?: ILinks;
}

export interface ILinks {
  [key: string]: Configurator;
}

// TODO 理清配置数据流向，防止循环触发视图更新

/**
 * Configurator 是数据和视图的中间层，同时代表视图对可编辑数据的声明。
 * 配置数据全部要通过此来集散，由此影响视图
 * 视图配置数据可能来自拖拽产生，也可能来自右侧配置栏各项配置器来产生
 * 使用 name 来做为唯一 key, 以后无法约束
 * 使用 [name, type] 二元组来唯一确定一个 Configurator
 */

export class Configurator extends ConcreteSubject implements IConfigurator {
  lable: string;
  name?: string;
  describe?: string;
  type: ConfiguratorValueType;
  value: ConfiguratorValue;
  unit: UNIT = UNIT.NONE;
  links: ILinks = {};
  component:
    | React.ForwardRefExoticComponent<
        ConfiguratorProps & React.RefAttributes<ConfiguratorMethods>
      >
    | undefined;
  constructor({ lable, name, type, value, describe, links }: IConfigurator) {
    super();
    this.lable = lable;
    this.name = name;
    this.value = value;
    this.type = type;
    this.describe = describe;
    this.component = getComponet(this.type);
    if (links) this.link(links);
    return this;
  }
  initValue() {
    this.setValue(this.value);
  }
  setValue(value: ConfiguratorValue) {
    this.value = value;
    this.update();
  }

  update = throttle(this.notify, 10);

  link(links: ILinks) {
    this.links = links;
  }
}

const _attachEffect =
  (configurator: Configurator) =>
  (effect?: (value: ConfiguratorValue, links: ILinks) => void) => {
    if (!effect) return configurator;
    configurator.attach(
      new ConcreteObserver<Configurator>(({ value, links }) =>
        effect(value, links),
      ),
    );
    return configurator;
  };

export function createConfigurator(params: IConfigurator) {
  const configurator = new Configurator(params);
  return { attachEffect: _attachEffect(configurator) };
}
