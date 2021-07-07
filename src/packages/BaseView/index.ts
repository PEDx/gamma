import {
  ConfiguratorValueType,
  createConfigurator,
} from '@/class/Configurator';
import { createConfiguratorGroup } from '@/class/ConfiguratorGroup';
import { CreationView } from '@/packages';
import { WidgetType } from '@/class/Widget';
import { IRect } from '@/class/Editable';
import { nextTick } from '@/utils';
import { logger } from '@/class/Logger';

// TODO 构建到文件，各个编辑组件以怎样的形式存在
// TODO 各个组件的版本管理问题

const meta = {
  id: 'gamma-base-view-widget',
  name: '空盒子',
  icon: '',
  type: WidgetType.DOM,
};

export function createBaseView(): CreationView {
  const element = document.createElement('DIV');

  element.style.setProperty('position', `absolute`);
  element.style.setProperty('top', `0`);
  element.style.setProperty('left', `0`);

  // // TODO 此处需要处理单位
  // // TODO 1.多分辨率适配

  const rect = createConfigurator<IRect>({
    type: ConfiguratorValueType.Rect,
    name: 'rect',
    lable: '矩形',
    value: {
      x: 0,
      y: 0,
      width: 100,
      height: 100
    },
  }).attachEffect(
    (rect) => {
      if (!rect) return
      element.style.setProperty('height', `${rect.height}px`);
      element.style.setProperty('width', `${rect.width}px`);
      element.style.setProperty('transform', `translate3d(${rect.x}px, ${rect.y}px, 0px)`);
    }
  );

  const configurators = {  rect };

  return {
    meta,
    element,
    configurators,
  };
}
