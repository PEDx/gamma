import { Configurator, EConfiguratorType } from '../configurator/Configurator';
import { EElementType } from '../elements/IElement';
import { TypeValueEntity } from '../values/TypeValueEntity';
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

    super({
      element: createLayoutDivElement(),
      id,
      meta,
      configurators: { index },
    });

    this._index = index.value;
  }
  get index() {
    return this._index;
  }
}
