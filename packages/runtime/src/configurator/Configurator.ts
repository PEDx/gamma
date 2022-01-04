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
}

const asyncUpdateQueue = new AsyncUpdateQueue();

export class Configurator<
  T extends ValueEntity<unknown>,
> extends ConcreteSubject {
  readonly lable?: string; // 配置数值名称
  readonly name?: string; // 配置字段名
  readonly describe?: string; // 描述
  readonly type: EConfiguratorType; // 类型
  // 状态列表：多个值实体？
  private valueEntity: T; // 值实体
  constructor({
    valueEntity,
    lable,
    name,
    describe,
    type,
  }: IConfiguratorParams<T>) {
    super();
    this.lable = lable;
    this.name = name;
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
