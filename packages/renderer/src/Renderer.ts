import {
  ViewData,
  ViewDataContainer,
  IViewDataSnapshotMap,
  ViewDataSnapshot,
  IGammaElement,
  IElementCreateResult,
  RootViewData,
  getDefualtLayout,
  LayoutViewData,
  GammaScript,
  createLayoutViewData,
  isEmpty,
} from '@gamma/runtime';
import { RenderData } from './RenderData';

export class DemoScript extends GammaScript {
  created() {
    console.log('DemoScript created');
  }
  mounted() {
    const element = this.queryElementByName('@gamma-element/widget-text-3');
    console.log('DemoScript mounted');
    const text = element?.configurators['text'];
    setTimeout(() => {
      text?.setValue('动态设置');
    }, 3000);
  }
}

export class Renderer {
  elementSource: Map<string, IGammaElement<IElementCreateResult>>;
  /**
   * @param elementSource 渲染组件的来源列表
   */
  constructor(
    elementSource?: Map<string, IGammaElement<IElementCreateResult>>,
  ) {
    this.elementSource = elementSource || new Map();
  }
  createViewData(id: string) {
    const gammaElement = this.getElement(id);
    if (!gammaElement) return null;
    const { meta, create } = gammaElement;
    const { element, configurators, containers } = create();
    const viewData = new ViewData({
      element,
      meta,
      configurators,
      containerElements: containers,
    });
    return viewData;
  }
  getElement(id: string) {
    const element = this.elementSource.get(id);
    if (!element) {
      // @ts-ignore
      return window[id];
    }
    return element;
  }
  renderToLayout(
    targetLayoutView: LayoutViewData,
    snapshot: ViewDataSnapshot,
    renderData: IViewDataSnapshotMap,
  ) {
    const walk = (
      snapshot: ViewDataSnapshot | undefined,
      parentViewData: ViewData,
    ) => {
      if (!snapshot) return;
      const containers = snapshot.containers;
      containers?.forEach((idList, idx) => {
        const containerId = parentViewData.containers[idx];
        const container = ViewDataContainer.collection.getItemByID(containerId);
        idList.forEach((id) => {
          const viewDataSnapshot = renderData[id];
          const elementId = viewDataSnapshot.meta.id;
          const viewData = this.createViewData(elementId);
          if (!viewData) {
            console.error(`connot found gamma-element: ${elementId}`);
            return;
          }
          /**
           * 初始化配置数据到视图
           */
          viewData.restore(viewDataSnapshot);
          if (!viewData) return;
          container?.addViewData(viewData);
          walk(viewDataSnapshot, viewData);
        });
      });
    };
    walk(snapshot, targetLayoutView);
  }
  /**
   * 此方法会根据初始化的 dom 元素以及传入的渲染数据
   * 依次创建根组件，布局组件
   * @param renderData
   * @returns
   */
  render(rootViewData: RootViewData, renderData: RenderData) {
    const demos = new DemoScript();
    demos.created();
    /**
     * 获取根容器配置信息
     */
    const rootRenderData = renderData.getRootRenderData();

    /**
     * 获取布局容器配置信息
     */
    const layoutRenderData = renderData.getLayoutRenderData();

    if (rootRenderData) rootViewData.restore(rootRenderData);

    const rootContainer = rootViewData.getContainer();

    /**
     * 如果没有布局容器默认创建一个
     */
    if (isEmpty(layoutRenderData)) {
      layoutRenderData.push(getDefualtLayout());
    }

    /**
     * 保证所有 layout 一定会加入到 root 中
     */
    layoutRenderData.forEach((data, idx) => {
      const layoutViewData = createLayoutViewData(rootViewData.mode);
      layoutViewData.restore(data);
      layoutViewData.setIndex(idx);
      rootContainer.addViewData(layoutViewData);
      layoutViewData.restore(data);
      if (!renderData) return;
      this.renderToLayout(layoutViewData, data, renderData.getData());
    });
    setTimeout(() => {
      demos.mounted();
    });
  }
}
