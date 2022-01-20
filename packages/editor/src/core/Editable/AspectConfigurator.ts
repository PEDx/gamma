import { Resizable, IResizableParams } from './Resizable';
import { Editor } from '../Editor';

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
    Editor.selector.observerWH(this.element);
  }
  override updateWidth(value: number) {
    this.element.updateReact('width', Math.round(value));
    if (!this.enableWidth) return;
    Editor.selector.wConf!.value = Math.round(value);
  }
  override updateHeight(value: number) {
    this.element.updateReact('height', Math.round(value));
    if (!this.enableHeight) return;
    Editor.selector.hConf!.value = Math.round(value);
  }
  override updateX(value: number) {
    this.element.updateReact('x', Math.round(value));
    if (!Editor.selector.xConf) return;
    Editor.selector.xConf.value = Math.round(value);
  }
  override updateY(value: number) {
    this.element.updateReact('y', Math.round(value));
    if (!Editor.selector.yConf) return;
    Editor.selector.yConf.value = Math.round(value);
  }
  private initElementByShadow(element: HTMLElement) {
    this.initElement({
      x: Editor.selector.xConf?.value || 0,
      y: Editor.selector.yConf?.value || 0,
      width: element.offsetWidth,
      height: element.offsetHeight,
    });
  }
  /**
   * @returns
   */
  attachConfigurator(element: HTMLElement) {
    this.enableWidth = !!Editor.selector.wConf;
    this.enableHeight = !!Editor.selector.hConf;

    const container = element.offsetParent;
    if (!container) return;
    this.initElementTranslate(container, element);
    this.initElementByShadow(element);
  }
}
