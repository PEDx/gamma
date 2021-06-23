import { Render } from '@/class/Render';
import { ViewData, IViewDataParams } from './index';

// TODO 保存功能
export class RootViewData extends ViewData {
  isRoot: boolean;
  constructor({ element, configurators }: IViewDataParams) {
    super({ element, configurators });
    this.isRoot = true;
  }
}
