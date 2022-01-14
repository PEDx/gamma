import { AsyncUpdateQueue } from '../AsyncUpdateQueue';
import { Observer, Subject } from '../Observer';
import { BackgroundValueEntity } from '../values/BackgroundValueEntity';
import { BorderValueEntity } from '../values/BorderValueEntity';
import { FontValueEntity } from '../values/FontValueEntity';
import { TypeValueEntity } from '../values/TypeValueEntity';
import { PXNumberValueEntity } from '../values/UnitNumberValueEntity';
import { PickValueEntityInner, ValueEntity } from '../values/ValueEntity';

export interface IConfiguratorParams<T, U> {
  lable?: string;
  name?: string;
  describe?: string;
  type: U;
  valueEntity: T;
}

export enum EConfiguratorType { // Configurator 类型，对应不同的值配置器
  Index,
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

export interface IConfiguratorValueMap {
  [EConfiguratorType.Width]: PXNumberValueEntity;
  [EConfiguratorType.Height]: PXNumberValueEntity;
  [EConfiguratorType.X]: PXNumberValueEntity;
  [EConfiguratorType.Y]: PXNumberValueEntity;
  [EConfiguratorType.Font]: FontValueEntity;
  [EConfiguratorType.Background]: BackgroundValueEntity;
  [EConfiguratorType.Border]: BorderValueEntity;
  [EConfiguratorType.Switch]: TypeValueEntity<boolean>;
  [EConfiguratorType.Text]: TypeValueEntity<string>;
  [EConfiguratorType.Number]: TypeValueEntity<number>;
}

const asyncUpdateQueue = new AsyncUpdateQueue();

export type TConfigurator = Configurator<ValueEntity<unknown>>;

export class Configurator<
  T extends ValueEntity<unknown>,
> extends Subject {
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
    asyncUpdateQueue.push(this.update);
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

    this.value = this.value;
    return this;
  }
}
