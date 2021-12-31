import { AsyncUpdateQueue } from '../AsyncUpdateQueue';
import { ConcreteObserver, ConcreteSubject } from '../Observer';
import { ValueEntity } from '../values/ValueEntity';

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
}

const asyncUpdateQueue = new AsyncUpdateQueue();

type PickInner<T> = T extends ValueEntity<infer p> ? p : never;

export class Configurator<T extends ValueEntity<unknown>> extends ConcreteSubject {
  readonly lable?: string; // 配置数值名称
  readonly name?: string; // 配置字段名
  readonly describe?: string; // 描述
  readonly type: EConfiguratorType; // 类型
  private _valueEntity: T; // 值实体
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
    this._valueEntity = valueEntity;
  }
  get value(): PickInner<typeof this._valueEntity> {
    return this._valueEntity.value as PickInner<typeof this._valueEntity>;
  }
  set value(val: PickInner<typeof this._valueEntity>) {
    this._valueEntity.value = val;
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
    fn?: (value: typeof this._valueEntity, self?: typeof this) => void,
  ) {
    if (!fn) return this;
    this.attach(new ConcreteObserver(() => fn(this._valueEntity, this)));
    return this;
  }
}
