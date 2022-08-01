import { Command } from '@/core/Commands/Command';

export class ActiveCommand extends Command {
  private id: string;
  constructor(id: string) {
    super();
    this.id = id;
  }
  execute() {}
}
