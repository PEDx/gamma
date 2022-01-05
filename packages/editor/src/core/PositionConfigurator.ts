import { Movable, MovableParams } from './Movable';
import { IPosition } from './EditableElement';

import {
  Configurator,
  EConfiguratorType,
  ConcreteObserver,
} from '@gamma/runtime';
import { UnitNumberValueEntity } from '@gamma/runtime/src/values/UnitNumberValueEntity';
import { ValueEntity } from '@gamma/runtime/src/values/ValueEntity';

export class PositionConfigurator extends Movable {
  enableX: boolean = true;
  enableY: boolean = true;
  xConfigurator: Configurator<UnitNumberValueEntity> | null = null;
  yConfigurator: Configurator<UnitNumberValueEntity> | null = null;
  updateXObserver: ConcreteObserver<Configurator<UnitNumberValueEntity>>;
  updateYObserver: ConcreteObserver<Configurator<UnitNumberValueEntity>>;
  constructor(params: MovableParams) {
    super({
      ...params,
    });
    this.updateXObserver = new ConcreteObserver<
      Configurator<UnitNumberValueEntity>
    >(({ value }) => {
      this.element.updateReact('x', value.value);
    });
    this.updateYObserver = new ConcreteObserver<
      Configurator<UnitNumberValueEntity>
    >(({ value }) => {
      this.element.updateReact('y', value.value);
    });
    this.init();
  }
  override update(positon: IPosition) {
    if (!this.enableX) positon.x = 0;
    if (!this.enableY) positon.y = 0;
    this.updateConfiguratior(positon);
    this.element.updataPosition(positon);
  }
  private updateConfiguratior(positon: IPosition) {
    if (this.xConfigurator)
      this.xConfigurator.value = {
        value: Math.round(positon.x),
        unit: 'px',
      };
    if (this.yConfigurator)
      this.yConfigurator.value = {
        value: Math.round(positon.y),
        unit: 'px',
      };
  }
  private initElementByShadow(element: HTMLElement) {
    this.initElement({
      x: this.xConfigurator?.value.value || 0,
      y: this.yConfigurator?.value.value || 0,
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
  attachConfigurator(
    element: HTMLElement,
    configurators: { [key: string]: Configurator<ValueEntity<unknown>> },
  ) {

    this.xConfigurator?.detach(this.updateXObserver);
    this.yConfigurator?.detach(this.updateYObserver);

    this.enableX = false;
    this.enableY = false;

    Object.values(configurators).forEach((configurator) => {
      if (configurator.type === EConfiguratorType.Y) {
        this.enableY = true;
        this.yConfigurator = configurator as any;
        configurator.attach(this.updateYObserver);
      }
      if (configurator.type === EConfiguratorType.X) {
        this.enableX = true;
        this.xConfigurator = configurator as any;
        configurator.attach(this.updateXObserver);
      }
    });

    const container = element.offsetParent;
    if (!container) return;
    this.initElementTranslate(container, element);
    this.initElementByShadow(element);
  }
}
