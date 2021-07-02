import { Memento } from "@/class/Memento/Memento";

export interface Originator {
  save(): Memento
  restore(memo: Memento): void
}
