import { AsyncUpdateQueue } from '../AsyncUpdateQueue';
import { ConcreteObserver, ConcreteSubject } from '../Observer';
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

const asyncUpdateQueue = new AsyncUpdateQueue();

export class Configurator<
  T extends ValueEntity<unknown>,
> extends ConcreteSubject {
  /**
   * 配置器名称, 为空情况下不会显示配置器组件
   */
  readonly lable?: string;
  /**
   * 对配置的附加描述
   */
  readonly describe?: string;
  /**
   * 配置器的类型
   */
  readonly type: EConfiguratorType;
  /**
   * 配置的值实体
   */
  private valueEntity: T;
  constructor({
    valueEntity,
    lable,
    describe,
    type,
  }: IConfiguratorParams<T>) {
    super();
    this.lable = lable;
    this.type = type;
    this.describe = describe;
    this.valueEntity = valueEntity;
  }
  get value(): PickValueEntityInner<typeof this.valueEntity> {
    return this.valueEntity.value as PickValueEntityInner<
      typeof this.valueEntity
    >;
  }
  set value(val: PickValueEntityInner<typeof this.valueEntity>) {
    this.valueEntity.value = val;
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
    this.attach(new ConcreteObserver(() => fn(this.valueEntity, this)));
    return this;
  }
}
