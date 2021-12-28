import { Resizable, IResizableParams } from './Resizable';
import { Configurator, ConfiguratorValueType } from '@gamma/runtime';
import { ViewData, ConcreteObserver } from '@gamma/runtime';

export class AspectConfigurator extends Resizable {
  private enableWidth: boolean = true;
  private enableHeight: boolean = true;
  private xConfigurator: Configurator<number> | null = null;
  private yConfigurator: Configurator<number> | null = null;
  private widthConfigurator: Configurator<number> | null = null;
  private heightConfigurator: Configurator<number> | null = null;
  private updateWidthObserver: ConcreteObserver<Configurator<number>>;
  private updateHeightObserver: ConcreteObserver<Configurator<number>>;
  constructor({ element, distance, effect }: IResizableParams) {
    super({
      element,
      distance,
      effect,
    });
    this.updateWidthObserver = new ConcreteObserver<Configurator<number>>(
      ({ value, config }) => {
        this.element.updateReact('width', value);
        if (!config) {
          this.aspectRatio = 0;
          return;
        }
        this.aspectRatio = (config as { aspectRatio: number }).aspectRatio;
      },
    );
    this.updateHeightObserver = new ConcreteObserver<Configurator<number>>(
      ({ value }) => this.element.updateReact('height', value),
    );
  }
  override updateWidth(value: number) {
    this.widthConfigurator?.setValue(Math.round(value));
    this.element.updateReact('width', Math.round(value));
  }
  override updateHeight(value: number) {
    this.heightConfigurator?.setValue(Math.round(value));
    this.element.updateReact('height', Math.round(value));
  }
  override updateX(value: number) {
    this.xConfigurator?.setValue(Math.round(value));
    this.element.updateReact('x', Math.round(value));
  }
  override updateY(value: number) {
    this.yConfigurator?.setValue(Math.round(value));
    this.element.updateReact('y', Math.round(value));
  }
  private initElementByShadow(element: HTMLElement) {
    this.initElement({
      x: this.xConfigurator?.value || 0,
      y: this.yConfigurator?.value || 0,
      width: element.offsetWidth,
      height: element.offsetHeight,
    });
  }
  /**
   * @param viewData
   * @returns
   */
  attachConfigurator(viewData: ViewData | null) {
    if (!viewData) throw new Error('can not set shadowViewData');

    this.widthConfigurator?.detach(this.updateWidthObserver);
    this.heightConfigurator?.detach(this.updateHeightObserver);

    this.enableWidth = false;
    this.enableHeight = false;

    this.widthConfigurator = null;
    this.heightConfigurator = null;
    this.xConfigurator = null;
    this.yConfigurator = null;

    Object.values(viewData.configurators).forEach((configurator) => {
      if (configurator.type === ConfiguratorValueType.Width) {
        this.widthConfigurator = configurator as Configurator<number>;
        configurator.attach(this.updateWidthObserver);
        this.enableWidth = true;
        return;
      }
      if (configurator.type === ConfiguratorValueType.Height) {
        this.heightConfigurator = configurator as Configurator<number>;
        configurator.attach(this.updateHeightObserver);
        this.enableHeight = true;
        return;
      }
      if (configurator.type === ConfiguratorValueType.Y) {
        this.yConfigurator = configurator as Configurator<number>;
        return;
      }
      if (configurator.type === ConfiguratorValueType.X) {
        this.xConfigurator = configurator as Configurator<number>;
        return;
      }
    });
    const container = viewData.element.offsetParent;
    if (!container) return;
    this.initElementTranslate(container, viewData.element);
    this.initElementByShadow(viewData.element);
  }
}
