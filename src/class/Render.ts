import { noop } from '@/utils';
import { RootViewData } from './ViewData/RootViewData';
import { viewTypeMap } from '@/packages';
import {
  ViewDataContainer,
  CONTAINER_DATA_TAG,
} from './ViewData/ViewDataContainer';
import { ViewData, IViewStaticData } from './ViewData';
import { find } from 'lodash';

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
    traversal(this.target as Element, (node) => {});
  }
  initViewData(data: IViewStaticData) {
    const id = data.meta.id;
    const configuratorsValue = data.configurators;
    const createView = viewTypeMap.get(id);
    if (!createView) return;
    const { element, configurators, containers, meta } = createView();

    Object.keys(configurators).forEach((key) => {
      configurators[key].value = configuratorsValue[key];
    });

    const vd = new ViewData({
      element,
      meta,
      configurators,
      containerElements: containers,
    });

    return vd;
  }
  initConfigurator() {}
  getRenderData() {
    return ViewData.collection.getSerializeCollection();
  }
  parseTemplate(rootViewData: RootViewData) {
    const renderData = this.getRenderData();
    const root = find(renderData, (val) => !val.meta);
    console.log(renderData);

    const walk = (root: IViewStaticData | undefined, rootView: ViewData) => {
      if (!root) return;
      const containers = root.containers;
      containers.forEach((children, idx) => {
        const container = rootView.containers[idx];
        console.log(rootView);
        children.forEach((id) => {
          const child = renderData[id];
          const vd = this.initViewData(child);
          if (!vd) return;
          if (!container) return;
          // FIXME 有些组件的内部容器可能是异步的
          container?.addViewData(vd);
          vd.initViewByConfigurators();
          walk(child, vd);
        });
      });
    };
    walk(root, rootViewData);
  }
}
