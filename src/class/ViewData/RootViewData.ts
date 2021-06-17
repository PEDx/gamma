import { ViewData, IViewDataParams } from './index';

// TODO 保存功能
export class RootViewData extends ViewData {
  isRoot: boolean;
  constructor({ element, configurators }: IViewDataParams) {
    super({ element, configurators });
    this.isRoot = true;
  }
  getTemplateStruct() {
    console.log(this.element.innerHTML); // 所见即所得的 DOM 结构和样式数据，可利用此数据来优化首屏
    console.log(RootViewData.collection.getCollection()); // 运行时数据，用以生成组件
  }
}
