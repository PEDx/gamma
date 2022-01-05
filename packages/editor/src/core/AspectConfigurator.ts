import { Resizable, IResizableParams } from './Resizable';
import {
  Configurator,
  EConfiguratorType,
  ConcreteObserver,
} from '@gamma/runtime';
import { UnitNumberValueEntity } from '@gamma/runtime/src/values/UnitNumberValueEntity';
import { ValueEntity } from '@gamma/runtime/src/values/ValueEntity';
import { IConfiguratorMap } from '@gamma/runtime/src/elements/IElement';

export class AspectConfigurator extends Resizable {
  private enableWidth: boolean = true;
  private enableHeight: boolean = true;
  private xConfigurator: Configurator<UnitNumberValueEntity> | null = null;
  private yConfigurator: Configurator<UnitNumberValueEntity> | null = null;
  private wConfigurator: Configurator<UnitNumberValueEntity> | null = null;
  private hConfigurator: Configurator<UnitNumberValueEntity> | null = null;
  private updateWidthObserver: ConcreteObserver<
    Configurator<UnitNumberValueEntity>
  >;
  private updateHeightObserver: ConcreteObserver<
    Configurator<UnitNumberValueEntity>
  >;
  constructor({ element, distance, effect, limit }: IResizableParams) {
    super({
      element,
      distance,
      effect,
      limit,
    });
    this.updateWidthObserver = new ConcreteObserver<
      Configurator<UnitNumberValueEntity>
    >(({ value }) => {
      this.element.updateReact('width', value.value);
    });
    this.updateHeightObserver = new ConcreteObserver<
      Configurator<UnitNumberValueEntity>
    >(({ value }) => this.element.updateReact('height', value.value));
  }
  override updateWidth(value: number) {
    this.element.updateReact('width', Math.round(value));
    if (!this.enableWidth) return;
    if (this.wConfigurator)
      this.wConfigurator.value = { value: Math.round(value), unit: 'px' };
  }
  override updateHeight(value: number) {
    this.element.updateReact('height', Math.round(value));
    if (!this.enableHeight) return;
    if (this.hConfigurator)
      this.hConfigurator.value = { value: Math.round(value), unit: 'px' };
  }
  override updateX(value: number) {
    this.element.updateReact('x', Math.round(value));
    if (this.xConfigurator)
      this.xConfigurator.value = { value: Math.round(value), unit: 'px' };
  }
  override updateY(value: number) {
    this.element.updateReact('y', Math.round(value));
    if (this.yConfigurator)
      this.yConfigurator.value = { value: Math.round(value), unit: 'px' };
  }
  private initElementByShadow(element: HTMLElement) {
    this.initElement({
      x: this.xConfigurator?.value.value || 0,
      y: this.yConfigurator?.value.value || 0,
      width: element.offsetWidth,
      height: element.offsetHeight,
    });
  }
  /**
   * @param viewData
   * @returns
   */
  attachConfigurator(element: HTMLElement, configurators: IConfiguratorMap) {
    console.log('attachConfigurator');

    this.wConfigurator?.detach(this.updateWidthObserver);
    this.hConfigurator?.detach(this.updateHeightObserver);

    this.enableWidth = false;
    this.enableHeight = false;

    this.wConfigurator = null;
    this.hConfigurator = null;
    this.xConfigurator = null;
    this.yConfigurator = null;

    Object.values(configurators).forEach((configurator) => {
      if (configurator.type === EConfiguratorType.Width) {
        this.wConfigurator = configurator as any;
        configurator.attach(this.updateWidthObserver);
        this.enableWidth = true;
        return;
      }
      if (configurator.type === EConfiguratorType.Height) {
        this.hConfigurator = configurator as any;
        configurator.attach(this.updateHeightObserver);
        this.enableHeight = true;
        return;
      }
      if (configurator.type === EConfiguratorType.Y) {
        this.yConfigurator = configurator as any;
        return;
      }
      if (configurator.type === EConfiguratorType.X) {
        this.xConfigurator = configurator as any;
        return;
      }
    });
    const container = element.offsetParent;
    if (!container) return;
    this.initElementTranslate(container, element);
    this.initElementByShadow(element);
  }
}
