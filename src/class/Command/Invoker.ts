import { Command } from "./Command";

/**
 * The Invoker is associated with one or several commands. It sends a request to
 * the command.
 */

export class Invoker {
  private onStart!: Command;

  private onFinish!: Command;

  /**
   * Initialize commands.
   */
  public setOnStart(command: Command): void {
    this.onStart = command;
  }

  public setOnFinish(command: Command): void {
    this.onFinish = command;
  }

  /**
   * The Invoker does not depend on concrete command or receiver classes. The
   * Invoker passes a request to a receiver indirectly, by executing a
   * command.
   */
  public doSomethingImportant(): void {
    console.log('Invoker: Does anybody want something done before I begin?');
    if (this.isCommand(this.onStart)) {
      this.onStart.execute();
    }

    console.log('Invoker: ...doing something really important...');

    console.log('Invoker: Does anybody want something done after I finish?');
    if (this.isCommand(this.onFinish)) {
      this.onFinish.execute();
    }
  }

  private isCommand(object: Command): boolean {
    return object.execute !== undefined;
  }
}
