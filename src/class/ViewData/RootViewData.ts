import { Render } from '@/class/Render';
import { ViewDataCollection } from './ViewDataCollection';
import { ViewData, IViewDataParams } from './index';

// TODO 保存功能
export class RootViewData extends ViewData {
  collection = new ViewDataCollection();
  isRoot: boolean;
  constructor({ element, configurators }: IViewDataParams) {
    super({ element, configurators });
    this.isRoot = true;
  }
}
