import { IConfigableNodeSnapshot } from '../nodes/ConfigableNode';

const LOCAL_STORAGE_KEY = 'gamma-local-data';

export class Storage {
  save(data: IConfigableNodeSnapshot[]) {
    const str = JSON.stringify(data);
    window.localStorage.setItem(LOCAL_STORAGE_KEY, str);
  }
  get(): IConfigableNodeSnapshot[] {
    const str = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!str) return [];
    let data: IConfigableNodeSnapshot[] = [];
    try {
      data = JSON.parse(str) || [];
    } catch (error) {}
    return data;
  }
}

export const storage = new Storage();
