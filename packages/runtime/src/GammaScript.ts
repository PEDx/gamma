import { ViewData } from './ViewData';

export class GammaScript {
  protected created() {}
  protected mounted() {}
  queryElementByName($name: string) {
    const collection = ViewData.collection;
    return collection.find((item) => item.name === $name) || null;
  }
}
