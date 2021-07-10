import { Memento } from "@/runtime/Memento/Memento";

export interface Originator {
  save(): Memento
  restore(memo: Memento): void
}
