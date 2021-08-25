import { isEmpty } from './utils';

interface CollectionItem {
  id: string;
}
interface CollectionMap<T> {
  [key: string]: T;
}

export class Collection<T extends CollectionItem> {
  private collection: CollectionMap<T> = {};
  private count: number = 0;
  getItemByID(id: string) {
    const _item = this.collection[id];
    if (!_item) return null;
    return _item;
  }
  addItem(item: T) {
    const _item = this.collection[item.id];
    if (_item) return false;
    this.count++;
    this.collection[item.id] = item;
  }
  removeItem(item: T) {
    const _item = this.collection[item.id];
    if (!_item) return false;
    this.count--;
    delete this.collection[item.id];
  }
  getCollection() {
    return this.collection;
  }
  isEmpty() {
    return isEmpty(this.collection);
  }
  removeAll() {
    this.count = 0;
    this.collection = {};
  }
  find(predicate: (value: T, index: number, obj: T[]) => boolean) {
    return Object.values(this.collection).find(predicate);
  }
  getLength() {
    return this.count;
  }
}
