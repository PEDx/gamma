import { Resizable, IResizableParams } from './Resizable';
import { activeNodeManager } from '../ActiveNodeManager';

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
    activeNodeManager.observerWH(this.element);
  }
  override updateWidth(value: number) {
    this.element.updateReact('width', Math.round(value));
    if (!this.enableWidth) return;
    activeNodeManager.wConf!.value = Math.round(value);
  }
  override updateHeight(value: number) {
    this.element.updateReact('height', Math.round(value));
    if (!this.enableHeight) return;
    activeNodeManager.hConf!.value = Math.round(value);
  }
  override updateX(value: number) {
    this.element.updateReact('x', Math.round(value));
    if (!activeNodeManager.xConf) return;
    activeNodeManager.xConf.value = Math.round(value);
  }
  override updateY(value: number) {
    this.element.updateReact('y', Math.round(value));
    if (!activeNodeManager.yConf) return;
    activeNodeManager.yConf.value = Math.round(value);
  }
  private initElementByShadow(element: HTMLElement) {
    this.initElement({
      x: activeNodeManager.xConf?.value || 0,
      y: activeNodeManager.yConf?.value || 0,
      width: element.offsetWidth,
      height: element.offsetHeight,
    });
  }
  /**
   * @returns
   */
  attachConfigurator(element: HTMLElement) {

    this.enableWidth = !!activeNodeManager.wConf;
    this.enableHeight = !!activeNodeManager.hConf;

    const container = element.offsetParent;
    if (!container) return;
    this.initElementTranslate(container, element);
    this.initElementByShadow(element);
  }
}
