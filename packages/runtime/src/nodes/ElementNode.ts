import { INodeParams, Node } from './Node';

type TElementNodeParams = INodeParams & {
  element: HTMLElement;
};

export class ElementNode extends Node {
  readonly element: HTMLElement; // dom 节点
  constructor({ id, meta, element, configurators }: TElementNodeParams) {
    super({ id, meta, configurators });
    this.element = element;
  }
}
