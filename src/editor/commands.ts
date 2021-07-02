import { Command } from "@/class/Command"
import { ViewData } from "@/class/ViewData/ViewData"
import { ViewDataContainer } from "@/class/ViewData/ViewDataContainer"
import { ActionType, EditorAction } from "@/store/editor"


export class AddWidgetCommand extends Command {
  private addedWidget: ViewData
  private container: ViewDataContainer
  dispatch: React.Dispatch<EditorAction>
  constructor(addedWidget: ViewData, container: ViewDataContainer, dispatch: React.Dispatch<EditorAction>) {
    super();
    this.addedWidget = addedWidget
    this.container = container
    this.dispatch = dispatch
  }
  execute() {
    this.container?.addViewData(this.addedWidget);
    this.dispatch({
      type: ActionType.SetActiveViewData,
      data: this.addedWidget,
    });
  }
  undo() {
    this.addedWidget.removeSelfFromParentContainer()
    this.dispatch({
      type: ActionType.SetActiveViewData,
      data: null,
    });
  }
}

export class DeleteWidgetCommand extends Command {
  private deletedWidget: ViewData
  dispatch: React.Dispatch<EditorAction>
  constructor(deletedWidget: ViewData, dispatch: React.Dispatch<EditorAction>) {
    super()
    this.deletedWidget = deletedWidget
    this.dispatch = dispatch
  }
  execute() {
    this.deletedWidget.removeSelfFromParentContainer();
    this.dispatch({
      type: ActionType.SetActiveViewData,
      data: null,
    });
  }
  undo() {
    const parentContainerId = this.deletedWidget.getParentContainerId()
    const container = ViewDataContainer.collection.getItemByID(parentContainerId)
    container?.addViewData(this.deletedWidget);
  }
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
