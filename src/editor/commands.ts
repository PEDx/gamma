import { Command } from "@/class/Command"
import { globalBus } from "@/class/Event"
import { ViewData } from "@/class/ViewData/ViewData"
import { ViewDataContainer } from "@/class/ViewData/ViewDataContainer"
import { ViewDataSnapshot } from "@/class/ViewData/ViewDataSnapshot"


// 无副作用命令不用实现 undo
// 无副作用命令 是指不会影响其他命令执行或者回退的命令
// 有副作用命令必须实现自己的回退操作，在回退到相邻命令前执行


export class AddWidgetCommand extends Command {
  private videDataId: string
  private containerId: string
  constructor(videDataId: string, containerId: string) {
    super();
    this.videDataId = videDataId
    this.containerId = containerId
  }
  execute() {
    const viewData = ViewData.collection.getItemByID(this.videDataId)
    const container = ViewDataContainer.collection.getItemByID(this.containerId)
    if (!viewData) return
    container?.addViewData(viewData);
    globalBus.emit('set-active-viewdata', viewData)
  }
  undo() {
    const viewData = ViewData.collection.getItemByID(this.videDataId)
    if (!viewData) return
    viewData.removeSelfFromParentContainer()
    globalBus.emit('set-active-viewdata', null)
  }
}

export class DeleteWidgetCommand extends Command {
  private videDataId: string
  constructor(videDataId: string) {
    super()
    this.videDataId = videDataId
  }
  execute() {
    const deletedWidget = ViewData.collection.getItemByID(this.videDataId)
    if (!deletedWidget) return
    deletedWidget.removeSelfFromParentContainer();
    globalBus.emit('set-active-viewdata', null)
  }
  undo() {
    const deletedWidget = ViewData.collection.getItemByID(this.videDataId)
    if (!deletedWidget) return
    const parentContainerId = deletedWidget.getParentContainerId()
    const container = ViewDataContainer.collection.getItemByID(parentContainerId)
    container?.addViewData(deletedWidget);
  }
}

export class SelectWidgetCommand extends Command {
  private videDataId: string
  private snapshot: ViewDataSnapshot | undefined
  constructor(videDataId: string) {
    super()
    this.videDataId = videDataId
  }
  execute() {
    const viewData = ViewData.collection.getItemByID(this.videDataId)
    if (this.snapshot) this._execute()
    if (!this.snapshot) this.snapshot = viewData?.save()
    globalBus.emit('set-active-viewdata', viewData)
  }
  _execute() {
    const viewData = ViewData.collection.getItemByID(this.videDataId)
    if (!this.snapshot || !viewData) return
    viewData?.restore(this.snapshot)
    globalBus.emit('set-active-viewdata', viewData)
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
      this._execute()
      return
    }
    this.snapshot = viewData?.save()
  }
  _execute() {
    const viewData = ViewData.collection.getItemByID(this.videDataId)
    if (!this.snapshot || !viewData) return
    viewData?.restore(this.snapshot)
    globalBus.emit('set-active-viewdata', viewData)
  }
}



export class EditorCommandInvoker {
  addWidget() { }
  deleteWidget() { }
  selectWidget() { }
}
