import { ViewData } from '@/runtime/ViewData';

export class SuspendViewDataCollection {
  data: { [key: string]: ViewData[]; } = {};
  constructor() { }
  addItemToCollection(containerId: string, viewData: ViewData) {
    if (!this.data[containerId]) {
      this.data[containerId] = [];
    }
    const containerCollection = this.data[containerId];
    containerCollection.push(viewData);
  }
  getViewDataCollectionByID(containerId: string) {
    return this.data[containerId] || [];
  }
  removeCollection(containerId: string) {
    this.data[containerId] = [];
  }
  isEmpty() {
    return Object.values(this.data).every(collection => collection.length === 0);
  }
}
