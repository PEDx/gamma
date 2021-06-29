import { SectionInput, NumberInput, DropArea } from '@/configurator';
import { ConcreteSubject } from '@/class/Observer';
import { ConcreteObserver } from '@/class/Observer';
import { UNIT } from '@/utils';
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

export interface IConfigurator<T> {
  lable: string;
  name?: string;
  describe?: string;
  type: ConfiguratorValueType;
  value: T;
  unit?: UNIT;
}

// TODO 理清配置数据流向，防止循环触发视图更新

/**
 * Configurator 是数据和视图的中间层，同时代表视图对可编辑数据的声明。
 * 配置数据全部要通过此来集散，由此影响视图
 * 视图配置数据可能来自拖拽产生，也可能来自右侧配置栏各项配置器来产生
 */

export class Configurator<T> extends ConcreteSubject {
  lable: string;
  name?: string;
  describe?: string;
  type: ConfiguratorValueType;
  value: T;
  unit: UNIT = UNIT.NONE;
  component:
    | React.ForwardRefExoticComponent<
        ConfiguratorProps & React.RefAttributes<ConfiguratorMethods>
      >
    | undefined;
  constructor({ lable, name, type, value, describe }: IConfigurator<T>) {
    super();
    this.lable = lable;
    this.name = name;
    this.value = value;
    this.type = type;
    this.describe = describe;
    this.component = getComponet(this.type);
    return this;
  }
  initValue() {
    this.setValue(this.value);
  }
  setValue(value: T) {
    this.value = value;
    this.update();
  }

  update = throttle(this.notify, 10);
}

const _attachEffect =
  <T>(configurator: Configurator<T>) =>
  (effect?: (value: T) => void) => {
    if (!effect) return configurator;
    configurator.attach(
      new ConcreteObserver<Configurator<T>>(({ value }) => effect(value)),
    );
    return configurator;
  };

export function createConfigurator<T>(params: IConfigurator<T>) {
  const configurator = new Configurator(params);
  return { attachEffect: _attachEffect(configurator) };
}
