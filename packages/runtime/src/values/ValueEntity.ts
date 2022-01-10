// 原始值 {value: 12, unit: 'px'}
// 视图值 '12px'
// 配置值 {value: 12, unit: 'px'}
// 存储值 {value: 12, unit: 'px'}

/**
 * 不一致 出入口值
 */
export abstract class IOValueEntity<IN, OUT> {
  abstract setValue(value: IN): void;
  abstract getValue(): OUT;
  abstract style(): unknown;
}

interface IIOValueEntityMap {
  [key: string]: IOValueEntity<unknown, unknown>;
}

type TValueEntityOutTypeMap<T extends IIOValueEntityMap> = {
  [key in keyof T]: ReturnType<T[key]['getValue']>;
};
type TValueEntityInTypeMap<T extends IIOValueEntityMap> = {
  [key in keyof T]: Parameters<T[key]['setValue']>['0'];
};

/**
 * 全一致 出入口值
 *
 */
export abstract class AccordValueEntity<T> extends IOValueEntity<T, T> {
  abstract setValue(value: T): void;
  abstract getValue(): T;
  abstract style(): unknown;
}

export abstract class ValueEntity<T> extends AccordValueEntity<T> {
  private value: T;
  constructor(value: T) {
    super();
    this.value = value;
  }
  setValue(value: T) {
    this.value = value;
  }
  getValue() {
    return this.value;
  }
  abstract style(): unknown;
}

export type PickValueEntityInner<T> = T extends ValueEntity<infer p>
  ? p
  : never;

export type PickNestValueEntity<T, U extends string> = T extends {
  [key in U]: ValueEntity<unknown>;
}
  ? { [key in U]: PickValueEntityInner<T[key]> }
  : never;
