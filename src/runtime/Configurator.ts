import { ConcreteSubject, ConcreteObserver } from '@/common/Observer';
import { noop, UNIT } from '@/utils';
import { AsyncUpdateQueue } from '@/runtime/AsyncUpdateQueue';

export enum ConfiguratorValueType { // 值类型，对应不同的值配置器
  Custom,
  Text,
  TextArea,
  RichText,
  Font,
  Number,
  UnitNumber,
  Color,
  Select,
  GradientColor,
  Boolean,
  Resource,
  Rect,
  Width,
  Height,
  X,
  Y,
}

export type LayoutConfiguratorValueType =
  | ConfiguratorValueType.X
  | ConfiguratorValueType.Y
  | ConfiguratorValueType.Width
  | ConfiguratorValueType.Height;


export type PositionConfiguratorValueType =
  | ConfiguratorValueType.X
  | ConfiguratorValueType.Y;

export type StringOrNumber = string | number;

export interface ConfiguratorComponent<T> {
  methods: {
    setValue: (value: T) => void;
    setConfig?: <K>(arg: K) => void;
  };
  props: {
    onChange: (value: T) => void;
  };
}

export type ConfiguratorComponentNumber = ConfiguratorComponent<number>;
export type ConfiguratorComponentString = ConfiguratorComponent<string>;

export type ConfiguratorComponentType<T> = React.ForwardRefExoticComponent<
  ConfiguratorComponent<T>['props'] &
    React.RefAttributes<ConfiguratorComponent<T>['methods']>
>;

export interface IConfigurator<T> {
  lable: string;
  name?: string;
  describe?: string;
  type: ConfiguratorValueType;
  hidden?: boolean;
  value: T;
  unit?: UNIT;
  config?: unknown;
  component?: ConfiguratorComponentType<any>;
}

/**
 * Configurator 是数据和视图的中间层，同时代表视图对可编辑数据的声明。
 * 配置数据全部要通过此来集散，由此影响视图
 * 视图配置数据可能来自拖拽产生，也可能来自右侧配置栏各项配置器来产生
 */

export type PickConfiguratorValueType<T> = T extends Configurator<infer P>
  ? P
  : never;

const asyncUpdateQueue = new AsyncUpdateQueue();

// 需要限定一下 T 不能为 function
export class Configurator<T> extends ConcreteSubject {
  lable: string;
  name?: string;
  describe?: string;
  hidden: boolean;
  type: ConfiguratorValueType;
  value: T;
  unit: UNIT = UNIT.NONE;
  config: unknown;
  component: ConfiguratorComponentType<T> | undefined;
  constructor({
    lable,
    name,
    type,
    value,
    describe,
    component,
    hidden = false,
  }: IConfigurator<T>) {
    super();
    this.lable = lable;
    this.name = name;
    this.hidden = hidden;
    this.value = value;
    this.type = type;
    this.describe = describe;
    this.component = component;
    return this;
  }
  setValue(value: T) {
    this.value = value;
    asyncUpdateQueue.push(this.update);
  }
  setConfig<K>(value: K) {
    this.config = value;
    asyncUpdateQueue.push(this.update);
  }
  update = () => this.notify();
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
