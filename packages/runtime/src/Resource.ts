import { uuid } from './utils';

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
    this.id = `${uuid()}`;
  }
}
