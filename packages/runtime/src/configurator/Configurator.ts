import { AsyncUpdateQueue } from '../AsyncUpdateQueue';
import { ConcreteObserver, ConcreteSubject } from '../Observer';
import { ValueEntity } from '../values/ValueEntity';

export interface IConfiguratorParams<T> {
  lable?: string;
  name?: string;
  describe?: string;
  type: EConfiguratorType;
  valueEntity: ValueEntity<T>;
}

export enum EConfiguratorType { // 值类型，对应不同的值配置器
  Width,
  Height,
  X,
  Y,
}

const asyncUpdateQueue = new AsyncUpdateQueue();

export class Configurator<T> extends ConcreteSubject {
  readonly lable?: string; // 配置数值名称
  readonly name?: string; // 配置字段名
  readonly describe?: string; // 描述
  readonly type: EConfiguratorType; // 类型
  private _valueEntity: ValueEntity<T>; // 值实体
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
  get value() {
    return this._valueEntity.save();
  }
  set value(val: string) {
    this._valueEntity.restore(val);
    /**
     * 加入异步队列通知观察者
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
  public effect(fn?: (value: string) => void) {
    if (!fn) return this;
    this.attach(new ConcreteObserver(() => fn(this.value)));
    return this;
  }
  /**
   * 更新值实体
   */
  public setValue(val: string) {
    this.value = val;
  }
}
