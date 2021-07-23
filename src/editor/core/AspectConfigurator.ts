import { Editable, IEditable } from './Editable';
import { Configurator, ConfiguratorValueType } from '@/runtime/Configurator';
import { ViewData } from '@/runtime/ViewData';
import { ConcreteObserver } from '@/common/Observer';

export class AspectConfigurator extends Editable {
  enableWidth: boolean = true;
  enableHeight: boolean = true;
  xConfigurator: Configurator<number> | null = null;
  yConfigurator: Configurator<number> | null = null;
  widthConfigurator: Configurator<number> | null = null;
  heightConfigurator: Configurator<number> | null = null;
  updateWidthObserver: ConcreteObserver<Configurator<number>>;
  updateHeightObserver: ConcreteObserver<Configurator<number>>;
  constructor({ editableElement, distance, effect }: IEditable) {
    super({
      editableElement,
      distance,
      effect,
    });
    this.updateWidthObserver = new ConcreteObserver<Configurator<number>>(
      ({ value }) => this.editableElement.update('width', value),
    );
    this.updateHeightObserver = new ConcreteObserver<Configurator<number>>(
      ({ value }) => this.editableElement.update('height', value),
    );
  }
  override updateWidth(value: number) {
    if (!this.enableWidth) return;
    this.widthConfigurator?.setValue(value);
    this.editableElement.update('width', value);
  }
  override updateHeight(value: number) {
    if (!this.enableHeight) return;
    this.heightConfigurator?.setValue(value);
    this.editableElement.update('height', value);
  }
  override updateX(value: number) {
    if (!this.enableWidth) return;
    this.xConfigurator?.setValue(value);
    this.editableElement.update('x', value);
  }
  override updateY(value: number) {
    if (!this.enableWidth) return;
    this.yConfigurator?.setValue(value);
    this.editableElement.update('y', value);
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

    Object.values(viewData.configurators).forEach((configurator) => {
      if (configurator.type === ConfiguratorValueType.Width) {
        this.widthConfigurator = configurator;
        configurator.attach(this.updateWidthObserver);
        this.enableWidth = true;
      }
      if (configurator.type === ConfiguratorValueType.Height) {
        this.heightConfigurator = configurator;
        configurator.attach(this.updateHeightObserver);
        this.enableHeight = true;
      }
      if (configurator.type === ConfiguratorValueType.Y) {
        this.yConfigurator = configurator;
      }
      if (configurator.type === ConfiguratorValueType.X) {
        this.xConfigurator = configurator;
      }
    });

    this.initElementByShadow(viewData.element);
  }
}