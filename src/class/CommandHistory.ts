import { Command } from "@/class/Command";


const MAX_HISTORY_LENGTH = 30
export class CommandHistory {
  private history: Command[] = []
  private head: number = -1
  commit(cmd: Command) {
    if (this.head >= MAX_HISTORY_LENGTH - 1) this.history.shift()
    if (this.head !== this.history.length - 1) {
      this.history = this.history.slice(this.head, this.history.length)
    }
    this.history.push(cmd)
    this.head++
  }
  push(cmd: Command) {
    this.commit(cmd)
    cmd.execute()
  }
  undo() {
    if (this.head <= 0) return
    this.head--
    this.executeCommand(this.head)
  }
  redo() {
    if (this.head >= this.history.length - 1) return
    this.head++
    this.executeCommand(this.head)
  }
  executeCommand(head: number) {
    const command = this.history[head]
    if (!command) return
    if (command.undo) {
      command.undo()
      return
    }
    command.execute()
  }
}


export const commandHistory = new CommandHistory()
