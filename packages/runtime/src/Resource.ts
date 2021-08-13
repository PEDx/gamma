import { v4 as uuidv4 } from 'uuid';

export type ResourceType = 'image' | 'audio' | 'video' | 'svga';

export interface IResource {
  type: ResourceType;
  url: string;
  name: string;
}

export class Resource {
  type: ResourceType;
  url: string;
  name: string;
  id: string;
  constructor({ type, url, name }: IResource) {
    this.type = type;
    this.url = url;
    this.name = name;
    this.id = `res_${uuidv4()}`;
  }
}
