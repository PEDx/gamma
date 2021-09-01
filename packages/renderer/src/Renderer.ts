import {
  ViewData,
  ViewDataContainer,
  getDefualtLayout,
  createLayoutViewData,
  isEmpty,
  TGammaElementType,
  ElementType,
  RuntimeElementSnapshot,
} from '@gamma/runtime';
import type {
  IRuntimeElementSnapshotMap,
  IElementCreateResult,
  IScriptCreateResult,
  ViewDataSnapshot,
  LayoutViewData,
  IGammaElement,
  RootViewData,
} from '@gamma/runtime';
import type { RenderData } from './RenderData';
import { ScriptData } from '@gamma/runtime';

export class Renderer {
  elementSource: Map<string, IGammaElement<TGammaElementType>>;
  /**
   * @param elementSource 渲染组件的来源列表
   */
  constructor(elementSource?: Map<string, IGammaElement<TGammaElementType>>) {
    this.elementSource = elementSource || new Map();
  }
  createViewData(elementId: string, id?: string) {
    const gammaElement = this.getGammaElement(elementId);
    if (!gammaElement) return null;
    const { meta, create } = gammaElement;

    if (meta.type === ElementType.Script) {
      const { configurators } = create() as IScriptCreateResult;
      const scriptData = new ScriptData({
        id,
        meta,
        configurators,
      });
      return scriptData;
    }
    const { element, configurators, containers } =
      create() as IElementCreateResult;
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
          const viewData = this.createViewData(
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
  render(rootViewData: RootViewData, renderData: RenderData) {
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
  }
}
