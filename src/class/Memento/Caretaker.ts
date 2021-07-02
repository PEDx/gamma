import { Originator } from "./Originator";
import { Memento } from "./Memento";
export class Caretaker {
  private mementos: Memento[] = [];
  private originator: Originator;
  constructor(originator: Originator) {
    this.originator = originator;
  }
  public backup(): void {
  }
  public undo(): void {
  }
  public showHistory(): void {
  }
}
