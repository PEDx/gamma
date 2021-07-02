


export abstract class Command {
  public abstract execute(): void;
  public undo?(): void;
}
