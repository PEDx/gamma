import { Movable, MovableParams } from './Movable';
import { ViewData, ConcreteObserver } from '@gamma/runtime';
import { Configurator, ConfiguratorValueType } from '@gamma/runtime';
import { IPosition } from './EditableElement';

export class PositionConfigurator extends Movable {
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
        this.element.updateReact('x', value);
      },
    );
    this.updateYObserver = new ConcreteObserver<Configurator<number>>(
      ({ value }) => {
        this.element.updateReact('y', value);
      },
    );
    this.init();
  }
  override update(positon: IPosition) {
    if (!this.enableX) positon.x = 0;
    if (!this.enableY) positon.y = 0;
    this.updateConfiguratior(positon);
    this.element.updataPosition(positon);
  }
  private updateConfiguratior(positon: IPosition) {
    this.xConfigurator?.setValue(positon.x);
    this.yConfigurator?.setValue(positon.y);
  }
  private initElementByShadow(element: HTMLElement) {
    this.initElement({
      x: this.xConfigurator?.value || 0,
      y: this.yConfigurator?.value || 0,
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
  attachConfigurator(viewData: ViewData | null) {
    if (!viewData) throw new Error('can not set shadowViewData');

    this.xConfigurator?.detach(this.updateXObserver);
    this.yConfigurator?.detach(this.updateYObserver);

    this.enableX = false;
    this.enableY = false;

    Object.values(viewData.configurators).forEach((configurator) => {
      if (configurator.type === ConfiguratorValueType.Y) {
        this.enableY = true;
        this.yConfigurator = configurator as Configurator<number>;
        configurator.attach(this.updateYObserver);
      }
      if (configurator.type === ConfiguratorValueType.X) {
        this.enableX = true;
        this.xConfigurator = configurator as Configurator<number>;
        configurator.attach(this.updateXObserver);
      }
    });

    const container = viewData.element.offsetParent;
    if (!container) return;
    this.initElementTranslate(container, viewData.element);
    this.initElementByShadow(viewData.element);
  }
}
