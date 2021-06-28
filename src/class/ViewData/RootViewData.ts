import { ViewData, IViewDataParams } from './ViewData';

export class RootViewData extends ViewData {
  override isRoot: boolean = true;
  constructor({ element, configurators }: IViewDataParams) {
    super({ element, configurators });
  }
}
