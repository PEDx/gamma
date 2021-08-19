export interface Memento {}
export interface Originator {
  save(): Memento;
  restore(memo: Memento): void;
}
