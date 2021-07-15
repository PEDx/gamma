import { Memento } from "@/common/Memento/Memento";

export interface Originator {
  save(): Memento
  restore(memo: Memento): void
}
