import { Configurator, EConfiguratorType } from '../Configurator';
import { EElementType } from '../elements/IElement';
import { BackgroundValueEntity } from '../values/BackgroundValueEntity';
import { ColorValueEntity } from '../values/ColorValueEntity';
import { PXNumberValueEntity } from '../values/UnitNumberValueEntity';
import { ViewNode } from './ViewNode';
import { ENodeType, INodeParams } from './Node';

export const createLayoutDivElement = () => {
  const element = document.createElement('DIV');
  element.style.setProperty('position', 'relative');
  element.style.setProperty('overflow', 'hidden');
  return element;
};

type TLayoutNodeParams = Pick<INodeParams, 'id'>;

/**
 * 布局节点是流式布局，因此有先后顺序
 * 顺序在 RootNode 的 Children 数组中表达
 */
export class LayoutNode extends ViewNode {
  readonly type = ENodeType.Layout;
  constructor({ id }: TLayoutNodeParams) {
    const div = createLayoutDivElement();

    const meta = {
      id: 'layout-node',
      name: '布局节点',
      type: EElementType.View,
    };

    const height = new Configurator({
      type: EConfiguratorType.Height,
      lable: 'H',
      valueEntity: new PXNumberValueEntity(256),
    }).effect((valueEntity) => {
      div.style.setProperty('min-height', valueEntity.style());
    });

    const background = new Configurator({
      type: EConfiguratorType.Background,
      lable: 'background',
      valueEntity: new BackgroundValueEntity({
        backgroundColor: new ColorValueEntity({ r: 255, g: 255, b: 255, a: 1 }),
      }),
    }).effect((valueEntity) => {
      const style = valueEntity.style();
      (Object.keys(style) as (keyof typeof style)[]).forEach(
        (key) => (div.style[key] = style[key] || ''),
      );
    });

    super({
      element: div,
      id,
      meta,
      container: true,
      configurators: { height, background },
    });
  }
}
