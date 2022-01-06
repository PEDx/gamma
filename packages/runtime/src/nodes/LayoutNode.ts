import { Configurator, EConfiguratorType } from '../configurator/Configurator';
import { EElementType } from '../elements/IElement';
import { BackgroundValueEntity } from '../values/BackgroundValueEntity';
import { ColorValueEntity } from '../values/ColorValueEntity';
import { TypeValueEntity } from '../values/TypeValueEntity';
import { PXNumberValueEntity } from '../values/UnitNumberValueEntity';
import { ElementNode } from './ElementNode';
import { ENodeType, INodeParams } from './Node';

export const createLayoutDivElement = () => {
  const element = document.createElement('DIV');
  element.style.setProperty('position', 'relative');
  element.style.setProperty('overflow', 'hidden');
  return element;
};

type TLayoutNodeParams = Pick<INodeParams, 'id'>;

export class LayoutNode extends ElementNode {
  readonly type = ENodeType.Layout;
  private _index: number;
  constructor({ id }: TLayoutNodeParams) {
    const div = createLayoutDivElement();

    const meta = {
      id: 'layout-node',
      name: '布局节点',
      type: EElementType.View,
    };

    const index = new Configurator({
      valueEntity: new TypeValueEntity(0),
      type: EConfiguratorType.Number,
    }).effect((valueEntity) => {
      this._index = valueEntity.getValue();
    });

    const height = new Configurator({
      type: EConfiguratorType.Height,
      lable: 'H',
      valueEntity: new PXNumberValueEntity(256),
    }).effect((valueEntity) => {
      div.style.setProperty('height', valueEntity.style());
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
      configurators: { index, height, background },
    });

    this._index = index.value;
  }
  get index() {
    return this._index;
  }
}
