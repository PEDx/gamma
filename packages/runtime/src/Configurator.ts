import { Runtime } from '.';
import { Observer, Subject } from './Observer';
import { PickValueEntityInner, ValueEntity } from './values/ValueEntity';

export interface IConfiguratorParams<T, U> {
  lable?: string;
  name?: string;
  describe?: string;
  type: U;
  valueEntity: T;
}

export enum EConfiguratorType { // Configurator 类型，对应不同的值配置器
  Width,
  Height,
  X,
  Y,
  Font,
  Background,
  Border,
  Switch,
  Text,
  Number,
}

export type TConfigurator = Configurator<ValueEntity<unknown>>;

export class Configurator<T extends ValueEntity<unknown>> extends Subject {
  /**
   * 配置器的类型
   */
  readonly type: EConfiguratorType;
  /**
   * 配置器名称, 为空情况下不会显示配置器组件
   */
  readonly lable?: string;
  /**
   * 对配置的附加描述
   */
  readonly describe?: string;
  /**
   * 配置的值实体
   */
  private valueEntity: T;
  constructor({
    type,
    lable,
    describe,
    valueEntity,
  }: IConfiguratorParams<T, EConfiguratorType>) {
    super();
    this.lable = lable;
    this.type = type;
    this.describe = describe;
    this.valueEntity = valueEntity;
    return this;
  }
  get value(): PickValueEntityInner<T> {
    return this.valueEntity.getValue() as PickValueEntityInner<T>;
  }
  set value(val: PickValueEntityInner<T>) {
    this.valueEntity.setValue(val);
    /**
     * 加入异步队列通知观察者并去重
     */
    Runtime.updateQueue.push(this.update);
  }
  /**
   * 通知所有观察者
   */
  private update = () => this.notify();

  /**
   * 添加配置器的观察者
   */
  public effect(
    fn?: (value: typeof this.valueEntity, self?: typeof this) => void,
  ) {
    if (!fn) return this;
    const obs = new Observer(() => fn(this.valueEntity, this));
    this.attach(obs);
    /**
     * 初始化通知观察者一次
     */

    fn(this.valueEntity, this);
    return this;
  }
}
