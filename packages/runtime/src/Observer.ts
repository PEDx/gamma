// LINK https://www.cnblogs.com/onepixel/p/10806891.html
// LINK https://refactoringguru.cn/design-patterns/observer
/**
 * 观察者模式
 */
export interface Subject {
  attach(observer: Observer): unknown;
  detach(observer: Observer): void;
  notify(): void;
}

export interface Observer {
  update(subject: Subject): void;
}

export class ConcreteSubject implements Subject {
  private observers: Observer[] = [];
  public attach(observer: Observer) {
    const isExist = this.observers.includes(observer);
    if (isExist) return this;
    this.observers.push(observer);

    return this;
  }

  public detach(observer: Observer): void {
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

export class ConcreteObserver<T extends Subject> implements Observer {
  update: (subject: T) => void;
  constructor(update: (subject: T) => void) {
    this.update = update;
  }
}
