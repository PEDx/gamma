import { getRandomStr } from '@/utils';
import { Collection } from '@/class/Collection';

export type ResourceType = 'image' | 'audio' | 'video' | 'svga';

export interface IResource {
  type: ResourceType;
  url: string;
  name: string;
}

export class Resource {
  static collection = new Collection<Resource>();
  type: ResourceType;
  url: string;
  name: string;
  id: string;
  constructor({ type, url, name }: IResource) {
    this.type = type;
    this.url = url;
    this.name = name;
    this.id = `res_${getRandomStr(10)}`;
    Resource.collection.addItem(this);
  }
  static getResourceByUrl(url: string): Resource | null {
    let ret: Resource | null = null;
    Object.values(Resource.collection.getCollection()).map((res) => {
      if (!res) return;
      if (res.url === url) ret = res;
    });
    return ret;
  }
}
