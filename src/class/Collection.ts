interface CollectionItem {
  id: string;
}
interface CollectionMap<T> {
  [key: string]: T;
}

export class Collection<T extends CollectionItem> {
  private collection: CollectionMap<T> = {};
  getItemByID(id: string) {
    const _item = this.collection[id];
    if (!_item) return null;
    return _item;
  }
  addItem(item: T) {
    const _item = this.collection[item.id];
    if (_item) return false;
    this.collection[item.id] = item;
  }
  removeItem(item: T) {
    const _item = this.collection[item.id];
    if (!_item) return false;
    delete this.collection[item.id];
  }
  getCollection() {
    return this.collection
  }
  removeAll() {
    this.collection = {}
  }
}
