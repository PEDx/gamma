import { ViewData } from '@/runtime/ViewData';
import { WidgetType } from '@/runtime/CreationView';
import { createConfigurator, ConfiguratorValueType } from './Configurator';

// 页面配置对象

interface IRootViewDataParams {
  element: HTMLElement;
}

const meta = {
  id: 'gamma-root-container',
  name: '根容器',
  icon: '',
  type: WidgetType.DOM,
};

export class RootViewData extends ViewData {
  override readonly isRoot: boolean = true;
  constructor({ element }: IRootViewDataParams) {
    const title = createConfigurator({
      type: ConfiguratorValueType.Text,
      lable: '页面标题',
      value: 'gamma page',
    }).attachEffect();
    super({
      meta,
      element,
      configurators: { title },
    });
  }
}
