import { ViewData, IViewDataParams } from './ViewData';

export class RootViewData extends ViewData {
  isRoot: boolean;
  constructor({ element, configurators }: IViewDataParams) {
    super({ element, configurators });
    this.isRoot = true;
  }
}
