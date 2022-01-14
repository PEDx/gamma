import { Command } from '@/core/Command';

// 无副作用命令：是指不会影响其他命令执行或者回退的命令
// 有副作用命令：必须实现自己的回退操作，在回退到相邻命令前执行
// 二义命令：生成时和再次执行时为不同的逻辑
// 命令要幂等，重复执行多次与执行一次结果要一致


export class AddCommand extends Command {
  private id: string;
  constructor(id: string) {
    super();
    this.id = id;
  }
  execute() {}
}

export class DeleteCommand extends Command {
  private id: string;
  constructor(id: string) {
    super();
    this.id = id;
  }
  execute() {}
}

export class SelectCommand extends Command {
  private id: string;
  constructor(id: string) {
    super();
    this.id = id;
  }
  execute() {}
}

/**
 * 快照命令
 * 优化点： 只存储更改了数据的 config
 */
export class SnapshotCommand extends Command {
  private id: string;
  constructor(id: string) {
    super();
    this.id = id;
  }
  execute() {}
}
