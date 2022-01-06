import { Resizable, IResizableParams } from './Resizable';
import { editNodeManager } from './EditNodeManager';

export class AspectConfigurator extends Resizable {
  private enableWidth: boolean = true;
  private enableHeight: boolean = true;
  constructor({ element, distance, effect, limit }: IResizableParams) {
    super({
      element,
      distance,
      effect,
      limit,
    });
    editNodeManager.observerWH(this.element);
  }
  override updateWidth(value: number) {
    this.element.updateReact('width', Math.round(value));
    if (!this.enableWidth) return;
    editNodeManager.wConf!.value = Math.round(value);
  }
  override updateHeight(value: number) {
    this.element.updateReact('height', Math.round(value));
    if (!this.enableHeight) return;
    editNodeManager.hConf!.value = Math.round(value);
  }
  override updateX(value: number) {
    this.element.updateReact('x', Math.round(value));
    if (!editNodeManager.xConf) return;
    editNodeManager.xConf.value = Math.round(value);
  }
  override updateY(value: number) {
    this.element.updateReact('y', Math.round(value));
    if (!editNodeManager.yConf) return;
    editNodeManager.yConf.value = Math.round(value);
  }
  private initElementByShadow(element: HTMLElement) {
    this.initElement({
      x: editNodeManager.xConf?.value || 0,
      y: editNodeManager.yConf?.value || 0,
      width: element.offsetWidth,
      height: element.offsetHeight,
    });
  }
  /**
   * @param viewData
   * @returns
   */
  attachConfigurator(element: HTMLElement) {
    console.log('attachConfigurator');

    this.enableWidth = !!editNodeManager.wConf;
    this.enableHeight = !!editNodeManager.hConf;

    const container = element.offsetParent;
    if (!container) return;
    this.initElementTranslate(container, element);
    this.initElementByShadow(element);
  }
}
