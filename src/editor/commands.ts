import { Command } from "@/class/Command"
import { globalBus } from "@/class/Event"
import { ViewData } from "@/class/ViewData/ViewData"
import { ViewDataContainer } from "@/class/ViewData/ViewDataContainer"
import { ViewDataSnapshot } from "@/class/ViewData/ViewDataSnapshot"
import { ActionType, EditorAction } from "@/store/editor"


export class AddWidgetCommand extends Command {
  private videDataId: string
  private containerId: string
  dispatch: React.Dispatch<EditorAction>
  constructor(videDataId: string, containerId: string, dispatch: React.Dispatch<EditorAction>) {
    super();
    this.videDataId = videDataId
    this.containerId = containerId
    this.dispatch = dispatch
  }
  execute() {
    const viewData = ViewData.collection.getItemByID(this.videDataId)
    const container = ViewDataContainer.collection.getItemByID(this.containerId)
    if (!viewData) return
    container?.addViewData(viewData);
    this.dispatch({
      type: ActionType.SetActiveViewData,
      data: viewData,
    });
  }
  undo() {
    const viewData = ViewData.collection.getItemByID(this.videDataId)
    if (!viewData) return
    viewData.removeSelfFromParentContainer()
    this.dispatch({
      type: ActionType.SetActiveViewData,
      data: null,
    });
  }
}

export class DeleteWidgetCommand extends Command {
  private videDataId: string
  dispatch: React.Dispatch<EditorAction>
  constructor(videDataId: string, dispatch: React.Dispatch<EditorAction>) {
    super()
    this.videDataId = videDataId
    this.dispatch = dispatch
  }
  execute() {
    const deletedWidget = ViewData.collection.getItemByID(this.videDataId)
    if (!deletedWidget) return
    deletedWidget.removeSelfFromParentContainer();
    this.dispatch({
      type: ActionType.SetActiveViewData,
      data: null,
    });
  }
  undo() {
    const deletedWidget = ViewData.collection.getItemByID(this.videDataId)
    if (!deletedWidget) return
    const parentContainerId = deletedWidget.getParentContainerId()
    const container = ViewDataContainer.collection.getItemByID(parentContainerId)
    container?.addViewData(deletedWidget);
  }
}

// 无副作用命令不用实现 undo
export class SelectWidgetCommand extends Command {
  private videDataId: string
  private snapshot: ViewDataSnapshot | undefined
  private dispatch: React.Dispatch<EditorAction>
  constructor(videDataId: string, dispatch: React.Dispatch<EditorAction>) {
    super()
    this.videDataId = videDataId
    this.dispatch = dispatch
  }
  execute() {
    const viewData = ViewData.collection.getItemByID(this.videDataId)
    if (this.snapshot) this._undo()
    if (!this.snapshot) this.snapshot = viewData?.save()
    this.dispatch({
      type: ActionType.SetActiveViewData,
      data: viewData,
    });
  }
  _undo() {
    const viewData = ViewData.collection.getItemByID(this.videDataId)
    if (!this.snapshot || !viewData) return
    viewData?.restore(this.snapshot)
    globalBus.emit('refresh-edit-box-layer', viewData)
  }
}

// 组件内部配置变化
export class ViewDataSnapshotCommand extends Command {
  private videDataId: string
  private snapshot: ViewDataSnapshot | undefined
  constructor(videDataId: string) {
    super()
    this.videDataId = videDataId
  }
  execute() {
    const viewData = ViewData.collection.getItemByID(this.videDataId)
    if (!viewData) return false
    if (this.snapshot) {
      this._undo()
      return
    }
    this.snapshot = viewData?.save()
  }
  _undo() {
    const viewData = ViewData.collection.getItemByID(this.videDataId)
    if (!this.snapshot || !viewData) return
    viewData?.restore(this.snapshot)
    globalBus.emit('refresh-edit-box-layer', viewData)
  }
}



export class EditorCommandInvoker {
  addWidget() { }
  deleteWidget() { }
  selectWidget() { }
}
