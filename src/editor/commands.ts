import { Command } from "@/class/Command"
import { ViewData } from "@/class/ViewData/ViewData"


export class AddWidgetCommand extends Command {
  constructor() { super() }
  execute() { }
}

export class DeleteWidgetCommand extends Command {
  private deletedWidget: ViewData
  constructor(deletedWidget: ViewData) {
    super()
    this.deletedWidget = deletedWidget
  }
  execute() { }
  undo() { }
}

export class SelectWidgetCommand extends Command {
  private selectWidget: ViewData
  private receiver: (videData: ViewData) => void
  constructor(selectWidget: ViewData, receiver: (videData: ViewData) => void) {
    super()
    this.selectWidget = selectWidget
    this.receiver = receiver
  }
  execute() {
    this.receiver(this.selectWidget)
  }
}

export class UpdateWidgetCommand extends Command {
  constructor() { super() }
  execute() { }
}



export class EditorCommandInvoker {
  addWidget() { }
  deleteWidget() { }
  selectWidget() { }
}
