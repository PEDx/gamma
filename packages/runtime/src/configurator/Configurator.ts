import { AsyncUpdateQueue } from '../AsyncUpdateQueue';
import { ConcreteObserver, ConcreteSubject } from '../Observer';
import { BackgroundValueEntity } from '../values/BackgroundValueEntity';
import { BorderValueEntity } from '../values/BorderValueEntity';
import { FontValueEntity } from '../values/FontValueEntity';
import { TypeValueEntity } from '../values/TypeValueEntity';
import { PXNumberValueEntity } from '../values/UnitNumberValueEntity';
import { ValueEntity, PickValueEntityInner } from '../values/ValueEntity';

export interface IConfiguratorParams<T> {
  lable?: string;
  name?: string;
  describe?: string;
  type: EConfiguratorType;
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

export interface IConfiguratorType {
  [EConfiguratorType.Width]: Configurator<PXNumberValueEntity>;
  [EConfiguratorType.Height]: Configurator<PXNumberValueEntity>;
  [EConfiguratorType.X]: Configurator<PXNumberValueEntity>;
  [EConfiguratorType.Y]: Configurator<PXNumberValueEntity>;
  [EConfiguratorType.Font]: Configurator<FontValueEntity>;
  [EConfiguratorType.Background]: Configurator<BackgroundValueEntity>;
  [EConfiguratorType.Border]: Configurator<BorderValueEntity>;
  [EConfiguratorType.Switch]: Configurator<TypeValueEntity<boolean>>;
  [EConfiguratorType.Text]: Configurator<TypeValueEntity<string>>;
  [EConfiguratorType.Number]: Configurator<TypeValueEntity<number>>;
}

const asyncUpdateQueue = new AsyncUpdateQueue();

export class Configurator<
  T extends ValueEntity<unknown>,
> extends ConcreteSubject {
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
  constructor({ type, lable, describe, valueEntity }: IConfiguratorParams<T>) {
    super();
    this.lable = lable;
    this.type = type;
    this.describe = describe;
    this.valueEntity = valueEntity;
    return this;
  }
  get value(): PickValueEntityInner<typeof this.valueEntity> {
    return this.valueEntity.getValue() as PickValueEntityInner<
      typeof this.valueEntity
    >;
  }
  set value(val: PickValueEntityInner<typeof this.valueEntity>) {
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
    const obs = new ConcreteObserver(() => fn(this.valueEntity, this));
    this.attach(obs);
    /**
     * 初始化通知观察者一次
     */

    this.value = this.value;
    return this;
  }
}
