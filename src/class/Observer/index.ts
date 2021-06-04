import { Observer } from './Observer';
import { Subject } from './Subject';

// https://www.cnblogs.com/onepixel/p/10806891.html
// https://refactoringguru.cn/design-patterns/observer

export class ConcreteSubject implements Subject {
  public state: number | undefined;
  private observers: Observer[] = [];
  public attach(observer: Observer): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.log('Subject: Observer has been attached already.');
    }

    console.log('Subject: Attached an observer.');
    this.observers.push(observer);
  }

  public detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.log('Subject: Nonexistent observer.');
    }

    this.observers.splice(observerIndex, 1);
    console.log('Subject: Detached an observer.');
  }
  public notify(): void {
    console.log('Subject: Notifying observers...');
    for (const observer of this.observers) {
      observer.update(this);
    }
  }
  public someBusinessLogic(): void {
    console.log("\nSubject: I'm doing something important.");
    this.state = Math.floor(Math.random() * (10 + 1));
    console.log(`Subject: My state has just changed to: ${this.state}`);
    this.notify();
  }
}

class ConcreteObserverA implements Observer {
  public update(subject: Subject): void {
    if (
      subject instanceof ConcreteSubject &&
      subject.state &&
      subject.state < 3
    ) {
      console.log('ConcreteObserverA: Reacted to the event.');
    }
  }
}

class ConcreteObserverB implements Observer {
  public update(subject: Subject): void {
    if (
      subject instanceof ConcreteSubject &&
      subject.state &&
      (subject.state === 0 || subject.state >= 2)
    ) {
      console.log('ConcreteObserverB: Reacted to the event.');
    }
  }
}

/**
 * The client code.
 */

// const subject = new ConcreteSubject();

// const observer1 = new ConcreteObserverA();
// subject.attach(observer1);

// const observer2 = new ConcreteObserverB();
// subject.attach(observer2);

// subject.someBusinessLogic();
// subject.someBusinessLogic();

// subject.detach(observer2);

// subject.someBusinessLogic();
