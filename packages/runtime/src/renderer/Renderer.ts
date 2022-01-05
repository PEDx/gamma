import { TNodeId } from '../nodes/Node';
import { BaseViewElement } from '../elements/BaseViewElement';
import { ElementNode } from '../nodes/ElementNode';
import { LayoutNode } from '../nodes/LayoutNode';
import { RootNode } from '../nodes/RootNode';

const tryCall = <T extends Function>(fn: T) => {
  try {
    return fn();
  } catch (error) {
    throw error;
  }
};

export class Renderer {
  root: RootNode | null = null;
  constructor() {}
  createRootNode(rootElement: HTMLElement) {
    this.root = new RootNode({
      width: 375,
    });
    this.root.mount(rootElement);
  }
  createElementNode() {
    const { meta, create } = new BaseViewElement();
    const { element, configurators } = tryCall(create);
    return new ElementNode({ meta, element, configurators, container: true });
  }
  createLayoutNode() {
    return new LayoutNode({});
  }
  addLayoutNode() {
    const ln = this.createLayoutNode();
    if (!this.root) return;
    ln.appendTo(this.root.id);
    return ln;
  }
  addElementNode(id: TNodeId) {
    const en = this.createElementNode();
    en.appendTo(id);
    return en;
  }
  build() {}
}
