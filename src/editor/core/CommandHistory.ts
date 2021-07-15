import { Command } from "@/editor/core/Command";
import { ConcreteSubject } from "@/common/Observer";


const MAX_HISTORY_LENGTH = 20
export class CommandHistory extends ConcreteSubject {
  private history: Command[] = []
  private head: number = -1
  constructor() {
    super()
  }
  commit(cmd: Command) {
    if (this.head >= MAX_HISTORY_LENGTH - 1) {
      this.history.shift()
      this.head = MAX_HISTORY_LENGTH - 2
    }
    if (this.head !== this.history.length - 1) {
      this.history = this.history.slice(0, this.head + 1)
    }
    this.history.push(cmd)
    this.head++
  }
  push(cmd: Command) {
    cmd.execute()
    this.commit(cmd)
    this.notify()
  }
  undo() {
    if (this.head <= 0) return
    const headCommand = this.history[this.head]
    this.head--
    if (headCommand.undo) {
      headCommand.undo();
    }
    this.executeCommand(this.head)
    this.notify()
  }
  redo() {
    if (this.head >= this.history.length - 1) return
    this.head++
    this.executeCommand(this.head)
    this.notify()
  }
  private executeCommand(head: number) {
    const command = this.history[head]
    if (!command) return
    command.execute()
  }
  getHistory() {
    return this.history
  }
  getHead() {
    return this.head
  }
}


export const commandHistory = new CommandHistory()
