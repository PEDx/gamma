import { Movable, MovableParams } from './Movable';
import { IPosition } from './EditableElement';
import { activeNodeManager } from '../ActiveNodeManager';

export class PositionConfigurator extends Movable {
  enableX: boolean = true;
  enableY: boolean = true;
  constructor(params: MovableParams) {
    super({
      ...params,
    });
    activeNodeManager.observerXY(this.element);
    this.init();
  }
  override update(positon: IPosition) {
    if (!this.enableX) positon.x = 0;
    if (!this.enableY) positon.y = 0;
    this.updateConfiguratior(positon);
    this.element.updataPosition(positon);
  }
  private updateConfiguratior(positon: IPosition) {
    if (activeNodeManager.xConf)
      activeNodeManager.xConf.value = Math.round(positon.x);
    if (activeNodeManager.yConf)
      activeNodeManager.yConf.value = Math.round(positon.y);
  }
  private initElementByShadow(element: HTMLElement) {
    this.initElement({
      x: activeNodeManager.xConf?.value || 0,
      y: activeNodeManager.yConf?.value || 0,
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
    this.enableX = !!activeNodeManager.xConf;

    this.enableY = !!activeNodeManager.yConf;

    const container = element.offsetParent;
    if (!container) return;
    this.initElementTranslate(container, element);
    this.initElementByShadow(element);
  }
}
