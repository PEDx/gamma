import { Memento } from "@/commom/Memento/Memento";

export interface Originator {
  save(): Memento
  restore(memo: Memento): void
}
