import {
  ViewData,
  ViewDataContainer,
  createLayoutViewData,
  isEmpty,
  TGammaElementType,
  RuntimeElementSnapshot,
  LayoutMode,
  RootViewData,
} from '@gamma/runtime';
import type {
  IRuntimeElementSnapshotMap,
  IElementCreateResult,
  ViewDataSnapshot,
  LayoutViewData,
  IGammaElement,
} from '@gamma/runtime';
import type { RenderData } from './RenderData';

const tryCall = <T extends Function>(fn: T) => {
  try {
    return fn();
  } catch (error) {
    throw error;
  }
};

export class Renderer {
  elementSource: Map<string, IGammaElement<TGammaElementType>>;
  /**
   * @param elementSource 渲染组件的来源列表
   */
  constructor(elementSource?: Map<string, IGammaElement<TGammaElementType>>) {
    this.elementSource = elementSource || new Map();
  }
  createRuntimeElement(elementId: string, id?: string) {
    const gammaElement = this.getGammaElement(elementId);
    if (!gammaElement) {
      throw `can not found ${elementId}`;
    }
    const { meta, create } = gammaElement;

    const { element, configurators, containers } = tryCall(
      create,
    ) as IElementCreateResult;

    const viewData = new ViewData({
      id,
      element,
      meta,
      configurators,
      containerElements: containers,
    });
    return viewData;
  }
  getGammaElement(id: string): IGammaElement<TGammaElementType> {
    const element = this.elementSource.get(id);
    if (!element) {
      // @ts-ignore
      return window[id]; // UMD
    }
    return element;
  }
  renderToLayout(
    targetLayoutView: LayoutViewData,
    snapshot: RuntimeElementSnapshot,
    renderData: IRuntimeElementSnapshotMap,
  ) {
    const walk = (
      snapshot: RuntimeElementSnapshot | undefined,
      parentViewData: ViewData,
    ) => {
      if (!snapshot) return;
      const containers = (snapshot as ViewDataSnapshot).containers;
      containers?.forEach((viewDataIdList, idx) => {
        const containerId = parentViewData.containers[idx];
        const container = ViewDataContainer.collection.getItemByID(containerId);
        viewDataIdList.forEach((viewDataId) => {
          const viewDataSnapshot = renderData[viewDataId];
          const elementId = viewDataSnapshot.meta.id;
          const viewData = this.createRuntimeElement(
            elementId,
            viewDataId,
          ) as ViewData;

          if (!viewData) {
            console.error(`connot found gamma-element: ${elementId}`);
            return;
          }
          /**
           * 初始化配置数据到视图
           */
          viewData.restore(viewDataSnapshot as ViewDataSnapshot);
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
  render(element: HTMLElement, mode: LayoutMode, renderData: RenderData) {

    let rootViewData: RootViewData;
    /**
     * 获取根容器配置信息
     */
    const rootRenderData = renderData.getRootSnapshotData();

    rootViewData = new RootViewData({
      element,
      mode,
    });

    if (rootRenderData) rootViewData.restore(rootRenderData);

    /**
     * 获取布局容器配置信息
     */
    const layoutRenderData = renderData.getLayoutSnapshotData();

    /**
     * 获取脚本元素信息
     */
    const scriptSnapshotData = renderData.getScriptSnapshotData();

    const rootContainer = rootViewData.getContainer();

    /**
     * 如果没有布局容器默认创建一个
     */
    if (isEmpty(layoutRenderData)) {
      const layoutViewData = createLayoutViewData(rootViewData.mode);
      rootContainer.addViewData(layoutViewData);
      /**
       * layoutViewData 中有样式，因此需要初始化一次 Configurators
       */
      layoutViewData.callConfiguratorsNotify();
    } else {
      /**
       * 保证所有 layout 一定会加入到 root 中
       */
      layoutRenderData.forEach((data, idx) => {
        const layoutViewData = createLayoutViewData(rootViewData.mode, data.id);
        layoutViewData.restore(data);
        rootContainer.addViewData(layoutViewData);
        if (!renderData) return;
        this.renderToLayout(layoutViewData, data, renderData.getData());
      });
    }

    /**
     * 最后初始化脚本
     */

    return rootViewData;
  }
}
