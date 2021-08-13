import { Movable, MovableParams } from './Movable';
import { ViewData, ConcreteObserver } from '@gamma/runtime';
import { Configurator, ConfiguratorValueType } from '@gamma/runtime';
import { IPosition } from './EditableElement';

export class PositionConfigurator extends Movable {
  translateX: number = 0;
  translateY: number = 0;
  enableX: boolean = true;
  enableY: boolean = true;
  xConfigurator: Configurator<number> | null = null;
  yConfigurator: Configurator<number> | null = null;
  updateXObserver: ConcreteObserver<Configurator<number>>;
  updateYObserver: ConcreteObserver<Configurator<number>>;
  constructor(params: MovableParams) {
    super({
      ...params,
    });
    this.updateXObserver = new ConcreteObserver<Configurator<number>>(
      ({ value }) => {
        this.editableElement.update('x', value);
      },
    );
    this.updateYObserver = new ConcreteObserver<Configurator<number>>(
      ({ value }) => {
        this.editableElement.update('y', value);
      },
    );
    this.init();
  }
  override init() {
    document.addEventListener('mousemove', this.mousemoveHandler);
    document.addEventListener('mouseup', this.mouseupHandler);
  }
  override update(positon: IPosition) {
    if (!this.enableX) positon.x = 0;
    if (!this.enableY) positon.y = 0;
    this.updateConfiguratior(positon);
    this.editableElement.updataPosition(positon);
  }
  private updateConfiguratior(positon: IPosition) {
    this.xConfigurator?.setValue(positon.x);
    this.yConfigurator?.setValue(positon.y);
  }
  private initElementByShadow() {
    const positon = {
      x: (this.xConfigurator?.value || 0) as number,
      y: (this.yConfigurator?.value || 0) as number,
    };
    this.editableElement.updataPosition(positon);
  }
  private initElementTranslate(container: Element, shadowElement: HTMLElement) {
    const offsetParent = this.editableElement.element
      .offsetParent as HTMLElement;
    if (!offsetParent) return;
    const offRect = offsetParent.getBoundingClientRect();
    const conRect = container.getBoundingClientRect();
    // 盒子内部可能会有边距，因此需加上  offset
    this.translateX = conRect.x - offRect.x + shadowElement.offsetLeft;
    this.translateY = conRect.y - offRect.y + shadowElement.offsetTop;
    // element 与 shadowElement 的父容器并不重合，因此需要计算偏移量
    this.editableElement.setElementOffset({
      x: this.translateX,
      y: this.translateY,
    });
  }
  attachMouseDownEvent(e: MouseEvent) {
    if (!this.container) return;
    this.rect = this.editableElement.getRect();
    this.handleMouseDown(e);
  }
  /**
   * attachConfigurator 需要比 attachMouseDownEvent 先调用
   * 不然移动时各项参数将不正确
   *
   * @param viewData
   * @returns
   */
  attachConfigurator(viewData: ViewData | null) {
    if (!viewData) throw new Error('can not set shadowViewData');

    this.xConfigurator?.detach(this.updateXObserver);
    this.yConfigurator?.detach(this.updateYObserver);

    this.enableX = false;
    this.enableY = false;

    this.xConfigurator = null;
    this.yConfigurator = null;
    Object.values(viewData.configurators).forEach((configurator) => {
      if (configurator.type === ConfiguratorValueType.Y) {
        this.enableY = true;
        this.yConfigurator = configurator;
        configurator.attach(this.updateYObserver);
      }
      if (configurator.type === ConfiguratorValueType.X) {
        this.enableX = true;
        this.xConfigurator = configurator;
        configurator.attach(this.updateXObserver);
      }
    });

    this.container = viewData.element.offsetParent;
    if (!this.container) return;
    this.initElementTranslate(this.container, viewData.element);
    this.initElementByShadow();
  }
}
