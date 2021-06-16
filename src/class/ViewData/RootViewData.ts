import { ViewData, IViewDataParams } from './index';

export class RootViewData extends ViewData {
  isRoot: boolean;
  constructor({ element, configurators }: IViewDataParams) {
    super({ element, configurators });
    this.isRoot = true;
  }
  getTemplateStruct() {
    console.log(this.element.innerHTML);
  }
}
