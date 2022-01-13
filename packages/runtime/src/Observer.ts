// LINK https://www.cnblogs.com/onepixel/p/10806891.html
// LINK https://refactoringguru.cn/design-patterns/observer
/**
 * 观察者模式
 */
export interface ISubject {
  attach(observer: IObserver): unknown;
  detach(observer: IObserver): void;
  notify(): void;
}

export interface IObserver {
  update(subject: ISubject): void;
}

export class Subject implements ISubject {
  private observers: IObserver[] = [];
  public attach(observer: IObserver) {
    const isExist = this.observers.includes(observer);
    if (isExist) return this;
    this.observers.push(observer);

    return this;
  }

  public detach(observer: IObserver): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.log('Subject: Nonexistent observer.');
    }

    this.observers.splice(observerIndex, 1);
  }
  public notify(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }
}

export class Observer<T extends ISubject> implements IObserver {
  update: (subject: T) => void;
  constructor(update: (subject: T) => void) {
    this.update = update;
  }
}
