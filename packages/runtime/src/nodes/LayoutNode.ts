import { Configurator, EConfiguratorType } from '../configurator/Configurator';
import { EElementType } from '../elements/IElement';
import { BackgroundValueEntity } from '../values/BackgroundValueEntity';
import { TypeValueEntity } from '../values/TypeValueEntity';
import { UnitNumberValueEntity } from '../values/UnitNumberValueEntity';
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
      this._index = valueEntity.value;
    });

    const height = new Configurator({
      type: EConfiguratorType.Height,
      lable: 'H',
      valueEntity: new UnitNumberValueEntity({ value: 256, unit: 'px' }),
    }).effect((valueEntity) => {
      div.style.setProperty('height', valueEntity.style());
    });

    const background = new Configurator({
      type: EConfiguratorType.Background,
      lable: 'background',
      valueEntity: new BackgroundValueEntity(),
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
      configurators: { index, height, background },
    });

    this._index = index.value;
  }
  get index() {
    return this._index;
  }
}
