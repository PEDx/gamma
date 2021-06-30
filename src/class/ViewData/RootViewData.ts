import { ViewData } from './ViewData';
import {
  ConfiguratorValueType,
  createConfigurator,
} from '@/class/Configurator';
import { WidgetType } from '../Widget';


// TODO 滚动容器
export class RootViewData extends ViewData {
  override readonly isRoot: boolean = true;
  constructor({ element }: { element: HTMLElement }) {
    super({
      element, configurators: {
        height: createConfigurator({
          type: ConfiguratorValueType.Height,
          name: 'height',
          lable: '高度',
          value: 812,
        }).attachEffect((value) => {
          this.element.style.setProperty('height', `${value}px`);
        }),
      },
      meta: {
        id: 'gamma-page-root',
        name: 'gamma-page-root',
        type: WidgetType.DOM
      }
    });
  }
}
