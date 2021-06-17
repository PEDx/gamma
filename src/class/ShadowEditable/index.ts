import { Editable, IEditable, editableConfiguratorType } from '../Editable';
import { ShadowMovable } from '../ShadowMovable';
import { Configurator } from '@/class/Configurator';
import { ViewData } from '@/class/ViewData';
import { ConcreteObserver } from '@/class/Observer';

export class ShadowEditable extends Editable {
  shadowElement!: HTMLElement;
  viewData!: ViewData | null;
  override movable: ShadowMovable;
  updataWidthObserver: ConcreteObserver<Configurator>;
  updataHeightObserver: ConcreteObserver<Configurator>;
  constructor({ element, container, distance }: IEditable) {
    super({
      element,
      container,
      distance,
    });

    this.movable = new ShadowMovable({
      element: element,
      container: container,
      distance: distance,
    });

    this.updataWidthObserver = new ConcreteObserver<Configurator>(
      ({ value }) => {
        this.element.style.setProperty('width', `${value}px`);
      },
    );
    this.updataHeightObserver = new ConcreteObserver<Configurator>(
      ({ value }) => {
        this.element.style.setProperty('height', `${value}px`);
      },
    );
  }
  private updateViewData(key: editableConfiguratorType, value: number) {
    this.viewData!.editableConfigurators[key]!.setValue(value);
  }
  override updateElementStyle(key: editableConfiguratorType, value: number) {
    this.updateViewData(key, value);
    const element = this.element;
    element.style.setProperty(key, `${value}px`);
  }
  private initElementByShadow() {
    const shadowElement = this.shadowElement;
    const element = this.element;
    this.container = shadowElement.offsetParent as HTMLElement;
    element.style.setProperty('width', `${shadowElement.clientWidth}px`);
    element.style.setProperty('height', `${shadowElement.clientHeight}px`);
  }

  attachMouseDownEvent(e: MouseEvent) {
    this.movable.attachMouseDownEvent(e);
  }
  setShadowViewData(viewData: ViewData | null) {
    if (this.viewData) {
      this.viewData!.editableConfigurators.width?.detach(
        this.updataWidthObserver,
      );
      this.viewData!.editableConfigurators.height?.detach(
        this.updataHeightObserver,
      );
    }
    if (!viewData) throw new Error('can not set shadowViewData');
    this.viewData = viewData;

    this.viewData!.editableConfigurators.width?.attach(
      this.updataWidthObserver,
    );
    this.viewData!.editableConfigurators.height?.attach(
      this.updataHeightObserver,
    );

    this.shadowElement = viewData.element;
    this.movable.setShadowElement(this.shadowElement);
    this.initElementByShadow();
  }
}
