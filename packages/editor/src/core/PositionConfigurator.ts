import { Movable, MovableParams } from './Movable';
import { IPosition } from './EditableElement';
import { editNodeManager } from './EditNodeManager';

export class PositionConfigurator extends Movable {
  enableX: boolean = true;
  enableY: boolean = true;
  constructor(params: MovableParams) {
    super({
      ...params,
    });
    editNodeManager.observerXY(this.element);
    this.init();
  }
  override update(positon: IPosition) {
    if (!this.enableX) positon.x = 0;
    if (!this.enableY) positon.y = 0;
    this.updateConfiguratior(positon);
    this.element.updataPosition(positon);
  }
  private updateConfiguratior(positon: IPosition) {
    if (editNodeManager.xConf)
      editNodeManager.xConf.value = Math.round(positon.x);
    if (editNodeManager.yConf)
      editNodeManager.yConf.value = Math.round(positon.y);
  }
  private initElementByShadow(element: HTMLElement) {
    this.initElement({
      x: editNodeManager.xConf?.value || 0,
      y: editNodeManager.yConf?.value || 0,
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
   * @param viewData
   * @returns
   */
  attachConfigurator(element: HTMLElement) {
    this.enableX = !!editNodeManager.xConf;

    this.enableY = !!editNodeManager.yConf;

    const container = element.offsetParent;
    if (!container) return;
    this.initElementTranslate(container, element);
    this.initElementByShadow(element);
  }
}
