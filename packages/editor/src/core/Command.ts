


export abstract class Command {
  abstract execute(): void;
  public undo?(): void;
}
