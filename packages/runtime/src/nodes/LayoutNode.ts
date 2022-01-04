import { EElementType } from '../elements/IElement';
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
  constructor({ id }: TLayoutNodeParams) {
    const meta = {
      id: 'layout-node',
      name: '布局节点',
      type: EElementType.View,
    };

    super({ element: createLayoutDivElement(), id, meta, configurators: {} });
  }
}
