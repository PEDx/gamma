import { Configurator, EConfiguratorType } from '../Configurator';
import { EElementType } from '../elements/IElement';
import { TypeValueEntity } from '../values/TypeValueEntity';
import { ViewNode } from './ViewNode';
import { ENodeType, INodeParams } from './Node';

export const DEFAULT_PAGE_WIDTH = 375;
export const DEFAULT_PENDANT_WIDTH = 180;

type TRootNodeParams = Pick<INodeParams, 'id'> & { width: number };

export class RootNode extends ViewNode {
  readonly type = ENodeType.Root;
  constructor({ width = DEFAULT_PAGE_WIDTH, id }: TRootNodeParams) {
    const meta = {
      id: 'root-node',
      name: '根节点',
      type: EElementType.View,
    };

    const title = new Configurator({
      valueEntity: new TypeValueEntity('text'),
      type: EConfiguratorType.Text,
      lable: 'text',
    }).effect((valueEntity) => {
      console.log(valueEntity.getValue());
    });

    const div = document.createElement('DIV');

    div.style.setProperty('width', `${width}px`);

    super({
      id,
      meta,
      element: div,
      configurators: {
        title,
      },
    });
  }
  mount(root: HTMLElement) {
    root.appendChild(this.element);
  }
}
