import 'systemjs';

const getGammaElementUrl = (elementId: string) => {
  // if (elementId === '@gamma-element/script-pendant-gala')
  //   return `http://localhost:8000/index.js`;
  return `http://192.168.38.15:7070/${elementId.split('/')[1]}/dist/index.js`;
};

interface IElementModule {
  status: 'success' | 'failure';
  id: string;
  url: string;
  module?: System.Module;
}

interface IElementLoaderParams {
  elementIds: string[];
  onLoad?: (info: IElementModule) => void;
}

export class ElementLoader {
  private elementIds: string[] = [];
  private onLoad: (info: IElementModule) => void;
  constructor({ elementIds, onLoad }: IElementLoaderParams) {
    this.elementIds = elementIds;
    this.onLoad = onLoad || (() => {});
    return this;
  }
  loadAll() {
    const pmisArr: Promise<System.Module>[] = [];
    this.elementIds.forEach((id) => {
      pmisArr.push(this.load(id));
    });
    return this.promiseLoad(pmisArr);
  }
  private promiseLoad<T>(promiseArrs: Promise<T>[]) {
    return new Promise((resolve) => {
      let arr: T[] = [];
      let count = 0;
      const handlerResolve = (index: number, data: T) => {
        arr[index] = data;
        const id = this.elementIds[index];
        this.onLoad({
          status: 'success',
          id,
          url: getGammaElementUrl(id),
          module: data,
        });
        count++;
      };
      const handlerReject = (index: number, data: T) => {
        arr[index] = data;
        const id = this.elementIds[index];
        this.onLoad({
          status: 'failure',
          id,
          url: getGammaElementUrl(id),
        });
        count++;
      };
      for (let i = 0; i < promiseArrs.length; i++) {
        promiseArrs[i]
          .then((data) => {
            handlerResolve(i, data);
          })
          .catch((err) => {
            handlerReject(i, err);
          })
          .finally(() => {
            if (count === promiseArrs.length) {
              console.log(System.entries());

              resolve(arr);
            }
          });
      }
    });
  }
  load(id: string) {
    return System.import(getGammaElementUrl(id));
  }
}
