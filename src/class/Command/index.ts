import { Command } from "./Command";
import { Invoker } from "./Invoker";
import { Receiver } from "./Receiver";
export class SimpleCommand implements Command {
  private payload: string;

  constructor(payload: string) {
    this.payload = payload;
  }

  public execute(): void {
    console.log(
      `SimpleCommand: See, I can do simple things like printing (${this.payload})`,
    );
  }
}

export class ComplexCommand implements Command {
  private receiver: Receiver;
  private a: string;
  private b: string;
  constructor(receiver: Receiver, a: string, b: string) {
    this.receiver = receiver;
    this.a = a;
    this.b = b;
  }
  public execute(): void {
    console.log(
      'ComplexCommand: Complex stuff should be done by a receiver object.',
    );
    this.receiver.doSomething(this.a);
    this.receiver.doSomethingElse(this.b);
  }
}

const invoker = new Invoker();
invoker.setOnStart(new SimpleCommand('Say Hi!'));
const receiver = new Receiver();
invoker.setOnFinish(new ComplexCommand(receiver, 'Send email', 'Save report'));

invoker.doSomethingImportant();
