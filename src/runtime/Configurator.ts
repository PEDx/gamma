import { ConcreteSubject, ConcreteObserver } from '@/common/Observer';
import { UNIT } from '@/utils';
import { ConfiguratorMap } from '@/runtime/CreationView';
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

export const LayoutConfiguratorValueType = [
  ConfiguratorValueType.X,
  ConfiguratorValueType.Y,
  ConfiguratorValueType.Width,
  ConfiguratorValueType.Height,
];

export interface ConfiguratorComponent<T> {
  methods: {
    setValue: (value: T) => void;
    setConfig?: <K>(arg: K) => void;
  };
  props: {
    value?: T;
    onChange: (value: T) => void;
  };
}

export type ConfiguratorComponentType<T> = React.ForwardRefExoticComponent<
  ConfiguratorComponent<T>['props'] &
    React.RefAttributes<ConfiguratorComponent<T>['methods']>
>;

export interface IConfigurator<T> {
  lable?: string;
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

export type PickConfiguratorValueTypeMap<T extends ConfiguratorMap> = {
  [P in keyof T]: PickConfiguratorValueType<T[P]>;
};

const asyncUpdateQueue = new AsyncUpdateQueue();

// 需要限定一下 T 不能为 function
export class Configurator<T> extends ConcreteSubject {
  readonly lable?: string;
  readonly name?: string;
  readonly describe?: string;
  readonly hidden: boolean;
  readonly type: ConfiguratorValueType;
  readonly unit: UNIT = UNIT.NONE;
  public value: T;
  public config: unknown;
  readonly component: ConfiguratorComponentType<T> | undefined;
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
  setConfig<K>(config: K) {
    this.config = config;
    asyncUpdateQueue.push(this.update);
  }
  save(): unknown {
    return this.value;
  }
  restore(value: T) {
    this.setValue(value);
  }
  update = () => this.notify();

  attachEffect = (effect?: (value: T) => void) => {
    if (!effect) return this;
    this.attach(
      new ConcreteObserver<Configurator<T>>(({ value }) => effect(value)),
    );
    return this;
  };
}

/**
 * 创建 Configurator 的工具函数
 * @param params
 * @returns 返回的 attachEffect 必须调用，用来初始化对 Configurator 的观察
 */
export function createConfigurator<T>(params: IConfigurator<T>) {
  return new Configurator(params);
}
