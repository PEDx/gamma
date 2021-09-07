import { Editable, IEditable } from './Editable';
import { Configurator, ConfiguratorValueType } from '@gamma/runtime';
import { ViewData, ConcreteObserver } from '@gamma/runtime';

export class AspectConfigurator extends Editable {
  private enableWidth: boolean = true;
  private enableHeight: boolean = true;
  private xConfigurator: Configurator<number> | null = null;
  private yConfigurator: Configurator<number> | null = null;
  private widthConfigurator: Configurator<number> | null = null;
  private heightConfigurator: Configurator<number> | null = null;
  private updateWidthObserver: ConcreteObserver<Configurator<number>>;
  private updateHeightObserver: ConcreteObserver<Configurator<number>>;
  constructor({ editableElement, distance, effect }: IEditable) {
    super({
      editableElement,
      distance,
      effect,
    });
    this.updateWidthObserver = new ConcreteObserver<Configurator<number>>(
      ({ value, config }) => {
        this.editableElement.update('width', value);
        if (!config) {
          this.aspectRatio = 0;
          return;
        }
        this.aspectRatio = (config as { aspectRatio: number }).aspectRatio;
      },
    );
    this.updateHeightObserver = new ConcreteObserver<Configurator<number>>(
      ({ value }) => this.editableElement.update('height', value),
    );
  }
  override updateWidth(value: number) {
    if (!this.enableWidth) return;
    this.widthConfigurator?.setValue(Math.round(value));
    this.editableElement.update('width', Math.round(value));
  }
  override updateHeight(value: number) {
    if (!this.enableHeight) return;
    this.heightConfigurator?.setValue(Math.round(value));
    this.editableElement.update('height', Math.round(value));
  }
  override updateX(value: number) {
    if (!this.enableWidth) return;
    this.xConfigurator?.setValue(Math.round(value));
    this.editableElement.update('x', Math.round(value));
  }
  override updateY(value: number) {
    if (!this.enableWidth) return;
    this.yConfigurator?.setValue(Math.round(value));
    this.editableElement.update('y', Math.round(value));
  }
  private initElementByShadow(element: HTMLElement) {
    const shadowElement = element;
    this.container = shadowElement.offsetParent as HTMLElement;
    const width = shadowElement.clientWidth;
    const height = shadowElement.clientHeight;
    this.editableElement.update('width', width);
    this.editableElement.update('height', height);
    this.rect = this.editableElement.getRect();
  }
  /**
   * attachConfigurator 必须比 attachMouseDownEvent 先调用
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

    this.initElementByShadow(viewData.element);
  }
}
