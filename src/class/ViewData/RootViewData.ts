import { ViewData, IViewDataParams } from './ViewData';
import {
  ConfiguratorValueType,
  createConfigurator,
} from '@/class/Configurator';
import { WidgetType } from '../Widget';

export class RootViewData extends ViewData {
  override isRoot: boolean = true;
  constructor({ element }: { element: HTMLElement }) {
    super({
      element, configurators: {
        height: createConfigurator({
          type: ConfiguratorValueType.Height,
          name: 'height',
          lable: '高度',
          value: 100,
        }).attachEffect((value) => {
          this.element.style.setProperty('height', `${value}px`);
        }),
      },
      meta: {
        id: 'root',
        name: 'root',
        type: WidgetType.DOM
      }
    });
  }
}
