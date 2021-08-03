import { Command } from '@/editor/core/Command';
import { safeEventBus, SafeEventType } from '@/editor/events';
import { viewDataHelper } from '@/runtime/ViewData';
import { ViewDataContainer } from '@/runtime/ViewDataContainer';
import { ViewDataSnapshot } from '@/runtime/ViewDataSnapshot';

// 无副作用命令：是指不会影响其他命令执行或者回退的命令
// 有副作用命令：必须实现自己的回退操作，在回退到相邻命令前执行
// 二义命令：生成时和再次执行时为不同的逻辑
// 命令要幂等，重复执行多次与执行一次结果要一致

export class AddWidgetCommand extends Command {
  private viewDataId: string;
  private containerId: string;
  constructor(viewDataId: string, containerId: string) {
    super();
    this.viewDataId = viewDataId;
    this.containerId = containerId;
  }
  execute() {
    const viewData = viewDataHelper.getViewDataByID(this.viewDataId);
    viewDataHelper.add(viewData, this.containerId);
    safeEventBus.emit(SafeEventType.SET_ACTIVE_VIEWDATA, viewData);
  }
  undo() {
    const viewData = viewDataHelper.getViewDataByID(this.viewDataId);
    viewDataHelper.remove(viewData);
    safeEventBus.emit(SafeEventType.SET_ACTIVE_VIEWDATA, null);
  }
}

export class DeleteWidgetCommand extends Command {
  private viewDataId: string;
  constructor(viewDataId: string) {
    super();
    this.viewDataId = viewDataId;
  }
  execute() {
    const viewData = viewDataHelper.getViewDataByID(this.viewDataId);
    viewDataHelper.remove(viewData);
    safeEventBus.emit(SafeEventType.SET_ACTIVE_VIEWDATA, null);
  }
  undo() {
    const deletedWidget = viewDataHelper.getViewDataByID(this.viewDataId);
    if (!deletedWidget) return;
    const parentContainerId = deletedWidget.getParent();
    const container =
      ViewDataContainer.collection.getItemByID(parentContainerId);
    container?.addViewData(deletedWidget);
  }
}

export class SelectWidgetCommand extends Command {
  private viewDataId: string;
  private snapshot: ViewDataSnapshot | undefined;
  constructor(viewDataId: string) {
    super();
    this.viewDataId = viewDataId;
  }
  execute() {
    const viewData = viewDataHelper.getViewDataByID(this.viewDataId);
    if (this.snapshot) this._execute();
    if (!this.snapshot) this.snapshot = viewData?.save();
    safeEventBus.emit(SafeEventType.SET_ACTIVE_VIEWDATA, viewData);
  }
  _execute() {
    const viewData = viewDataHelper.getViewDataByID(this.viewDataId);
    if (!this.snapshot || !viewData) return;
    viewData?.restore(this.snapshot);
    safeEventBus.emit(SafeEventType.SET_ACTIVE_VIEWDATA, viewData);
  }
}

/**
 * 快照命令
 * 优化点： 只存储更改了数据的 config
 */
export class ViewDataSnapshotCommand extends Command {
  private viewDataId: string;
  private snapshot: ViewDataSnapshot | undefined;
  constructor(viewDataId: string) {
    super();
    this.viewDataId = viewDataId;
  }
  execute() {
    const viewData = viewDataHelper.getViewDataByID(this.viewDataId);
    if (!viewData) return false;
    if (this.snapshot) {
      this._execute();
      return;
    }
    this.snapshot = viewData?.save();
  }
  _execute() {
    const viewData = viewDataHelper.getViewDataByID(this.viewDataId);
    if (!this.snapshot || !viewData) return;
    viewData?.restore(this.snapshot);
    safeEventBus.emit(SafeEventType.SET_ACTIVE_VIEWDATA, viewData);
  }
}
