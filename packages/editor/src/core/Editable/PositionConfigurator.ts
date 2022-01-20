import { Movable, MovableParams } from './Movable';
import { IPosition } from './EditableElement';
import { Editor } from '../Editor';

export class PositionConfigurator extends Movable {
  enableX: boolean = true;
  enableY: boolean = true;
  constructor(params: MovableParams) {
    super({
      ...params,
    });
    Editor.selector.observerXY(this.element);
    this.init();
  }
  override update(positon: IPosition) {
    if (!this.enableX) positon.x = 0;
    if (!this.enableY) positon.y = 0;
    this.updateConfiguratior(positon);
    this.element.updataPosition(positon);
  }
  private updateConfiguratior(positon: IPosition) {
    if (Editor.selector.xConf)
      Editor.selector.xConf.value = Math.round(positon.x);
    if (Editor.selector.yConf)
      Editor.selector.yConf.value = Math.round(positon.y);
  }
  private initElementByShadow(element: HTMLElement) {
    this.initElement({
      x: Editor.selector.xConf?.value || 0,
      y: Editor.selector.yConf?.value || 0,
      width: element.offsetWidth,
      height: element.offsetHeight,
    });
  }
  attachMouseDownEvent(e: MouseEvent) {
    this.handleMouseDown(e);
  }
  /**
   * attachConfigurator 需要比 attachMouseDownEvent 先调用
   * 不然移动时各项参数将不正确
   *
   * @returns
   */
  attachConfigurator(element: HTMLElement) {
    this.enableX = !!Editor.selector.xConf;

    this.enableY = !!Editor.selector.yConf;

    const container = element.offsetParent;
    if (!container) return;
    this.initElementTranslate(container, element);
    this.initElementByShadow(element);
  }
}
