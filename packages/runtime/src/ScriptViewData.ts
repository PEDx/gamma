import { IConfiguratorMap, IElementMeta } from './GammaElement';
import { ViewData } from './ViewData';

export interface IScriptDataParams {
  id?: string;
  meta: IElementMeta;
  configurators: IConfiguratorMap | null;
}

export class ScriptViewData extends ViewData {
  constructor({ meta, configurators, id }: IScriptDataParams) {
    super({
      id,
      meta,
      element: document.createElement('DIV'), // 占位
      configurators: configurators,
      containerElements: [],
    });
  }
}
