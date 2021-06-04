// https://www.cnblogs.com/onepixel/p/10806891.html
// https://refactoringguru.cn/design-patterns/observer

export interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(): void;
}

export interface Observer {
  update(subject: Subject): void;
}

export class ConcreteSubject implements Subject {
  private observers: Observer[] = [];
  public attach(observer: Observer): void {

    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.log('Subject: Observer has been attached already.');
    }

    // console.log('Subject: Attached an observer.');
    this.observers.push(observer);
  }

  public detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.log('Subject: Nonexistent observer.');
    }

    this.observers.splice(observerIndex, 1);
    // console.log('Subject: Detached an observer.');
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
