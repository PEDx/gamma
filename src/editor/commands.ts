import { Command } from "@/editor/core/Command"
import { globalBus } from "@/editor/core/Event"
import { ViewData } from "@/runtime/ViewData"
import { ViewDataContainer } from "@/runtime/ViewDataContainer"
import { ViewDataSnapshot } from "@/runtime/ViewDataSnapshot"


// 无副作用命令：是指不会影响其他命令执行或者回退的命令
// 有副作用命令：必须实现自己的回退操作，在回退到相邻命令前执行
// 二义命令：生成时和再次执行时为不同的逻辑
// 命令要幂等，重复执行多次与执行一次结果要一致


export class AddWidgetCommand extends Command {
  private viewDataId: string
  private containerId: string
  constructor(viewDataId: string, containerId: string) {
    super();
    this.viewDataId = viewDataId
    this.containerId = containerId
  }
  execute() {
    const viewData = ViewData.collection.getItemByID(this.viewDataId)
    const container = ViewDataContainer.collection.getItemByID(this.containerId)
    if (!viewData) return
    container?.addViewData(viewData);
    globalBus.emit('set-active-viewdata', viewData)
  }
  undo() {
    const viewData = ViewData.collection.getItemByID(this.viewDataId)
    if (!viewData) return
    viewData.removeSelfFromParentContainer()
    globalBus.emit('set-active-viewdata', null)
  }
}

export class DeleteWidgetCommand extends Command {
  private viewDataId: string
  constructor(viewDataId: string) {
    super()
    this.viewDataId = viewDataId
  }
  execute() {
    const deletedWidget = ViewData.collection.getItemByID(this.viewDataId)
    if (!deletedWidget) return
    deletedWidget.removeSelfFromParentContainer();
    globalBus.emit('set-active-viewdata', null)
  }
  undo() {
    const deletedWidget = ViewData.collection.getItemByID(this.viewDataId)
    if (!deletedWidget) return
    const parentContainerId = deletedWidget.getParentContainerId()
    const container = ViewDataContainer.collection.getItemByID(parentContainerId)
    container?.addViewData(deletedWidget);
  }
}

export class SelectWidgetCommand extends Command {
  private viewDataId: string
  private snapshot: ViewDataSnapshot | undefined
  constructor(viewDataId: string) {
    super()
    this.viewDataId = viewDataId
  }
  execute() {
    const viewData = ViewData.collection.getItemByID(this.viewDataId)
    if (this.snapshot) this._execute()
    if (!this.snapshot) this.snapshot = viewData?.save()
    globalBus.emit('set-active-viewdata', viewData)
  }
  _execute() {
    const viewData = ViewData.collection.getItemByID(this.viewDataId)
    if (!this.snapshot || !viewData) return
    viewData?.restore(this.snapshot)
    globalBus.emit('set-active-viewdata', viewData)
  }
}

// 组件内部配置变化
export class ViewDataSnapshotCommand extends Command {
  private viewDataId: string
  private snapshot: ViewDataSnapshot | undefined
  constructor(viewDataId: string) {
    super()
    this.viewDataId = viewDataId
  }
  execute() {
    const viewData = ViewData.collection.getItemByID(this.viewDataId)
    if (!viewData) return false
    if (this.snapshot) {
      this._execute()
      return
    }
    this.snapshot = viewData?.save()
  }
  _execute() {
    const viewData = ViewData.collection.getItemByID(this.viewDataId)
    if (!this.snapshot || !viewData) return
    viewData?.restore(this.snapshot)
    globalBus.emit('set-active-viewdata', viewData)
  }
}
