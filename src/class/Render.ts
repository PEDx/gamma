import { noop } from '@/utils';
import { RootViewData } from './ViewData/RootViewData';

interface RenderParams {
  target: Element;
  rootViewData: RootViewData;
}

function traversal(
  node: Element | ChildNode,
  callback: (node: Element | ChildNode) => void = noop,
) {
  const walk = (node: Element | ChildNode) => {
    if (node && node.nodeType === 1) {
      callback(node);
    }
    let i = 0,
      childNodes = node.childNodes,
      _item;
    for (; i < childNodes.length; i++) {
      _item = childNodes[i];
      if (_item && _item.nodeType === 1) walk(_item);
    }
  };
  walk(node);
}

export class Render {
  target: Element;
  rootViewData: RootViewData;
  template: string;
  constructor({ target, rootViewData }: RenderParams) {
    this.target = target;
    this.template = rootViewData.element.innerHTML;
    this.rootViewData = rootViewData;
  }
  render() {
    this.target.innerHTML = this.template;
  }
  initViewData() {}
  initConfigurator() {}
  parseTemplate() {
    this.render();
    traversal(this.target as Element, (node) => {
      console.log(node);
    });
  }
}
